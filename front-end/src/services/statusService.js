import { api } from "./apiService";

const statusService = {
  createStatusUpdate: async (statusData) => {
    try {
      const response = await api("status").post("/status/status-updates", {
        reportId: statusData.reportId,
        status: statusData.status,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui status";
      throw new Error(errorMessage);
    }
  },
  getStatusHistoryByReportId: async (reportId) => {
    try {
      const response = await api("status").get(
        `/status-updates/report/${reportId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAllStatusUpdates: async (params = {}) => {
    try {
      const response = await api("status").get("/status-updates", { params });
      return response.data;
    } catch (error) {
      console.error("Error in getAllStatusUpdates:", error);
      throw error.response?.data || error.message;
    }
  },

  getStatusStatistics: async () => {
    try {
      const response = await api("status").get("/status/status-statistics");


      // Pastikan struktur data sesuai dengan backend
      const backendData = response.data.data || response.data;

      return {
        pending: parseInt(backendData.pending) || 0,
        onGoing: parseInt(backendData.onGoing) || 0, 
        completed: parseInt(backendData.completed) || 0,
        cancelled: parseInt(backendData.cancelled) || 0, 
      };
    } catch (error) {
      console.error("Gagal mengambil statistik status:", {
        error: error.message,
        response: error.response?.data,
      });

      return {
        pending: 0,
        onGoing: 0,
        completed: 0,
        cancelled: 0,
      };
    }
  },
};

export default statusService;
