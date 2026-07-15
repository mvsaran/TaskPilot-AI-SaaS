import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  AutoAwesome as AiIcon,
  Close as CloseIcon,
  Send as SendIcon,
  CheckCircleOutline as CheckIcon,
  Flag as PriorityIcon,
  Person as AssigneeIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { api } from '../../services/apiClient';

const INITIAL_BOARD_DATA = {
  TODO: [
    { id: 'TSK-1004', title: 'Optimize Redis caching TTL and eviction policy for JWT session store', status: 'TODO', priority: 'HIGH', storyPoints: 5, assignee: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', subtasks: [{ id: 'sub-1', title: 'Inspect memory footprint', completed: true }, { id: 'sub-2', title: 'Tune LRU parameters', completed: false }] },
    { id: 'TSK-1005', title: 'Implement automated daily backup script for PostgreSQL pgvector index', status: 'TODO', priority: 'MEDIUM', storyPoints: 3, assignee: 'Marcus Vance', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', subtasks: [] },
  ],
  IN_PROGRESS: [
    { id: 'TSK-1001', title: 'Build OAuth 2.0 / JWT Authentication middleware and refresh token rotation', status: 'IN_PROGRESS', priority: 'CRITICAL', storyPoints: 8, assignee: 'Sarah Connor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', subtasks: [{ id: 'sub-3', title: 'Setup Passport strategy', completed: true }, { id: 'sub-4', title: 'Implement Redis blacklist', completed: true }, { id: 'sub-5', title: 'Write unit tests', completed: false }] },
    { id: 'TSK-1006', title: 'Develop RAG document chunking pipeline with 512 token overlap', status: 'IN_PROGRESS', priority: 'HIGH', storyPoints: 8, assignee: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', subtasks: [{ id: 'sub-6', title: 'Integrate pdf-parse', completed: true }, { id: 'sub-7', title: 'Connect pgvector operator', completed: false }] },
  ],
  IN_REVIEW: [
    { id: 'TSK-1002', title: 'Create interactive Kanban board with swimlanes and drag-and-drop', status: 'IN_REVIEW', priority: 'HIGH', storyPoints: 5, assignee: 'Elena Rostova', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', subtasks: [{ id: 'sub-8', title: 'Add @hello-pangea/dnd', completed: true }, { id: 'sub-9', title: 'Verify optimistic updates', completed: true }] },
  ],
  DONE: [
    { id: 'TSK-1003', title: 'Provision Docker Compose stack with PostgreSQL, Redis, and PgAdmin', status: 'DONE', priority: 'MEDIUM', storyPoints: 3, assignee: 'David Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', subtasks: [{ id: 'sub-10', title: 'Verify volume persistence', completed: true }] },
  ],
};

export const KanbanBoardPage: React.FC = () => {
  const [columns, setColumns] = useState<any>(INITIAL_BOARD_DATA);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [newComment, setNewComment] = useState('');
  const [aiPlannerOpen, setAiPlannerOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to load live tasks from backend, fallback to rich initial data
    api.getTasks().then((res: any) => {
      if (Array.isArray(res) && res.length > 0) {
        const grouped: any = { TODO: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [] };
        res.forEach((t) => {
          if (grouped[t.status]) grouped[t.status].push(t);
        });
        setColumns(grouped);
      }
    }).catch(() => {});
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    // BUG-FE-06 intentional defect: Drag and drop optimistic state update omits rollback trigger when network patch fails or throttles
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = source.droppableId === destination.droppableId ? sourceCol : [...columns[destination.droppableId]];
    const [movedTask] = sourceCol.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });

    try {
      await api.updateTaskStatus(movedTask.id, destination.droppableId);
    } catch (err) {
      // Intentional defect behavior: swallow error without reverting UI state
    }
  };

  const handleRunAiPlanner = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res: any = await api.aiPlanSprint('Analyze current board distribution across Alex Rivera, Sarah Connor, and Elena Rostova. Recommend workload balancing.', 'prj-alpha');
      setAiResult(typeof res?.result === 'string' ? res.result : JSON.stringify(res?.result || res, null, 2));
    } catch (err) {
      setAiResult('AI Sprint Planner optimization complete: Reassigned 1 High Priority task from Alex Rivera to Marcus Vance to balance capacity.');
    } finally {
      setAiLoading(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Bar */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: '2rem' }}>
            Active Kanban Board — Alpha Core Engine
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drag and drop tasks across swimlanes to update status. Click any task for subtasks, risk scores, and mentions.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AiIcon />}
            onClick={() => setAiPlannerOpen(true)}
            sx={{ borderRadius: 2.5 }}
          >
            AI Sprint Planner
          </Button>
        </Box>
      </Box>

      {/* Drag & Drop Swimlanes */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2.5, minHeight: '65vh' }}>
          {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((colKey) => {
            const colTasks = columns[colKey] || [];
            return (
              <Box
                key={colKey}
                sx={{
                  backgroundColor: '#0D1224',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Column Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
                    {colKey.replace('_', ' ')}
                  </Typography>
                  <Chip label={colTasks.length} size="small" sx={{ height: 20, fontWeight: 800 }} />
                </Box>

                {/* Droppable Area */}
                <Droppable droppableId={colKey}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        minHeight: 200,
                        backgroundColor: snapshot.isDraggingOver ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                        borderRadius: 2,
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      {colTasks.map((task: any, idx: number) => (
                        <Draggable key={task.id} draggableId={task.id} index={idx}>
                          {(dragProvided, dragSnapshot) => (
                            <Card
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              sx={{
                                p: 2,
                                cursor: 'pointer',
                                backgroundColor: dragSnapshot.isDragging ? '#1E293B' : '#111827',
                                borderColor: dragSnapshot.isDragging ? '#3B82F6' : 'rgba(255, 255, 255, 0.08)',
                                boxShadow: dragSnapshot.isDragging ? '0 12px 30px rgba(59, 130, 246, 0.4)' : '0 4px 12px rgba(0,0,0,0.3)',
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: "'Fira Code', monospace", fontWeight: 700 }}>
                                  {task.id}
                                </Typography>
                                <Chip label={task.priority} color={getPriorityColor(task.priority) as any} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                              </Box>

                              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, lineHeight: 1.4 }}>
                                {task.title}
                              </Typography>

                              {task.subtasks && task.subtasks.length > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                                  <CheckIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    {task.subtasks.filter((st: any) => st.completed).length} / {task.subtasks.length} subtasks
                                  </Typography>
                                </Box>
                              )}

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                  <Avatar src={task.avatar} alt={task.assignee} sx={{ width: 22, height: 22 }} />
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    {task.assignee}
                                  </Typography>
                                </Box>
                                <Chip label={`${task.storyPoints} pts`} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', borderColor: 'rgba(255,255,255,0.2)' }} />
                              </Box>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Box>
            );
          })}
        </Box>
      </DragDropContext>

      {/* Task Details Modal */}
      <Dialog open={Boolean(selectedTask)} onClose={() => setSelectedTask(null)} maxWidth="md" fullWidth>
        {selectedTask && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip label={selectedTask.id} size="small" color="primary" sx={{ fontFamily: "'Fira Code', monospace" }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {selectedTask.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedTask(null)}><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                <Paper sx={{ p: 1.5, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>STATUS</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 0.5 }}>{selectedTask.status}</Typography>
                </Paper>
                <Paper sx={{ p: 1.5, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>PRIORITY</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 0.5, color: getPriorityColor(selectedTask.priority) === 'error' ? '#F43F5E' : '#F59E0B' }}>{selectedTask.priority}</Typography>
                </Paper>
                <Paper sx={{ p: 1.5, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>ASSIGNEE</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 0.5 }}>{selectedTask.assignee}</Typography>
                </Paper>
              </Box>

              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Subtask Checklist</Typography>
                  <Paper sx={{ p: 1, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    {selectedTask.subtasks.map((st: any) => (
                      <FormControlLabel
                        key={st.id}
                        control={<Checkbox checked={st.completed} size="small" />}
                        label={<Typography variant="body2">{st.title}</Typography>}
                        sx={{ display: 'block', ml: 0.5 }}
                      />
                    ))}
                  </Paper>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Comments & Activity Timeline</Typography>
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" sx={{ width: 28, height: 28 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>Marcus Vance (@pm)</Typography>
                      <Typography variant="body2" sx={{ mt: 0.3 }}>Please make sure @dev verifies Redis memory overhead before merging.</Typography>
                    </Box>
                  </Box>
                </Paper>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="Write a comment... use @username to mention teammates"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    size="small"
                    fullWidth
                  />
                  <Button variant="contained" color="primary" onClick={() => setNewComment('')} endIcon={<SendIcon />}>
                    Post
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* AI Sprint Planner Modal */}
      <Dialog open={aiPlannerOpen} onClose={() => setAiPlannerOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AiIcon sx={{ color: '#8B5CF6' }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            AI Sprint Planner & Workload Balancer
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            TaskPilot AI analyzes current team velocity, task complexity, and developer availability to recommend optimal sprint allocations.
          </Typography>
          {aiLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5, gap: 2 }}>
              <CircularProgress color="secondary" />
              <Typography variant="body2">Analyzing 36 backlog items and historical velocity across 3 sprints...</Typography>
            </Box>
          ) : aiResult ? (
            <Paper sx={{ p: 2.5, backgroundColor: '#161F38', fontFamily: "'Fira Code', monospace", fontSize: '0.825rem' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{aiResult}</pre>
            </Paper>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAiPlannerOpen(false)} color="inherit">Close</Button>
          <Button variant="contained" color="secondary" onClick={handleRunAiPlanner} disabled={aiLoading}>
            Generate AI Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
