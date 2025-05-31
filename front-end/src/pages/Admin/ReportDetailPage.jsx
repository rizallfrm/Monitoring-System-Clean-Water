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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import reportService from '../../services/reportService';
import statusService from '../../services/statusService';
import dayjs from 'dayjs';

const statusColors = {
  Pending: 'warning',
  'On-Going': 'info',
  Completed: 'success',
  Cancelled: 'error',
};

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true);
        const [reportData, history] = await Promise.all([
          reportService.getReportById(id),
          statusService.getAllStatusUpdates({ reportId: id }),
        ]);
        
        setReport(reportData);
        setStatusHistory(history);
      } catch (err) {
        console.error('Error fetching report details:', err);
        setError(err.message || 'Failed to load report details');
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate('/reports');
  };

  const handleAssignOfficer = async () => {
    try {
      // In a real app, you would select an officer first
      const officerId = 'some-officer-id';
      await reportService.assignOfficer(id, officerId);
      
      // Refresh data
      const [updatedReport, updatedHistory] = await Promise.all([
        reportService.getReportById(id),
        statusService.getAllStatusUpdates({ reportId: id }),
      ]);
      
      setReport(updatedReport);
      setStatusHistory(updatedHistory);
    } catch (err) {
      console.error('Error assigning officer:', err);
      setError(err.message || 'Failed to assign officer');
    }
  };

  const handleCancelReport = async () => {
    try {
      await reportService.cancelReport(id);
      
      // Refresh data
      const [updatedReport, updatedHistory] = await Promise.all([
        reportService.getReportById(id),
        statusService.getAllStatusUpdates({ reportId: id }),
      ]);
      
      setReport(updatedReport);
      setStatusHistory(updatedHistory);
    } catch (err) {
      console.error('Error cancelling report:', err);
      setError(err.message || 'Failed to cancel report');
    }
  };

  const handleCompleteReport = async () => {
    try {
      await reportService.completeReport(id);
      
      // Refresh data
      const [updatedReport, updatedHistory] = await Promise.all([
        reportService.getReportById(id),
        statusService.getAllStatusUpdates({ reportId: id }),
      ]);
      
      setReport(updatedReport);
      setStatusHistory(updatedHistory);
    } catch (err) {
      console.error('Error completing report:', err);
      setError(err.message || 'Failed to complete report');
    }
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

  if (!report) {
    return <Alert severity="warning">Report not found</Alert>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBackClick} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Report Details</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">{report.title}</Typography>
                <Chip
                  label={report.status}
                  color={statusColors[report.status] || 'default'}
                  size="medium"
                />
              </Box>

              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Created: {dayjs(report.created_at).format('DD MMM YYYY HH:mm')}
              </Typography>

              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                {report.description}
              </Typography>

              {report.location && (
                <Typography variant="body2" color="textSecondary" paragraph>
                  Location: {report.location}
                </Typography>
              )}

              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                <Box display="flex" gap={2}>
                  {report.status === 'Pending' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AssignmentIcon />}
                      onClick={handleAssignOfficer}
                    >
                      Assign Officer
                    </Button>
                  )}
                  {report.status === 'On-Going' && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={handleCompleteReport}
                    >
                      Mark as Complete
                    </Button>
                  )}
                  {report.status !== 'Cancelled' && report.status !== 'Completed' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelReport}
                    >
                      Cancel Report
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status History
              </Typography>
              <List>
                {statusHistory.length > 0 ? (
                  statusHistory.map((status, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center">
                              <Chip
                                label={status.status}
                                color={statusColors[status.status] || 'default'}
                                size="small"
                                sx={{ mr: 2 }}
                              />
                              <Typography variant="body2">
                                {dayjs(status.created_at).format('DD MMM YYYY HH:mm')}
                              </Typography>
                            </Box>
                          }
                          secondary={`Updated by: ${status.updated_by_name || 'System'}`}
                        />
                      </ListItem>
                      {index < statusHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No status history available
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportDetailPage;