import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { TextArea } from 'antd/lib/input/TextArea';

const NewActionModal = ({ visible, onCancel, onSubmit, report }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        onSubmit(values);
        form.resetFields();
      })
      .catch(info => {
        message.error('Harap isi deskripsi tindakan');
      });
  };

  return (
    <Modal
      title={`Tambah Tindakan - Laporan #${report?.report_id}`}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Batal
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Simpan Tindakan
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="description"
          label="Deskripsi Tindakan"
          rules={[{ required: true, message: 'Harap isi deskripsi tindakan' }]}
        >
          <TextArea rows={4} placeholder="Deskripsikan tindakan yang telah dilakukan..." />
        </Form.Item>
        <div className="report-info">
          <p><strong>Deskripsi Laporan:</strong> {report?.description}</p>
          <p><strong>Lokasi:</strong> {report?.location}</p>
          <p><strong>Status:</strong> {report?.status}</p>
        </div>
      </Form>
    </Modal>
  );
};

export default NewActionModal;