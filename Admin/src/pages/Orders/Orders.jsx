/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Tabs, Spin, message, Select, Button } from "antd";
import api from "@/utils/axios";
import "./Orders.css";

const { TabPane } = Tabs;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/orders", { withCredentials: true });
      setOrders(res.data.orders || res.data);
    } catch (err) {
      message.error("Siparişler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ PUT metoduna göre düzenlendi
  const updateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await api.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      message.success(res.data.message || "Sipariş durumu güncellendi 🎉");
      fetchOrders();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.message || "Durum güncellenirken hata oluştu."
      );
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = (status) =>
    status === "all"
      ? orders
      : orders.filter((order) => order.status === status);

  return (
    <div className="orders-container">
      <h2>Admin Sipariş Yönetimi</h2>

      {loading ? (
        <div style={{ textAlign: "center", margin: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Tabs defaultActiveKey="all">
          <TabPane tab="Tüm Siparişler" key="all">
            <OrdersList
              orders={filteredOrders("all")}
              updateStatus={updateStatus}
              updating={updating}
            />
          </TabPane>
          <TabPane tab="Hazırlanıyor" key="hazırlanıyor">
            <OrdersList
              orders={filteredOrders("hazırlanıyor")}
              updateStatus={updateStatus}
              updating={updating}
            />
          </TabPane>
          <TabPane tab="Kargoya Verildi" key="kargoya verildi">
            <OrdersList
              orders={filteredOrders("kargoya verildi")}
              updateStatus={updateStatus}
              updating={updating}
            />
          </TabPane>
          <TabPane tab="Teslim Edildi" key="teslim edildi">
            <OrdersList
              orders={filteredOrders("teslim edildi")}
              updateStatus={updateStatus}
              updating={updating}
            />
          </TabPane>
          <TabPane tab="İptal Edilenler" key="iptal edildi">
            <OrdersList
              orders={filteredOrders("iptal edildi")}
              updateStatus={updateStatus}
              updating={updating}
            />
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

// 🔹 Sipariş kartlarını listeleyen component
const OrdersList = ({ orders, updateStatus, updating }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case "hazırlanıyor":
        return "📦 Hazırlanıyor";
      case "kargoya verildi":
        return "🚚 Kargoya Verildi";
      case "teslim edildi":
        return "✅ Teslim Edildi";
      case "iptal edildi":
        return "❌ İptal Edildi";
      default:
        return "🕓 Beklemede";
    }
  };

  if (!orders || orders.length === 0)
    return <p>Sipariş bulunmamaktadır.</p>;

  return orders.map((order) => (
    <div key={order._id || order.id} className="order-card">
      <div className="order-header">
        <p>
          <strong>Sipariş ID:</strong> {order._id || order.id}
        </p>
        <p>
          <strong>Tarih:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Toplam:</strong> ₺{order.totalAmount.toFixed(2)}
        </p>
        <p>
          <strong>Durum:</strong> {getStatusLabel(order.status)}
        </p>
        <p>
          <strong>Ödeme:</strong>{" "}
          {order.paymentStatus === "completed"
            ? "✅ Ödendi"
            : "❌ Beklemede"}
        </p>
      </div>

      {/* 🔹 Ürünler */}
      <div className="products-list">
        <h4>Ürünler</h4>
        {order.products.map((item, idx) => {
          const name = item.productId?.name || item.name || "Ürün Bilgisi Yok";
          const image =
            item.productId?.images?.[0] ||
            item.image ||
            "https://via.placeholder.com/80";

          return (
            <div key={idx} className="product-item">
              <img src={image} alt={name} className="product-image" />
              <div className="product-info">
                <p>
                  <strong>Ürün:</strong> {name}
                </p>
                <p>
                  <strong>Adet:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Birim Fiyat:</strong> ₺{item.price.toFixed(2)}
                </p>
                <p>
                  <strong>Toplam:</strong> ₺
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔹 Durum Güncelleme Alanı */}
      <div className="order-update">
        <Select
          defaultValue={order.status}
          style={{ width: 180, marginRight: 10 }}
          onChange={(value) => updateStatus(order._id, value)}
          disabled={updating}
        >
          <Option value="hazırlanıyor">Hazırlanıyor</Option>
          <Option value="kargoya verildi">Kargoya Verildi</Option>
          <Option value="teslim edildi">Teslim Edildi</Option>
          <Option value="iptal edildi">İptal Edildi</Option>
        </Select>
        <Button
          type="primary"
          loading={updating}
          onClick={() => message.info("Durum güncellemesi kaydedildi.")}
        >
          Güncelle
        </Button>
      </div>
    </div>
  ));
};

export default Orders;
