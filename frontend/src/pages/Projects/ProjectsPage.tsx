import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  FolderSpecial as ProjectIcon,
  Add as AddIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/apiClient';

const MOCK_PROJECTS = [
  { id: 'prj-alpha', key: 'ALPHA', name: 'TaskPilot AI Core Engine & RAG Indexer', status: 'ACTIVE', healthScore: 94.5, team: 'Core Engineering', tasks: 24 },
  { id: 'prj-beta', key: 'BETA', name: 'Enterprise Design System & Glassmorphism UI', status: 'ACTIVE', healthScore: 92.0, team: 'Frontend Team', tasks: 12 },
  { id: 'prj-gamma', key: 'GAMMA', name: 'Observability & Telemetry Infrastructure Pipeline', status: 'PLANNED', healthScore: 88.0, team: 'DevOps & SRE', tasks: 8 },
];

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    // BUG-FE-05 intentional defect: double clicks on modal submit button are not debounced, allowing potential duplicate project requests under latency
    if (!name.trim() || !key.trim()) return;
    const newPrj = {
      id: `prj-${Date.now()}`,
      key: key.toUpperCase(),
      name,
      status: 'ACTIVE',
      healthScore: 95.0,
      team: 'Core Engineering',
      tasks: 0,
    };
    setProjects([newPrj, ...projects]);
    setOpenCreate(false);
    setName('');
    setKey('');
    try { await api.createProject(newPrj); } catch (e) {}
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: '2rem' }}>
            Enterprise Projects Repository
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Browse active workspaces, inspect health telemetry, and manage cross-functional engineering initiatives.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: 2.5 }}
        >
          Create New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((p) => (
          <Grid item xs={12} md={4} key={p.id}>
            <Card
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/board')}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Chip label={p.key} size="small" color="primary" sx={{ fontFamily: "'Fira Code', monospace", fontWeight: 800 }} />
                  <Chip label={p.status} color={p.status === 'ACTIVE' ? 'success' : 'default'} size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {p.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 2 }}>
                  Team: {p.team} | {p.tasks} total tasks
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>AI HEALTH</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: p.healthScore >= 90 ? '#10B981' : '#F59E0B' }}>
                    {p.healthScore} / 100
                  </Typography>
                </Box>
                <Button size="small" endIcon={<ArrowIcon />}>
                  Open Board
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Workspace Project</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Project Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth size="small" />
          <TextField label="Project Key (e.g. ALPHA)" value={key} onChange={(e) => setKey(e.target.value)} required fullWidth size="small" />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} fullWidth size="small" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
