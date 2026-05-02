import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ColorModeContext';
import { AppShell } from './components/layout/AppShell';
import { Toaster } from './components/Toaster';
import LeadListing from './pages/LeadListing';
import LeadDetails from './pages/LeadDetails';
import Dashboard from './pages/Dashboard';
import LeadManagement from './pages/LeadManagement';
import AutomationBuilder from './pages/AutomationBuilder';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 4 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const } },
};

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
        >
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={user ? <Navigate replace to="/dashboard" /> : <Navigate replace to="/login" />}
            />
            <Route
              path="/dashboard"
              element={user ? <AppShell><Dashboard /></AppShell> : <Navigate replace to="/login" />}
            >
              <Route index element={<LeadListing />} />
              <Route path="leads/:id" element={<LeadDetails />} />
              <Route path="leads" element={<LeadListing />} />
              <Route path="lead-management" element={<LeadManagement />} />
              <Route path="automation-builder" element={<AutomationBuilder />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: 100,
                zIndex: 9999,
              }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 560,
                background: 'white',
                borderRadius: 12,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                overflow: 'hidden',
              }}
            >
              <input
                autoFocus
                placeholder="Search leads, contacts, or commands..."
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: 16,
                  border: 'none',
                  outline: 'none',
                }}
              />
              <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Type <kbd style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>↑</kbd> <kbd style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>↓</kbd> to navigate</span>
                <span style={{ fontSize: 12, color: '#64748b' }}><kbd style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>↵</kbd> to select</span>
                <span style={{ fontSize: 12, color: '#64748b' }}><kbd style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>esc</kbd> to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AnimatedRoutes />
        <Toaster position="top-right" />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;