const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { verifyToken, checkRole } = require('../../../common/middleware/auth');

// Routes publik
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes yang memerlukan autentikasi
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateUser);

// Routes untuk Admin
router.get('/users', verifyToken, checkRole(['Admin']), userController.getAllUsers);
router.get('/users/:id', verifyToken, checkRole(['Admin']), userController.getUserById);
router.put('/users/:id', verifyToken, checkRole(['Admin']), userController.updateUser);
router.delete('/users/:id', verifyToken, checkRole(['Admin']), userController.deleteUser);

// Khusus untuk mendapatkan daftar petugas
router.get('/officers', verifyToken, checkRole(['Admin']), userController.getOfficers);

module.exports = router;