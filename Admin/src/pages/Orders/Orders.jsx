/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { Pagination } from "antd";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const pageSize = 5;

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/orders?page=${page}&limit=${pageSize}`, {
        withCredentials: true,
      });
      // Backend'den beklenen response: { orders: [...], totalCount: number }

      setOrders(res.data.orders || res.data);
      setTotalOrders(res.data.totalCount || 0);
    } catch (err) {
      setError("Siparişler alınamadı");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchOrders(currentPage); // Güncellemeden sonra aynı sayfayı yenile
    } catch (err) {
      alert("Durum güncellenemedi: " + (err.message || "Bilinmeyen hata"));
    }
  };

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
        return status;
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page);
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, []);

  return (
    <div className="orders-container">
      <h2>Admin Siparişler</h2>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p>Sipariş bulunmamaktadır.</p>
      )}

      {orders.map((order) => (
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
              <strong>Ödeme Durumu:</strong>{" "}
              {order.paymentStatus === "completed"
                ? "✅ Ödendi"
                : "❌ Ödeme Bekleniyor"}
            </p>
            <p>
              <strong>Ödeme Yöntemi:</strong>{" "}
              {order.paymentMethod?.replace("_", " ").toUpperCase()}
            </p>
            <p>
              <strong>Satış Sözleşmesi:</strong>{" "}
              {order.agreementAccepted
                ? "✅ Kabul Edildi"
                : "❌ Kabul Edilmedi"}
            </p>
          </div>

          <div className="order-address">
            <h4>Adres Bilgileri</h4>
            <p>{order.address.addressDetail}</p>
            <p>
              {order.address.district}, {order.address.province} -{" "}
              {order.address.postalCode}
            </p>
          </div>

          <div className="products-list">
            <h4>Ürünler</h4>
            {order.products.map((item, idx) => {
              // Eğer productId doluysa içinden name ve images al, değilse item üstünden kullan
              const name = item.productId?.name || item.name || "Ürün Bilgisi Yok";
              const image =
                item.productId?.images?.[0] ||
                item.image ||
                "https://via.placeholder.com/80";

              return (
                <div key={item.productId?._id || idx} className="product-item">
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
                      <strong>Toplam:</strong> ₺{(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.color && (
                      <p>
                        <strong>Renk:</strong> {item.color}
                      </p>
                    )}
                    {item.size && (
                      <p>
                        <strong>Beden:</strong> {item.size}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="status-buttons">
            {order.status === "hazırlanıyor" && (
              <button
                onClick={() =>
                  updateStatus(order._id || order.id, "kargoya verildi")
                }
              >
                Kargoya Ver
              </button>
            )}
            {order.status === "kargoya verildi" && (
              <button
                onClick={() =>
                  updateStatus(order._id || order.id, "teslim edildi")
                }
              >
                Teslim Edildi Olarak İşaretle
              </button>
            )}
            {order.status === "teslim edildi" && (
              <button disabled>Teslim Edildi</button>
            )}
            {order.status === "iptal edildi" && (
              <button disabled>İptal Edildi</button>
            )}
          </div>
        </div>
      ))}

      {totalOrders > pageSize && (
        <div
          className="pagination-wrapper"
          style={{ marginTop: 20, textAlign: "center" }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalOrders}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
