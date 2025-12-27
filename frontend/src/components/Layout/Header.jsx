import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin, isManager, isTechnician } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'warning';
      case 'technician': return 'info';
      default: return 'default';
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1.5 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mr: 4,
            cursor: 'pointer',
            letterSpacing: '-0.02em',
          }}
          onClick={() => navigate('/dashboard')}
        >
          ⚙️ GearGuard
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/dashboard')} 
            startIcon={<Dashboard />}
            sx={{
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
              },
            }}
          >
            Dashboard
          </Button>
          {(isAdmin() || isManager() || isTechnician()) && (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/requests')}
                sx={{
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  },
                }}
              >
                Requests
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/calendar')}
                sx={{
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  },
                }}
              >
                Calendar
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/reports')}
                sx={{
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  },
                }}
              >
                📊 Reports
              </Button>
            </>
          )}
          <Button 
            color="inherit" 
            variant="outlined"
            onClick={() => navigate('/requests/create')}
            sx={{ 
              ml: 'auto',
              mr: 2,
              fontWeight: 600,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            ➕ New Request
          </Button>
          {isAdmin() && (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/equipment')}
                sx={{
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  },
                }}
              >
                Equipment
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/teams')}
                sx={{
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  },
                }}
              >
                Teams
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/calendar')}
                sx={{
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  },
                }}
              >
                Calendar
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
              {user?.full_name || user?.email}
            </Typography>
            <Chip
              label={user?.role?.toUpperCase() || 'USER'}
              size="small"
              color={getRoleColor(user?.role)}
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 700,
                mt: 0.5,
              }}
            />
          </Box>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <AccountCircle sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Settings sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <Logout sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
