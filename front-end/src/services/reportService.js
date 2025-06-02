import { api } from "./apiService";

const reportService = {
  createReport: async (formData, files) => {
    try {
      // 1. Handle file upload terpisah jika diperlukan
      const formPayload = new FormData();

      // Append form data
      formPayload.append("description", formData.description);
      formPayload.append("location", formData.location);

      // Append files jika ada
      if (files && files.length > 0) {
        files.forEach((file) => {
          formPayload.append("images", file);
        });
      }

      // 2. Kirim ke endpoint yang benar dengan content-type multipart
      const response = await api("report").post(
        "/reports/reports",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          status: "error",
          message: error.message || "Failed to create report",
        }
      );
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
        post: typeof apiInstance.post,
      });

      const response = await apiInstance.get(`/reports/reports/${id}`);
      console.log("Full API response:", response);

      // Pastikan struktur data sesuai
      if (response.data && response.data.status === "success") {
        return response.data.data; // Ambil data dari response
      }
      throw new Error("Invalid response structure");
    } catch (error) {
      console.error("Error in getReportById:", error);
      throw error.response?.data || error.message;
    }
  },

  getReportsByOfficer: async (officerId) => {
    try {
      if (!officerId) {
        throw new Error("Officer ID is required");
      }

      const response = await api("report").get(
        `/reports/reports/officer/${officerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error in getReportsByOfficer:", error);

      throw error;
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
