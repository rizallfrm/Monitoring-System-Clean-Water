// src/pages/CreateOfficerPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CreateOfficerForm from '../../pages/Admin/CreateOfficerForm';

const CreateOfficerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOfficerCreated = (newOfficer) => {
    navigate(`/officers`);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/officers')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">Create New Officer</Typography>
      </Box>

      <Card>
        <CardContent>
          <CreateOfficerForm
            open={true}
            onClose={() => navigate('/officers')}
            onOfficerCreated={handleOfficerCreated}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateOfficerPage;