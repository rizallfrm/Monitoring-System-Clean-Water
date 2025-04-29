import { useState, useEffect } from "react";
import Sidebar from "../components/Admin/SideBar";
import Header from "../components/Admin/Header";
import MobileSidebar from "../components/Admin/MobileSidebar";
import DashboardOverview from "../components/Admin/DashboardOverview";
import UserManagement from "../components/Admin/UserManagement";
import SensorManagement from "../components/Admin/SensorManagement";
import RecentReports from "../components/Admin/RecentReport";
import AlertsNotifications from "../components/Admin/AlertsNotifications";
import SystemSettings from "../components/Admin/SystemSetting";
import SystemLogs from "../components/Admin/SystemLogs";
import Footer from "../components/Admin/Footer";
import Login from "../components/Admin/Login";

function AdminDashboard() {
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const authStatus = localStorage.getItem("auth");
//     if (authStatus === "true") {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("auth"); // Hapus auth dari localStorage
//     setIsAuthenticated(false); // Balik ke halaman login
//   };

//   if (!isAuthenticated) {
//     return <Login onLogin={handleLogin} />;
//   }

// onSidebarToggle={() => setMobileSidebarOpen(true)} onLogout={handleLogout}
// open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} 
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-y-auto">
          <Header/>
          <MobileSidebar/>
          <main className="flex-1 p-6 overflow-y-auto">
            <DashboardOverview />
            <UserManagement />
            <SensorManagement />
            <RecentReports />
            <AlertsNotifications />
            <SystemSettings />
            <SystemLogs />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
