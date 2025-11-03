/* eslint-disable no-unused-vars */
// src/pages/Coupon/CouponPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios"; // ✅ Axios instance kullanıyoruz

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/coupons");
      setCoupons(res.data.coupons || []);
    } catch (err) {
      message.error("Kuponlar alınamadı");
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await api.delete(`/api/coupons/${id}`);
      message.success("Kupon başarıyla silindi");
      fetchCoupons();
    } catch (err) {
      message.error("Kupon silinemedi");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const columns = [
    {
      title: "Kupon Kodu",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "İndirim (%)",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (date) => new Date(date).toLocaleDateString("tr-TR"),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => navigate(`/admin/coupons/update/${record._id}`)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Bu kuponu silmek istiyor musun?"
            onConfirm={() => deleteCoupon(record._id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button danger>Sil</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Kupon Listesi</h2>
      <Table
        dataSource={coupons}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default CouponPage;
