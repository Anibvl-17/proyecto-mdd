import api from './root.service.js';

// Obtener información del perfil del usuario logueado
export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil del usuario:', error);
    throw error;
  }
};

// Actualizar información del perfil
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar perfil del usuario:', error);
    throw error;
  }
};

// (Opcional) Eliminar perfil del usuario
export const deleteProfile = async () => {
  try {
    const response = await api.delete('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error al eliminar perfil del usuario:', error);
    throw error;
  }
};
