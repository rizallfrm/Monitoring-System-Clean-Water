import React from 'react';
import { Row, Col, Card, Statistic, Skeleton } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import { Pie } from '@ant-design/charts';

const StatusStatistics = ({ data, loading }) => {
  const pieData = [
    { type: 'Pending', value: data?.pending || 0 },
    { type: 'On-Going', value: data?.onGoing || 0 },
    { type: 'Completed', value: data?.completed || 0 },
    { type: 'Cancel', value: data?.cancelled || 0 },
  ];

  const config = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      content: '{name}\n{percentage}',
    },
    color: ['#FAAD14', '#1890FF', '#52C41A', '#FF4D4F'],
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  return (
    <div className="stats-container">
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <>
          <Row gutter={16} className="stats-summary">
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Laporan"
                  value={data?.total || 0}
                  prefix={<FileDoneOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Pending"
                  value={data?.pending || 0}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#FAAD14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="On-Going"
                  value={data?.onGoing || 0}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#1890FF' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={data?.completed || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52C41A' }}
                />
              </Card>
            </Col>
          </Row>
          
          <Card title="Distribusi Status Laporan" className="pie-card">
            <Pie {...config} height={300} />
          </Card>
        </>
      )}
    </div>
  );
};

export default StatusStatistics;