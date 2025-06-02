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
import UserManagementPage from "./pages/Admin/UserManagementPage";
import OfficerManagementPage from "./pages/Admin/OfficerManagementPage";
import CreateOfficerPage from "./pages/Admin/CreateOfficerPage";
import ReportManagementPage from "./pages/Admin/ReportManagementPage";
import ReportDetailPage from "./pages/Admin/ReportDetailPage";
import ActionManagementPage from "./pages/Admin/ActionManagementPage";

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
        path="/admin/*"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/officers"
        element={
          <ProtectedRoute roles={["admin"]}>
            <OfficerManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officers/new"
        element={
          <ProtectedRoute roles={["admin"]}>
            <CreateOfficerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute roles={["admin"]}>
            <ReportManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/:id"
        element={
          <ProtectedRoute roles={["admin"]}>
            <ReportDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actions"
        element={
          <ProtectedRoute roles={["admin"]}>
            <ActionManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes element */}
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
