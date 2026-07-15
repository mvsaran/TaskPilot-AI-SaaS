import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AiAssistantDrawer } from '../ai/AiAssistantDrawer';

export const AppLayout: React.FC = () => {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0A0E1A' }}>
      <Header onToggleAiDrawer={() => setAiDrawerOpen(true)} />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            overflowX: 'hidden',
            minHeight: 'calc(100vh - 65px)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <AiAssistantDrawer open={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
    </Box>
  );
};
