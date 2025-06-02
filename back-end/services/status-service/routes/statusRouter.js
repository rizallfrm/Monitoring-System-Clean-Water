const express = require('express');
const router = express.Router();
const statusController = require('../controller/statusController');
const { verifyToken, checkRole } = require('../../../common/middleware/auth');

// Semua route memerlukan autentikasi
router.use(verifyToken);

// Membuat status update baru
router.post('/status-updates', statusController.createStatusUpdate);

// Mendapatkan riwayat status berdasarkan ID laporan
router.get('/reports/:reportId/status-history', statusController.getStatusHistoryByReportId);

// Mendapatkan semua status update (untuk Admin dan Dashboard)
router.get('/status-updates', checkRole(['Admin', 'Petugas']), statusController.getAllStatusUpdates);

// Mendapatkan statistik status (untuk Dashboard)
router.get('/status-statistics', checkRole(['Admin', 'Petugas']), statusController.getStatusStatistics);

module.exports = router;