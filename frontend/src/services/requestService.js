import api from './api';

export const getRequests = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.stage) params.append('stage', filters.stage);
  if (filters.equipment_id) params.append('equipment_id', filters.equipment_id);
  if (filters.team_id) params.append('team_id', filters.team_id);
  
  return api.get(`/api/requests/?${params.toString()}`);
};

export const getRequestById = (id) => api.get(`/api/requests/read.php?id=${id}`);
export const createRequest = (data) => api.post('/api/requests/create.php', data);
export const updateRequestStage = (requestId, stageId) => api.put('/api/requests/update_stage.php', { request_id: requestId, stage_id: stageId });
export const assignRequest = (requestId, userId) => api.post(`/api/requests/assign.php?id=${requestId}`, { user_id: userId });
export const getCalendarEvents = () => api.get('/api/requests/calendar.php');

