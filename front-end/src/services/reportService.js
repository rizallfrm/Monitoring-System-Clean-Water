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
      // Gunakan instance api dengan benar
      const apiInstance = api("report");
      console.log("Api instance methods:", {
        get: typeof apiInstance.get,
        post: typeof apiInstance.post
      });

      const response = await apiInstance.get(`/reports/reports/${id}`);
      console.log("Full API response:", response);
      
      // Pastikan struktur data sesuai
      if (response.data && response.data.status === 'success') {
        return response.data.data; // Ambil data dari response
      }
      throw new Error("Invalid response structure");
    } catch (error) {
      console.error("Error in getReportById:", error);
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
