const { Report, User, StatusUpdate } = require("../../../common/models");
const { Op } = require("sequelize");
const {
  upload,
  uploadToImageKit,
} = require("../../../common/middleware/uploadMiddleware");
// Controller untuk pengelolaan report
const reportController = {
  // Membuat laporan baru
  createReport: [
    upload.array("images", 5), // Maksimal 5 gambar
    uploadToImageKit,
    async (req, res) => {
      try {
        const { description, location } = req.body;
        const userId = req.user.id;

        // Validasi input
        if (!description || !location) {
          return res.status(400).json({
            status: "error",
            message: "Deskripsi dan lokasi harus diisi",
          });
        }

        // Buat laporan baru dengan gambar jika ada
        const newReport = await Report.create({
          user_id: userId,
          description,
          location,
          status: "Pending",
          images: req.uploadedImages || [], // Menyimpan array gambar dari ImageKit
        });

        // Buat entry status update untuk status awal
        await StatusUpdate.create({
          report_id: newReport.report_id,
          updated_by: userId,
          status: "Pending",
        });

        return res.status(201).json({
          status: "success",
          message: "Laporan berhasil dibuat",
          data: newReport,
        });
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "Terjadi kesalahan saat membuat laporan",
          error: error.message,
        });
      }
    },
  ],

  // Mendapatkan semua laporan dengan filter dan pagination
  getAllReports: async (req, res) => {
    try {
      const {
        status,
        search,
        userId,
        assignedTo,
        page = 1,
        limit = 10,
      } = req.query;
      const offset = (page - 1) * limit;

      // Siapkan filter jika ada
      let whereClause = {};

      if (status) {
        whereClause.status = status;
      }

      if (userId) {
        whereClause.user_id = userId;
      }

      if (assignedTo) {
        whereClause.assigned_to = assignedTo;
      }

      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { description: { [Op.like]: `%${search}%` } },
            { location: { [Op.like]: `%${search}%` } },
          ],
        };
      }

      // Jika user adalah Warga, hanya tampilkan laporan miliknya
      if (req.user.role === "Warga") {
        whereClause.user_id = req.user.id;
      }

      // Dapatkan semua laporan dengan pagination dan include informasi reporter dan assigned officer
      const { count, rows: reports } = await Report.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "reporter",
            attributes: ["user_id", "name", "email", "role"],
          },
          {
            model: User,
            as: "assignedOfficer",
            attributes: ["user_id", "name", "email", "role"],
          },
        ],
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
          reports,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data laporan",
        error: error.message,
      });
    }
  },

  // Mendapatkan detail laporan berdasarkan ID
  getReportById: async (req, res) => {
    try {
      const { id } = req.params;

      // Cari laporan berdasarkan ID
      const report = await Report.findByPk(id, {
        include: [
          {
            model: User,
            as: "reporter",
            attributes: ["user_id", "name", "email", "role"],
          },
          {
            model: User,
            as: "assignedOfficer",
            attributes: ["user_id", "name", "email", "role"],
          },
          {
            model: StatusUpdate,
            as: "statusUpdates",
            include: [
              {
                model: User,
                as: "updater",
                attributes: ["user_id", "name", "role"],
              },
            ],
          },
        ],
      });

      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Laporan tidak ditemukan",
        });
      }

      // Jika user adalah Warga dan bukan pemilik laporan, tolak akses
      if (req.user.role === "Warga" && report.user_id !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak memiliki akses ke laporan ini",
        });
      }

      return res.status(200).json({
        status: "success",
        data: report,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil detail laporan",
        error: error.message,
      });
    }
  },

  // Update laporan
  updateReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { description, location } = req.body;

      // Cari laporan berdasarkan ID
      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Laporan tidak ditemukan",
        });
      }

      // Jika user adalah Warga dan bukan pemilik laporan, tolak akses
      if (req.user.role === "Warga" && report.user_id !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak memiliki akses untuk mengubah laporan ini",
        });
      }

      // Jika laporan sudah tidak Pending, tidak bisa diubah oleh Warga
      if (req.user.role === "Warga" && report.status !== "Pending") {
        return res.status(400).json({
          status: "error",
          message: "Laporan yang sudah diproses tidak dapat diubah",
        });
      }

      // Update data laporan
      await report.update({
        description: description || report.description,
        location: location || report.location,
      });

      return res.status(200).json({
        status: "success",
        message: "Laporan berhasil diperbarui",
        data: report,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat memperbarui laporan",
        error: error.message,
      });
    }
  },

  // Mendapatkan laporan berdasarkan officerId
  getReportsByOfficer: async (req, res) => {
    try {
      const { officerId } = req.params;
      const { status, search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Validasi officerId
      const officer = await User.findByPk(officerId);
      if (!officer) {
        return res.status(400).json({
          status: "error",
          message: "Petugas tidak valid",
        });
      }

      // Siapkan filter
       let whereClause = {
            [Op.or]: [
                { assigned_to: officerId },
            ]
        };


      if (status) {
        whereClause.status = status;
      }

      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { description: { [Op.like]: `%${search}%` } },
            { location: { [Op.like]: `%${search}%` } },
          ],
        };
      }

      // Dapatkan laporan dengan pagination
      const { count, rows: reports } = await Report.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "reporter",
            attributes: ["user_id", "name", "email", "role"],
          },
          {
            model: User,
            as: "assignedOfficer",
            attributes: ["user_id", "name", "email", "role"],
          },
        ],
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
          reports,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data laporan",
        error: error.message,
      });
    }
  },

  // Assign petugas ke laporan (hanya untuk Admin)
  assignOfficer: async (req, res) => {
    try {
      const { id } = req.params;
      const { officerId } = req.body;

      // Cari laporan berdasarkan ID
      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Laporan tidak ditemukan",
        });
      }

      const officer = await User.findByPk(officerId);

      if (!officer || officer.role !== "Petugas") {
        return res.status(400).json({
          status: "error",
          message: "Petugas tidak ditemukan atau user bukan petugas",
        });
      }

      // Update assigned_to di laporan
      await report.update({
        assigned_to: officerId,
      });

      // Jika status masih Pending, update ke On-Going
      if (report.status === "Pending") {
        await report.update({
          status: "Pending",
        });

        // Buat entry status update
        await StatusUpdate.create({
          report_id: report.report_id,
          updated_by: req.user.id,
          status: "Pending",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Petugas berhasil ditugaskan",
        data: report,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menugaskan petugas",
        error: error.message,
      });
    }
  },

  // Cancel report (bisa dilakukan oleh pemilik laporan atau Admin)
  cancelReport: async (req, res) => {
    try {
      const { id } = req.params;

      // Cari laporan berdasarkan ID
      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Laporan tidak ditemukan",
        });
      }

      // Jika user adalah Warga dan bukan pemilik laporan, tolak akses
      if (req.user.role === "Warga" && report.user_id !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak memiliki akses untuk membatalkan laporan ini",
        });
      }

      // Jika laporan sudah Completed, tidak bisa dibatalkan
      if (report.status === "Completed") {
        return res.status(400).json({
          status: "error",
          message: "Laporan yang sudah selesai tidak dapat dibatalkan",
        });
      }

      // Update status laporan menjadi Cancel
      await report.update({
        status: "Cancel",
      });

      // Buat entry status update
      await StatusUpdate.create({
        report_id: report.report_id,
        updated_by: req.user.id,
        status: "Cancel",
      });

      return res.status(200).json({
        status: "success",
        message: "Laporan berhasil dibatalkan",
        data: report,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat membatalkan laporan",
        error: error.message,
      });
    }
  },

  // Menandai laporan sebagai selesai (hanya untuk Petugas yang ditugaskan atau Admin)
  completeReport: async (req, res) => {
    try {
      const { id } = req.params;

      // Cari laporan berdasarkan ID
      const report = await Report.findByPk(id);

      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Laporan tidak ditemukan",
        });
      }

      // Jika user adalah Petugas, pastikan dia yang ditugaskan
      if (req.user.role === "Petugas" && report.assigned_to !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak ditugaskan untuk laporan ini",
        });
      }

      // Jika laporan sudah Completed atau Cancel, tolak request
      if (report.status === "Completed" || report.status === "Cancel") {
        return res.status(400).json({
          status: "error",
          message: `Laporan sudah dalam status ${report.status}`,
        });
      }

      // Update status laporan menjadi Completed
      await report.update({
        status: "Completed",
      });

      // Buat entry status update
      await StatusUpdate.create({
        report_id: report.report_id,
        updated_by: req.user.id,
        status: "Completed",
      });

      return res.status(200).json({
        status: "success",
        message: "Laporan telah diselesaikan",
        data: report,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menyelesaikan laporan",
        error: error.message,
      });
    }
  },
};

module.exports = reportController;
