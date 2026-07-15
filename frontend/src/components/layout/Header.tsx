import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Paper,
  InputBase,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  AutoAwesome as AiIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAuth, UserProfile } from '../../context/AuthContext';
import { api } from '../../services/apiClient';

interface HeaderProps {
  onToggleAiDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleAiDrawer }) => {
  const { user, switchRole, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Poll or load initial unread notifications
    api.client.get('/notifications/unread').then((res: any) => {
      if (Array.isArray(res)) setNotifications(res);
    }).catch(() => {});

    // Listen to SSE live stream if available
    let evtSource: any = null;
    if (typeof window !== 'undefined' && typeof (window as any).EventSource !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const EventSourceClass = (window as any).EventSource;
      evtSource = new EventSourceClass(`/api/v1/notifications/stream?token=${token}`);
      evtSource.onmessage = (event: any) => {
        try {
          const payload = JSON.parse(event.data);
          setNotifications((prev) => [payload, ...prev]);
        } catch (e) {}
      };
    }

    return () => {
      if (evtSource && typeof evtSource.close === 'function') {
        evtSource.close();
      }
    };
  }, []);

  const handleRoleChange = (event: any) => {
    switchRole(event.target.value as UserProfile['role']);
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'PROJECT_MANAGER': return 'secondary';
      case 'DEVELOPER': return 'primary';
      case 'QA_ENGINEER': return 'warning';
      case 'PRODUCT_OWNER': return 'success';
      default: return 'default';
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Left: Brand & Global Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
              }}
            >
              <AiIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, background: 'linear-gradient(to right, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TaskPilot AI
            </Typography>
          </Box>

          <Paper
            component="form"
            sx={{
              p: '2px 14px',
              display: 'flex',
              alignItems: 'center',
              width: 320,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              '&:hover': { borderColor: 'rgba(59, 130, 246, 0.4)' },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search projects, tasks, or RAG docs..."
              sx={{ ml: 1, flex: 1, fontSize: '0.875rem', color: '#fff' }}
            />
          </Paper>
        </Box>

        {/* Right: Role Switcher, AI Copilot Button, Notifications, User */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* RBAC Role Switcher */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'rgba(255,255,255,0.03)', px: 1.5, py: 0.5, borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
            <SecurityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Role:
            </Typography>
            <Select
              size="small"
              value={user?.role || 'DEVELOPER'}
              onChange={handleRoleChange}
              variant="standard"
              disableUnderline
              sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="PROJECT_MANAGER">PROJECT MANAGER</MenuItem>
              <MenuItem value="DEVELOPER">DEVELOPER</MenuItem>
              <MenuItem value="QA_ENGINEER">QA ENGINEER</MenuItem>
              <MenuItem value="PRODUCT_OWNER">PRODUCT OWNER</MenuItem>
              <MenuItem value="VIEWER">VIEWER</MenuItem>
            </Select>
            <Chip label={user?.role} color={getRoleColor(user?.role) as any} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
          </Box>

          {/* AI Copilot Launch Button */}
          <Tooltip title="Open AI Hub & Copilot Drawer">
            <Box
              onClick={onToggleAiDrawer}
              sx={{
                cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: 2.5,
                px: 2,
                py: 0.7,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                  transform: 'scale(1.02)',
                },
              }}
            >
              <AiIcon sx={{ color: '#A78BFA', fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                AI Hub
              </Typography>
            </Box>
          </Tooltip>

          {/* Notifications SSE Popover */}
          <IconButton
            onClick={(e) => setNotifAnchor(e.currentTarget)}
            sx={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2 }}
          >
            <Badge badgeContent={notifications.filter((n) => !n.read).length} color="error">
              <NotificationsIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Badge>
          </IconButton>

          <Popover
            open={Boolean(notifAnchor)}
            anchorEl={notifAnchor}
            onClose={() => setNotifAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { width: 340, maxHeight: 420, mt: 1.5, p: 2 } }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              Live Notifications (SSE)
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {notifications.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', p: 2, textAlign: 'center' }}>
                No recent notifications
              </Typography>
            ) : (
              <List disablePadding>
                {notifications.slice(0, 8).map((n, i) => (
                  <React.Fragment key={n.id || i}>
                    <ListItem alignItems="flex-start" sx={{ px: 1, py: 1 }}>
                      <ListItemText
                        primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{n.title || n.type}</Typography>}
                        secondary={<Typography variant="caption" sx={{ color: 'text.secondary' }}>{n.message}</Typography>}
                      />
                    </ListItem>
                    {i < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Popover>

          {/* User Profile & Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={user?.avatarUrl} alt={user?.fullName} sx={{ width: 36, height: 36, border: '2px solid #3B82F6' }} />
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {user?.fullName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
