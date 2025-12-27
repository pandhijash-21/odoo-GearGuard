import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, LinearProgress, Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import KanbanBoard from '../components/Requests/KanbanBoard';
import { getRequests } from '../services/requestService';

const RequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Maintenance Requests
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          size="large"
          onClick={() => navigate('/requests/create')}
        >
          New Request
        </Button>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <KanbanBoard requests={requests} onUpdate={fetchRequests} />
      )}
    </Layout>
  );
};

export default RequestsPage;

