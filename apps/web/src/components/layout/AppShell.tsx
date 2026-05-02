import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Box, IconButton, Typography, Avatar, Menu, MenuItem, Button, Divider, Drawer, useMediaQuery, useTheme } from '@mui/material';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Zap,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Plus,
  LogOut,
  Moon,
  Sun,
  User,
  Menu as MenuIcon,
} from 'lucide-react';
import { useColorMode } from '../../context/ColorModeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Leads', icon: Users, path: '/dashboard/leads' },
  { label: 'Pipeline', icon: Kanban, path: '/dashboard/lead-management' },
  { label: 'Team', icon: Users, path: '/dashboard/lead-management' },
  { label: 'Automation', icon: Zap, path: '/dashboard/automation-builder' },
  { label: 'Reports', icon: BarChart3, path: '/dashboard' },
  { label: 'Settings', icon: Settings, path: '/dashboard' },
];

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const sidebarWidth = collapsed ? 72 : 240;

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    void dispatch(logout() as any);
    handleCloseMenu();
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    return segments.map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1));
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const SidebarContent = ({ isMobileDrawer = false }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: isMobileDrawer ? 280 : sidebarWidth,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobileDrawer ? 'center' : 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 64,
        }}
      >
        <AnimatePresence mode="wait">
          {(!collapsed || isMobileDrawer) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                LF
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                LeadFlow
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && !isMobileDrawer && (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            LF
          </Box>
        )}
        {isMobileDrawer && (
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2, px: isMobileDrawer ? 2 : (collapsed ? 1 : 2) }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Box
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNavClick(item.path)}
              aria-label={`${item.label} page`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 2,
                py: 1.5,
                mb: 0.5,
                borderRadius: '8px',
                cursor: 'pointer',
                bgcolor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? 'white' : 'text.secondary',
                '&:hover': {
                  bgcolor: isActive ? 'primary.dark' : 'action.hover',
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
                transition: 'all 0.15s ease',
                justifyContent: (collapsed && !isMobileDrawer) ? 'center' : 'flex-start',
              }}
            >
              <Icon size={20} aria-hidden="true" />
              <AnimatePresence>
                {(!collapsed || isMobileDrawer) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    style={{ whiteSpace: 'nowrap', fontWeight: 500, fontSize: 14 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Box>
          );
        })}
      </Box>

      {/* User Card */}
      {user && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            justifyContent: (collapsed && !isMobileDrawer) ? 'center' : 'flex-start',
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: 14,
              fontWeight: 600,
            }}
            aria-label={`User: ${user.full_name}`}
          >
            {user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </Avatar>
          <AnimatePresence>
            {(!collapsed || isMobileDrawer) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ flex: 1, minWidth: 0 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.full_name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
                >
                  {user.role.replace('_', ' ')}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      )}

      {/* Collapse Toggle - only on desktop */}
      {!isMobileDrawer && (
        <Box
          sx={{
            p: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'flex-end',
          }}
        >
          <IconButton
            size="small"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </IconButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          sx={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 1200,
            bgcolor: 'background.paper',
            boxShadow: 1,
          }}
        >
          <MenuIcon size={24} />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <SidebarContent isMobileDrawer />
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        component={motion.aside}
        initial={false}
        animate={{ width: isMobile ? 0 : sidebarWidth }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          flexDirection: 'column',
          zIndex: 1200,
          overflow: 'hidden',
        }}
      >
        <SidebarContent />
      </Box>

      {/* Main Content */}
      <Box
        component={motion.main}
        initial={false}
        animate={{ marginLeft: isMobile ? 0 : sidebarWidth }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Topbar */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            height: 64,
            px: 3,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1100,
          }}
        >
          {/* Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: isMobile ? 5 : 0 }}>
            {getBreadcrumbs().map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>/</Typography>
                )}
                <Typography
                  sx={{
                    color: idx === getBreadcrumbs().length - 1 ? 'text.primary' : 'text.secondary',
                    fontWeight: idx === getBreadcrumbs().length - 1 ? 600 : 400,
                    fontSize: 14,
                  }}
                >
                  {crumb}
                </Typography>
              </React.Fragment>
            ))}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Search */}
            <Button
              startIcon={<Search size={18} />}
              aria-label="Search (Cmd+K)"
              sx={{
                color: 'text.secondary',
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                px: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography variant="caption" sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
                Search...
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  ml: 2,
                  px: 1,
                  py: 0.5,
                  bgcolor: 'divider',
                  borderRadius: 1,
                  display: { xs: 'none', md: 'block' },
                }}
              >
                ⌘K
              </Typography>
            </Button>

            {/* New Lead */}
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              aria-label="Create new lead"
              sx={{ borderRadius: '8px' }}
            >
              <Typography sx={{ display: { xs: 'none', md: 'block' } }}>New Lead</Typography>
            </Button>

            {/* Notifications */}
            <IconButton
              onClick={(e) => setNotifAnchor(e.currentTarget)}
              aria-label="View notifications"
            >
              <Bell size={20} />
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                }}
              />
            </IconButton>

            {/* Theme Toggle */}
            <IconButton onClick={toggleColorMode} aria-label="Toggle dark mode">
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>

            {/* User Avatar */}
            <IconButton onClick={handleProfileClick} aria-label="User menu">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {user?.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { mt: 1, minWidth: 180 },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user?.full_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleCloseMenu}>
          <User size={16} style={{ marginRight: 8 }} aria-hidden="true" />
          Profile
        </MenuItem>
        <MenuItem onClick={toggleColorMode}>
          {mode === 'dark' ? <Sun size={16} style={{ marginRight: 8 }} /> : <Moon size={16} style={{ marginRight: 8 }} />}
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <LogOut size={16} style={{ marginRight: 8 }} aria-hidden="true" />
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { mt: 1, width: 320, maxHeight: 400 },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        <MenuItem>
          <Box>
            <Typography variant="body2">New lead assigned to you</Typography>
            <Typography variant="caption" color="text.secondary">
              2 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="body2">Lead status updated to Qualified</Typography>
            <Typography variant="caption" color="text.secondary">
              15 minutes ago
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};