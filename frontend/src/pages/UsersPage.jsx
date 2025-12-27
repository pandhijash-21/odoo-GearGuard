import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Edit, Person, Refresh } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const UsersPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'technician', label: 'Technician' },
    { value: 'employee', label: 'Employee' },
  ];

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/users/');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setEditDialogOpen(true);
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      setError('');
      const response = await api.put(`/api/users/update.php?id=${selectedUser.user_id}`, {
        role: selectedRole,
      });

      if (response.data.success) {
        // Update local state
        setUsers(users.map((u) => (u.user_id === selectedUser.user_id ? { ...u, role: selectedRole } : u)));
        setEditDialogOpen(false);
        setSelectedUser(null);
        setSelectedRole('');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update user role. Please try again.');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'warning';
      case 'technician': return 'info';
      case 'employee': return 'default';
      default: return 'default';
    }
  };

  if (!isAdmin()) {
    return (
      <Layout>
        <Alert severity="error">Access denied. Admin privileges required.</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2563eb 30%, #6d28d9 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage users and their roles
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchUsers}
          disabled={loading}
          sx={{ py: 1.5, borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LinearProgress />
      ) : (
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No users found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.user_id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person color="action" />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {user.full_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role?.toUpperCase() || 'N/A'}
                            color={getRoleColor(user.role)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.is_active == 1 ? 'Active' : 'Inactive'}
                            color={user.is_active == 1 ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Role">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(user)}
                              sx={{ '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit User Role</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              User: <strong>{selectedUser?.full_name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Email: <strong>{selectedUser?.email}</strong>
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRoleUpdate}
            variant="contained"
            disabled={!selectedRole || selectedRole === selectedUser?.role}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
              },
            }}
          >
            Update Role
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UsersPage;

