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
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  ListItemIcon,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";

const OfficerManagementPage = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        const data = await userService.getOfficers();
        setOfficers(data.officers || []);
        console.log("Fetched officers:", data);
      } catch (err) {
        console.error("Error fetching officers:", err);
        setError(err.message || "Failed to load officers");
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMenuClick = (event, officerId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOfficerId(officerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOfficerId(null);
  };

  const handleViewOfficer = () => {
    navigate(`/users/${selectedOfficerId}`);
    handleMenuClose();
  };

  const handleEditOfficer = () => {
    // Implement edit functionality
    handleMenuClose();
  };

  const handleAddOfficer = async () => {
    try {
      setLoading(true);
      // Ini adalah contoh - Anda perlu membuat form untuk input data petugas baru
      const newOfficerData = {
        name: "New Officer",
        email: `officer${Math.floor(Math.random() * 1000)}@example.com`,
        password: "password123",
        role: "Petugas",
        phone: "08123456789",
        active: true,
      };

      const response = await userService.createUser(newOfficerData);
      setOfficers([...officers, response]);
    } catch (err) {
      console.error("Error adding officer:", err);
      setError(err.message || "Failed to add officer");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    const officer = officers.find((o) => o.id === selectedOfficerId);
    setOfficerToDelete(officer);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(officerToDelete.id);
      setOfficers(
        officers.filter((officer) => officer.id !== officerToDelete.id)
      );
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Error deleting officer:", err);
      setError(err.message || "Failed to delete officer");
    }
  };

  const filteredOfficers = officers.filter(
    (officer) =>
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Typography variant="h4">Officer Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => navigate("/officers/new")}
          disabled={loading} // Tambahkan disabled state saat loading
        >
          {loading ? "Adding..." : "Add Officer"}
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search officers..."
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Officer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Assigned Reports</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOfficers.map((officer) => (
              <TableRow key={officer.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2 }}>
                      {officer.name.charAt(0).toUpperCase()}
                    </Avatar>
                    {officer.name}
                  </Box>
                </TableCell>
                <TableCell>{officer.email}</TableCell>
                <TableCell>
                  <Chip
                    label={officer.assigned_reports_count || 0}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={officer.active ? "Active" : "Inactive"}
                    color={officer.active ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    aria-controls={`officer-menu-${officer.id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, officer.id)}
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
        id={`officer-menu-${selectedOfficerId}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewOfficer}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditOfficer}>
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
          <DialogContentText>
            Are you sure you want to delete officer {officerToDelete?.name}?
            This action cannot be undone.
          </DialogContentText>
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

export default OfficerManagementPage;
