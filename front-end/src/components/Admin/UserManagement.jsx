function UserManagement() {
    const users = [
      { id: "U001", name: "Ahmad Fauzi", email: "ahmad.fauzi@example.com", role: "Administrator", status: "Active" },
      { id: "U002", name: "Siti Nurhaliza", email: "siti.nurhaliza@example.com", role: "Operator", status: "Active" },
      { id: "U003", name: "Budi Santoso", email: "budi.santoso@example.com", role: "Viewer", status: "Pending" },
      { id: "U004", name: "Lina Marlina", email: "lina.marlina@example.com", role: "Operator", status: "Disabled" },
    ];
  
    const statusStyles = {
      Active: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Disabled: "bg-red-100 text-red-800",
    };
  
    return (
      <section className="mb-10" id="users">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">User Management</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                {["User ID", "Name", "Email", "Role", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusStyles[user.status]}`}>
                      <i className={`fas ${user.status === "Pending" ? "fa-exclamation-triangle" : user.status === "Disabled" ? "fa-times-circle" : "fa-check-circle"} mr-1`}></i>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 focus:outline-none" title="Edit user">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-900 focus:outline-none" title="Delete user">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  
  export default UserManagement;
  