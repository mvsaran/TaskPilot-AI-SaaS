import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { AutoAwesome as AiIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/apiClient';

export const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.register({ fullName, email, password, role });
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.toString() || 'Registration failed');
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
      }}
    >
      <Card sx={{ maxWidth: 480, width: '100%', p: 3, borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AiIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Join TaskPilot AI
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Create an enterprise account to access AI project management tools
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} size="small" required fullWidth />
            <TextField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} size="small" required fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} size="small" required fullWidth />
            <TextField select label="Requested Role" value={role} onChange={(e) => setRole(e.target.value)} size="small" fullWidth>
              <MenuItem value="DEVELOPER">DEVELOPER</MenuItem>
              <MenuItem value="PROJECT_MANAGER">PROJECT MANAGER</MenuItem>
              <MenuItem value="QA_ENGINEER">QA ENGINEER</MenuItem>
              <MenuItem value="PRODUCT_OWNER">PRODUCT OWNER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ py: 1.2, mt: 1 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Already have an account? <Link to="/login" style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
