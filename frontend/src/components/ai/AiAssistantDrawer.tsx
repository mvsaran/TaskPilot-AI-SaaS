import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  AutoAwesome as AiIcon,
  Send as SendIcon,
  Psychology as PlanIcon,
  BugReport as BugIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { api } from '../../services/apiClient';

interface AiAssistantDrawerProps {
  open: boolean;
  onClose: () => void;
  projectId?: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ open, onClose, projectId = 'prj-alpha' }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [responseOutput, setResponseOutput] = useState<any | null>(null);

  const handleExecute = async () => {
    if (!inputPrompt.trim()) return;
    setLoading(true);
    setResponseOutput(null);

    try {
      let res: any;
      if (tabIndex === 0) {
        // Copilot / RAG Chat
        res = await api.aiRagChat(inputPrompt, projectId);
      } else if (tabIndex === 1) {
        // Task / Story Generator
        res = await api.aiGenerateTasks(inputPrompt, projectId);
      } else if (tabIndex === 2) {
        // Sprint Planner
        res = await api.aiPlanSprint(inputPrompt, projectId);
      } else if (tabIndex === 3) {
        // Bug Summarizer
        res = await api.aiSummarizeBug(inputPrompt, projectId);
      } else if (tabIndex === 4) {
        // Smart Search
        res = await api.aiSmartSearch(inputPrompt, projectId);
      }
      setResponseOutput(res?.result || res);
    } catch (err: any) {
      setResponseOutput({ error: err?.toString() || 'AI execution failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', md: 520 },
          backgroundColor: '#0D1224',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(17, 24, 39, 0.8)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: 2, background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AiIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              AI Hub & Copilot
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              High-Fidelity Enterprise Assistant (Project: {projectId})
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(_, val) => { setTabIndex(val); setResponseOutput(null); setInputPrompt(''); }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', px: 2, pt: 1, '& .MuiTab-root': { minHeight: 46, fontSize: '0.8rem', fontWeight: 600 } }}
      >
        <Tab label="RAG Copilot" icon={<AiIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="Task Gen" icon={<PlanIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="Sprint Plan" icon={<PlanIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="Bug Analyzer" icon={<BugIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
        <Tab label="Smart Search" icon={<SearchIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
      </Tabs>

      {/* Content Area */}
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Input section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {tabIndex === 0 && 'Ask anything about architecture, tasks, or knowledge base docs:'}
            {tabIndex === 1 && 'Describe feature idea or engineering epic to decompose into stories:'}
            {tabIndex === 2 && 'Enter sprint constraints, target velocity, and capacity targets:'}
            {tabIndex === 3 && 'Paste error logs, stack traces, or console output to analyze:'}
            {tabIndex === 4 && 'Enter natural language query to translate to SQL/Prisma (e.g. "Overdue tasks"):'}
          </Typography>
          <TextField
            multiline
            rows={4}
            placeholder={
              tabIndex === 0 ? 'e.g., What are the security policies and RBAC rules in this project?' :
              tabIndex === 1 ? 'e.g., Build two-factor authentication with SMS OTP and backup codes' :
              tabIndex === 2 ? 'e.g., Plan 40 points across 5 developers avoiding overload on Alex Rivera' :
              tabIndex === 3 ? 'e.g., TypeError: Cannot read property status of null at TasksController.updateStatus' :
              'e.g., Show critical high-priority bugs assigned to backend team'
            }
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 3,
                fontSize: '0.9rem',
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleExecute}
              disabled={loading || !inputPrompt.trim()}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              sx={{ borderRadius: 2.5, px: 3 }}
            >
              {loading ? 'AI Processing...' : 'Execute AI'}
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Output area */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            AI Response Output
            {responseOutput && <Chip label="Structured JSON / Citations" size="small" color="success" sx={{ height: 20 }} />}
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, gap: 2 }}>
              <CircularProgress color="secondary" />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Orchestrating AI models, RAG vector index, and structured schema verification...
              </Typography>
            </Box>
          ) : !responseOutput ? (
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: 3 }}>
              <AiIcon sx={{ fontSize: 36, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter your prompt and click Execute AI to see real-time structured responses and citations.
              </Typography>
            </Paper>
          ) : (
            <Paper
              // BUG-FE-03 intentional defect: Long unescaped strings or code blocks can overflow container width without proper overflow-x wrap checking
              sx={{
                p: 2.5,
                backgroundColor: '#161F38',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 3,
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.825rem',
                maxHeight: 450,
                overflowY: 'auto',
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {typeof responseOutput === 'string' ? responseOutput : JSON.stringify(responseOutput, null, 2)}
              </pre>
            </Paper>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
