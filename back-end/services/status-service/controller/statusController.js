const { StatusUpdate, Report, User } = require("../../../common/models");
const { Op } = require("sequelize");
const {sequelize} = require("../../../common/models")
// Controller untuk pengelolaan status update
const statusController = {
  // Membuat update status baru
  createStatusUpdate: async (req, res) => {
    try {
      const { reportId, status } = req.body;
      const userId = req.user.id;

      // Validasi input
      if (!reportId || !status) {
        return res.status(400).json({
          status: "error",
          message: "ID laporan dan status harus diisi",
        });
      }

      // Periksa apakah status valid
      const validStatuses = ["Pending", "On-Going", "Completed", "Cancel"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: "error",
          message: "Status tidak valid",
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

      // Jika user adalah Warga, mereka hanya bisa membatalkan laporan mereka sendiri
      if (req.user.role === "Warga") {
        if (report.user_id !== userId) {
          return res.status(403).json({
            status: "error",
            message:
              "Anda tidak memiliki akses untuk mengubah status laporan ini",
          });
        }

        if (status !== "Cancel") {
          return res.status(403).json({
            status: "error",
            message: "Warga hanya dapat membatalkan laporan",
          });
        }

        if (report.status === "Completed") {
          return res.status(400).json({
            status: "error",
            message: "Laporan yang sudah selesai tidak dapat dibatalkan",
          });
        }
      }

      // Jika user adalah Petugas, pastikan mereka ditugaskan untuk laporan ini
      if (req.user.role === "Petugas" && report.assigned_to !== userId) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak ditugaskan untuk laporan ini",
        });
      }

      // Buat status update baru
      const newStatusUpdate = await StatusUpdate.create({
        report_id: reportId,
        updated_by: userId,
        status,
      });

      // Update status di laporan
      await report.update({ status });

      return res.status(201).json({
        status: "success",
        message: "Status berhasil diperbarui",
        data: newStatusUpdate,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat memperbarui status",
        error: error.message,
      });
    }
  },

  // Mendapatkan riwayat status berdasarkan ID laporan
  getStatusHistoryByReportId: async (req, res) => {
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
          message: "Anda tidak memiliki akses ke riwayat status laporan ini",
        });
      }

      // Dapatkan riwayat status dengan informasi user yang memperbarui
      const statusHistory = await StatusUpdate.findAll({
        where: { report_id: reportId },
        include: [
          {
            model: User,
            as: "updater",
            attributes: ["user_id", "name", "role"],
          },
        ],
        order: [["updated_at", "ASC"]],
      });

      return res.status(200).json({
        status: "success",
        data: statusHistory,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil riwayat status",
        error: error.message,
      });
    }
  },

  // Mendapatkan semua status update dengan filter dan pagination (untuk Admin dan Dashboard)
  getAllStatusUpdates: async (req, res) => {
    try {
      const {
        reportId,
        userId,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = req.query;
      const offset = (page - 1) * limit;

      // Siapkan filter jika ada
      let whereClause = {};

      if (reportId) {
        whereClause.report_id = reportId;
      }

      if (userId) {
        whereClause.updated_by = userId;
      }

      if (status) {
        whereClause.status = status;
      }

      // Filter berdasarkan tanggal
      if (startDate && endDate) {
        whereClause.updated_at = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      } else if (startDate) {
        whereClause.updated_at = {
          [Op.gte]: new Date(startDate),
        };
      } else if (endDate) {
        whereClause.updated_at = {
          [Op.lte]: new Date(endDate),
        };
      }

      // Dapatkan semua status update dengan pagination
      const { count, rows: statusUpdates } = await StatusUpdate.findAndCountAll(
        {
          where: whereClause,
          include: [
            {
              model: User,
              as: "updater",
              attributes: ["user_id", "name", "role"],
            },
            {
              model: Report,
              as: "report",
              attributes: ["report_id", "description", "location", "user_id"],
            },
          ],
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: [["updated_at", "DESC"]],
        }
      );

      return res.status(200).json({
        status: "success",
        data: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
          statusUpdates,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data status update",
        error: error.message,
      });
    }
  },

  // Mendapatkan statistik status (untuk Dashboard)
  getStatusStatistics: async (req, res) => {
  try {
    const statusCounts = await Report.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('report_id')), 'count']
      ],
      group: ['status']
    });
    
    const statistics = {
      pending: 0,
      onGoing: 0,
      completed: 0,
      cancelled: 0 // Ubah dari 'cancel' menjadi 'cancelled' untuk konsistensi
    };
    
    statusCounts.forEach(item => {
      const count = parseInt(item.get('count'));
      const status = item.get('status');
      
      // Handle berbagai variasi penulisan status
      if (status.toLowerCase() === 'pending') {
        statistics.pending = count;
      } else if (status.toLowerCase() === 'on-going' || status.toLowerCase() === 'ongoing') {
        statistics.onGoing = count;
      } else if (status.toLowerCase() === 'completed') {
        statistics.completed = count;
      } else if (status.toLowerCase() === 'cancel' || status.toLowerCase() === 'cancelled') {
        statistics.cancelled = count;
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: statistics
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan server',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
}
};

module.exports = statusController;
