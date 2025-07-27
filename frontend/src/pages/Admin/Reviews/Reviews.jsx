/* eslint-disable no-unused-vars */
import { Table, Button, message, Popconfirm, Tag } from "antd";
import { useEffect, useState, useCallback } from "react";
import axios from "@/utils/axios";
import "./Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/reviews/pending"); // Onay bekleyen yorumlar
      setReviews(res.data || []);
    } catch (err) {
      message.error("Yorumlar alınamadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`/api/reviews/${id}/approve`);
      console.log("Onaylama başarılı:", res.data);
      message.success("Yorum onaylandı.");
      fetchReviews();
    } catch (err) {
      console.error("Onaylama hatası:", err.response || err.message);
      message.error("Onaylama başarısız.");
    }
  };
  

  const handleReject = async (id) => {
    try {
      await axios.patch(`/api/reviews/${id}/reject`);
      message.success("Yorum reddedildi.");
      fetchReviews();
    } catch (err) {
      message.error("Reddetme başarısız.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/reviews/${id}`);
      message.success("Yorum silindi.");
      fetchReviews();
    } catch (err) {
      message.error("Silme işlemi başarısız.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const columns = [
    {
      title: "Kullanıcı",
      dataIndex: "userId",
      key: "user",
      render: (user) => (
        <span>
          {user?.name} {user?.surname}
        </span>
      ),
    },
    {
      title: "Ürün",
      dataIndex: "productId",
      key: "product",
      render: (product) => <span>{product?.name}</span>,
    },
    {
      title: "Yorum",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "orange";
        let text = "Onay Bekliyor";

        if (status === "approved") {
          color = "green";
          text = "Onaylandı";
        } else if (status === "rejected") {
          color = "red";
          text = "Reddedildi";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <div className="action-buttons" style={{ display: "flex", gap: "6px" }}>
          <Button type="primary" onClick={() => handleApprove(record._id)} size="small">
            Onayla
          </Button>
          <Button onClick={() => handleReject(record._id)} size="small" danger>
            Reddet
          </Button>
          <Popconfirm
            title="Yorumu silmek istediğinize emin misiniz?"
            onConfirm={() => handleDelete(record._id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button size="small">Sil</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-reviews">
      <h2>Yorum Yönetimi</h2>
      <Table
        dataSource={reviews}
        columns={columns}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Reviews;
