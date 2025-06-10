import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Bell,
  Settings,
  LogOut,
  Droplets,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../Context/authContext";
import ProfileSection from "../components/UserPage/ProfileSection";
import Logo from "../../public/logo.png";
import Footer from "../components/LandingPage/Footer";
import Navbar from "../components/Navbar";

const menuItems = [
  {
    text: "User Management",
    icon: Users,
    path: "/users",
  },
  {
    text: "Officer Management",
    icon: Wrench,
    path: "/officers",
  },
  {
    text: "Report Management",
    icon: FileText,
    path: "/reports",
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown/sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await authService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = async () => {
    setIsDropdownOpen(false);
    setMobileMenuOpen(false);
    if (!profile) {
      await fetchProfile();
    }
    setShowProfileModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={handleDrawerToggle}
          className={`fixed bottom-4 left-4 z-40 lg:hidden mobile-menu-button p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors ${
            open ? "hidden" : ""
          }`}
        >
          <Menu className="h-6 w-6" />
        </button>
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 lg:w-60`}
        >
          <div className="flex flex-col h-full pt-14 md:pt-8">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2"></div>
              <button
                onClick={handleDrawerToggle}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.text}>
                      <Link
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <Icon className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                        <span>{item.text}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Mobile Account Section in Sidebar */}
            <div className="lg:hidden p-4 border-t border-gray-200">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-2">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name || user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role === "Admin"
                        ? "Admin"
                        : user.role === "Petugas"
                        ? "Petugas"
                        : "Warga"}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full mt-3 flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {open && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={handleDrawerToggle}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-60">
          {/* Top Navigation Bar */}
          <Navbar />

          {/* Spacer to prevent content from hiding behind fixed navbar */}
          <div className="h-16"></div>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Enhanced Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Profil Pengguna
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Kelola informasi akun Anda
                    </p>
                  </div>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Memuat profil...</p>
                  </div>
                ) : (
                  <ProfileSection profile={profile || user} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
