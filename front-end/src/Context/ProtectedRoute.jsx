"use client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../Context/authContext";

const roleMappings = {
  'warga': 'user',
  'petugas': 'officer',
  'admin': 'admin'
};

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const normalizedUserRole = user?.role?.toLowerCase();
    const mappedRole = roleMappings[normalizedUserRole] || normalizedUserRole;
    
    if (roles.length > 0 && !roles.includes(mappedRole)) {
      // Redirect based on mapped role
      switch(mappedRole) {
        case 'admin':
          navigate("/admin");
          break;
        case 'user':
          navigate("/user");
          break;
        case 'officer':
          navigate("/officer");
          break;
        default:
          navigate("/login");
      }
    }
  }, [loading, isAuthenticated, user, roles, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const normalizedUserRole = user?.role?.toLowerCase();
  const mappedRole = roleMappings[normalizedUserRole] || normalizedUserRole;
  
  if (roles.length > 0 && !roles.includes(mappedRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Unauthorized Access
          </h1>
          <p className="mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;