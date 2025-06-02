const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportController");
const { verifyToken, checkRole } = require("../../../common/middleware/auth");

// Semua route memerlukan autentikasi
router.use(verifyToken);
// Membuat laporan baru (semua role bisa) - dengan upload middleware
router.post(
  "/reports",
  reportController.createReport[0], // upload middleware
  reportController.createReport[1], // uploadToImageKit middleware
  reportController.createReport[2] // handler utama
);

// Membuat laporan baru (semua role bisa)
router.post("/reports", reportController.createReport);

// Mendapatkan semua laporan (dengan filter berdasarkan role)
router.get("/reports", reportController.getAllReports);

// Mendapatkan detail laporan
router.get("/reports/:id", reportController.getReportById);

// Update laporan (hanya pemilik laporan, petugas yang ditugaskan, atau Admin)
router.put("/reports/:id", reportController.updateReport);

// Assign petugas ke laporan (hanya Admin)
router.post(
  "/reports/:id/assign",
  checkRole(["Admin"]),
  reportController.assignOfficer
);
// Mendapatkan laporan yang ditugaskan ke petugas tertentu
router.get("/reports/officer/:officerId", reportController.getReportsByOfficer);

// Membatalkan laporan (pemilik laporan atau Admin)
router.post("/reports/:id/cancel", reportController.cancelReport);

// Menyelesaikan laporan (petugas yang ditugaskan atau Admin)
router.post("/reports/:id/complete", reportController.completeReport);

module.exports = router;
