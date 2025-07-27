import { Button, Popconfirm, Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import axios from "@/utils/axios"; // axios instance

const AdminUserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Soyadı",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "E-Mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefon No",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      render: (_, record) => (
        <Popconfirm
          title="Kullanıcıyı Sil"
          description="Kullanıcıyı silmek istediğinizden emin misiniz?"
          okText="Evet"
          cancelText="Hayır"
          onConfirm={() => deleteUser(record.email)}
        >
          <Button type="primary" danger>
            Sil
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users");
      setDataSource(response.data || []);
    } catch (error) {
      console.error("Kullanıcıları getirme hatası:", error);
      message.error("Kullanıcıları getirirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = async (userEmail) => {
    try {
      await axios.delete(`/api/users/${userEmail}`);
      message.success("Kullanıcı başarıyla silindi.");
      fetchUsers(); // Listeyi güncelle
    } catch (error) {
      console.error("Silme hatası:", error);
      message.error("Kullanıcı silinirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(record) => record._id}
      loading={loading}
    />
  );
};

export default AdminUserPage;
