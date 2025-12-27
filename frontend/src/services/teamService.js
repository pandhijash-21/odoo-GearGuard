import api from './api';

export const getTeams = () => api.get('/api/teams/');
export const getTeamById = (id) => api.get(`/api/teams/read.php?id=${id}`);
export const createTeam = (data) => api.post('/api/teams/', data);
export const getTeamMembers = (teamId) => api.get(`/api/teams/members.php?team_id=${teamId}`);
export const getStages = () => api.get('/api/stages/');

