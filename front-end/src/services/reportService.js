import {api} from './apiService';

const reportService = {
  createReport: async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllReports: async (params = {}) => {
    try {
      const response = await api.get('/reports', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getReportById: async (id) => {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateReport: async (id, reportData) => {
    try {
      const response = await api.put(`/reports/${id}`, reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  assignOfficer: async (reportId, officerId) => {
    try {
      const response = await api.post(`/reports/${reportId}/assign`, { officerId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  cancelReport: async (reportId) => {
    try {
      const response = await api.post(`/reports/${reportId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  completeReport: async (reportId) => {
    try {
      const response = await api.post(`/reports/${reportId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default reportService;