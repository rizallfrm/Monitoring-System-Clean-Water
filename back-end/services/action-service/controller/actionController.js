const { Action, Report, User } = require("../../../common/models");
const { Op } = require("sequelize");

// Controller untuk pengelolaan actions (tindakan petugas)
const actionController = {
  // Membuat action baru
  createAction: async (req, res) => {
    try {
      const { reportId, actionDescription } = req.body;
      const userId = req.user.id;

      // Validasi input
      if (!reportId || !actionDescription) {
        return res.status(400).json({
          status: "error",
          message: "ID laporan dan deskripsi tindakan harus diisi",
        });
      }

      // Cari laporan berdasarkan ID
      const report = await Report.findByPk(reportId);

      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Laporan tidak ditemukan",
        });
      }

      // Jika user adalah Petugas, pastikan dia yang ditugaskan
      if (req.user.role === "Petugas" && report.assigned_to !== userId) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak ditugaskan untuk laporan ini",
        });
      }

      // Jika laporan sudah Cancel atau Completed, tidak bisa menambahkan action
      if (report.status === "Cancel" || report.status === "Completed") {
        return res.status(400).json({
          status: "error",
          message: `Tidak dapat menambahkan tindakan pada laporan dengan status ${report.status}`,
        });
      }

      // Buat action baru
      const newAction = await Action.create({
        report_id: reportId,
        performed_by: userId,
        action_description: actionDescription,
      });

      // Jika status laporan masih Pending, ubah menjadi On-Going
      if (report.status === "Pending") {
        await report.update({
          status: "On-Going",
        });
      }

      return res.status(201).json({
        status: "success",
        message: "Tindakan berhasil ditambahkan",
        data: newAction,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menambahkan tindakan",
        error: error.message,
      });
    }
  },

  // Mendapatkan semua action berdasarkan ID laporan
  getActionsByReportId: async (req, res) => {
    try {
      const { reportId } = req.params;

      // Cari laporan berdasarkan ID
      const report = await Report.findByPk(reportId);

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
          message: "Anda tidak memiliki akses ke tindakan untuk laporan ini",
        });
      }

      // Dapatkan semua action dengan informasi performer
      const actions = await Action.findAll({
        where: { report_id: reportId },
        include: [
          {
            model: User,
            as: "performer",
            attributes: ["user_id", "name", "role"],
          },
        ],
        order: [["performed_at", "DESC"]],
      });

      return res.status(200).json({
        status: "success",
        data: actions,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data tindakan",
        error: error.message,
      });
    }
  },

  // Mendapatkan semua action dengan filter dan pagination (untuk Admin)
  getAllActions: async (req, res) => {
    try {
      const { reportId, performedBy, startDate, endDate } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Siapkan filter jika ada
      let whereClause = {};

      if (reportId) {
        whereClause.report_id = reportId;
      }

      if (performedBy) {
        whereClause.performed_by = performedBy;
      }

      // Filter berdasarkan tanggal
      if (startDate && endDate) {
        whereClause.performed_at = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      } else if (startDate) {
        whereClause.performed_at = {
          [Op.gte]: new Date(startDate),
        };
      } else if (endDate) {
        whereClause.performed_at = {
          [Op.lte]: new Date(endDate),
        };
      }

      // Untuk Petugas, hanya tampilkan action yang dilakukan oleh mereka
      if (req.user.role === "Petugas") {
        whereClause.performed_by = req.user.id;
      }

      // Dapatkan semua action dengan pagination
      const { count, rows: actions } = await Action.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "performer",
            attributes: ["user_id", "name", "role"],
          },
          {
            model: Report,
            as: "report",
            attributes: ["report_id", "description", "location", "status"],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["performed_at", "DESC"]],
      });

      return res.status(200).json({
        status: "success",
        data: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
          actions,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data tindakan",
        error: error.message,
      });
    }
  },

  // Mendapatkan detail action berdasarkan ID
  getActionById: async (req, res) => {
    try {
      const { id } = req.params;

      // Cari action berdasarkan ID
      const action = await Action.findByPk(id, {
        include: [
          {
            model: User,
            as: "performer",
            attributes: ["user_id", "name", "role"],
          },
          {
            model: Report,
            as: "report",
            attributes: [
              "report_id",
              "description",
              "location",
              "status",
              "user_id",
            ],
          },
        ],
      });

      if (!action) {
        return res.status(404).json({
          status: "error",
          message: "Tindakan tidak ditemukan",
        });
      }

      // Jika user adalah Warga, periksa apakah dia pemilik laporan
      if (req.user.role === "Warga" && action.report.user_id !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak memiliki akses ke detail tindakan ini",
        });
      }

      return res.status(200).json({
        status: "success",
        data: action,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil detail tindakan",
        error: error.message,
      });
    }
  },

  // Update action (hanya bisa dilakukan oleh performer atau Admin)
  updateAction: async (req, res) => {
    try {
      const { id } = req.params;
      const { actionDescription } = req.body;

      // Cari action berdasarkan ID
      const action = await Action.findByPk(id, {
        include: [
          {
            model: Report,
            as: "report",
          },
        ],
      });

      if (!action) {
        return res.status(404).json({
          status: "error",
          message: "Tindakan tidak ditemukan",
        });
      }

      // Hanya performer atau Admin yang bisa update action
      if (req.user.role !== "Admin" && action.performed_by !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak memiliki akses untuk mengubah tindakan ini",
        });
      }

      // Jika laporan sudah Completed atau Cancel, tidak bisa update action
      if (
        action.report.status === "Completed" ||
        action.report.status === "Cancel"
      ) {
        return res.status(400).json({
          status: "error",
          message: `Tidak dapat mengubah tindakan pada laporan dengan status ${action.report.status}`,
        });
      }

      // Update action
      await action.update({
        action_description: actionDescription,
      });

      return res.status(200).json({
        status: "success",
        message: "Tindakan berhasil diperbarui",
        data: action,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat memperbarui tindakan",
        error: error.message,
      });
    }
  },

  // Delete action (hanya bisa dilakukan oleh Admin)
  deleteAction: async (req, res) => {
    try {
      const { id } = req.params;

      // Cari action berdasarkan ID
      const action = await Action.findByPk(id);

      if (!action) {
        return res.status(404).json({
          status: "error",
          message: "Tindakan tidak ditemukan",
        });
      }

      // Hanya Admin yang bisa menghapus action
      if (req.user.role !== "Admin" && req.user.role !== "Petugas") {
        return res.status(403).json({
          status: "error",
          message: "Hanya Admin yang dapat menghapus tindakan",
        });
      }

      // Delete action
      await action.destroy();

      return res.status(200).json({
        status: "success",
        message: "Tindakan berhasil dihapus",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat menghapus tindakan",
        error: error.message,
      });
    }
  },
};

module.exports = actionController;
