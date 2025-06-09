require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router dari masing-masing service
const userRouter = require("./services/user-services/routes/userRouter");
const reportRouter = require("./services/report-service/routes/reportRouter");
const statusRouter = require("./services/status-service/routes/statusRouter");
const actionRouter = require("./services/action-service/routes/actionRouter");

// Mount semua route
app.use("/api/users", userRouter);
app.use("/api/reports", reportRouter);
app.use("/api/status", statusRouter);
app.use("/api/actions", actionRouter);

// Port utama (Railway akan inject process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
