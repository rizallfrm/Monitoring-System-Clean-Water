import React from 'react';
import { Table, Tag, Button, Space, Skeleton, Card } from 'antd';
import { 
  CheckCircleOutlined, 
  PlusOutlined, 
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const statusColors = {
  'Pending': 'orange',
  'On-Going': 'blue',
  'Completed': 'green',
  'Cancel': 'red'
};

const statusIcons = {
  'Pending': <ClockCircleOutlined />,
  'On-Going': <ClockCircleOutlined />,
  'Completed': <CheckCircleOutlined />,
  'Cancel': <CloseCircleOutlined />
};

const ReportList = ({ reports, loading, onComplete, onAddAction }) => {
  const columns = [
    {
      title: 'ID Laporan',
      dataIndex: 'report_id',
      key: 'report_id',
      width: 100,
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Lokasi',
      dataIndex: 'location',
      key: 'location',
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Tag 
          icon={statusIcons[status]} 
          color={statusColors[status]}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="small"
            onClick={() => onAddAction(record)}
            disabled={record.status === 'Completed' || record.status === 'Cancel'}
          >
            Tindakan
          </Button>
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            size="small"
            onClick={() => onComplete(record.report_id)}
            disabled={record.status !== 'On-Going'}
          >
            Selesaikan
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card className="report-card">
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="report_id"
          pagination={{ pageSize: 5 }}
          size="middle"
          scroll={{ x: true }}
        />
      )}
    </Card>
  );
};

export default ReportList;