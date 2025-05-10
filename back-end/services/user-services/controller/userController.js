const { User } = require("../../../common/models");
const { generateToken } = require("../../../common/middleware/auth");
const { Op } = require("sequelize");

// Controller untuk pengelolaan user
const userController = {
  // Register user baru
  register: async (req, res) => {
    try {
      console.log("Role dari token:", req.user?.role);

      const { name, email, password, phone, role } = req.body;
      console.log("EMAIL YANG MASUK:", email);

      // Periksa apakah email sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Email sudah terdaftar",
        });
      }

      // Validasi role (hanya admin yang bisa membuat user Petugas atau Admin)
      console.log(
        "CONTROLLER - IS ADMIN?",
        req.user && req.user.role === "Admin"
      );
      if (
        (role === "Petugas" || role === "Admin") &&
        !(req.user && req.user.role === "Admin")
      ) {
        return res.status(403).json({
          status: "error",
          message: "Hanya Admin yang dapat membuat akun Petugas atau Admin",
        });
      }

      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Format email tidak valid" });
      }

      // Buat user baru
      const newUser = await User.create({
        name,
        email,
        password, // Password akan di-hash melalui hook sebelum disimpan
        phone,
        role: role || "Warga", // Default role adalah Warga
      });

      // Response tanpa menampilkan password
      const { password: _, ...userWithoutPassword } = newUser.toJSON();

      return res.status(201).json({
        status: "success",
        message: "User berhasil dibuat",
        data: userWithoutPassword,
      });
    } catch (error) {
      console.log("BODY YANG DITERIMA:", req.body);

      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat membuat user",
        error: error.message,
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Cari user berdasarkan email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Email atau password salah",
        });
      }

      // Verifikasi password
      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: "error",
          message: "Email atau password salah",
        });
      }

      // Generate token
      const token = generateToken(user);

      // Response data user (tanpa password)
      const { password: _, ...userWithoutPassword } = user.toJSON();

      return res.status(200).json({
        status: "success",
        message: "Login berhasil",
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat login",
        error: error.message,
      });
    }
  },

  // Mendapatkan profil user yang sedang login
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      // Cari user berdasarkan ID
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil profil",
        error: error.message,
      });
    }
  },

  // Mendapatkan semua user (hanya untuk Admin)
  getAllUsers: async (req, res) => {
    try {
      const { role, search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Siapkan filter jika ada
      let whereClause = {};

      if (role) {
        whereClause.role = role;
      }

      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        };
      }

      // Dapatkan semua user dengan pagination
      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ["password"] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json({
        status: "success",
        data: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
          users,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data user",
        error: error.message,
      });
    }
  },

  // Mendapatkan detail user berdasarkan ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      // Cari user berdasarkan ID
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data user",
        error: error.message,
      });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { name, email, password, phone, role } = req.body;

      // Cari user berdasarkan user_ID
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
        });
      }

      // Jika user bukan admin dan mencoba mengubah role
      if (req.user.role !== "Admin" && role && role !== user.role) {
        return res.status(403).json({
          status: "error",
          message: "Hanya Admin yang dapat mengubah role user",
        });
      }

      // Update data user
      await user.update({
        name: name || user.name,
        email: email || user.email,
        password: password ? password : undefined,
        phone: phone !== undefined ? phone : user.phone,
        role: role || user.role,
      });

      // Response data user (tanpa password)
      const { password: _, ...userWithoutPassword } = user.toJSON();

      return res.status(200).json({
        status: "success",
        message: "User berhasil diperbarui",
        data: userWithoutPassword,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat memperbarui user",
        error: error.message,
      });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Cari user berdasarkan ID
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User tidak ditemukan",
        });
      }

      // Delete user
      await user.destroy();

      return res.status(200).json({
        status: "success",
        message: "User berhasil dihapus",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menghapus user",
        error: error.message,
      });
    }
  },

  // Hanya untuk Admin: Mendapatkan daftar petugas
  getOfficers: async (req, res) => {
    try {
      const { search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Siapkan filter untuk petugas
      let whereClause = { role: "Petugas" };

      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        };
      }

      // Dapatkan daftar petugas dengan pagination
      const { count, rows: officers } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ["password"] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["name", "ASC"]],
      });

      return res.status(200).json({
        status: "success",
        data: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
          officers,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data petugas",
        error: error.message,
      });
    }
  },
};

module.exports = userController;
