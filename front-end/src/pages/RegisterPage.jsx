import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Logo from "../../public/logo.png"; // Import logo dari folder assets

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Warga",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register(formData);
      setSuccess("Pendaftaran berhasil! Silakan login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Pendaftaran gagal. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden fixed inset-0">
      {/* Background dengan tema air dan monitoring */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700">
        {/* Wave patterns untuk efek air */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute bottom-0 left-0 w-full h-64"
            viewBox="0 0 1440 320"
            fill="none"
          >
            <path
              fill="rgba(59, 130, 246, 0.3)"
              d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,165.3C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          <svg
            className="absolute bottom-0 left-0 w-full h-64"
            viewBox="0 0 1440 320"
            fill="none"
          >
            <path
              fill="rgba(34, 197, 94, 0.2)"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,117.3C672,107,768,117,864,128C960,139,1056,149,1152,138.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Floating bubbles untuk efek air */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-white bg-opacity-30 rounded-full animate-bounce"></div>
        <div
          className="absolute top-20 right-20 w-6 h-6 bg-blue-300 bg-opacity-40 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-40 left-1/4 w-3 h-3 bg-cyan-300 bg-opacity-50 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-60 right-1/3 w-5 h-5 bg-teal-300 bg-opacity-40 rounded-full animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/2 w-8 h-8 bg-blue-400 bg-opacity-30 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Grid pattern untuk tema monitoring */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full p-8">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="bg-white h-4"></div>
            ))}
          </div>
        </div>

        {/* Decorative water drops */}
        <div className="absolute top-32 left-16 w-12 h-16 opacity-20">
          <div className="w-12 h-12 bg-blue-300 rounded-full"></div>
          <div className="w-3 h-4 bg-blue-300 mx-auto -mt-2 rounded-b-full"></div>
        </div>
        <div className="absolute bottom-32 right-16 w-8 h-12 opacity-15">
          <div className="w-8 h-8 bg-cyan-300 rounded-full"></div>
          <div className="w-2 h-3 bg-cyan-300 mx-auto -mt-1 rounded-b-full"></div>
        </div>

        {/* Pipeline pattern */}
        <div className="absolute top-0 left-1/3 w-2 h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-10"></div>
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-15"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Glass morphism card dengan tema PDAM */}
          <div className="bg-white bg-opacity-5 backdrop-blur-3xl rounded-2xl p-6 shadow-2xl border border-white border-opacity-20">
            {/* Logo/Icon area */}
            <div className="text-center mb-4">
              <div className="text-center mb-2">
                <img
                  src={Logo}
                  alt="Hydroflow"
                  className="h-40 w-auto transform group-hover:scale-105 transition-transform duration-200 mt-2 px-28"
                />
                <h2 className="text-center  text-xl font-bold text-white mb-8">
                 Buat Akun Baru
                </h2>
              </div>
              
            </div>

            {error && (
              <div
                className="bg-red-500 bg-opacity-20 backdrop-blur-sm border border-red-400 border-opacity-50 text-red-100 px-4 py-3 rounded-lg relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {success && (
              <div
                className="bg-green-500 bg-opacity-20 backdrop-blur-sm border border-green-400 border-opacity-50 text-green-100 px-4 py-3 rounded-lg relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{success}</span>
              </div>
            )}

             <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-3">
                {/* Input Nama */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full pl-10 pr-4 py-2.5 bg-white bg-opacity-20 backdrop-blur-sm border border-blue-300 border-opacity-40 rounded-lg shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Input Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full pl-10 pr-4 py-2.5 bg-white bg-opacity-20 backdrop-blur-sm border border-blue-300 border-opacity-40 rounded-lg shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                      placeholder="Masukkan email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Input Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full pl-10 pr-4 py-2.5 bg-white bg-opacity-20 backdrop-blur-sm border border-blue-300 border-opacity-40 rounded-lg shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                      placeholder="Masukkan password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Input Nomor Telepon */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-blue-100 mb-1">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="block w-full pl-10 pr-4 py-2.5 bg-white bg-opacity-20 backdrop-blur-sm border border-blue-300 border-opacity-40 rounded-lg shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                      placeholder="Masukkan nomor telepon"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Tombol Daftar */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Memproses..." : "Daftar"}
                </button>
              </div>
            </form>

            {/* Bagian "Sudah punya akun? Masuk di sini" */}
            <div className="text-center text-sm text-blue-200 mt-4">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-medium text-cyan-300 hover:text-cyan-200 transition-colors duration-200"
              >
                Masuk di sini
              </Link>
            </div>
          </div>

          {/* Footer info */}
          <div className="text-center text-xs text-blue-300 opacity-75 mt-4">
            <p>© 2025 HydroFlow</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
