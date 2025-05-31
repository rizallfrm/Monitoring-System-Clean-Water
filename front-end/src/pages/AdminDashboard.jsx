import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AdminLayout from "../layouts/AdminLayout";
import DashboardPage from "../pages/Admin/DashboardPage";
import UserManagementPage from "../pages/Admin/UserManagementPage";
import OfficerManagementPage from "../pages/Admin/OfficerManagementPage";
import ReportManagementPage from "../pages/Admin/ReportManagementPage";
import ActionManagementPage from "../pages/Admin/ActionManagementPage";
import ReportDetailPage from "../pages/Admin/ReportDetailPage";
import UserDetailPage from "../pages/Admin/UserDetailPage";
import CreateOfficerPage from "../pages/Admin/CreateOfficerPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

function AdminDashboard() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users">
            <Route index element={<UserManagementPage />} />
            <Route path=":id" element={<UserDetailPage />} />
          </Route>
          <Route path="officers">
            <Route index element={<OfficerManagementPage />} />
            <Route path="new" element={<CreateOfficerPage />} />
          </Route>
          <Route path="reports">
            <Route index element={<ReportManagementPage />} />
            <Route path=":id" element={<ReportDetailPage />} />
          </Route>
          <Route path="actions" element={<ActionManagementPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}


export default AdminDashboard;