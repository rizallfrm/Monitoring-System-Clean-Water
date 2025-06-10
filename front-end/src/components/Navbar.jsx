"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../Context/authContext";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";
import ProfileSection from "../components/UserPage/ProfileSection";
import Logo from "../../public/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Import authService sesuai kebutuhan
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
    setIsMobileMenuOpen(false);
    if (!profile) {
      await fetchProfile();
    }
    setShowProfileModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
            : "bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex items-center group cursor-pointer">
                <img
                  src={Logo}
                  alt="Hydroflow"
                  className="h-32 pt-2 w-auto transform group-hover:scale-105 transition-transform duration-200 
             sm:h-12 
             md:h-24 
             lg:h-32
             xl:px-24"
                />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop Right Section - User Profile */}
            <div className="hidden md:flex items-center">
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 pl-2 pr-3 py-2 rounded-xl transition-all duration-200 border border-blue-200/50 hover:border-blue-300/50 hover:shadow-md group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-2">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {user.name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {user.role === "Admin"
                          ? "Admin"
                          : user.role === "Petugas"
                          ? "Petugas"
                          : user.role === "Warga"
                          ? "Warga"
                          : "Warga"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-all duration-300 ${
                        isDropdownOpen ? "rotate-180 text-blue-500" : ""
                      }`}
                    />
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {user.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                            {user.role && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 mt-1">
                                {user.role === "Admin"
                                  ? "Admin"
                                  : user.role === "Petugas"
                                  ? "Petugas"
                                  : user.role === "Warga"
                                  ? "Warga"
                                  : "Warga"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group"
                        >
                          <div className="bg-gray-100 group-hover:bg-blue-100 rounded-lg p-2 mr-3 transition-colors duration-200">
                            <User className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Profil Saya</p>
                            <p className="text-xs text-gray-500">
                              Kelola informasi akun
                            </p>
                          </div>
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                        >
                          <div className="bg-red-100 group-hover:bg-red-200 rounded-lg p-2 mr-3 transition-colors duration-200">
                            <LogOut className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Keluar</p>
                            <p className="text-xs text-red-500">
                              Logout dari sistem
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      {user.role && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 mt-1">
                          {user.role === "Admin"
                            ? "Admin"
                            : user.role === "Petugas"
                            ? "Petugas"
                            : user.role === "Warga"
                            ? "Warga"
                            : "Warga"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleProfileClick}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <User className="h-5 w-5 text-gray-500 mr-3" />
                Profil Saya
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="h-5 w-5 text-red-500 mr-3" />
                Keluar
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>

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
    </>
  );
}
