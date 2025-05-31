import axios from "axios";

const servicePorts = {
  user: "http://localhost:3001/api",
  report: "http://localhost:3002/api",
  status: "http://localhost:3003/api",
  action: "http://localhost:3004/api",
};

const createApiInstance = (serviceName) => {
  const instance = axios.create({
    baseURL: servicePorts[serviceName],
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
    },
    timeout: 10000, // Tambahkan timeout 10 detik
  });

  // Interceptor untuk menambahkan token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`Mengirim request ke: ${config.baseURL}${config.url}`); // Logging
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
      console.log("Response dari:", response.config.url, response.data); // Logging
      return response;
    },
    (error) => {
      console.error("Error pada response:", error.config?.url, error.response?.status);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = (serviceName = 'status') => {
  if (!servicePorts[serviceName]) {
    throw new Error(`Service ${serviceName} tidak dikonfigurasi`);
  }
  return createApiInstance(serviceName);
};