import React, { useState, useEffect } from 'react';
import  actionService  from '../../services/actionService'; // Sesuaikan dengan path yang benar

const ActionList = ({ reportId }) => {
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const loadActionsForReport = async (reportId) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await actionService.getActionsByReportId(reportId);
    
    if (response.status === "success" && Array.isArray(response.data)) {
      // Format data sesuai response Postman
      const formattedActions = response.data.map(action => ({
        ...action,
        performed: action.performer // Ubah performer menjadi performed
      }));
      
      setActions(formattedActions);
      setSelectedReportId(reportId);
    } else {
      throw new Error(response.message || "Format data tidak valid");
    }
  } catch (error) {
    console.error("Error loading actions:", error);
    setError(error.message || "Gagal memuat tindakan");
    setActions([]);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (reportId) {
      loadActionsForReport(reportId);
    }
  }, [reportId]);

  if (isLoading) {
    return <div className="loading-spinner">Memuat data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!actions.length) {
    return <div className="no-data">Tidak ada data tindakan untuk laporan ini</div>;
  }

  return (
    <div className="report-actions-container">
      <h3>Tindakan untuk Laporan #{selectedReportId}</h3>
      <div className="actions-list">
        {actions.map((action) => (
          <div key={action.action_id} className="action-card">
            <div className="action-header">
              <span className="action-id">ID: {action.action_id}</span>
              <span className="action-date">
                {new Date(action.performed_at).toLocaleString()}
              </span>
            </div>
            <div className="action-description">
              <strong>Deskripsi:</strong> {action.action_description}
            </div>
         <div className="action-performed-by">
  <strong>Dilakukan oleh:</strong> 
  {action.performer?.name || action.performed?.name || 'Tidak diketahui'} 
  ({action.performer?.role || action.performed?.role || 'Tidak diketahui'})
</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionList;