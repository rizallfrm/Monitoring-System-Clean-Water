import { api } from "./apiService";

const userService = {
  getAllUsers: async () => {
    try {
      const response = await api("user").get("/users/users");
      return response?.data?.data?.users || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProfile: async () => {
    try {
      console.log("Get profile");
      const response = await api("user").get("/users/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async () => {
    try {
      const response = await api("user").put("/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api("user").get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api("user").put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api("user").delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOfficers: async () => {
    try {
      const response = await api("user").get("/users/officers");
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
