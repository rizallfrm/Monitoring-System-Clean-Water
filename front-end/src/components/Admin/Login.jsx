import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "rizalpepes") {
      onLogin();
      localStorage.setItem("auth", "true");
    } else {
      alert("Masukin nama dan password yang bener lah BLOG!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login Admin</h2>

        {/* Username Field */}
        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>

        {/* Password Field */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Login
        </button>

        {/* Info Username & Password */}
        <p className="text-xs text-gray-500 text-center mt-2">
          Username: <span className="font-semibold">admin</span> | Password: <span className="font-semibold">rizalpepes</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
