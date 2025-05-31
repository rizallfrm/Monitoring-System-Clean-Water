import { api } from "./apiService";

const statusService = {
  createStatusUpdate: async (statusData) => {
    try {
      const response = await api("status").post("/status-updates", statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
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
      console.log("Mengambil statistik status...");
      const response = await api("status").get("/status/status-statistics");

      console.log("Response statistik:", response.data);

      // Pastikan struktur data sesuai dengan backend
      const backendData = response.data.data || response.data;

      return {
        pending: parseInt(backendData.pending) || 0,
        onGoing: parseInt(backendData.onGoing) || 0, // Sesuaikan dengan backend
        completed: parseInt(backendData.completed) || 0,
        cancelled: parseInt(backendData.cancelled) || 0, // Sesuaikan dengan backend
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
