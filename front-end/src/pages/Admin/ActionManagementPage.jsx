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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Chip,
  ListItemIcon,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import actionService from "../../services/actionService";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import reportService from "../../services/reportService";

const actionStatusColors = {
  Pending: "warning",
  Completed: "success",
  Failed: "error",
};

const ActionManagementPage = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newAction, setNewAction] = useState({
    reportId: "",
    actionDescription: "",
    status: "Pending",
  });
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  // Fungsi untuk membuka modal
  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewAction({
      reportId: "",
      actionDescription: "",
      status: "Pending",
    });
  };

  // Handle perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmitAction = async () => {
    try {
      setLoading(true);
      const response = await actionService.createAction({
        reportId: newAction.reportId,
        actionDescription: newAction.actionDescription,
      });

      // Tambahkan action baru ke state
      setActions((prev) => [response.data, ...prev]);

      // Tutup modal dan reset form
      handleCloseAddModal();
    } catch (error) {
      console.error("Error creating action:", error);
      setError(error.message || "Failed to create action");
    } finally {
      setLoading(false);
    }
  };
  // Ambil data laporan untuk dropdown
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportService.getAllReports();
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        const response = await actionService.getAllActions();
        setActions(response.data.actions); // Ambil array-nya saja
      } catch (err) {
        console.error("Error fetching actions:", err);
        setError(err.message || "Failed to load actions");
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleMenuClick = (event, actionId) => {
    setAnchorEl(event.currentTarget);
    setSelectedActionId(actionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedActionId(null);
  };

  const handleViewAction = () => {
    navigate(`/actions/${selectedActionId}`);
    handleMenuClose();
  };

  const handleEditAction = () => {
    // Implement edit functionality
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    const action = actions.find((a) => a.id === selectedActionId);
    setActionToDelete(action);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await actionService.deleteAction(actionToDelete.id);
      setActions(actions.filter((action) => action.id !== actionToDelete.id));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Error deleting action:", err);
      setError(err.message || "Failed to delete action");
    }
  };

  const filteredActions = actions
    .filter(
      (action) =>
        action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (action.report_title &&
          action.report_title.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(
      (action) => statusFilter === "All" || action.status === statusFilter
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
        <Typography variant="h4">Action Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal} // Ubah ini untuk membuka modal
        >
          Add Action
        </Button>
      </Box>

      {/* Modal untuk menambahkan action baru */}
      <Dialog
        open={openAddModal}
        onClose={handleCloseAddModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tambah Tindakan Baru</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Pilih Laporan</InputLabel>
              <Select
                name="reportId"
                value={newAction.reportId}
                onChange={handleInputChange}
                label="Pilih Laporan"
                required
              >
                {Array.isArray(reports) &&
                  reports.map((report) => (
                    <MenuItem key={report.id} value={report.id}>
                      {report.title} - {report.status}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Deskripsi Tindakan"
              name="actionDescription"
              value={newAction.actionDescription}
              onChange={handleInputChange}
              multiline
              rows={4}
              required
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Batal</Button>
          <Button
            onClick={handleSubmitAction}
            color="primary"
            variant="contained"
            disabled={!newAction.reportId || !newAction.actionDescription}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search actions..."
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
          placeholder="Search actions..."
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
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Failed">Failed</MenuItem>
        </TextField>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Officer</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActions.map((action) => (
              <TableRow key={action.id}>
                <TableCell>
                  {action.report_title || "No associated report"}
                </TableCell>
                <TableCell>
                  {action.description.length > 50
                    ? `${action.description.substring(0, 50)}...`
                    : action.description}
                </TableCell>
                <TableCell>
                  <Chip
                    label={action.status}
                    color={actionStatusColors[action.status] || "default"}
                  />
                </TableCell>
                <TableCell>
                  {dayjs(action.created_at).format("DD MMM YYYY")}
                </TableCell>
                <TableCell>{action.officer_name || "Not assigned"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    aria-controls={`action-menu-${action.id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, action.id)}
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
        id={`action-menu-${selectedActionId}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewAction}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditAction}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this action?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActionManagementPage;
