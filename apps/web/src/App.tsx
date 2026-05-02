import { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LeadsListPage from './pages/leads/LeadsListPage';
import LeadDetailPage from './pages/leads/LeadDetailPage';
import AutomationPage from './pages/automation/AutomationPage';
import UsersPage from './pages/users/UsersPage';
import AppLayout from './components/layout/AppLayout';
import LeadFormModal from './components/forms/LeadFormModal';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | undefined>(undefined);

  const handleNavigate = (page: string, leadId?: string) => {
    setCurrentPage(page);
  };

  const handleOpenLeadForm = (leadId?: string) => {
    setEditingLeadId(leadId);
    setIsLeadFormOpen(true);
  };

  const handleCloseLeadForm = () => {
    setIsLeadFormOpen(false);
    setEditingLeadId(undefined);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'leads':
        return <LeadsListPage onNavigate={handleNavigate} onOpenLeadForm={handleOpenLeadForm} />;
      case 'lead-detail':
        return (
          <LeadDetailPage
            onNavigate={handleNavigate}
            onEdit={() => {
              const leads = store.getState().leads.leads;
              const selectedLead = store.getState().leads.selectedLead;
              if (selectedLead) {
                handleOpenLeadForm(selectedLead.id);
              }
            }}
          />
        );
      case 'automation':
        return <AutomationPage />;
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
      <LeadFormModal
        isOpen={isLeadFormOpen}
        onClose={handleCloseLeadForm}
        leadId={editingLeadId}
      />
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