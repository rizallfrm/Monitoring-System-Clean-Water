import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService, actionService, statusService } from '../services';
import { ReportList, ActionList, StatusStatistics, NewActionModal } from '../components/Officers';
import { Button, Tabs, Badge, message, Avatar } from 'antd';
import {
  FileDoneOutlined,
  SolutionOutlined,
  DashboardOutlined,
  PlusOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import '../components/Officers/styles/OfficerPage.css';

const { TabPane } = Tabs;

const OfficerPage = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [actions, setActions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState({
    reports: false,
    actions: false,
    stats: false
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchReports();
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (activeTab === 'actions' && reports.length > 0) {
      fetchActions();
    }
  }, [activeTab, reports]);

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUserProfile(response.data);
    } catch (error) {
      message.error('Gagal memuat profil pengguna');
    }
  };

  const fetchReports = async () => {
    setLoading(prev => ({ ...prev, reports: true }));
    try {
      const response = await reportService.getAllReports({ 
        assignedTo: userProfile?.user_id 
      });
      setReports(response.data.reports);
    } catch (error) {
      message.error('Gagal memuat laporan');
    } finally {
      setLoading(prev => ({ ...prev, reports: false }));
    }
  };

  const fetchActions = async () => {
    setLoading(prev => ({ ...prev, actions: true }));
    try {
      const response = await actionService.getAllActions({ 
        performedBy: userProfile?.user_id,
        limit: 10
      });
      setActions(response.data.actions);
    } catch (error) {
      message.error('Gagal memuat tindakan');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const fetchStatistics = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const response = await statusService.getStatusStatistics();
      setStatistics(response.data);
    } catch (error) {
      message.error('Gagal memuat statistik');
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const handleCompleteReport = async (reportId) => {
    try {
      await reportService.completeReport(reportId);
      message.success('Laporan berhasil diselesaikan');
      fetchReports();
      fetchStatistics();
    } catch (error) {
      message.error('Gagal menyelesaikan laporan');
    }
  };

  const handleAddAction = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleSubmitAction = async (values) => {
    try {
      await actionService.createAction({
        reportId: selectedReport.report_id,
        actionDescription: values.description
      });
      message.success('Tindakan berhasil ditambahkan');
      setModalVisible(false);
      fetchReports();
      fetchActions();
    } catch (error) {
      message.error('Gagal menambahkan tindakan');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="petugas-container">
      <header className="petugas-header">
        <div className="header-left">
          <h1 className="app-title">Layanan Pengaduan Masyarakat</h1>
          <p className="app-subtitle">Portal Petugas</p>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <Avatar 
              size="large" 
              style={{ backgroundColor: '#1890ff' }}
            >
              {userProfile?.name?.charAt(0)}
            </Avatar>
            <div className="user-info">
              <span className="user-name">{userProfile?.name}</span>
              <span className="user-role">Petugas</span>
            </div>
          </div>
          <Button 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            className="logout-btn"
          >
            Keluar
          </Button>
        </div>
      </header>

      <main className="petugas-content">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="petugas-tabs"
        >
          <TabPane
            tab={
              <span>
                <SolutionOutlined />
                Laporan Saya <Badge count={reports.length} />
              </span>
            }
            key="reports"
          >
            <ReportList 
              reports={reports} 
              loading={loading.reports}
              onComplete={handleCompleteReport}
              onAddAction={handleAddAction}
            />
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <FileDoneOutlined />
                Tindakan Saya <Badge count={actions.length} />
              </span>
            }
            key="actions"
          >
            <ActionList 
              actions={actions} 
              loading={loading.actions}
            />
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <DashboardOutlined />
                Dashboard
              </span>
            }
            key="dashboard"
          >
            <StatusStatistics 
              data={statistics} 
              loading={loading.stats}
            />
          </TabPane>
        </Tabs>
      </main>

      <NewActionModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmitAction}
        report={selectedReport}
      />
    </div>
  );
};

export default OfficerPage;