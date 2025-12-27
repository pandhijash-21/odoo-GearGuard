import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, LinearProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import KanbanBoard from '../components/Requests/KanbanBoard';
import RequestDetailModal from '../components/Requests/RequestDetailModal';
import { getRequests } from '../services/requestService';

const RequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

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

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Maintenance Requests
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          size="large"
          onClick={() => navigate('/requests/create')}
          sx={{
            py: 1.5,
            px: 3,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          New Request
        </Button>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <KanbanBoard 
            requests={requests} 
            onUpdate={fetchRequests}
            onRequestClick={handleRequestClick}
          />
          <RequestDetailModal
            open={detailModalOpen}
            onClose={handleCloseDetail}
            request={selectedRequest}
            onUpdate={() => {
              handleCloseDetail();
              fetchRequests();
            }}
          />
        </>
      )}
    </Layout>
  );
};

export default RequestsPage;

