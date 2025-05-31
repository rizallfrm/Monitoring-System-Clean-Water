import {api} from './apiService';

const actionService = {
  createAction: async (actionData) => {
    try {
      const response = await api("action").post('/actions/actions', actionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getActionsByReportId: async (reportId) => {
    try {
      const response = await api("action").get(`/reports/${reportId}/actions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllActions: async (params = {}) => {
    try {
      const response = await api("action").get('/actions/actions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getActionById: async (id) => {
    try {
      const response = await api("action").get(`/actions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateAction: async (id, actionData) => {
    try {
      const response = await api("action").put(`/actions/${id}`, actionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteAction: async (id) => {
    try {
      const response = await api("action").delete(`/actions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default actionService;