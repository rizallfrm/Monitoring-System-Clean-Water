const express = require('express');
const router = express.Router();
const actionController = require('../controller/actionController');
const { verifyToken, checkRole } = require('../../../common/middleware/auth');

// Semua route memerlukan autentikasi
router.use(verifyToken);

// Membuat action baru
router.post('/actions', checkRole(['Admin', 'Petugas']), actionController.createAction);

// Mendapatkan semua action berdasarkan ID laporan
router.get('/reports/:reportId/actions', actionController.getActionsByReportId);

// Mendapatkan semua action (dengan filter untuk Admin/Petugas)
router.get('/actions', checkRole(['Admin', 'Petugas']), actionController.getAllActions);

// Mendapatkan detail action
router.get('/actions/:id', actionController.getActionById);

// Update action (hanya performer atau Admin)
router.put('/actions/:id', checkRole(['Admin', 'Petugas']), actionController.updateAction);

// Delete action (hanya Admin)
router.delete('/actions/:id', checkRole(['Admin', 'Petugas']), actionController.deleteAction);

module.exports = router; 