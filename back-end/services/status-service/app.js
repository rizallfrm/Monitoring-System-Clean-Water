require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('../../common/models');
const statusRoutes = require('./routes/statusRouter');

const app = express();
const PORT = process.env.STATUS_SERVICE_PORT || 3003;

// Middleware
const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/status', statusRoutes);

// Pengecekan health
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'Status Service',
    status: 'UP',
    timestamp: new Date()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan internal server',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Memulai server
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`Status Service berjalan di port ${PORT}`);
    
    try {
      await sequelize.authenticate();
      console.log('Koneksi database berhasil');
    } catch (error) {
      console.error('Tidak dapat terhubung ke database:', error);
    }
  });
}

module.exports = app;