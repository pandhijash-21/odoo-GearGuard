import api from './api';

export const getEquipment = () => api.get('/api/equipment/');
export const getEquipmentById = (id) => api.get(`/api/equipment/read.php?id=${id}`);
export const createEquipment = (data) => api.post('/api/equipment/', data);
export const updateEquipment = (id, data) => {
  // Remove equipment_id from data if present (it's in URL)
  const { equipment_id, ...updateData } = data;
  return api.put(`/api/equipment/update.php?id=${id}`, updateData);
};
export const deleteEquipment = (id) => api.delete(`/api/equipment/delete.php?id=${id}`);

