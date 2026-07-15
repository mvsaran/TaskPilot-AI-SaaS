import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ExecutiveDashboard } from './pages/Dashboard/ExecutiveDashboard';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { KanbanBoardPage } from './pages/Board/KanbanBoardPage';
import { SprintsPage } from './pages/Sprints/SprintsPage';
import { KnowledgePage } from './pages/Knowledge/KnowledgePage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { BugCatalogPage } from './pages/Bugs/BugCatalogPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<AppLayout />}>
          <Route index element={<ExecutiveDashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="board" element={<KanbanBoardPage />} />
          <Route path="sprints" element={<SprintsPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="bugs" element={<BugCatalogPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
