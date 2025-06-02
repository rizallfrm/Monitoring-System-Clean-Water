import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, FileText, CheckCircle, LogOut, Activity, User, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../Context/authContext';
import authService from '../services/authService';
import ProfileSection from '../components/UserPage/ProfileSection';
import Logo from '../assets/logo.png';

const NavSideBarOfficer = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    role: 'Loading...'
  });
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch user profile for sidebar
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profile = await authService.getProfile();
        setUserProfile({
          name: profile.name || 'Unknown User',
          role: profile.role || 'Unknown Role'
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUserProfile({
          name: 'Petugas',
          role: 'Petugas Lapangan'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const profileData = await authService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileClick = async () => {
    setIsDropdownOpen(false);
    if (!profile) {
      await fetchProfile();
    }
    setShowProfileModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name) => {
    if (!name || name === 'Loading...') return 'JP';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
          : 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex items-center group cursor-pointer">
                <img
                  src={Logo}
                  alt="Hydroflow"
                  className="h-40 w-auto transform group-hover:scale-105 transition-transform duration-200 mt-2"
                />
              </div>
            </div>

            {/* Right Section - User Profile */}
            <div className="flex items-center">
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
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {user.name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {user.role === 'Admin' ? 'Admin' :
                          user.role === 'Petugas' ? 'Petugas' :
                            user.role === 'Warga' ? 'Warga' : 'Petugas'}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-all duration-300 ${
                        isDropdownOpen ? 'rotate-180 text-blue-500' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-30"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {user.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                            {user.role && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 mt-1">
                                {user.role === 'Admin' ? 'Admin' :
                                  user.role === 'Petugas' ? 'Petugas' :
                                    user.role === 'Warga' ? 'Warga' : 'Petugas'}
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
                            <p className="text-xs text-gray-500">Kelola informasi akun</p>
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
                            <p className="text-xs text-red-500">Logout dari sistem</p>
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
      </nav>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 shadow-2xl border-r border-slate-200/60 flex flex-col overflow-hidden pt-16 backdrop-blur-sm">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-80 bg-gradient-to-bl from-blue-100/40 via-cyan-50/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-48 h-64 bg-gradient-to-tr from-indigo-100/40 via-purple-50/30 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-slate-200/60 relative z-10 bg-white/40 backdrop-blur-sm">
          <div className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

            </div>
            <div className="ml-4 flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Dashboard Petugas
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Kelola laporan & tindakan
              </p>
              <div className="mt-2 flex items-center space-x-2">
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 relative z-10">
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: Home,
              gradient: "from-blue-500 to-indigo-600",
              hoverGradient: "from-blue-600 to-indigo-700",
            },
            {
              id: "reports",
              label: "Laporan",
              icon: FileText,
              gradient: "from-emerald-500 to-teal-600",
              hoverGradient: "from-emerald-600 to-teal-700",
            },
            {
              id: "actions",
              label: "Tindakan",
              icon: CheckCircle,
              gradient: "from-purple-500 to-pink-600",
              hoverGradient: "from-purple-600 to-pink-700",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center w-full px-5 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
                activeTab === tab.id
                  ? `bg-gradient-to-r text-white shadow-xl transform scale-105 border border-white/20 ${tab.gradient}`
                  : "text-slate-700 hover:bg-white/60 hover:text-slate-900 hover:scale-105 hover:shadow-lg bg-white/40 border border-white/30"
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
              )}
              <div
                className={`p-3 rounded-xl mr-4 transition-all duration-300 relative z-10 ${
                  activeTab === tab.id
                    ? "bg-white/25 shadow-lg"
                    : "bg-white/60 group-hover:bg-white/80 shadow-sm"
                }`}
              >
                <tab.icon
                  className={`h-5 w-5 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-slate-600 group-hover:text-slate-800"
                  }`}
                />
              </div>
              <span className="relative z-10 flex-1 text-left">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="ml-auto relative z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200/60 relative z-10 bg-white/40 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-xs text-slate-500">
              © 2025 Hydroflow System
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Dashboard Petugas v1.0
            </p>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Profil Pengguna
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Kelola informasi akun Anda</p>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {profileLoading ? (
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

      {/* Content padding to account for sidebar */}
      <div className="ml-72">
        <div className="h-16"></div> {/* Spacer for navbar */}
      </div>
    </>
  );
};

export default NavSideBarOfficer;