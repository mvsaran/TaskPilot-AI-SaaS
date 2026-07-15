import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AutoAwesome as AiIcon, Security as SecurityIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Sarah Connor (Admin)', email: 'admin@taskpilot.ai', role: 'ADMIN', color: '#F43F5E' },
  { label: 'Marcus Vance (Project Manager)', email: 'pm@taskpilot.ai', role: 'PROJECT_MANAGER', color: '#8B5CF6' },
  { label: 'Alex Rivera (Senior Developer)', email: 'dev@taskpilot.ai', role: 'DEVELOPER', color: '#3B82F6' },
  { label: 'Elena Rostova (Lead QA Engineer)', email: 'qa@taskpilot.ai', role: 'QA_ENGINEER', color: '#F59E0B' },
  { label: 'David Chen (Product Owner)', email: 'po@taskpilot.ai', role: 'PRODUCT_OWNER', color: '#10B981' },
  { label: 'Maya Lin (Viewer / Auditor)', email: 'viewer@taskpilot.ai', role: 'VIEWER', color: '#94A3B8' },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@taskpilot.ai');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.toString() || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoEmail: string) => {
    setEmail(demoEmail);
    setLoading(true);
    try {
      await login(demoEmail, 'Password123!');
      navigate('/');
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0A0E1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.12) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
      }}
    >
      <Card sx={{ maxWidth: 520, width: '100%', p: { xs: 2, md: 4 }, borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Logo Title */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.6)',
              }}
            >
              <AiIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              TaskPilot AI
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Enterprise AI Project Management & Autonomous QA SUT
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ py: 1.2, mt: 1, fontSize: '0.95rem', borderRadius: 2.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In to Enterprise Workspace'}
            </Button>
          </Box>

          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              INSTANT DEMO ROLES (FOR SUT / QA TESTING)
            </Typography>
          </Divider>

          {/* Demo Role Buttons */}
          <Grid container spacing={1.5}>
            {DEMO_ACCOUNTS.map((acc) => (
              <Grid item xs={12} sm={6} key={acc.email}>
                <Button
                  onClick={() => handleDemoClick(acc.email)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<SecurityIcon sx={{ color: acc.color, fontSize: 16 }} />}
                  sx={{
                    justifyContent: 'flex-start',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    py: 0.8,
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    '&:hover': {
                      borderColor: acc.color,
                      backgroundColor: `${acc.color}15`,
                    },
                  }}
                >
                  <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {acc.label}
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Don't have an account? <Link to="/register" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>Create account</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
