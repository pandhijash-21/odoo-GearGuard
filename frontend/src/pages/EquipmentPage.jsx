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
  TextField,
  InputAdornment,
  Fade,
  Skeleton,
} from '@mui/material';
import {
  Add,
  Visibility,
  Edit,
  Search,
  Build,
  LocationOn,
  Category,
  QrCode,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { getEquipment } from '../services/equipmentService';

const EquipmentPage = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredEquipment = equipment.filter(item =>
    item.equipment_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serial_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <Card elevation={0} sx={{ border: '1px solid rgba(102, 126, 234, 0.1)' }}>
            <CardContent>
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Layout>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1e293b',
                mb: 0.5,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              Equipment Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Manage and track all your equipment inventory
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/equipment/create')}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Add Equipment
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search equipment by name, serial number, category, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#64748b' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              '&:hover fieldset': {
                borderColor: '#667eea',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#667eea',
                borderWidth: 2,
              },
            },
          }}
        />
      </Box>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredEquipment.length === 0 ? (
        <Fade in timeout={600}>
          <Card
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              textAlign: 'center',
              py: 8,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Build sx={{ fontSize: 40, color: '#667eea' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              {searchQuery ? 'No equipment found' : 'No equipment yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Add your first equipment to get started with inventory management'
              }
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/equipment/create')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Add Equipment
              </Button>
            )}
          </Card>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {filteredEquipment.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item.equipment_id}
              sx={{
                animation: 'fadeInUp 0.6s ease-out',
                animationFillMode: 'both',
                animationDelay: `${index * 0.05}s`,
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(102, 126, 234, 0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px -12px rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#1e293b',
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.equipment_name}
                      </Typography>
                      {item.serial_number && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <QrCode sx={{ fontSize: 16, color: '#64748b' }} />
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                            {item.serial_number}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    {item.is_scrapped && (
                      <Chip
                        label="Scrapped"
                        color="error"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Box>

                  {/* Category */}
                  {item.category && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                      <Category sx={{ fontSize: 16, color: '#667eea' }} />
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                          color: '#667eea',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                  )}

                  {/* Location */}
                  {item.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.location}
                      </Typography>
                    </Box>
                  )}

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/equipment/${item.equipment_id}`)}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                      }}
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

      {/* Results Count */}
      {!loading && filteredEquipment.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Showing {filteredEquipment.length} of {equipment.length} equipment
          </Typography>
        </Box>
      )}
    </Layout>
  );
};

export default EquipmentPage;
