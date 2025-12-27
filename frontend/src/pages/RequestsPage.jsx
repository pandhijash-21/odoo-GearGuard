import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  LinearProgress,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  MenuItem,
  Grid,
  Fade,
} from '@mui/material';
import {
  Add,
  Search,
  ViewKanban,
  ViewList,
  FilterList,
  Assignment,
  Build,
  Warning,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import KanbanBoard from '../components/Requests/KanbanBoard';
import RequestDetailModal from '../components/Requests/RequestDetailModal';
import { getRequests } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

const RequestsPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [filterType, setFilterType] = useState('all'); // 'all', 'preventive', 'corrective'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'new', 'in_progress', 'completed'
  const [filterPriority, setFilterPriority] = useState('all'); // 'all', 'low', 'medium', 'high'

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getRequests();
      setRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedRequest(null);
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    // Search filter
    const matchesSearch =
      request.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.equipment_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesType =
      filterType === 'all' ||
      request.request_type?.toLowerCase() === filterType;

    // Status filter
    const matchesStatus =
      filterStatus === 'all' ||
      request.stage_name?.toLowerCase().replace(' ', '_') === filterStatus;

    // Priority filter
    const matchesPriority =
      filterPriority === 'all' ||
      request.priority?.toLowerCase() === filterPriority;

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // Calculate stats
  const stats = {
    total: filteredRequests.length,
    new: filteredRequests.filter(r => r.stage_name === 'New').length,
    inProgress: filteredRequests.filter(r => r.stage_name === 'In Progress').length,
    completed: filteredRequests.filter(r => r.stage_name === 'Completed').length,
    overdue: filteredRequests.filter(r => r.is_overdue).length,
  };

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
          mb: 3,
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
              Maintenance Requests
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Manage and track all maintenance requests
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/requests/create')}
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
            New Request
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={6} md={2.4}>
            <Card
              elevation={0}
              sx={{
                background: 'rgba(102, 126, 234, 0.08)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Assignment sx={{ fontSize: 20, color: '#667eea' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                    Total
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#667eea' }}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={2.4}>
            <Card
              elevation={0}
              sx={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Schedule sx={{ fontSize: 20, color: '#06b6d4' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                    New
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#06b6d4' }}>
                  {stats.new}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={2.4}>
            <Card
              elevation={0}
              sx={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Build sx={{ fontSize: 20, color: '#f59e0b' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                    In Progress
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                  {stats.inProgress}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={2.4}>
            <Card
              elevation={0}
              sx={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                    Completed
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                  {stats.completed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={2.4}>
            <Card
              elevation={0}
              sx={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Warning sx={{ fontSize: 20, color: '#ef4444' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                    Overdue
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444' }}>
                  {stats.overdue}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
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
          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#64748b', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Type Filter */}
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="preventive">Preventive</MenuItem>
                  <MenuItem value="corrective">Corrective</MenuItem>
                </TextField>
              </Grid>

              {/* Status Filter */}
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              </Grid>

              {/* Priority Filter */}
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Priority"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>
              </Grid>

              {/* View Mode Toggle */}
              <Grid item xs={6} md={2}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value="kanban">
                    <ViewKanban sx={{ fontSize: 18, mr: 0.5 }} />
                    Kanban
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewList sx={{ fontSize: 18, mr: 0.5 }} />
                    List
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>

            {/* Active Filters */}
            {(filterType !== 'all' || filterStatus !== 'all' || filterPriority !== 'all' || searchQuery) && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, mr: 1, alignSelf: 'center' }}>
                  Active Filters:
                </Typography>
                {searchQuery && (
                  <Chip
                    label={`Search: "${searchQuery}"`}
                    size="small"
                    onDelete={() => setSearchQuery('')}
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {filterType !== 'all' && (
                  <Chip
                    label={`Type: ${filterType}`}
                    size="small"
                    onDelete={() => setFilterType('all')}
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {filterStatus !== 'all' && (
                  <Chip
                    label={`Status: ${filterStatus.replace('_', ' ')}`}
                    size="small"
                    onDelete={() => setFilterStatus('all')}
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {filterPriority !== 'all' && (
                  <Chip
                    label={`Priority: ${filterPriority}`}
                    size="small"
                    onDelete={() => setFilterPriority('all')}
                    sx={{ fontWeight: 600 }}
                  />
                )}
                <Button
                  size="small"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterStatus('all');
                    setFilterPriority('all');
                  }}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    px: 1.5,
                  }}
                >
                  Clear All
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Content */}
      {loading ? (
        <Card elevation={0} sx={{ p: 3, border: '1px solid rgba(102, 126, 234, 0.1)' }}>
          <LinearProgress />
        </Card>
      ) : (
        <Fade in timeout={600}>
          <Box>
            {viewMode === 'kanban' ? (
              <KanbanBoard
                requests={filteredRequests}
                onUpdate={fetchRequests}
                onRequestClick={handleRequestClick}
              />
            ) : (
              <Card
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  List View
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  List view coming soon! Use Kanban view for now.
                </Typography>
              </Card>
            )}

            <RequestDetailModal
              open={detailModalOpen}
              onClose={handleCloseDetail}
              request={selectedRequest}
              onUpdate={() => {
                handleCloseDetail();
                fetchRequests();
              }}
            />
          </Box>
        </Fade>
      )}
    </Layout>
  );
};

export default RequestsPage;
