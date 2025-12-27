import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    LinearProgress,
    Chip,
    Divider,
} from '@mui/material';
import {
    ArrowBack,
    PersonAdd,
    Delete,
    Group,
    Person,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import api from '../services/api';

const ManageTeamMembersPage = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchData();
    }, [teamId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all teams and find the specific team
            const teamsResponse = await api.get('/api/teams/');
            const allTeams = teamsResponse.data.data || [];
            const foundTeam = allTeams.find(t => t.team_id === parseInt(teamId));

            if (!foundTeam) {
                setError('Team not found');
                setTeam(null);
                setLoading(false);
                return;
            }

            setTeam(foundTeam);

            // Fetch team members
            const membersResponse = await api.get(`/api/teams/members.php?team_id=${teamId}`);
            setMembers(membersResponse.data.data || []);

            // Fetch all users for adding
            const usersResponse = await api.get('/api/users/');
            setAllUsers(usersResponse.data.data || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load team data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedUserId) {
            setError('Please select a user to add');
            return;
        }

        try {
            setError(null);
            await api.post('/api/teams/add-member.php', {
                team_id: teamId,
                user_id: selectedUserId,
            });

            setSuccess('Member added successfully!');
            setAddDialogOpen(false);
            setSelectedUserId('');
            fetchData();

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error adding member:', err);
            setError(err.response?.data?.error || 'Failed to add member. Please try again.');
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this member from the team?')) {
            return;
        }

        try {
            setError(null);
            await api.post('/api/teams/remove-member.php', {
                team_id: teamId,
                user_id: userId,
            });

            setSuccess('Member removed successfully!');
            fetchData();

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error removing member:', err);
            setError(err.response?.data?.error || 'Failed to remove member. Please try again.');
        }
    };

    const availableUsers = allUsers.filter(
        user => !members.some(member => member.user_id === user.user_id)
    );

    if (loading) {
        return (
            <Layout>
                <LinearProgress />
            </Layout>
        );
    }

    if (!team) {
        return (
            <Layout>
                <Alert severity="error">Team not found</Alert>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/teams')}
                    sx={{ mt: 2 }}
                >
                    Back to Teams
                </Button>
            </Layout>
        );
    }

    return (
        <Layout maxWidth="lg">
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/teams')}
                    sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#64748b',
                        '&:hover': {
                            bgcolor: 'rgba(100, 116, 139, 0.08)',
                        },
                    }}
                >
                    Back to Teams
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        <Group sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: '#1e293b',
                                fontSize: { xs: '1.5rem', md: '1.875rem' },
                            }}
                        >
                            {team.team_name}
                        </Typography>
                        {team.description && (
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {team.description}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Chip
                    icon={<Person />}
                    label={`${members.length} ${members.length === 1 ? 'Member' : 'Members'}`}
                    sx={{
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        fontWeight: 700,
                    }}
                />
            </Box>

            {/* Alerts */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {/* Members Card */}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Team Members
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<PersonAdd />}
                            onClick={() => setAddDialogOpen(true)}
                            disabled={availableUsers.length === 0}
                            sx={{
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                },
                            }}
                        >
                            Add Member
                        </Button>
                    </Box>

                    {members.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Person sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                                No members yet
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                Add members to this team to get started
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {members.map((member, index) => (
                                <Box key={member.user_id}>
                                    <ListItem
                                        sx={{
                                            px: 2,
                                            py: 2,
                                            borderRadius: 2,
                                            '&:hover': {
                                                bgcolor: 'rgba(102, 126, 234, 0.05)',
                                            },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    fontSize: '1.125rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {(member.full_name?.charAt(0) || member.email?.charAt(0) || 'U').toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                    {member.full_name || member.email?.split('@')[0]}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                        {member.email}
                                                    </Typography>
                                                    {member.role && (
                                                        <Chip
                                                            label={member.role.toUpperCase()}
                                                            size="small"
                                                            sx={{
                                                                mt: 0.5,
                                                                height: 20,
                                                                fontSize: '0.6875rem',
                                                                fontWeight: 700,
                                                                bgcolor: member.role === 'admin' ? 'error.light' : member.role === 'manager' ? 'warning.light' : 'info.light',
                                                                color: member.role === 'admin' ? 'error.dark' : member.role === 'manager' ? 'warning.dark' : 'info.dark',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveMember(member.user_id)}
                                            sx={{
                                                color: 'error.main',
                                                '&:hover': {
                                                    bgcolor: 'rgba(239, 68, 68, 0.08)',
                                                },
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItem>
                                    {index < members.length - 1 && <Divider sx={{ my: 0.5 }} />}
                                </Box>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* Add Member Dialog */}
            <Dialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
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
                <DialogTitle sx={{ fontWeight: 700 }}>Add Team Member</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        select
                        label="Select User"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        {availableUsers.length === 0 ? (
                            <MenuItem value="">
                                <em>No users available</em>
                            </MenuItem>
                        ) : (
                            availableUsers.map((user) => (
                                <MenuItem key={user.user_id} value={user.user_id}>
                                    {user.full_name || user.email} ({user.email})
                                </MenuItem>
                            ))
                        )}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 2 }}>
                    <Button onClick={() => setAddDialogOpen(false)} sx={{ fontWeight: 600 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddMember}
                        disabled={!selectedUserId}
                        sx={{
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            },
                        }}
                    >
                        Add Member
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default ManageTeamMembersPage;
