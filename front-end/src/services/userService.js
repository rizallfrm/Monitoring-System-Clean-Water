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
      const response = await api("user").get("/users/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async () => {
    try {
      const response = await api("user").put("/users/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api("user").get(`/users/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api("user").put(
        `/users/users/${userId}`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api("user").delete(`/users/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOfficers: async () => {
    try {
      const response = await api("user").get("/users/officers");
      return response.data.data.officers || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
