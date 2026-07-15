import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp as VelocityIcon,
  AutoAwesome as AiIcon,
  AssignmentTurnedIn as TasksIcon,
  FolderSpecial as ProjectIcon,
  BugReport as BugIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/apiClient';

export const ExecutiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BUG-FE-04 intentional defect: Resize observer setup or chart layout effect omits cleanup function, leaving potential detached event listeners during rapid tab navigation
    let isMounted = true;
    api.getDashboardMetrics().then((res: any) => {
      if (isMounted && res) setMetrics(res);
      setLoading(false);
    }).catch(() => {
      // Mock metrics fallback for local demo/QA testing
      if (isMounted) {
        setMetrics({
          summary: {
            totalProjects: 3,
            activeProjects: 3,
            totalTasks: 36,
            completedTasks: 15,
            completionRate: 42,
            activeSprints: 3,
            averageHealthScore: 92.4,
            totalAuditLogs: 142,
          },
          releaseReadiness: 'HIGH_CONFIDENCE',
          distribution: { TODO: 12, IN_PROGRESS: 8, IN_REVIEW: 5, DONE: 11 },
        });
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = metrics?.summary || {
    totalProjects: 3,
    activeProjects: 3,
    totalTasks: 36,
    completedTasks: 15,
    completionRate: 42,
    activeSprints: 3,
    averageHealthScore: 92.4,
  };

  const distribution = metrics?.distribution || { TODO: 12, IN_PROGRESS: 8, IN_REVIEW: 5, DONE: 11 };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Top Banner */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: '2.2rem', mb: 0.5 }}>
            Executive Overview
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            AI-powered velocity forecasting, risk detection, and cross-team health telemetry.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AiIcon />}
            onClick={() => navigate('/board')}
            sx={{ borderRadius: 2.5 }}
          >
            AI Sprint Planner
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowIcon />}
            onClick={() => navigate('/board')}
            sx={{ borderRadius: 2.5 }}
          >
            Open Active Board
          </Button>
        </Box>
      </Box>

      {/* KPI Cards Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>
                  ACTIVE PROJECTS
                </Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProjectIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                </Box>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>
                {summary.activeProjects} / {summary.totalProjects}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckIcon sx={{ fontSize: 14 }} /> 100% on schedule
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>
                  TASK COMPLETION RATE
                </Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TasksIcon sx={{ color: '#10B981', fontSize: 20 }} />
                </Box>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>
                {summary.completionRate}%
              </Typography>
              <LinearProgress variant="determinate" value={summary.completionRate} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { backgroundColor: '#10B981' } }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>
                  AI HEALTH INDEX
                </Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AiIcon sx={{ color: '#8B5CF6', fontSize: 20 }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 800, color: '#A78BFA' }}>
                  {summary.averageHealthScore}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>/ 100</Typography>
              </Box>
              <Chip label="HIGH CONFIDENCE RELEASE" color="success" size="small" sx={{ width: 'fit-content', height: 22, fontWeight: 700, fontSize: '0.65rem' }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#FB7185', fontWeight: 700, letterSpacing: '0.05em' }}>
                  QA SUT DEFECT CATALOG
                </Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, backgroundColor: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BugIcon sx={{ color: '#F43F5E', fontSize: 20 }} />
                </Box>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#FB7185' }}>
                50 Injected
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WarningIcon sx={{ fontSize: 14, color: '#F59E0B' }} /> Sec, BE, DB, AI, FE, QA bugs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Middle Row: Velocity Chart Preview & Task Distribution */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ mb: 0.5 }}>
                  Sprint Velocity & Burndown Forecast
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Historical story points completed per sprint against velocity targets.
                </Typography>
              </Box>
              <Chip label="AI Predicted: +8% next sprint" color="secondary" size="small" icon={<VelocityIcon />} />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Simulated Velocity Bars */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              {[
                { name: 'Sprint 1 (Closed)', completed: 38, target: 40, color: '#3B82F6' },
                { name: 'Sprint 2 (Closed)', completed: 42, target: 40, color: '#8B5CF6' },
                { name: 'Sprint 3 (Active - Alpha)', completed: 24, target: 40, color: '#10B981', ongoing: true },
              ].map((s) => (
                <Box key={s.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{s.name}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {s.completed} pts {s.ongoing && `(of ${s.target} target)`}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (s.completed / s.target) * 100)}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      '& .MuiLinearProgress-bar': { backgroundColor: s.color },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              Task Status Distribution
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Current workload spread across all workspace boards.
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {[
                { label: 'TODO', count: distribution.TODO || 12, color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.1)' },
                { label: 'IN PROGRESS', count: distribution.IN_PROGRESS || 8, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
                { label: 'IN REVIEW', count: distribution.IN_REVIEW || 5, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
                { label: 'DONE', count: distribution.DONE || 11, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
              ].map((stat) => (
                <Grid item xs={6} key={stat.label}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: stat.bg, border: `1px solid ${stat.color}40`, borderRadius: 3 }}>
                    <Typography variant="caption" sx={{ color: stat.color, fontWeight: 800 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color, mt: 0.5 }}>
                      {stat.count}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3.5, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate('/bugs')}
                startIcon={<BugIcon />}
                sx={{ py: 1.2, fontWeight: 700 }}
              >
                Inspect 50 Internal QA Defects
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
