import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { useAuth } from '../context/AuthContext';
import { createRequest } from '../services/requestService';
import { getEquipment } from '../services/equipmentService';
import { getTeams } from '../services/teamService';
import { REQUEST_TYPES, PRIORITIES } from '../utils/constants';

const CreateRequestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    request_type: 'Corrective',
    priority: 'medium',
    equipment_id: '',
    maintenance_team_id: '',
    scheduled_date: '',
  });

  useEffect(() => {
    fetchEquipment();
    fetchTeams();
    
    // Check if scheduled_date is in URL params (from calendar click)
    const scheduledDate = searchParams.get('scheduled_date');
    if (scheduledDate) {
      // Use the date directly (already formatted for datetime-local)
      setFormData(prev => ({
        ...prev,
        scheduled_date: decodeURIComponent(scheduledDate),
        request_type: 'Preventive' // Default to Preventive for scheduled maintenance
      }));
    }
  }, [searchParams]);

  const fetchTeams = async () => {
    try {
      const response = await getTeams();
      setTeamsList(response.data.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await getEquipment();
      setEquipmentList(response.data.data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleEquipmentChange = (equipmentId) => {
    const equipment = equipmentList.find((e) => e.equipment_id == equipmentId);
    if (equipment) {
      setFormData({
        ...formData,
        equipment_id: equipmentId,
        maintenance_team_id: equipment.maintenance_team_id || '',
      });
    } else {
      setFormData({
        ...formData,
        equipment_id: equipmentId,
      });
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
    setLoading(true);

    try {
      // Add current user ID from auth context
      const requestData = {
        ...formData,
        created_by: user?.user_id || 1,
        equipment_id: parseInt(formData.equipment_id),
        maintenance_team_id: parseInt(formData.maintenance_team_id),
        scheduled_date: formData.scheduled_date || null,
      };

      await createRequest(requestData);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/requests');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create Maintenance Request
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Request created successfully! Redirecting...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject *"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Leaking Oil, Printer Not Working"
                  helperText="What is wrong?"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Provide detailed description of the issue..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Request Type *</InputLabel>
                  <Select
                    name="request_type"
                    value={formData.request_type}
                    onChange={handleChange}
                    label="Request Type *"
                  >
                    <MenuItem value="Corrective">Corrective (Breakdown)</MenuItem>
                    <MenuItem value="Preventive">Preventive (Routine Checkup)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Equipment *</InputLabel>
                  <Select
                    name="equipment_id"
                    value={formData.equipment_id}
                    onChange={(e) => handleEquipmentChange(e.target.value)}
                    label="Equipment *"
                  >
                    {equipmentList.map((equipment) => (
                      <MenuItem key={equipment.equipment_id} value={equipment.equipment_id}>
                        {equipment.equipment_name} {equipment.serial_number ? `(${equipment.serial_number})` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Selecting equipment will auto-fill the maintenance team
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Maintenance Team *</InputLabel>
                  <Select
                    name="maintenance_team_id"
                    value={formData.maintenance_team_id}
                    onChange={handleChange}
                    label="Maintenance Team *"
                    disabled={!!formData.equipment_id}
                  >
                    {teamsList.map((team) => (
                      <MenuItem key={team.team_id} value={team.team_id}>
                        {team.team_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {formData.equipment_id ? 'Auto-filled from equipment (cannot change)' : 'Select team manually'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Scheduled Date (Optional)"
                  name="scheduled_date"
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={formData.scheduled_date ? "Date selected from calendar - Click date on calendar to schedule" : "When should the work happen? (Click date on calendar to pre-fill)"}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/requests')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Creating...' : 'Create Request'}
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

export default CreateRequestPage;

