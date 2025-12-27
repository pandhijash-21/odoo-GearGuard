import api from './api';

export const getEquipment = () => api.get('/api/equipment/');
export const getEquipmentById = (id) => api.get(`/api/equipment/read.php?id=${id}`);
export const createEquipment = (data) => api.post('/api/equipment/', data);
export const updateEquipment = (id, data) => api.put(`/api/equipment/update.php?id=${id}`, data);
export const deleteEquipment = (id) => api.delete(`/api/equipment/delete.php?id=${id}`);

