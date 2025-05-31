import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import reportService from "../../services/reportService";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const statusColors = {
  Pending: "warning",
  "On-Going": "info",
  Completed: "success",
  Cancelled: "error",
};

const ReportManagementPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAllReports();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMenuClick = (event, reportId) => {
    setAnchorEl(event.currentTarget);
    setSelectedReportId(reportId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReportId(null);
  };

  const handleViewReport = () => {
    navigate(`/reports/${selectedReportId}`);
    handleMenuClose();
  };

  const handleAssignClick = () => {
    setSelectedAction("assign");
    setAssignDialogOpen(true);
    handleMenuClose();
  };

  const handleCancelClick = () => {
    setSelectedAction("cancel");
    setCancelDialogOpen(true);
    handleMenuClose();
  };

  const handleCompleteClick = () => {
    setSelectedAction("complete");
    setCompleteDialogOpen(true);
    handleMenuClose();
  };

  const handleAssignConfirm = async () => {
    try {
      // In a real app, you would select an officer first
      const officerId = "some-officer-id"; // This should come from a selection dialog
      await reportService.assignOfficer(selectedReportId, officerId);

      // Update local state
      setReports(
        reports.map((report) =>
          report.id === selectedReportId
            ? { ...report, status: "On-Going", assigned_to: officerId }
            : report
        )
      );

      setAssignDialogOpen(false);
    } catch (err) {
      console.error("Error assigning officer:", err);
      setError(err.message || "Failed to assign officer");
    }
  };

  const handleCancelConfirm = async () => {
    try {
      await reportService.cancelReport(selectedReportId);

      // Update local state
      setReports(
        reports.map((report) =>
          report.id === selectedReportId
            ? { ...report, status: "Cancelled" }
            : report
        )
      );

      setCancelDialogOpen(false);
    } catch (err) {
      console.error("Error cancelling report:", err);
      setError(err.message || "Failed to cancel report");
    }
  };

  const handleCompleteConfirm = async () => {
    try {
      await reportService.completeReport(selectedReportId);

      // Update local state
      setReports(
        reports.map((report) =>
          report.id === selectedReportId
            ? { ...report, status: "Completed" }
            : report
        )
      );

      setCompleteDialogOpen(false);
    } catch (err) {
      console.error("Error completing report:", err);
      setError(err.message || "Failed to complete report");
    }
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

 const filteredReports = reports
  .filter((report) => {
    const title = report.title?.toLowerCase() || "";
    const description = report.description?.toLowerCase() || "";
    const status = report.status?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      title.includes(search) ||
      description.includes(search) ||
      status.includes(search)
    );
  })
  .filter(
    (report) => statusFilter === "All" || report.status === statusFilter
  );


  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Report Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/reports/new")}
        >
          Create Report
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search reports..."
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search reports..."
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <TextField
          select
          label="Filter by Status"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="All">All Status</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="On-Going">On-Going</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.title}</TableCell>
                <TableCell>
                  {report.description.length > 50
                    ? `${report.description.substring(0, 50)}...`
                    : report.description}
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.status}
                    color={statusColors[report.status] || "default"}
                  />
                </TableCell>
                <TableCell>
                  {dayjs(report.created_at).format("DD MMM YYYY")}
                </TableCell>
                <TableCell>{report.assigned_to || "Not assigned"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    aria-controls={`report-menu-${report.id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, report.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        id={`report-menu-${selectedReportId}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewReport}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem
          onClick={handleAssignClick}
          disabled={
            reports.find((r) => r.id === selectedReportId)?.status !== "Pending"
          }
        >
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          Assign Officer
        </MenuItem>
        <MenuItem
          onClick={handleCancelClick}
          disabled={
            reports.find((r) => r.id === selectedReportId)?.status ===
              "Cancelled" ||
            reports.find((r) => r.id === selectedReportId)?.status ===
              "Completed"
          }
        >
          <ListItemIcon>
            <CancelIcon fontSize="small" />
          </ListItemIcon>
          Cancel Report
        </MenuItem>
        <MenuItem
          onClick={handleCompleteClick}
          disabled={
            reports.find((r) => r.id === selectedReportId)?.status !==
            "On-Going"
          }
        >
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          Mark as Complete
        </MenuItem>
      </Menu>

      {/* Assign Officer Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
      >
        <DialogTitle>Assign Officer</DialogTitle>
        <DialogContent>
          <Typography>Select an officer to assign to this report:</Typography>
          {/* In a real app, you would have a dropdown or list of officers here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAssignConfirm}
            color="primary"
            variant="contained"
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Report Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Report</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel this report?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Report Dialog */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
      >
        <DialogTitle>Complete Report</DialogTitle>
        <DialogContent>
          Are you sure you want to mark this report as completed?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>No</Button>
          <Button
            onClick={handleCompleteConfirm}
            color="success"
            variant="contained"
          >
            Yes, Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportManagementPage;
