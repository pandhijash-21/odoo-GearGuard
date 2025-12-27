import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import { Add, Visibility, Edit } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { getEquipment } from '../services/equipmentService';

const EquipmentPage = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await getEquipment();
      setEquipment(response.data.data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Equipment Management
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/equipment/create')}>
          Add Equipment
        </Button>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : equipment.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No equipment found. Add your first equipment to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {equipment.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.equipment_id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {item.equipment_name}
                      </Typography>
                      {item.serial_number && (
                        <Typography variant="body2" color="text.secondary">
                          SN: {item.serial_number}
                        </Typography>
                      )}
                      {item.category && (
                        <Chip label={item.category} size="small" sx={{ mt: 1 }} />
                      )}
                    </Box>
                    {item.is_scrapped && (
                      <Chip label="Scrapped" color="error" size="small" />
                    )}
                  </Box>

                  {item.location && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {item.location}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/equipment/${item.equipment_id}`)}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
};

export default EquipmentPage;
