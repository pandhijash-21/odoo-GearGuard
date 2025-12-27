import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  Build,
  Group,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { getRequests } from '../services/requestService';
import { getEquipment } from '../services/equipmentService';
import { getTeams } from '../services/teamService';
import RequestDetailModal from '../components/Requests/RequestDetailModal';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card 
    elevation={2} 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color === 'primary' ? '#2563eb' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4'}15 0%, ${color === 'primary' ? '#3b82f6' : color === 'warning' ? '#fbbf24' : color === 'error' ? '#f87171' : '#22d3ee'}08 100%)`,
      border: `1px solid ${color === 'primary' ? '#2563eb' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4'}20`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            color="text.secondary" 
            gutterBottom 
            variant="body2"
            sx={{ 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem',
              mb: 1.5,
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: color === 'primary' ? '#2563eb' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4',
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: color === 'primary' ? '#2563eb' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4',
            borderRadius: 3,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 14px 0 ${color === 'primary' ? '#2563eb' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4'}40`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isManager, isTechnician } = useAuth();
  const [stats, setStats] = useState({
    totalEquipment: 0,
    activeRequests: 0,
    teams: 0,
    overdueRequests: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, equipmentRes, teamsRes] = await Promise.all([
        getRequests(),
        isAdmin() ? getEquipment() : Promise.resolve({ data: { data: [] } }),
        isAdmin() || isManager() ? getTeams() : Promise.resolve({ data: { data: [] } }),
      ]);

      const requests = requestsRes.data.data || [];
      const equipment = equipmentRes.data.data || [];
      const teams = teamsRes.data.data || [];

      const activeRequests = requests.filter(
        (r) => r.stage_name === 'New' || r.stage_name === 'In Progress'
      );
      const overdueRequests = requests.filter((r) => r.is_overdue);

      setStats({
        totalEquipment: equipment.length,
        activeRequests: activeRequests.length,
        teams: teams.length,
        overdueRequests: overdueRequests.length,
      });

      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LinearProgress />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Welcome back, {user?.full_name || user?.email}! 👋
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem' }}
        >
          Here's what's happening with your maintenance operations
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {isAdmin() && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Equipment"
              value={stats.totalEquipment}
              icon={<Build />}
              color="primary"
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={isAdmin() ? 3 : 4}>
          <StatCard
            title="Active Requests"
            value={stats.activeRequests}
            icon={<Assignment />}
            color="warning"
          />
        </Grid>
        {(isAdmin() || isManager()) && (
          <Grid item xs={12} sm={6} md={isAdmin() ? 3 : 4}>
            <StatCard
              title="Teams"
              value={stats.teams}
              icon={<Group />}
              color="info"
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={isAdmin() ? 3 : 4}>
          <StatCard
            title="Overdue"
            value={stats.overdueRequests}
            icon={<Warning />}
            color="error"
            subtitle="Requires attention"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card 
            elevation={2}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Assignment sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                  Recent Requests
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {recentRequests.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No requests found
                    </Typography>
                  </Box>
                ) : (
                  recentRequests.map((request, index) => (
                    <Box key={request.request_id}>
                      <ListItem 
                        onClick={() => {
                          setSelectedRequest(request);
                          setDetailModalOpen(true);
                        }}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 2,
                          mb: 1,
                          py: 2,
                          px: 2,
                          transition: 'all 0.2s ease',
                          border: '1px solid transparent',
                          '&:hover': { 
                            bgcolor: 'primary.light',
                            bgcolor: 'action.hover',
                            border: '1px solid',
                            borderColor: 'primary.light',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: request.is_overdue 
                                ? 'error.main' 
                                : request.request_type === 'Preventive'
                                ? 'info.main'
                                : 'primary.main',
                              width: 48,
                              height: 48,
                              boxShadow: request.is_overdue 
                                ? '0 4px 14px 0 rgba(239, 68, 68, 0.4)'
                                : '0 4px 14px 0 rgba(37, 99, 235, 0.3)',
                            }}
                          >
                            <Assignment />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 600,
                                mb: 0.5,
                              }}
                            >
                              {request.subject}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                {request.equipment_name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                •
                              </Typography>
                              <Chip
                                label={request.stage_name}
                                size="small"
                                sx={{
                                  height: 22,
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  bgcolor: request.stage_name === 'New' 
                                    ? 'info.light' 
                                    : request.stage_name === 'In Progress'
                                    ? 'warning.light'
                                    : 'success.light',
                                  color: request.stage_name === 'New'
                                    ? 'info.dark'
                                    : request.stage_name === 'In Progress'
                                    ? 'warning.dark'
                                    : 'success.dark',
                                }}
                              />
                            </Box>
                          }
                        />
                        <Chip
                          label={request.request_type}
                          size="small"
                          sx={{
                            height: 28,
                            fontWeight: 600,
                            bgcolor: request.request_type === 'Preventive' 
                              ? 'info.main' 
                              : 'grey.200',
                            color: request.request_type === 'Preventive'
                              ? 'white'
                              : 'text.primary',
                          }}
                        />
                      </ListItem>
                      {index < recentRequests.length - 1 && (
                        <Box sx={{ height: 1, bgcolor: 'divider', mx: 2 }} />
                      )}
                    </Box>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={2}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                  Quick Actions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  onClick={() => navigate('/requests/create')}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  ➕ Create Request
                </Button>
                {(isAdmin() || isManager() || isTechnician()) && (
                  <Button 
                    variant="outlined" 
                    fullWidth
                    size="large"
                    onClick={() => navigate('/calendar')}
                    sx={{
                      py: 1.5,
                      borderWidth: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'primary.light',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    📅 View Calendar
                  </Button>
                )}
                {isAdmin() && (
                  <>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      size="large"
                      onClick={() => navigate('/equipment')}
                      sx={{
                        py: 1.5,
                        borderWidth: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      🔧 Manage Equipment
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      size="large"
                      onClick={() => navigate('/teams')}
                      sx={{
                        py: 1.5,
                        borderWidth: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      👥 Manage Teams
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <RequestDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onUpdate={fetchData}
      />
    </Layout>
  );
};

export default Dashboard;
