import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Table, Tag, message, Button, Popconfirm } from "antd";
import "./CanceledOrders.css";

const CancelRequests = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  const fetchCancelRequests = async () => {
    try {
      const res = await axios.get("/api/orders/cancel-requests");
      setOrders(res?.data?.orders || []);
    } catch (err) {
      console.error(err);
      message.error("İptal talebi bekleyen siparişler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelRequests();
  }, []);

  const handleApproveCancel = async (orderId) => {
    setApproving(orderId);
    try {
      const res = await axios.post(`/api/orders/cancel-approve/${orderId}`);
      message.success(res?.data?.message || "Sipariş iptal edildi.");
      fetchCancelRequests();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "İptal işlemi başarısız.";
      message.error(msg);
    } finally {
      setApproving(null);
    }
  };

  const columns = [
    {
      title: "Sipariş No",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
    },
    {
      title: "Kullanıcı",
      dataIndex: "userId",
      key: "user",
      render: (user) => user?.name || "Anonim",
      ellipsis: true,
    },
    {
      title: "Tutar",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) =>
        typeof amount === "number" ? `₺${amount.toFixed(2)}` : "₺0.00",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case "hazırlanıyor":
            return <Tag color="blue">Hazırlanıyor</Tag>;
          case "kargoya verildi":
            return <Tag color="orange">Kargoya Verildi</Tag>;
          case "iptal edildi":
            return <Tag color="red">İptal Edildi</Tag>;
          default:
            return <Tag>{status}</Tag>;
        }
      },
    },
    {
      title: "İptal Talebi",
      dataIndex: "cancelRequest",
      key: "cancelRequest",
      render: (val) =>
        val ? <Tag color="warning">İptal Talebi Var</Tag> : "-",
    },
    {
      title: "Tarih",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("tr-TR"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) =>
        record.cancelRequest && record.status !== "iptal edildi" ? (
          <Popconfirm
            title="Bu siparişi iptal etmek istediğinize emin misiniz?"
            onConfirm={() => handleApproveCancel(record._id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              type="primary"
              danger
              loading={approving === record._id}
            >
              İptali Onayla
            </Button>
          </Popconfirm>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div className="canceled-orders-container">
      <h2 className="canceled-orders-title">İptal Talebi Bekleyen Siparişler</h2>
      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 7 }}
        className="canceled-orders-table"
        locale={{
          emptyText: "İptal talebi bekleyen sipariş bulunmamaktadır.",
        }}
      />
    </div>
  );
};

export default CancelRequests;
