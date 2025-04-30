import api from './apiService';

const actionService = {
  createAction: async (actionData) => {
    try {
      const response = await api.post('/actions', actionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getActionsByReportId: async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}/actions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllActions: async (params = {}) => {
    try {
      const response = await api.get('/actions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getActionById: async (id) => {
    try {
      const response = await api.get(`/actions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateAction: async (id, actionData) => {
    try {
      const response = await api.put(`/actions/${id}`, actionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteAction: async (id) => {
    try {
      const response = await api.delete(`/actions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default actionService;