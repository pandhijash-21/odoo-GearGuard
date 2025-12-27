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

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" color={color}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, width: 56, height: 56 }}>
          {icon}
        </Avatar>
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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome back, {user?.full_name || user?.email}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
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
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Requests
              </Typography>
              <List>
                {recentRequests.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No requests found
                  </Typography>
                ) : (
                  recentRequests.map((request) => (
                    <ListItem key={request.request_id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: request.is_overdue ? 'error.main' : 'primary.main' }}>
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={request.subject}
                        secondary={`${request.equipment_name} • ${request.stage_name}`}
                      />
                      <Chip
                        label={request.request_type}
                        size="small"
                        color={request.request_type === 'Preventive' ? 'info' : 'default'}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate('/requests/create')}
                >
                  Create Request
                </Button>
                {(isAdmin() || isManager() || isTechnician()) && (
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate('/calendar')}
                  >
                    View Calendar
                  </Button>
                )}
                {isAdmin() && (
                  <>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => navigate('/equipment')}
                    >
                      Add Equipment
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => navigate('/teams')}
                    >
                      Manage Teams
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
