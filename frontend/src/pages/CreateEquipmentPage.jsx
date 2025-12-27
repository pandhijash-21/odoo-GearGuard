import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    MenuItem,
    Alert,
    LinearProgress,
} from '@mui/material';
import { Save, Cancel, Build } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { createEquipment } from '../services/equipmentService';

const CreateEquipmentPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        equipment_name: '',
        serial_number: '',
        category: '',
        location: '',
        purchase_date: '',
        warranty_expiry: '',
        notes: '',
    });

    const categories = [
        'HVAC',
        'Electrical',
        'Plumbing',
        'Machinery',
        'IT Equipment',
        'Vehicles',
        'Tools',
        'Safety Equipment',
        'Other',
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.equipment_name.trim()) {
            setError('Equipment name is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await createEquipment(formData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/equipment');
            }, 1500);
        } catch (err) {
            console.error('Error creating equipment:', err);
            setError(err.response?.data?.error || 'Failed to create equipment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/equipment');
    };

    return (
        <Layout>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        color: '#1e293b',
                        mb: 0.5,
                        fontSize: { xs: '1.5rem', md: '1.875rem' },
                    }}
                >
                    Add New Equipment
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Register new equipment in the inventory
                </Typography>
            </Box>

            {/* Alerts */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Equipment created successfully! Redirecting...
                </Alert>
            )}

            {/* Form Card */}
            <Card
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: 3,
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Equipment Name */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Equipment Name"
                                    name="equipment_name"
                                    value={formData.equipment_name}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="e.g., HVAC Unit - Building A"
                                />
                            </Grid>

                            {/* Serial Number */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Serial Number"
                                    name="serial_number"
                                    value={formData.serial_number}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="e.g., SN-12345"
                                />
                            </Grid>

                            {/* Category */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <MenuItem value="">
                                        <em>Select Category</em>
                                    </MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Location */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="e.g., Building A, Floor 2"
                                />
                            </Grid>

                            {/* Purchase Date */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Purchase Date"
                                    name="purchase_date"
                                    value={formData.purchase_date}
                                    onChange={handleChange}
                                    disabled={loading}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Warranty Expiry */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Warranty Expiry"
                                    name="warranty_expiry"
                                    value={formData.warranty_expiry}
                                    onChange={handleChange}
                                    disabled={loading}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Notes */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Additional information about the equipment..."
                                />
                            </Grid>

                            {/* Action Buttons */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Cancel />}
                                        onClick={handleCancel}
                                        disabled={loading}
                                        sx={{
                                            px: 3,
                                            py: 1.2,
                                            fontWeight: 600,
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderWidth: 2,
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={loading ? null : <Save />}
                                        disabled={loading}
                                        sx={{
                                            px: 3,
                                            py: 1.2,
                                            fontWeight: 600,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {loading ? 'Creating...' : 'Create Equipment'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>

                        {loading && (
                            <Box sx={{ mt: 2 }}>
                                <LinearProgress />
                            </Box>
                        )}
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default CreateEquipmentPage;
