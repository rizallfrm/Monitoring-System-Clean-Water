import { api } from "./apiService";

const actionService = {
  createAction: async (actionData) => {
    try {
      const response = await api("action").post("/actions/actions", actionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getActionsByReportId: async (reportId) => {
    try {
      const response = await api("action").get(
        `/actions/reports/${reportId}/actions`
      );

      // Debugging response structure
      if (response.data && response.data.status === "success") {
        return response.data;
      }
      throw new Error("Format respons tidak valid");
    } catch (error) {
      console.error("API error:", error);
      throw error.response?.data || error.message;
    }
  },
  getAllActions: async (params = {}) => {
    try {
      const response = await api("action").get("/actions/actions", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getActionById: async (id) => {
    try {
      const response = await api("action").get(`/actions/actions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateAction: async (id, actionData) => {
    try {
      const response = await api("action").put(
        `/actions/actions/${id}`,
        actionData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteAction: async (actionId) => {
    try {
      const response = await api("action").delete(
        `/actions/actions/${actionId}`
      );
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },
};

export default actionService;
