import { api } from "./apiService";

const reportService = {
  createReport: async (reportData) => {
    try {
      const response = await api("report").post("/reports/reports", reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllReports: async (params = {}) => {
    try {
      const response = await api("report").get("/reports/reports", { params });
      return response.data.data.reports;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getReportById: async (id) => {
    try {
      const testInstance = api("report");
      console.log("Manual test:", typeof testInstance.get); // harus function

      console.log("API instance:", api("report"));
      const response = await api("report").get(`/reports/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateReport: async (id, reportData) => {
    try {
      const response = await api("report").put(
        `/reports/reports/${id}`,
        reportData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  assignOfficer: async (reportId, officerId) => {
    try {
      const response = await api("report").post(
        `/reports/reports/${reportId}/assign`,
        { officerId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  cancelReport: async (reportId) => {
    try {
      const response = await api("report").post(
        `/reports/reports/${reportId}/cancel`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  completeReport: async (reportId) => {
    try {
      const response = await api("report").post(
        `/reports/reports/${reportId}/complete`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default reportService;
