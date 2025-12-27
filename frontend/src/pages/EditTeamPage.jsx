import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Alert,
    LinearProgress,
} from '@mui/material';
import { Save, Cancel, Group } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import api from '../services/api';

const EditTeamPage = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        team_name: '',
        description: '',
    });

    useEffect(() => {
        fetchTeam();
    }, [teamId]);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/teams/');
            const teams = response.data.data || [];
            const team = teams.find(t => t.team_id === parseInt(teamId));

            if (team) {
                setFormData({
                    team_name: team.team_name || '',
                    description: team.description || '',
                });
            } else {
                setError('Team not found');
            }
        } catch (err) {
            console.error('Error fetching team:', err);
            setError('Failed to load team data');
        } finally {
            setLoading(false);
        }
    };

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

        if (!formData.team_name.trim()) {
            setError('Team name is required');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await api.post('/api/teams/update.php', {
                team_id: parseInt(teamId),
                ...formData,
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/teams');
            }, 1500);
        } catch (err) {
            console.error('Error updating team:', err);
            setError(err.response?.data?.error || 'Failed to update team. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/teams');
    };

    if (loading) {
        return (
            <Layout>
                <LinearProgress />
            </Layout>
        );
    }

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
                    Edit Team
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Update team information
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
                    Team updated successfully! Redirecting...
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
                    maxWidth: 800,
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Team Name */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Team Name"
                                    name="team_name"
                                    value={formData.team_name}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="e.g., Electricians, HVAC Team, IT Support"
                                    helperText="Enter a descriptive name for the team"
                                />
                            </Grid>

                            {/* Description */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="Describe the team's responsibilities and focus areas..."
                                    helperText="Optional: Provide details about the team's purpose and responsibilities"
                                />
                            </Grid>

                            {/* Action Buttons */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Cancel />}
                                        onClick={handleCancel}
                                        disabled={saving}
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
                                        startIcon={saving ? null : <Save />}
                                        disabled={saving}
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
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>

                        {saving && (
                            <Box sx={{ mt: 2 }}>
                                <LinearProgress />
                            </Box>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Info Box */}
            <Card
                elevation={0}
                sx={{
                    mt: 3,
                    maxWidth: 800,
                    background: 'rgba(102, 126, 234, 0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: 2,
                }}
            >
                <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Group sx={{ color: '#667eea', fontSize: 24 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                                Note
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Updating team information will not affect team members. To manage team members, use the "Manage Members" button on the teams page.
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default EditTeamPage;
