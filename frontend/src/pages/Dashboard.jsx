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
  Divider,
} from '@mui/material';
import {
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
    elevation={0}
    sx={{
      height: '100%',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `2px solid ${color === 'primary' ? '#667eea' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4'}20`,
      borderRadius: 3,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${color === 'primary' ? '#667eea' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4'}08 0%, transparent 100%)`,
        pointerEvents: 'none',
      },
      '&:hover': {
        transform: 'translateY(-6px) scale(1.01)',
        boxShadow: `0 16px 32px -10px ${color === 'primary' ? '#667eea' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4'}35`,
        borderColor: color === 'primary' ? '#667eea' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4',
      },
    }}
  >
    <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
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
              fontSize: '0.6875rem',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 800,
              color: color === 'primary' ? '#667eea' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4',
              mb: 0.5,
              fontSize: '2.25rem',
              lineHeight: 1,
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
            background: `linear-gradient(135deg, ${color === 'primary' ? '#667eea' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4'} 0%, ${color === 'primary' ? '#764ba2' : color === 'warning' ? '#fbbf24' : color === 'error' ? '#f87171' : '#22d3ee'} 100%)`,
            borderRadius: 2.5,
            p: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 6px 20px 0 ${color === 'primary' ? '#667eea' : color === 'warning' ? '#f59e0b' : color === 'error' ? '#ef4444' : '#06b6d4'}35`,
            transition: 'all 0.3s ease',
            '& svg': {
              color: 'white',
              fontSize: '1.75rem',
            },
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
      {/* Welcome Section - Compact */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1e293b',
                mb: 0.5,
                fontSize: { xs: '1.5rem', md: '1.875rem' },
                lineHeight: 1.2,
              }}
            >
              Welcome back, {user?.full_name || user?.email?.split('@')[0]}! 👋
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.875rem',
              }}
            >
              Here's an overview of your maintenance operations
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: 2,
              bgcolor: 'rgba(16, 185, 129, 0.08)',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#10b981',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981', fontSize: '0.8125rem' }}>
              System Active
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Grid - Tighter Spacing */}
      <Grid
        container
        spacing={3}
        sx={{
          mb: 4,
          '& > .MuiGrid-item': {
            animation: 'fadeInUp 0.5s ease-out',
            animationFillMode: 'both',
          },
          '& > .MuiGrid-item:nth-of-type(1)': { animationDelay: '0s' },
          '& > .MuiGrid-item:nth-of-type(2)': { animationDelay: '0.08s' },
          '& > .MuiGrid-item:nth-of-type(3)': { animationDelay: '0.16s' },
          '& > .MuiGrid-item:nth-of-type(4)': { animationDelay: '0.24s' },
          '@keyframes fadeInUp': {
            from: {
              opacity: 0,
              transform: 'translateY(15px)',
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
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

      {/* Main Content Grid - Better Proportions */}
      <Grid
        container
        spacing={3}
        sx={{
          '& > .MuiGrid-item': {
            animation: 'fadeInUp 0.5s ease-out',
            animationFillMode: 'both',
          },
          '& > .MuiGrid-item:nth-of-type(1)': { animationDelay: '0.1s' },
          '& > .MuiGrid-item:nth-of-type(2)': { animationDelay: '0.18s' },
        }}
      >
        {/* Recent Requests - 60% Width */}
        <Grid item xs={12} lg={8}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 28px -8px rgba(102, 126, 234, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    p: 1,
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <Assignment sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
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
                          mb: 0.5,
                          py: 1.5,
                          px: 1.5,
                          transition: 'all 0.2s ease',
                          border: '1px solid transparent',
                          '&:hover': {
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
                              width: 40,
                              height: 40,
                              boxShadow: request.is_overdue
                                ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                                : '0 4px 12px rgba(37, 99, 235, 0.25)',
                            }}
                          >
                            <Assignment sx={{ fontSize: 20 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                mb: 0.25,
                                fontSize: '0.9375rem',
                              }}
                            >
                              {request.subject}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: '0.8125rem' }}
                              >
                                {request.equipment_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">•</Typography>
                              <Chip
                                label={request.stage_name}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.6875rem',
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
                            height: 24,
                            fontSize: '0.75rem',
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
                        <Divider sx={{ my: 0.5 }} />
                      )}
                    </Box>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions - 40% Width */}
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 28px -8px rgba(102, 126, 234, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                    borderRadius: 2,
                    p: 1,
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
                  Quick Actions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/requests/create')}
                  sx={{
                    py: 1.25,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Create Request
                </Button>
                {(isAdmin() || isManager() || isTechnician()) && (
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={() => navigate('/calendar')}
                    sx={{
                      py: 1.25,
                      borderWidth: 2,
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'action.hover',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    View Calendar
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
                        py: 1.25,
                        borderWidth: 2,
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: 'action.hover',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Manage Equipment
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => navigate('/teams')}
                      sx={{
                        py: 1.25,
                        borderWidth: 2,
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: 'action.hover',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Manage Teams
                    </Button>
                  </>
                )}
                {(isAdmin() || isManager()) && (
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={() => navigate('/reports')}
                    sx={{
                      py: 1.25,
                      borderWidth: 2,
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'action.hover',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    View Reports
                  </Button>
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
