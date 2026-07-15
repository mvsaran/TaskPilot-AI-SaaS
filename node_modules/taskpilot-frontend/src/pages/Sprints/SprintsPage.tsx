import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Loop as SprintsIcon,
  AutoAwesome as AiIcon,
  PlayArrow as StartIcon,
  Stop as CloseIcon,
  TrendingUp as VelocityIcon,
} from '@mui/icons-material';
import { api } from '../../services/apiClient';

const MOCK_SPRINTS = [
  { id: 'sprint-3', name: 'Sprint 3 (Alpha Core Engine)', status: 'ACTIVE', startDate: '2026-07-01', endDate: '2026-07-15', velocity: 24, target: 40, health: 94 },
  { id: 'sprint-2', name: 'Sprint 2 (Authentication & RBAC)', status: 'CLOSED', startDate: '2026-06-15', endDate: '2026-06-30', velocity: 42, target: 40, health: 96 },
  { id: 'sprint-1', name: 'Sprint 1 (Schema & Observability)', status: 'CLOSED', startDate: '2026-06-01', endDate: '2026-06-14', velocity: 38, target: 40, health: 91 },
];

export const SprintsPage: React.FC = () => {
  const [sprints, setSprints] = useState(MOCK_SPRINTS);

  const handleStart = async (id: string) => {
    try { await api.startSprint(id); } catch (e) {}
    setSprints(sprints.map(s => s.id === id ? { ...s, status: 'ACTIVE' } : s));
  };

  const handleClose = async (id: string) => {
    // BUG-BE-02 & BUG-FE-07 intentional defect interaction: concurrent or rapid clicks on close sprint can trigger race condition without lock validation
    try { await api.closeSprint(id); } catch (e) {}
    setSprints(sprints.map(s => s.id === id ? { ...s, status: 'CLOSED' } : s));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: '2rem' }}>
            Sprints & Velocity Telemetry
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage sprint iterations, analyze burndown trajectory, and close sprints with AI summary generation.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Sprint Iterations & Lifecycle
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>SPRINT NAME</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>STATUS</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>DATES</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>VELOCITY / TARGET</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>HEALTH</TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 800 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sprints.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell sx={{ fontWeight: 700 }}>{s.name}</TableCell>
                      <TableCell>
                        <Chip label={s.status} color={s.status === 'ACTIVE' ? 'success' : 'default'} size="small" sx={{ fontWeight: 800 }} />
                      </TableCell>
                      <TableCell sx={{ fontFamily: "'Fira Code', monospace", fontSize: '0.8rem' }}>{s.startDate} — {s.endDate}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{s.velocity} / {s.target} pts</TableCell>
                      <TableCell>
                        <Chip label={`${s.health}%`} color="primary" size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        {s.status === 'PLANNED' && (
                          <Button size="small" variant="contained" color="success" startIcon={<StartIcon />} onClick={() => handleStart(s.id)}>
                            Start
                          </Button>
                        )}
                        {s.status === 'ACTIVE' && (
                          <Button size="small" variant="outlined" color="error" startIcon={<CloseIcon />} onClick={() => handleClose(s.id)}>
                            Close Sprint
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AiIcon sx={{ color: '#8B5CF6' }} />
              <Typography variant="h4">AI Velocity Forecast</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Based on historical burndown across Sprint 1 and 2, AI predicts team capacity will stabilize at 44 points for Sprint 4.
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <Typography variant="subtitle2" sx={{ color: '#A78BFA', fontWeight: 800 }}>
                Recommendation
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                Do not inject more than 44 story points into Sprint 4 backlog. Maintain 20% capacity buffer for QA SUT regression testing.
              </Typography>
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
