import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Build,
  LocationOn,
  CalendarToday,
  Group,
  Person,
  Description,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { getEquipmentById } from '../services/equipmentService';
import { getRequests } from '../services/requestService';
import RequestDetailModal from '../components/Requests/RequestDetailModal';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchEquipment();
    fetchRequests();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await getEquipmentById(id);
      setEquipment(response.data.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await getRequests({ equipment_id: id });
      setRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <LinearProgress />
      </Layout>
    );
  }

  if (!equipment) {
    return (
      <Layout>
        <Typography>Equipment not found</Typography>
      </Layout>
    );
  }

  const openRequests = requests.filter(
    (req) => req.stage_name === 'New' || req.stage_name === 'In Progress'
  );

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/equipment')}
            sx={{ mb: 2 }}
          >
            Back to Equipment
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {equipment.equipment_name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/equipment/${id}/edit`)}
            >
              Edit
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Equipment Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Equipment Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Build color="primary" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Serial Number
                    </Typography>
                  </Box>
                  <Typography variant="body1">{equipment.serial_number || 'Not specified'}</Typography>
                </Grid>

                {equipment.category && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Build color="action" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                    </Box>
                    <Chip label={equipment.category} />
                  </Grid>
                )}

                {equipment.location && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn color="action" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Location
                      </Typography>
                    </Box>
                    <Typography variant="body1">{equipment.location}</Typography>
                  </Grid>
                )}

                {equipment.purchase_date && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarToday color="action" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Purchase Date
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {new Date(equipment.purchase_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}

                {equipment.warranty_expiry_date && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarToday color="action" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Warranty Expiry
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {new Date(equipment.warranty_expiry_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}

                {equipment.warranty_info && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                      <Description color="action" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Warranty Information
                      </Typography>
                    </Box>
                    <Typography variant="body1">{equipment.warranty_info}</Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {equipment.maintenance_team_id && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Group color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Maintenance Team
                      </Typography>
                    </Box>
                    <Typography variant="body1">{equipment.team_name || 'Not assigned'}</Typography>
                  </Grid>
                )}

                {equipment.assigned_employee_id && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Person color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Assigned Employee
                      </Typography>
                    </Box>
                    <Typography variant="body1">{equipment.employee_name || 'Not assigned'}</Typography>
                  </Grid>
                )}

                {equipment.is_scrapped && (
                  <Grid item xs={12}>
                    <Chip
                      label="SCRAPPED"
                      color="error"
                      sx={{ fontWeight: 600 }}
                    />
                    {equipment.scrap_date && (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                        Scrapped on: {new Date(equipment.scrap_date).toLocaleDateString()}
                      </Typography>
                    )}
                    {equipment.scrap_reason && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Reason: {equipment.scrap_reason}
                      </Typography>
                    )}
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Smart Button - Maintenance Requests */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Maintenance Requests
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={`${openRequests.length} Open Requests`}
                  color={openRequests.length > 0 ? 'warning' : 'success'}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Total: {requests.length} requests
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {requests.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No maintenance requests for this equipment
                </Typography>
              ) : (
                <List>
                  {requests.slice(0, 5).map((request) => (
                    <Card
                      key={request.request_id}
                      sx={{
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 2 },
                      }}
                      onClick={() => handleRequestClick(request)}
                    >
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {request.subject}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                          <Chip label={request.stage_name} size="small" />
                          <Chip
                            label={request.request_type}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}

              {requests.length > 5 && (
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/requests?equipment_id=${id}`)}
                >
                  View All Requests
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>

        <RequestDetailModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          request={selectedRequest}
        />
      </Container>
    </Layout>
  );
};

export default EquipmentDetailPage;

