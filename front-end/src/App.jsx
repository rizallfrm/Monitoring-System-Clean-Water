import "./index.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Context/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserPage from "./pages/UserPage";
import OfficerPage from "./pages/OfficerPage";
import AuthLayout from "./pages/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={["user"]}>
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer"
        element={
          <ProtectedRoute roles={["officer"]}>
            <OfficerPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
