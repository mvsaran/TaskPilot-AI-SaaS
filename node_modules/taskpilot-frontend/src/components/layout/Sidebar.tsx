import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ViewKanban as KanbanIcon,
  FolderSpecial as ProjectsIcon,
  Loop as SprintsIcon,
  MenuBook as KnowledgeIcon,
  Analytics as AnalyticsIcon,
  BugReport as BugIcon,
} from '@mui/icons-material';

const NAV_ITEMS = [
  { label: 'Executive Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Projects List', path: '/projects', icon: <ProjectsIcon /> },
  { label: 'Active Kanban Board', path: '/board', icon: <KanbanIcon />, badge: 'Live' },
  { label: 'Sprints & Burndown', path: '/sprints', icon: <SprintsIcon /> },
  { label: 'Knowledge Base (RAG)', path: '/knowledge', icon: <KnowledgeIcon />, badge: 'AI' },
  { label: 'Analytics & Reports', path: '/analytics', icon: <AnalyticsIcon /> },
  { label: 'Internal Bug Catalog', path: '/bugs', icon: <BugIcon />, badge: '50 QA' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 250,
        minWidth: 250,
        backgroundColor: '#0D1224',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        height: 'calc(100vh - 65px)',
        position: 'sticky',
        top: 65,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 2,
      }}
    >
      <Box>
        <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', fontWeight: 700, letterSpacing: '0.1em' }}>
          Navigation
        </Typography>
        <List sx={{ px: 1.5, mt: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.2,
                    px: 2,
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                    color: isActive ? '#fff' : 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      color: '#fff',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#3B82F6' : 'inherit', minWidth: 38 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 500 }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: item.badge === '50 QA' ? 'rgba(244, 63, 94, 0.2)' : item.badge === 'AI' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: item.badge === '50 QA' ? '#FB7185' : item.badge === 'AI' ? '#A78BFA' : '#34D399',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* System Status Footer */}
      <Box sx={{ px: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 10px #10B981' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            System Under Test (SUT)
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
          Autonomous QA Target v1.0.0
        </Typography>
      </Box>
    </Box>
  );
};
