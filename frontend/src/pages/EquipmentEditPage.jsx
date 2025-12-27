import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import Layout from '../components/Layout/Layout';
import { getEquipmentById, updateEquipment } from '../services/equipmentService';
import { getTeams } from '../services/teamService';
import api from '../services/api';

const EquipmentEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    equipment_name: '',
    serial_number: '',
    category: '',
    purchase_date: '',
    warranty_expiry_date: '',
    warranty_info: '',
    location: '',
    department_id: '',
    assigned_employee_id: '',
    maintenance_team_id: '',
    default_technician_id: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, teamsRes, departmentsRes] = await Promise.all([
        getEquipmentById(id),
        getTeams(),
        api.get('/api/departments/'),
      ]);

      const equipment = equipmentRes.data.data;
      setTeams(teamsRes.data.data || []);
      setDepartments(departmentsRes.data.data || []);

      // Fetch users for dropdown
      try {
        const usersRes = await api.get('/api/users/');
        setUsers(usersRes.data.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }

      // Set form data
      setFormData({
        equipment_name: equipment.equipment_name || '',
        serial_number: equipment.serial_number || '',
        category: equipment.category || '',
        purchase_date: equipment.purchase_date || '',
        warranty_expiry_date: equipment.warranty_expiry_date || '',
        warranty_info: equipment.warranty_info || '',
        location: equipment.location || '',
        department_id: equipment.department_id || '',
        assigned_employee_id: equipment.assigned_employee_id || '',
        maintenance_team_id: equipment.maintenance_team_id || '',
        default_technician_id: equipment.default_technician_id || '',
      });
    } catch (error) {
      setError('Failed to load equipment data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const updateData = {
        ...formData,
        equipment_id: parseInt(id),
        department_id: formData.department_id ? parseInt(formData.department_id) : null,
        assigned_employee_id: formData.assigned_employee_id ? parseInt(formData.assigned_employee_id) : null,
        maintenance_team_id: formData.maintenance_team_id ? parseInt(formData.maintenance_team_id) : null,
        default_technician_id: formData.default_technician_id ? parseInt(formData.default_technician_id) : null,
      };

      await updateEquipment(id, updateData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/equipment/${id}`);
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update equipment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Edit Equipment
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Equipment updated successfully! Redirecting...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Equipment Name *"
                  name="equipment_name"
                  value={formData.equipment_name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Serial Number *"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Purchase Date"
                  name="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Warranty Expiry Date"
                  name="warranty_expiry_date"
                  type="date"
                  value={formData.warranty_expiry_date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Warranty Information"
                  name="warranty_info"
                  value={formData.warranty_info}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    label="Department"
                  >
                    <MenuItem value="">None</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.department_id} value={dept.department_id}>
                        {dept.department_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Assigned Employee</InputLabel>
                  <Select
                    name="assigned_employee_id"
                    value={formData.assigned_employee_id}
                    onChange={handleChange}
                    label="Assigned Employee"
                  >
                    <MenuItem value="">None</MenuItem>
                    {users
                      .filter((user) => user.role === 'employee')
                      .map((user) => (
                        <MenuItem key={user.user_id} value={user.user_id}>
                          {user.full_name || user.email}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Maintenance Team</InputLabel>
                  <Select
                    name="maintenance_team_id"
                    value={formData.maintenance_team_id}
                    onChange={handleChange}
                    label="Maintenance Team"
                  >
                    <MenuItem value="">None</MenuItem>
                    {teams.map((team) => (
                      <MenuItem key={team.team_id} value={team.team_id}>
                        {team.team_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Default Technician</InputLabel>
                  <Select
                    name="default_technician_id"
                    value={formData.default_technician_id}
                    onChange={handleChange}
                    label="Default Technician"
                  >
                    <MenuItem value="">None</MenuItem>
                    {users
                      .filter((user) => user.role === 'technician')
                      .map((user) => (
                        <MenuItem key={user.user_id} value={user.user_id}>
                          {user.full_name || user.email}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/equipment/${id}`)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : null}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
};

export default EquipmentEditPage;

