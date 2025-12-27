import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header />
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
