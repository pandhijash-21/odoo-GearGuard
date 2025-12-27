import React from 'react';
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
import { Logout, Person, Dashboard, Settings } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAdmin, isManager, isTechnician } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
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
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4, fontWeight: 'bold' }}>
          GearGuard
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button color="inherit" onClick={() => navigate('/dashboard')} startIcon={<Dashboard />}>
            Dashboard
          </Button>
          {(isAdmin() || isManager() || isTechnician()) && (
            <>
              <Button color="inherit" onClick={() => navigate('/requests')}>
                Requests
              </Button>
              <Button color="inherit" onClick={() => navigate('/calendar')}>
                Calendar
              </Button>
            </>
          )}
          <Button 
            color="inherit" 
            variant="outlined"
            onClick={() => navigate('/requests/create')}
            sx={{ ml: 'auto', mr: 1 }}
          >
            New Request
          </Button>
          {isAdmin() && (
            <>
              <Button color="inherit" onClick={() => navigate('/equipment')}>
                Equipment
              </Button>
              <Button color="inherit" onClick={() => navigate('/teams')}>
                Teams
              </Button>
            </>
          )}
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={user.role.toUpperCase()}
              color={getRoleColor(user.role)}
              size="small"
            />
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                <Person sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
