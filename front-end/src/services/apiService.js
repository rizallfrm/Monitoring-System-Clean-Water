import axios from "axios";
const VITE_API_BASE_URL = "https://hydroflow-backend-production.up.railway.app";

const servicePorts = {
  user: `${VITE_API_BASE_URL}/api/`,
  report: `${VITE_API_BASE_URL}/api/`,
  status: `${VITE_API_BASE_URL}/api/`,
  action: `${VITE_API_BASE_URL}/api/`,
};


const createApiInstance = (serviceName) => {
  const instance = axios.create({
    baseURL: servicePorts[serviceName],
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    timeout: 10000,
  });

  // Interceptor untuk menambahkan token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (
        !config.headers["Content-Type"] &&
        !(config.data instanceof FormData)
      ) {
        config.headers["Content-Type"] = "application/json";
      }
      return config;
    },
    (error) => {
      console.error("Error pada request:", error);
      return Promise.reject(error);
    }
  );

  // Interceptor untuk handling response
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error(
        "Error pada response:",
        error.config?.url,
        error.response?.status
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = (serviceName = "status") => {
  if (!servicePorts[serviceName]) {
    throw new Error(`Service ${serviceName} tidak dikonfigurasi`);
  }
  return createApiInstance(serviceName);
};
