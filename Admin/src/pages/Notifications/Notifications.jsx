import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Form, Select, message, Tag, Space } from "antd";
import axios from "../../utils/axios";

const { TextArea } = Input;
const { Option } = Select;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();

  // Bildirimleri çek
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/notifications", { withCredentials: true });
      setNotifications(res.data);
    } catch (err) {
      message.error("Bildirimler yüklenemedi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcıları çek (toplu gönderim için)
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users", { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  // Bildirim okundu olarak işaretle
  const markAsRead = async (id) => {
    try {
      await axios.post(`/api/notifications/${id}/read`, {}, { withCredentials: true });
      message.success("Bildirim okundu olarak işaretlendi.");
      fetchNotifications();
    } catch (err) {
      message.error("Hata oluştu.");
      console.error(err);
    }
  };

  // Yeni bildirim gönder
  const handleSend = async (values) => {
    try {
      await axios.post(
        "/api/notifications/send",
        {
          message: values.message,
          userIds: values.users,
        },
        { withCredentials: true }
      );
      message.success("Bildirim gönderildi!");
      setModalVisible(false);
      form.resetFields();
      fetchNotifications();
    } catch (err) {
      message.error("Gönderim sırasında hata oluştu.");
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Mesaj",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Tür",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color={type === "system" ? "blue" : "green"}>{type}</Tag>,
    },
    {
      title: "Durum",
      dataIndex: "read",
      key: "read",
      render: (read) => <Tag color={read ? "green" : "red"}>{read ? "Okundu" : "Okunmadı"}</Tag>,
    },
    {
      title: "Tarih",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Space>
          {!record.read && (
            <Button size="small" onClick={() => markAsRead(record._id)}>
              Okundu Olarak İşaretle
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => setModalVisible(true)}>
        Yeni Bildirim Gönder
      </Button>

      <Table
        rowKey="_id"
        dataSource={notifications}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Yeni Bildirim Gönder"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSend}>
          <Form.Item
            label="Mesaj"
            name="message"
            rules={[{ required: true, message: "Lütfen mesaj yazın!" }]}
          >
            <TextArea rows={4} placeholder="Mesajınızı yazın..." />
          </Form.Item>

          <Form.Item label="Kullanıcılar (boş bırakılırsa tüm kullanıcılar)">
            <Select mode="multiple" placeholder="Seçmek için kullanıcıları seçin" allowClear>
              {users.map((u) => (
                <Option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Gönder
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Notifications;
