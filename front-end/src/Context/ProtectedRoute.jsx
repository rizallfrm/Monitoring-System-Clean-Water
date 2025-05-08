"use client";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && isAuthenticated && roles.length > 0 && !roles.includes(user.role)) {
      // Redirect ke halaman yang sesuai berdasarkan role
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'officer') {
        router.push('/officer');
      } else {
        router.push('/user');
      }
    }
  }, [loading, isAuthenticated, user, roles, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
          <p className="mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;