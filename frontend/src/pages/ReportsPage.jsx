import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Layout from '../components/Layout/Layout';
import api from '../services/api';

const COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState({
    by_team: [],
    by_category: [],
    overall: null,
    by_priority: [],
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/reports/');
      console.log('Reports API Response:', response);
      
      // Handle different response structures
      let reportsData = {};
      if (response.data) {
        if (response.data.data) {
          reportsData = response.data.data;
        } else if (response.data.success && response.data.data) {
          reportsData = response.data.data;
        } else {
          reportsData = response.data;
        }
      }
      
      // Ensure all required keys exist
      setReports({
        by_team: reportsData.by_team || [],
        by_category: reportsData.by_category || [],
        overall: reportsData.overall || null,
        by_priority: reportsData.by_priority || [],
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.error || 'Failed to load reports. Please check if the backend server is running.');
      // Set empty state on error
      setReports({
        by_team: [],
        by_category: [],
        overall: null,
        by_priority: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            📊 Reports & Analytics
          </Typography>
        </Box>
        <LinearProgress />
      </Layout>
    );
  }

  // Prepare data for charts
  const teamChartData = reports.by_team?.map((item) => ({
    name: item.team_name || 'Unassigned',
    total: parseInt(item.total_requests || 0),
    new: parseInt(item.new_requests || 0),
    inProgress: parseInt(item.in_progress_requests || 0),
    repaired: parseInt(item.repaired_requests || 0),
    overdue: parseInt(item.overdue_requests || 0),
  })) || [];

  const categoryChartData = reports.by_category?.map((item) => ({
    name: item.category || 'Uncategorized',
    total: parseInt(item.total_requests || 0),
    new: parseInt(item.new_requests || 0),
    inProgress: parseInt(item.in_progress_requests || 0),
    repaired: parseInt(item.repaired_requests || 0),
    overdue: parseInt(item.overdue_requests || 0),
  })) || [];

  const priorityChartData = reports.by_priority?.map((item) => ({
    name: item.priority?.toUpperCase() || 'MEDIUM',
    value: parseInt(item.count || 0),
  })) || [];

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          📊 Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze maintenance requests by team, category, and priority
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Overall Statistics */}
      {reports.overall && reports.overall !== null && Object.keys(reports.overall).length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #2563eb15 0%, #3b82f608 100%)',
                border: '1px solid #2563eb20',
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Requests
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#2563eb' }}>
                  {reports.overall.total_requests || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #10b98115 0%, #34d39908 100%)',
                border: '1px solid #10b98120',
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Repaired
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {reports.overall.repaired_count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #f59e0b15 0%, #fbbf2408 100%)',
                border: '1px solid #f59e0b20',
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  In Progress
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {reports.overall.in_progress_count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #ef444415 0%, #f8717108 100%)',
                border: '1px solid #ef444420',
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Overdue
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {reports.overall.overdue_count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            },
          }}
        >
          <Tab label="By Team" />
          <Tab label="By Category" />
          <Tab label="By Priority" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  Requests per Team
                </Typography>
                {teamChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={teamChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                        }}
                      />
                      <Legend />
                      <Bar dataKey="new" stackId="a" fill="#06b6d4" name="New" />
                      <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
                      <Bar dataKey="repaired" stackId="a" fill="#10b981" name="Repaired" />
                      <Bar dataKey="overdue" fill="#ef4444" name="Overdue" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      No team data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  Team Summary
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamChartData.length > 0 ? (
                        teamChartData.map((row, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={row.total}
                                size="small"
                                sx={{
                                  bgcolor: '#2563eb',
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No data available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  Requests per Equipment Category
                </Typography>
                {categoryChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                        }}
                      />
                      <Legend />
                      <Bar dataKey="new" stackId="a" fill="#06b6d4" name="New" />
                      <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
                      <Bar dataKey="repaired" stackId="a" fill="#10b981" name="Repaired" />
                      <Bar dataKey="overdue" fill="#ef4444" name="Overdue" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      No category data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  Category Summary
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoryChartData.length > 0 ? (
                        categoryChartData.map((row, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={row.total}
                                size="small"
                                sx={{
                                  bgcolor: '#8b5cf6',
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No data available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  Requests by Priority
                </Typography>
                {priorityChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={priorityChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {priorityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      No priority data available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  Priority Distribution
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Count
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Percentage
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {priorityChartData.length > 0 ? (
                        priorityChartData.map((row, index) => {
                          const total = priorityChartData.reduce((sum, item) => sum + item.value, 0);
                          const percentage = total > 0 ? ((row.value / total) * 100).toFixed(1) : 0;
                          return (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Chip
                                  label={row.name}
                                  size="small"
                                  sx={{
                                    bgcolor: COLORS[index % COLORS.length],
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">{row.value}</TableCell>
                              <TableCell align="right">{percentage}%</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No data available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default ReportsPage;
