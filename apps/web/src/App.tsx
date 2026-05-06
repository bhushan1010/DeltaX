import { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/users/UsersPage';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from './components/ui/sonner';

import ProjectsListPage from './pages/projects/ProjectsListPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import TasksPage from './pages/tasks/TasksPage';

function AppContent() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState<string>('');

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page);
    if (page === 'project-detail' && id) {
      setCurrentProjectId(id);
    }
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'projects':
        return <ProjectsListPage onNavigate={handleNavigate} />;
      case 'project-detail':
        return <ProjectDetailPage onNavigate={handleNavigate} projectId={currentProjectId} />;
      case 'tasks':
        return <TasksPage />;
      case 'users':
        return <UsersPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      <AppLayout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderPage()}
      </AppLayout>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="size-full">
          <AppContent />
          <Toaster />
        </div>
      </ThemeProvider>
    </Provider>
  );
}