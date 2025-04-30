import React from 'react';
import { Table, Tag, Skeleton, Card, Typography } from 'antd';
import { 
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const ActionList = ({ actions, loading }) => {
  const columns = [
    {
      title: 'ID Tindakan',
      dataIndex: 'action_id',
      key: 'action_id',
      width: 100,
    },
    {
      title: 'Deskripsi Tindakan',
      dataIndex: 'action_description',
      key: 'action_description',
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: 'Laporan Terkait',
      dataIndex: 'report',
      key: 'report',
      render: (report) => (
        <div>
          <div><strong>ID:</strong> {report?.report_id}</div>
          <Text ellipsis>{report?.description}</Text>
        </div>
      ),
    },
    {
      title: 'Status Laporan',
      dataIndex: 'report',
      key: 'report_status',
      width: 150,
      render: (report) => (
        <Tag 
          color={
            report?.status === 'Completed' ? 'green' : 
            report?.status === 'Cancel' ? 'red' : 'blue'
          }
          icon={report?.status === 'Completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {report?.status}
        </Tag>
      ),
    },
    {
      title: 'Waktu',
      dataIndex: 'performed_at',
      key: 'performed_at',
      width: 180,
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <Card className="action-card">
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={actions}
          rowKey="action_id"
          pagination={{ pageSize: 5 }}
          size="middle"
          scroll={{ x: true }}
        />
      )}
    </Card>
  );
};

export default ActionList;