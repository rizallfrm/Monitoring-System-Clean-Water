import { api } from "./apiService";

const authService = {
  login: async (email, password) => {
    try {
      const response = await api("user").post("/users/login", {
        email,
        password,
      });

      if (!response || !response.data) {
        throw new Error("Invalid server response");
      }

      if (!response.data.data) {
        throw new Error("Missing data in response");
      }
      const data = response.data.data;

      return {
        data: response.data.data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      console.error("Login error details:", {
        request: { email, password },
        response: error.response?.data,
        status: error.response?.status,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api("user").post("/users/register", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role || "Warga", // Default role
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

 getProfile: async () => {
  try {
    const response = await api("user").get("/users/profile");

    if (response.status === 304) {
      // Bisa fetch ulang data dari cache, atau lempar error agar tidak lanjut
      throw new Error("Profile not modified, no data returned");
    }

    if (!response?.data?.data) {
      throw new Error("Data profile kosong");
    }

    return response.data.data;
  } catch (error) {
    console.error("Get profile failed:", error);
    throw error.response?.data || error.message;
  }
},


  updateProfile: async (userData) => {
    try {
      const response = await api("user").put("/users/profile", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authService;
