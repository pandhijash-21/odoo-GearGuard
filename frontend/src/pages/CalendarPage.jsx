import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Close,
  CalendarMonth,
  Assignment,
  Build,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Layout from '../components/Layout/Layout';
import { getRequests } from '../services/requestService';
import { useNavigate } from 'react-router-dom';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      const response = await getRequests({ stage: null });
      const requests = response.data.data || [];

      // Include all requests with scheduled_date
      const calendarEvents = requests
        .filter((req) => req.scheduled_date)
        .map((req) => {
          // Determine color based on status and type
          let color = '#667eea'; // Default purple

          if (req.is_overdue) {
            color = '#ef4444'; // Red for overdue
          } else if (req.stage_name === 'Completed') {
            color = '#10b981'; // Green for completed
          } else if (req.stage_name === 'In Progress') {
            color = '#f59e0b'; // Orange for in progress
          } else if (req.request_type === 'Preventive') {
            color = '#06b6d4'; // Cyan for preventive
          }

          return {
            id: req.request_id.toString(),
            title: req.subject,
            start: req.scheduled_date,
            backgroundColor: color,
            borderColor: color,
            textColor: '#ffffff',
            extendedProps: {
              request: req,
              equipmentName: req.equipment_name,
              stageName: req.stage_name,
              requestType: req.request_type,
              isOverdue: req.is_overdue,
            },
          };
        });

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (arg) => {
    // Navigate to create request with date pre-filled
    const dateStr = arg.dateStr;
    navigate(`/requests/create?scheduled_date=${dateStr}`);
  };

  const handleEventClick = (arg) => {
    // Show event details modal
    const request = arg.event.extendedProps.request;
    setSelectedEvent(request);
    setEventModalOpen(true);
  };

  const handleCloseModal = () => {
    setEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleViewDetails = () => {
    if (selectedEvent) {
      navigate(`/requests/${selectedEvent.request_id}`);
    }
  };

  const getStatusColor = (stageName) => {
    switch (stageName) {
      case 'New': return 'info';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
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
              Maintenance Calendar
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Schedule and track maintenance requests
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
      </Box>

      {/* Calendar Card */}
      {loading ? (
        <Card elevation={0} sx={{ p: 3, border: '1px solid rgba(102, 126, 234, 0.1)' }}>
          <LinearProgress />
        </Card>
      ) : (
        <Card
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            borderRadius: 3,
            overflow: 'hidden',
            '& .fc': {
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            '& .fc-toolbar-title': {
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 700,
              color: '#1e293b',
            },
            '& .fc-button': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              textTransform: 'capitalize',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              },
              '&:disabled': {
                opacity: 0.5,
              },
              '&.fc-button-active': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              },
            },
            '& .fc-col-header-cell': {
              background: 'rgba(102, 126, 234, 0.05)',
              borderColor: 'rgba(102, 126, 234, 0.1)',
              padding: '12px 8px',
              '& .fc-col-header-cell-cushion': {
                color: '#667eea',
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              },
            },
            '& .fc-daygrid-day': {
              borderColor: 'rgba(102, 126, 234, 0.08)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.03)',
              },
            },
            '& .fc-daygrid-day-number': {
              color: '#1e293b',
              fontWeight: 600,
              fontSize: '0.9375rem',
              padding: '8px',
            },
            '& .fc-daygrid-day.fc-day-today': {
              background: 'rgba(102, 126, 234, 0.08)',
              '& .fc-daygrid-day-number': {
                color: '#667eea',
                fontWeight: 700,
              },
            },
            '& .fc-event': {
              borderRadius: '6px',
              padding: '4px 8px',
              margin: '2px 4px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            },
            '& .fc-daygrid-event-dot': {
              display: 'none',
            },
            '& .fc-event-title': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
            '& .fc-more-link': {
              color: '#667eea',
              fontWeight: 600,
              fontSize: '0.75rem',
              '&:hover': {
                color: '#764ba2',
                textDecoration: 'underline',
              },
            },
          }}
        >
          <Box sx={{ p: 2.5 }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              editable={false}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={3}
              weekends={true}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
              }}
              height="auto"
              eventDisplay="block"
              displayEventTime={false}
            />
          </Box>
        </Card>
      )}

      {/* Event Details Modal */}
      <Dialog
        open={eventModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: 40,
                height: 40,
              }}
            >
              <Assignment />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Request Details
            </Typography>
          </Box>
          <IconButton onClick={handleCloseModal} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        {selectedEvent && (
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Subject */}
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.6875rem' }}>
                  Subject
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mt: 0.5 }}>
                  {selectedEvent.subject}
                </Typography>
              </Box>

              {/* Equipment */}
              {selectedEvent.equipment_name && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Build sx={{ color: '#667eea', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Equipment
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {selectedEvent.equipment_name}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Scheduled Date */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth sx={{ color: '#667eea', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                    Scheduled Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {new Date(selectedEvent.scheduled_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Box>

              {/* Status & Type */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  label={selectedEvent.stage_name}
                  color={getStatusColor(selectedEvent.stage_name)}
                  size="small"
                  sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                />
                <Chip
                  label={selectedEvent.request_type}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    borderColor: '#667eea',
                    color: '#667eea',
                  }}
                />
                {selectedEvent.is_overdue && (
                  <Chip
                    icon={<Warning />}
                    label="Overdue"
                    color="error"
                    size="small"
                    sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                  />
                )}
              </Box>

              {/* Description */}
              {selectedEvent.description && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.6875rem' }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, lineHeight: 1.6 }}>
                    {selectedEvent.description}
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
        )}

        <DialogActions sx={{ p: 2.5, pt: 2, borderTop: '1px solid rgba(102, 126, 234, 0.1)' }}>
          <Button
            onClick={handleCloseModal}
            sx={{
              fontWeight: 600,
              color: '#64748b',
              '&:hover': {
                bgcolor: 'rgba(100, 116, 139, 0.08)',
              },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleViewDetails}
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            View Full Details
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default CalendarPage;
