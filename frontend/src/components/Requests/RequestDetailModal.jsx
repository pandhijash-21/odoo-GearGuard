import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Assignment,
  Build,
  Person,
  Schedule,
  AccessTime,
  Description,
  LocationOn,
} from '@mui/icons-material';
import { STAGE_COLORS, REQUEST_TYPES } from '../../utils/constants';

const RequestDetailModal = ({ open, onClose, request, onUpdate }) => {
  if (!request) return null;

  const priorityColors = {
    urgent: 'error',
    high: 'warning',
    medium: 'info',
    low: 'default',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assignment color="primary" />
          <Typography variant="h5" component="div">
            {request.subject}
          </Typography>
          {request.is_overdue && (
            <Chip label="OVERDUE" color="error" size="small" />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Status and Priority */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={request.stage_name}
                sx={{
                  bgcolor: `${STAGE_COLORS[request.stage_name]}20`,
                  color: STAGE_COLORS[request.stage_name],
                  fontWeight: 600,
                }}
              />
              <Chip
                label={request.request_type}
                color={request.request_type === 'Preventive' ? 'info' : 'default'}
                variant="outlined"
              />
              <Chip
                label={request.priority?.toUpperCase()}
                color={priorityColors[request.priority] || 'default'}
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Description */}
          {request.description && (
            <>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Description color="action" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1">{request.description}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </>
          )}

          {/* Equipment Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Build color="primary" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Equipment
                </Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                {request.equipment_name || 'Not specified'}
              </Typography>
              {request.serial_number && (
                <Typography variant="body2" color="text.secondary">
                  Serial: {request.serial_number}
                </Typography>
              )}
              {request.equipment_location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {request.equipment_location}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Team Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Assignment color="primary" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Maintenance Team
                </Typography>
              </Box>
              <Typography variant="body1">
                {request.team_name || 'Not assigned'}
              </Typography>
            </Paper>
          </Grid>

          {/* Assigned To */}
          {request.assigned_to_name && (
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Person color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Assigned To
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {request.assigned_to_name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{request.assigned_to_name}</Typography>
                    {request.assigned_to_email && (
                      <Typography variant="caption" color="text.secondary">
                        {request.assigned_to_email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Created By */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Person color="action" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Created By
                </Typography>
              </Box>
              <Typography variant="body1">{request.created_by_name || 'Unknown'}</Typography>
              {request.created_by_email && (
                <Typography variant="caption" color="text.secondary">
                  {request.created_by_email}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Timeline */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Timeline
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(request.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {request.scheduled_date && (
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule fontSize="small" color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Scheduled
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(request.scheduled_date)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {request.date_start && (
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" color="info" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Started
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(request.date_start)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {request.date_end && (
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" color="success" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Completed
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(request.date_end)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {request.duration_hours && (
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {request.duration_hours} hours
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {onUpdate && (
          <Button variant="contained" onClick={onUpdate}>
            Update Status
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RequestDetailModal;

