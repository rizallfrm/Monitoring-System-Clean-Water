require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("../../common/models");
const userRoutes = require("./routes/userRouter");

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 3001;

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
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/users", userRoutes);

// Pengecekan health
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "User Service",
    status: "UP",
    timestamp: new Date(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan internal server",
    error: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// Memulai server
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`User Service berjalan di port ${PORT}`);

    try {
      await sequelize.authenticate();
      console.log("Koneksi database berhasil");
    } catch (error) {
      console.error("Tidak dapat terhubung ke database:", error);
    }
  });
}

module.exports = app;
