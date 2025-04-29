function MobileSidebar({ open, onClose }) {
    return (
      <>
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform ${
            open ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200 ease-in-out md:hidden`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src="https://storage.googleapis.com/a1aa/image/0a5f0c83-23e9-4055-b9ed-5e95ca738b37.jpg"
                alt="Logo"
                className="w-10 h-10"
              />
              <span className="text-xl font-semibold text-blue-700">
                Clean Water Admin
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
            >
              <i className="fas fa-times fa-lg"></i>
            </button>
          </div>
          <nav className="px-4 py-6 space-y-2 overflow-y-auto h-full">
            {[
              { name: "Dashboard", icon: "fas fa-tachometer-alt", href: "#dashboard" },
              { name: "Users", icon: "fas fa-users", href: "#users" },
              { name: "Sensors", icon: "fas fa-microchip", href: "#sensors" },
              { name: "Reports", icon: "fas fa-file-alt", href: "#reports" },
              { name: "Alerts", icon: "fas fa-bell", href: "#alerts" },
              { name: "Settings", icon: "fas fa-cogs", href: "#settings" },
              { name: "Logs", icon: "fas fa-clipboard-list", href: "#logs" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 rounded-md text-blue-700 hover:bg-blue-100 hover:text-blue-900 font-semibold"
              >
                <i className={`${item.icon} mr-3`}></i>
                {item.name}
              </a>
            ))}
          </nav>
        </aside>
  
        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
            onClick={onClose}
          ></div>
        )}
      </>
    );
  }
  
  export default MobileSidebar;
  