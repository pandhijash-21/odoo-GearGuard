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
} from '@mui/material';
import { Add, Group } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { getTeams } from '../services/teamService';
import api from '../services/api';

const TeamsPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState({});

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

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Maintenance Teams
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/teams/create')}>
          Create Team
        </Button>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : teams.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No teams found. Create your first maintenance team.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {teams.map((team) => (
            <Grid item xs={12} md={6} key={team.team_id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {team.team_name}
                      </Typography>
                      {team.description && (
                        <Typography variant="body2" color="text.secondary">
                          {team.description}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      icon={<Group />}
                      label={`${teamMembers[team.team_id]?.length || 0} members`}
                      size="small"
                    />
                  </Box>

                  {teamMembers[team.team_id] && teamMembers[team.team_id].length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Team Members:
                      </Typography>
                      <List dense>
                        {teamMembers[team.team_id].map((member) => (
                          <ListItem key={member.user_id}>
                            <ListItemAvatar>
                              <Avatar>{member.full_name?.charAt(0) || member.email?.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={member.full_name || member.email}
                              secondary={member.email}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/teams/${team.team_id}/manage`)}
                    >
                      Manage Members
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
};

export default TeamsPage;
