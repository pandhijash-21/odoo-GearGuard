import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  Fade,
  Skeleton,
  AvatarGroup,
  Divider,
} from '@mui/material';
import {
  Add,
  Group,
  Search,
  People,
  ManageAccounts,
  Person,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { getTeams } from '../services/teamService';
import api from '../services/api';

const TeamsPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await getTeams();
      const teamsData = response.data.data || [];
      setTeams(teamsData);

      // Fetch members for each team
      const membersData = {};
      for (const team of teamsData) {
        try {
          const membersResponse = await api.get(`/api/teams/members.php?team_id=${team.team_id}`);
          membersData[team.team_id] = membersResponse.data.data || [];
        } catch (error) {
          membersData[team.team_id] = [];
        }
      }
      setTeamMembers(membersData);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} md={6} key={i}>
          <Card elevation={0} sx={{ border: '1px solid rgba(102, 126, 234, 0.1)' }}>
            <CardContent>
              <Skeleton variant="text" width="70%" height={32} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2, borderRadius: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Layout>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1e293b',
                mb: 0.5,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              Maintenance Teams
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Manage your maintenance teams and members
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/teams/create')}
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
            Create Team
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search teams by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#64748b' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              '&:hover fieldset': {
                borderColor: '#667eea',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#667eea',
                borderWidth: 2,
              },
            },
          }}
        />
      </Box>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredTeams.length === 0 ? (
        <Fade in timeout={600}>
          <Card
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              textAlign: 'center',
              py: 8,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <People sx={{ fontSize: 40, color: '#667eea' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              {searchQuery ? 'No teams found' : 'No teams yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first maintenance team to organize your workforce'
              }
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/teams/create')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Create Team
              </Button>
            )}
          </Card>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {filteredTeams.map((team, index) => {
            const members = teamMembers[team.team_id] || [];
            const memberCount = members.length;

            return (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                key={team.team_id}
                sx={{
                  animation: 'fadeInUp 0.6s ease-out',
                  animationFillMode: 'both',
                  animationDelay: `${index * 0.05}s`,
                  '@keyframes fadeInUp': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px -12px rgba(102, 126, 234, 0.2)',
                      borderColor: '#667eea',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ mb: 2, minHeight: 90 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#1e293b',
                            flex: 1,
                            fontSize: '1.125rem',
                            mr: 1,
                          }}
                        >
                          {team.team_name}
                        </Typography>
                        <Chip
                          icon={<Group sx={{ fontSize: 16 }} />}
                          label={`${memberCount} ${memberCount === 1 ? 'member' : 'members'}`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '2.5em', // Strictly fix height
                          lineHeight: '1.25em',
                        }}
                      >
                        {team.description || 'No description provided for this team'}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Team Members */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 200 }}>
                      {members.length > 0 ? (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                              Team Members
                            </Typography>
                            <AvatarGroup
                              max={4}
                              sx={{
                                '& .MuiAvatar-root': {
                                  width: 28,
                                  height: 28,
                                  fontSize: '0.75rem',
                                  border: '2px solid white',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                },
                              }}
                            >
                              {members.map((member) => (
                                <Avatar key={member.user_id}>
                                  {(member.full_name?.charAt(0) || member.email?.charAt(0) || 'U').toUpperCase()}
                                </Avatar>
                              ))}
                            </AvatarGroup>
                          </Box>
                          <List dense sx={{
                            height: 160,
                            overflow: 'auto',
                            bgcolor: 'rgba(248, 250, 252, 0.5)',
                            borderRadius: 2,
                            p: 1,
                            '&::-webkit-scrollbar': {
                              width: 4,
                            },
                            '&::-webkit-scrollbar-track': {
                              background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: '#cbd5e1',
                              borderRadius: 4,
                            },
                          }}>
                            {members.map((member) => (
                              <ListItem
                                key={member.user_id}
                                sx={{
                                  px: 1,
                                  py: 0.75,
                                  mb: 0.5,
                                  borderRadius: 1.5,
                                  '&:hover': {
                                    bgcolor: 'rgba(102, 126, 234, 0.08)',
                                  },
                                }}
                              >
                                <ListItemAvatar sx={{ minWidth: 44 }}>
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      fontSize: '0.8125rem',
                                      fontWeight: 700,
                                    }}
                                  >
                                    {(member.full_name?.charAt(0) || member.email?.charAt(0) || 'U').toUpperCase()}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                                      {member.full_name || member.email?.split('@')[0]}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                                      {member.email}
                                    </Typography>
                                  }
                                  sx={{ m: 0 }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      ) : (
                        <Box sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          bgcolor: 'rgba(241, 245, 249, 0.5)',
                          borderRadius: 2,
                          border: '1px dashed #cbd5e1',
                          minHeight: 180, // Force height for empty state
                        }}>
                          <Person sx={{ fontSize: 32, color: '#94a3b8', mb: 1, opacity: 0.5 }} />
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                            No members yet
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            Add members to start
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 1 }}>
                      {/* Manage Members Button */}
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ManageAccounts />}
                        onClick={() => navigate(`/teams/${team.team_id}/manage`)}
                        sx={{
                          flex: 1,
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 0.8,
                          borderWidth: 1.5,
                          borderColor: 'rgba(102, 126, 234, 0.5)',
                          color: '#667eea',
                          '&:hover': {
                            borderWidth: 1.5,
                            borderColor: '#764ba2',
                            bgcolor: 'rgba(102, 126, 234, 0.05)',
                          },
                        }}
                      >
                        Manage
                      </Button>

                      {/* Edit Button */}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/teams/${team.team_id}/edit`)}
                        sx={{
                          minWidth: 'auto',
                          px: 2,
                          py: 0.8,
                          borderWidth: 1.5,
                          borderColor: '#10b981',
                          color: '#10b981',
                          '&:hover': {
                            borderWidth: 1.5,
                            borderColor: '#059669',
                            bgcolor: 'rgba(16, 185, 129, 0.05)',
                          },
                        }}
                      >
                        Edit
                      </Button>

                      {/* Delete Button */}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete "${team.team_name}"? This will also remove all team members.`)) {
                            try {
                              await api.post('/api/teams/delete.php', { team_id: team.team_id });
                              fetchTeams(); // Refresh the teams list
                            } catch (error) {
                              alert('Failed to delete team. Please try again.');
                            }
                          }
                        }}
                        sx={{
                          minWidth: 'auto',
                          px: 2,
                          py: 0.8,
                          borderWidth: 1.5,
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          '&:hover': {
                            borderWidth: 1.5,
                            borderColor: '#dc2626',
                            bgcolor: 'rgba(239, 68, 68, 0.05)',
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Results Count */}
      {!loading && filteredTeams.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Showing {filteredTeams.length} of {teams.length} teams
          </Typography>
        </Box>
      )}
    </Layout>
  );
};

export default TeamsPage;
