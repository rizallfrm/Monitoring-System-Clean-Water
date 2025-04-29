import api from './apiService';

export const statusService = {
  createStatusUpdate: async (statusData) => {
    try {
      const response = await api.post('/status-updates', statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStatusHistoryByReportId: async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}/status-history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllStatusUpdates: async (params = {}) => {
    try {
      const response = await api.get('/status-updates', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStatusStatistics: async () => {
    try {
      const response = await api.get('/status-statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};