import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/apiService";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Set token ke header axios
        // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Ambil data user
          const userData = await authService.getProfile();
          setUser(userData);

          // Redirect berdasarkan roleA
          // if (userData.role === "admin") {
          //   router("/admin");
          // } else if (userData.role === "officer") {
          //   router("/officer");
          // } else {
          //   router("/user");
          // }
        } catch (err) {
          console.error("Failed to load user", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const login = async (credentials) => {
    try {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email dan password harus diisi");
      }

      const response = await authService.login(
        credentials.email.trim(),
        credentials.password.trim()
      );
      console.log("RESPONSE DATA LENGKAP >>>", response.data);

      const data = response?.data;

      if (!data || !data.token || !data.user) {
        throw new Error("Token atau user tidak ditemukan dalam response");
      }

      const { token, user } = data;

      if (!token || !user) {
        throw new Error("Token atau data user tidak valid");
      }

      localStorage.setItem("token", token);

      if (api.defaults?.headers) {
        api.defaults.headers.common = {
          ...api.defaults.headers.common,
          Authorization: `Bearer ${token}`,
        };
      }

      setUser(user);

      // Redirect based on role
      const role = user.role?.toLowerCase();
      router(
        role === "warga"
          ? "/user"
          : role === "admin"
          ? "/admin"
          : role === "petugas"
          ? "/officer"
          : "/login"
      );

      return user;
    } catch (err) {
      console.error("Login error details:", {
        error: err,
        response: err.response?.data,
      });
      throw new Error(err.message || "Login failed");
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router("/login");
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await userService.updateUser(user._id, userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
