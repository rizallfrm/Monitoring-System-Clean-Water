const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Konfigurasi JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Middleware untuk verifikasi token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    console.log('Token diterima:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Tidak ada token autentikasi'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('TOKEN DECODED:', decoded);
      
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid atau kadaluarsa'
      });
    }
  };

// Middleware untuk memeriksa role pengguna
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "User tidak terautentikasi",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Anda tidak memiliki akses untuk operasi ini",
      });
    }

    next();
  };
};

// Middleware untuk memeriksa kepemilikan resource (hanya creator yang bisa akses)
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.id;

      const resource = await model.findByPk(resourceId);

      if (!resource) {
        return res.status(404).json({
          status: "error",
          message: "Resource tidak ditemukan",
        });
      }

      // Jika user adalah admin atau petugas, izinkan akses
      if (req.user.role === "Admin" || req.user.role === "Petugas") {
        return next();
      }

      // Jika user adalah warga, periksa kepemilikan
      if (resource.user_id !== userId) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak memiliki akses untuk resource ini",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat memeriksa kepemilikan resource",
      });
    }
  };
};

// Function untuk generate token
const generateToken = (user) => {
  const payload = {
    id: user.user_id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = {
  verifyToken,
  checkRole,
  checkOwnership,
  generateToken,
};
