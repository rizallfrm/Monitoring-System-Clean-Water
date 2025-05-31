import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Engineering as EngineeringIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { BarChart, PieChart } from "@mui/x-charts";
import statusService from "../../services/statusService";
import reportService from "../../services/reportService";
import userService from "../../services/userService";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Memulai pengambilan data dashboard...");

        const [statusStats, reports, users] = await Promise.all([
          statusService.getStatusStatistics(),
          reportService.getAllReports().catch((e) => {
            console.error("Error mengambil laporan:", e);
            return [];
          }),
          userService.getAllUsers().catch((e) => {
            console.error("Error mengambil pengguna:", e);
            return [];
          }),
        ]);

        console.log("Data yang diterima:", { statusStats, reports, users });

        const officerCount = users.filter(
          (user) => user.role === "Petugas"
        ).length;
        const userCount = users.filter((user) => user.role === "User").length;

        setStats({
          ...statusStats,
          officerCount,
          userCount,
          reportCount: reports.length,
        });
      } catch (err) {
        console.error("Error saat mengambil data dashboard:", {
          error: err,
          stack: err.stack,
        });
        setError(err.message || "Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Memuat dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        {error}
        <Box sx={{ mt: 1, fontSize: "0.8rem" }}>
          Silakan coba refresh halaman atau hubungi administrator.
        </Box>
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Total Reports
                  </Typography>
                  <Typography variant="h4">
                    {stats?.reportCount || 0}
                  </Typography>
                </div>
                <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4">{stats?.completed || 0}</Typography>
                </div>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Officers
                  </Typography>
                  <Typography variant="h4">
                    {stats?.officerCount || 0}
                  </Typography>
                </div>
                <EngineeringIcon color="action" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Users
                  </Typography>
                  <Typography variant="h4">{stats?.userCount || 0}</Typography>
                </div>
                <PeopleIcon color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Status Overview
              </Typography>
              <Box height={300}>
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: [
                        "Pending",
                        "Sedang Proses",
                        "Selesai",
                        "Dibatalkan",
                      ],
                    },
                  ]}
                  series={[
                    {
                      data: [
                        stats?.pending || 0,
                        stats?.onGoing || 0, // Sesuaikan dengan nama field
                        stats?.completed || 0,
                        stats?.cancelled || 0, // Sesuaikan dengan nama field
                      ],
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status Distribution
              </Typography>
              <Box height={300}>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: stats?.pending || 0, label: "Pending" },
                        {
                          id: 1,
                          value: stats?.onGoing || 0,
                          label: "Sedang Proses",
                        },
                        {
                          id: 2,
                          value: stats?.completed || 0,
                          label: "Selesai",
                        },
                        {
                          id: 3,
                          value: stats?.cancelled || 0,
                          label: "Dibatalkan",
                        },
                      ],
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
