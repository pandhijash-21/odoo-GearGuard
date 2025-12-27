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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Button,
  Fade,
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
  LineChart,
  Line,
} from 'recharts';
import {
  Assessment,
  Refresh,
  TrendingUp,
  Group,
  Category,
  PriorityHigh,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import api from '../services/api';

const COLORS = ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

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

  // Prepare data for charts
  const teamChartData = reports.by_team?.map((item) => ({
    name: item.team_name || 'Unassigned',
    total: parseInt(item.total_requests || 0),
    new: parseInt(item.new_requests || 0),
    inProgress: parseInt(item.in_progress_requests || 0),
    completed: parseInt(item.repaired_requests || 0),
    overdue: parseInt(item.overdue_requests || 0),
  })) || [];

  const categoryChartData = reports.by_category?.map((item) => ({
    name: item.category || 'Uncategorized',
    total: parseInt(item.total_requests || 0),
    new: parseInt(item.new_requests || 0),
    inProgress: parseInt(item.in_progress_requests || 0),
    completed: parseInt(item.repaired_requests || 0),
    overdue: parseInt(item.overdue_requests || 0),
  })) || [];

  const priorityChartData = reports.by_priority?.map((item) => ({
    name: item.priority?.toUpperCase() || 'MEDIUM',
    value: parseInt(item.count || 0),
  })) || [];

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1e293b',
                mb: 0.5,
                fontSize: { xs: '1.5rem', md: '1.875rem' },
              }}
            >
              Reports & Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Analyze maintenance requests by team, category, and priority
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchReports}
            disabled={loading}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Card elevation={0} sx={{ p: 3, border: '1px solid rgba(102, 126, 234, 0.1)' }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#64748b' }}>
            Loading reports...
          </Typography>
        </Card>
      ) : (
        <Fade in timeout={600}>
          <Box>
            {/* Overall Statistics */}
            {reports.overall && Object.keys(reports.overall).length > 0 && (
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                      border: '2px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Assessment sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                          Total Requests
                        </Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: '#667eea' }}>
                        {reports.overall.total_requests || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)',
                      border: '2px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(16, 185, 129, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                          Completed
                        </Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: '#10b981' }}>
                        {reports.overall.repaired_count || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                      border: '2px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(245, 158, 11, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Group sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                          In Progress
                        </Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                        {reports.overall.in_progress_count || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.05) 100%)',
                      border: '2px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(239, 68, 68, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PriorityHigh sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                          Overdue
                        </Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: '#ef4444' }}>
                        {reports.overall.overdue_count || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Tabs */}
            <Card
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                  '& .MuiTab-root': {
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.9375rem',
                    minHeight: 56,
                    px: 3,
                    '&.Mui-selected': {
                      color: '#667eea',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              >
                <Tab label="By Team" />
                <Tab label="By Category" />
                <Tab label="By Priority" />
              </Tabs>
            </Card>

            {/* Tab Content - By Team */}
            {tabValue === 0 && (
              <Grid container spacing={2.5}>
                <Grid item xs={12} lg={8}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                        Requests per Team
                      </Typography>
                      {teamChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={teamChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.1)" />
                            <XAxis
                              dataKey="name"
                              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                              angle={-45}
                              textAnchor="end"
                              height={100}
                            />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid rgba(102, 126, 234, 0.2)',
                                borderRadius: 8,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              }}
                            />
                            <Legend />
                            <Bar dataKey="new" stackId="a" fill="#06b6d4" name="New" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="overdue" fill="#ef4444" name="Overdue" radius={[4, 4, 4, 4]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                          <Group sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                            No team data available
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            Create teams and assign requests to see analytics
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                        Team Summary
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid rgba(102, 126, 234, 0.1)' }}>Team</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid rgba(102, 126, 234, 0.1)' }}>
                                Total
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {teamChartData.length > 0 ? (
                              teamChartData.map((row, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    '&:hover': {
                                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                                    },
                                  }}
                                >
                                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{row.name}</TableCell>
                                  <TableCell align="right">
                                    <Chip
                                      label={row.total}
                                      size="small"
                                      sx={{
                                        bgcolor: '#667eea',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
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

            {/* Tab Content - By Category */}
            {tabValue === 1 && (
              <Grid container spacing={2.5}>
                <Grid item xs={12} lg={8}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                        Requests per Equipment Category
                      </Typography>
                      {categoryChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={categoryChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.1)" />
                            <XAxis
                              dataKey="name"
                              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                              angle={-45}
                              textAnchor="end"
                              height={100}
                            />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid rgba(102, 126, 234, 0.2)',
                                borderRadius: 8,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              }}
                            />
                            <Legend />
                            <Bar dataKey="new" stackId="a" fill="#06b6d4" name="New" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="overdue" fill="#ef4444" name="Overdue" radius={[4, 4, 4, 4]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                          <Category sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                            No category data available
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            Add equipment categories to see analytics
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                        Category Summary
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid rgba(102, 126, 234, 0.1)' }}>Category</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid rgba(102, 126, 234, 0.1)' }}>
                                Total
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categoryChartData.length > 0 ? (
                              categoryChartData.map((row, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    '&:hover': {
                                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                                    },
                                  }}
                                >
                                  <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{row.name}</TableCell>
                                  <TableCell align="right">
                                    <Chip
                                      label={row.total}
                                      size="small"
                                      sx={{
                                        bgcolor: '#764ba2',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
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

            {/* Tab Content - By Priority */}
            {tabValue === 2 && (
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                        Requests by Priority
                      </Typography>
                      {priorityChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                          <PieChart>
                            <Pie
                              data={priorityChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={120}
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
                          <PriorityHigh sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                            No priority data available
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            Create requests with priorities to see analytics
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: 2,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                        Priority Distribution
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid rgba(102, 126, 234, 0.1)' }}>Priority</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid rgba(102, 126, 234, 0.1)' }}>
                                Count
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid rgba(102, 126, 234, 0.1)' }}>
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
                                  <TableRow
                                    key={index}
                                    sx={{
                                      '&:hover': {
                                        bgcolor: 'rgba(102, 126, 234, 0.05)',
                                      },
                                    }}
                                  >
                                    <TableCell>
                                      <Chip
                                        label={row.name}
                                        size="small"
                                        sx={{
                                          bgcolor: COLORS[index % COLORS.length],
                                          color: 'white',
                                          fontWeight: 700,
                                          fontSize: '0.75rem',
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                      {row.value}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                      {percentage}%
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
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
          </Box>
        </Fade>
      )}
    </Layout>
  );
};

export default ReportsPage;
