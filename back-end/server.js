require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Buat instance Express untuk masing-masing service
const userService = express();
const reportService = express();
const statusService = express();
const actionService = express();

// Terapkan middleware ke masing-masing service
[userService, reportService, statusService, actionService].forEach(service => {
  service.use(cors());
  service.use(express.json());
  service.use(express.urlencoded({ extended: true }));
});

// Import router untuk masing-masing service
const userRouter = require("./services/user-services/app");
const reportRouter = require("./services/report-service/app");
const statusRouter = require("./services/status-service/app");
const actionRouter = require("./services/action-service/app");

// Pasang router ke masing-masing service
userService.use("/", userRouter);
reportService.use("/", reportRouter);
statusService.use("/", statusRouter);
actionService.use("/", actionRouter);

// Port untuk masing-masing service
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT || 3001;
const REPORT_SERVICE_PORT = process.env.REPORT_SERVICE_PORT || 3002;
const STATUS_SERVICE_PORT = process.env.STATUS_SERVICE_PORT || 3003;
const ACTION_SERVICE_PORT = process.env.ACTION_SERVICE_PORT || 3004;

// Jalankan semua service
userService.listen(USER_SERVICE_PORT, () => {
  console.log(`User Service berjalan di port ${USER_SERVICE_PORT}`);
});

reportService.listen(REPORT_SERVICE_PORT, () => {
  console.log(`Report Service berjalan di port ${REPORT_SERVICE_PORT}`);
});

statusService.listen(STATUS_SERVICE_PORT, () => {
  console.log(`Status Service berjalan di port ${STATUS_SERVICE_PORT}`);
});

actionService.listen(ACTION_SERVICE_PORT, () => {
  console.log(`Action Service berjalan di port ${ACTION_SERVICE_PORT}`);
});

console.log("Semua microservice telah dijalankan!");
console.log(`
Layanan yang tersedia:
- User Service: http://localhost:${USER_SERVICE_PORT}
- Report Service: http://localhost:${REPORT_SERVICE_PORT}
- Status Service: http://localhost:${STATUS_SERVICE_PORT}
- Action Service: http://localhost:${ACTION_SERVICE_PORT}
`);