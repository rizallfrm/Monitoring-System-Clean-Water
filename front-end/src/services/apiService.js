import axios from "axios";

const servicePorts = {
  user: "http://localhost:3001/api",
  report: "http://localhost:3002/api",
  status: "http://localhost:3003/api",
  action: "http://localhost:3004/api",
};

export const api = (serviceName) => {
  const instance = axios.create({
    baseURL: servicePorts[serviceName],
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });
  instance.defaults.headers = instance.defaults.headers || {};
  instance.defaults.headers.common = instance.defaults.headers.common || {};
  // Interceptor request: tambahkan token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor response: tangani 401
  instance.interceptors.response.use(
    (response) => {
      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
        config: response.config,
      };
    },
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
