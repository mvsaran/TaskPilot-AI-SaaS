import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

export const AnalyticsPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h1" sx={{ fontSize: '2rem' }}>
          Analytics, Velocity & Release Readiness
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Deep-dive telemetry into engineering output, defect injection ratios, and predictive release timelines.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Defect Resolution Density
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Ratio of closed bugs versus open security and backend race condition defects.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2">Security Defects (BUG-SEC-01 to 08)</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>8 Injected / 0 Resolved</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { backgroundColor: '#F43F5E' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2">Backend Logic & Race Conditions (BUG-BE-01 to 10)</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>10 Injected / 0 Resolved</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { backgroundColor: '#F59E0B' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2">AI & RAG Pipeline Defects (BUG-AI-01 to 10)</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>10 Injected / 0 Resolved</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { backgroundColor: '#8B5CF6' } }} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Release Readiness & Confidence Index
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              AI telemetry synthesizing code churn, automated test pass rate, and open issue severity.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 3, mb: 3 }}>
              <CheckIcon sx={{ color: '#10B981', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#34D399' }}>
                  94.5% — High Confidence
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Target release date: Friday 17:00 UTC. All core modules operational.
                </Typography>
              </Box>
            </Box>

            <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>SUT TESTING REMINDER</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                While release readiness reads 94.5% for general functionality, remember that 50 defects have been intentionally hidden inside edge cases, race conditions, and unvalidated payloads for autonomous QA verification.
              </Typography>
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
