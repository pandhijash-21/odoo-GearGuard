import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Email } from '@mui/icons-material';
import api from '../../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.full_name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/signup.php', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Show success message and redirect to login
        alert('Account created successfully! Please login.');
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            width: '100%',
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create Account
          </Typography>
          <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
            Join GearGuard Maintenance System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              variant="filled"
              sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                style: { color: 'white' },
              }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              variant="filled"
              sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                style: { color: 'white' },
              }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              variant="filled"
              sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff sx={{ color: 'rgba(255,255,255,0.7)' }} /> : <Visibility sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: 'white' },
              }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              variant="filled"
              sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff sx={{ color: 'rgba(255,255,255,0.7)' }} /> : <Visibility sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: 'white' },
              }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                  boxShadow: '0 5px 10px 3px rgba(33, 203, 243, .3)',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: 'white',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;

