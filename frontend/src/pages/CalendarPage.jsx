import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Layout from '../components/Layout/Layout';
import { getRequests } from '../services/requestService';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      const response = await getRequests({ stage: null }); // Get all requests
      const requests = response.data.data || [];

      // Filter only Preventive requests with scheduled_date
      const calendarEvents = requests
        .filter((req) => req.request_type === 'Preventive' && req.scheduled_date)
        .map((req) => ({
          id: req.request_id.toString(),
          title: `${req.equipment_name || 'Equipment'}: ${req.subject}`,
          start: req.scheduled_date,
          backgroundColor: req.is_overdue ? '#d32f2f' : '#1976d2',
          borderColor: req.is_overdue ? '#d32f2f' : '#1976d2',
          extendedProps: {
            request: req,
          },
        }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (arg) => {
    // Open create request form with date pre-filled
    const dateStr = arg.dateStr;
    window.location.href = `/requests/create?scheduled_date=${dateStr}`;
  };

  const handleEventClick = (arg) => {
    // Open request details
    const requestId = arg.event.id;
    window.location.href = `/requests/${requestId}`;
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Calendar View
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => window.location.href = '/requests/create'}>
          New Request
        </Button>
      </Box>

      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 1 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
        />
      </Box>
    </Layout>
  );
};

export default CalendarPage;
