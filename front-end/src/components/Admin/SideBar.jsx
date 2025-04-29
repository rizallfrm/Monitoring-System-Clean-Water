function Sidebar() {
    return (
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <img src="https://storage.googleapis.com/a1aa/image/0a5f0c83-23e9-4055-b9ed-5e95ca738b37.jpg" alt="Logo" className="w-10 h-10" />
          <span className="ml-3 text-xl font-semibold text-blue-700">Clean Water Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
    );
  }
  
  export default Sidebar;
  