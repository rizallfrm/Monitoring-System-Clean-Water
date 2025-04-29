function Header({ onSidebarToggle, onLogout }) {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 h-16 px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={onSidebarToggle}
          className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
        >
          <i className="fas fa-bars fa-lg"></i>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          aria-label="Notifications"
          className="relative text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full"
        >
          <i className="fas fa-bell fa-lg"></i>
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
        </button>
        
        {/* Avatar Admin */}
        <div className="flex items-center space-x-3">
          <img
            src="https://storage.googleapis.com/a1aa/image/63d7fce4-211f-429a-c9d5-fb607d122e28.jpg"
            alt="Admin"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-gray-700 font-medium">Admin User</span>
        </div>

        {/* Tombol Logout */}
        <button
          onClick={onLogout}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
