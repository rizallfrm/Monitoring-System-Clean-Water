import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import userService from '../../services/userService';
import reportService from '../../services/reportService';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userData, userReports] = await Promise.all([
          userService.getUserById(id),
          reportService.getAllReports({ userId: id }),
        ]);
        
        setUser(userData);
        setEditedUser(userData);
        setReports(userReports);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleBackClick = () => {
    navigate('/users');
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedUser(user);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateUser(id, editedUser);
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(id);
      navigate('/users');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!user) {
    return <Alert severity="warning">User not found</Alert>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBackClick} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">User Details</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                {!editMode ? (
                  <Typography variant="h5">{user.name}</Typography>
                ) : (
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={editedUser.name || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                )}
                <Chip
                  label={user.role}
                  color={user.role === 'Admin' ? 'primary' : 'default'}
                  sx={{ mt: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <List>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={
                      !editMode ? (
                        user.email
                      ) : (
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={editedUser.email || ''}
                          onChange={handleInputChange}
                        />
                      )
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Phone"
                    secondary={
                      !editMode ? (
                        user.phone || '-'
                      ) : (
                        <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={editedUser.phone || ''}
                          onChange={handleInputChange}
                        />
                      )
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={
                      !editMode ? (
                        <Chip
                          label={user.active ? 'Active' : 'Inactive'}
                          color={user.active ? 'success' : 'error'}
                          size="small"
                        />
                      ) : (
                        <TextField
                          select
                          fullWidth
                          label="Status"
                          name="active"
                          value={editedUser.active ? 'true' : 'false'}
                          onChange={(e) => 
                            setEditedUser(prev => ({ ...prev, active: e.target.value === 'true' }))
                          }
                          SelectProps={{ native: true }}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </TextField>
                      )
                    }
                  />
                </ListItem>
              </List>

              <Box mt={3} display="flex" justifyContent="space-between">
                {!editMode ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={handleEditClick}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Reports" />
                <Tab label="Activity" />
                {user.role === 'Petugas' && <Tab label="Assigned Tasks" />}
              </Tabs>

              <Box sx={{ pt: 3 }}>
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Submitted Reports ({reports.length})
                    </Typography>
                    {reports.length > 0 ? (
                      <List>
                        {reports.map((report) => (
                          <ListItem key={report.id} divider>
                            <ListItemText
                              primary={report.title}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2">
                                    {report.status}
                                  </Typography>
                                  {' — '}
                                  {new Date(report.created_at).toLocaleDateString()}
                                </>
                              }
                            />
                            <Button
                              size="small"
                              onClick={() => navigate(`/reports/${report.id}`)}
                            >
                              View
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No reports submitted by this user.
                      </Typography>
                    )}
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Activity log will be displayed here.
                    </Typography>
                  </Box>
                )}

                {tabValue === 2 && user.role === 'Petugas' && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Assigned Tasks
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Assigned tasks will be displayed here.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetailPage;