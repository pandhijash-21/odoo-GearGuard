import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment,
  CalendarMonth,
  Assessment,
  Build,
  Group,
  Menu as MenuIcon,
  Add,
  Logout,
  Person,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin, isManager } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigation items configuration
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, roles: ['admin', 'manager', 'technician'] },
    { label: 'Requests', path: '/requests', icon: <Assignment />, roles: ['admin', 'manager', 'technician'] },
    { label: 'Calendar', path: '/calendar', icon: <CalendarMonth />, roles: ['admin', 'manager', 'technician', 'employee'] },
    { label: 'Reports', path: '/reports', icon: <Assessment />, roles: ['admin', 'manager'] },
    { label: 'Equipment', path: '/equipment', icon: <Build />, roles: ['admin'] },
    { label: 'Teams', path: '/teams', icon: <Group />, roles: ['admin'] },
    { label: 'Users', path: '/users', icon: <Person />, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'technician':
        return 'info';
      default:
        return 'default';
    }
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
          GearGuard
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Maintenance Management
        </Typography>
      </Box>

      <List sx={{ px: 2, py: 2 }}>
        {filteredNavItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: isActive(item.path) ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
              color: isActive(item.path) ? '#667eea' : '#64748b',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 700 : 500,
                fontSize: '0.9375rem',
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      <Box sx={{ p: 2 }}>
        <Box sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'rgba(102, 126, 234, 0.05)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {user?.full_name || user?.email?.split('@')[0]}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
            {user?.email}
          </Typography>
          <Chip
            label={user?.role?.toUpperCase()}
            size="small"
            color={getRoleColor(user?.role)}
            sx={{ fontWeight: 700, fontSize: '0.6875rem' }}
          />
        </Box>
        <Button
          fullWidth
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            mt: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            color: '#ef4444',
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 2 }, minHeight: { xs: 64, sm: 70 } }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, color: '#667eea' }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => navigate('/dashboard')}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }}
              >
                <SettingsIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                GearGuard
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, ml: 4, flex: 1 }}>
                {filteredNavItems.map((item) => (
                  <Button
                    key={item.path}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      color: isActive(item.path) ? '#667eea' : '#64748b',
                      bgcolor: isActive(item.path) ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      borderRadius: 2,
                      position: 'relative',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                        color: '#667eea',
                      },
                      '&::after': isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      } : {},
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {/* User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              {!isMobile && (
                <Box sx={{ textAlign: 'right', mr: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
                    {user?.full_name || user?.email?.split('@')[0]}
                  </Typography>
                  <Chip
                    label={user?.role?.toUpperCase()}
                    size="small"
                    color={getRoleColor(user?.role)}
                    sx={{
                      height: 20,
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      mt: 0.5,
                    }}
                  />
                </Box>
              )}
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  p: 0.5,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s',
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                  }}
                >
                  {(user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>

            {/* User Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  borderRadius: 2,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {user?.full_name || user?.email?.split('@')[0]}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {user?.email}
                </Typography>
              </Box>
              <MenuItem
                onClick={() => {
                  navigate('/dashboard');
                  handleMenuClose();
                }}
                sx={{ py: 1.5, gap: 1.5 }}
              >
                <Person sx={{ fontSize: 20, color: '#64748b' }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>Profile</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{ py: 1.5, gap: 1.5, color: '#ef4444' }}
              >
                <Logout sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            borderRadius: '0 16px 16px 0',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
