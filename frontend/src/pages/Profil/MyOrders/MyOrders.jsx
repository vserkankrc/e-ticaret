/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import ReviewForm from "../../../components/Reviews/ReviewFrom";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchOrders = async (pageNum = 1) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await api.get(`/api/orders/myorders?page=${pageNum}&limit=${limit}`, {
        withCredentials: true,
      });

      setOrders(data.orders || []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setErrorMsg("Siparişler alınamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "hazırlanıyor":
        return "📦 Sipariş Hazırlanıyor";
      case "kargoya verildi":
        return "🚚 Kargoya Verildi";
      case "teslim edildi":
        return "✅ Sipariş Teslim Edildi";
      case "iptal edildi":
        return "❌ Sipariş İptal Edildi";
      default:
        return status;
    }
  };

  const handleReviewSubmit = (productId, orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order._id !== orderId) return order;

        return {
          ...order,
          products: order.products.map((product) => {
            if (product.productId === productId) {
              return { ...product, hasReviewed: true };
            }
            return product;
          }),
        };
      })
    );
  };

  const handleCancelRequest = async (orderId) => {
    const confirm = window.confirm("Sipariş iptal talebi göndermek istiyor musunuz?");
    if (!confirm) return;

    try {
      const { data } = await api.post(`/api/orders/cancel-request/${orderId}`);

      alert(data.message || "İptal talebi alındı.");
      fetchOrders(page);
    } catch (error) {
      alert(error?.response?.data?.message || "İptal talebi gönderilemedi.");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (errorMsg) return <p className="error">{errorMsg}</p>;
  if (!orders.length) return <p>Henüz siparişiniz yok.</p>;

  return (
    <div className="my-orders">
      <h2>📃 Siparişlerim</h2>

      {orders.map((order) => {
        const orderKey = order.id || order._id || order.createdAt || Math.random().toString(36);

        return (
          <div key={orderKey} className="order-card">
            <div className="order-images">
              {order.products.map((item, index) => {
                const imgSrc = item.image
                  ? item.image.startsWith("http")
                    ? item.image
                    : api.defaults.baseURL + item.image
                  : "https://via.placeholder.com/100";

                return (
                  <img
                    key={item.productId || index}
                    src={imgSrc}
                    alt={item.name || "Ürün resmi"}
                    className="order-image"
                    loading="lazy"
                  />
                );
              })}
            </div>

            <div className="order-details">
              <h3 className="order-product-name" title={order.products[0]?.name || ""}>
                {order.products[0]?.name || "Ürün adı yok"}
              </h3>

              <p>
                <strong>Tarih:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString("tr-TR")}
              </p>
              <p>
                <strong>Toplam:</strong> ₺{order.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Durum:</strong> {getStatusLabel(order.status)}
              </p>

              {/* Renk ve Beden Bilgisi */}
              {order.products.map((item, index) => (
                <div key={item.productId || index} className="product-details">
                  <p>
                    <strong>Ürün:</strong> {item.name || "İsimsiz Ürün"}
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
              ))}

              {/* === İptal Butonu veya Bilgilendirme === */}
              {order.status === "hazırlanıyor" && (
                <>
                  {!order.cancelRequest ? (
                    <button className="cancel-button" onClick={() => handleCancelRequest(order._id)}>
                      ❌ Siparişi İptal Et
                    </button>
                  ) : (
                    <p className="cancel-info">
                      ⏳ İptal talebiniz alındı. Onay bekleniyor.
                    </p>
                  )}
                </>
              )}

              {order.status === "kargoya verildi" && (
                <p className="cancel-warning">
                  🚚 Siparişiniz kargoya verildiği için iptal edilemez.
                </p>
              )}

              {order.status === "iptal edildi" && (
                <p className="cancel-info">❌ Bu sipariş iptal edilmiştir.</p>
              )}

              {order.products.map((item, index) => (
                <div key={item.productId || index} className="product-review-section">
                  {order.status === "teslim edildi" && (
                    item.hasReviewed ? (
                      <p className="thank-you-message">
                        🙏 Değerlendirmeniz için teşekkür ederiz.
                      </p>
                    ) : (
                      <ReviewForm
                        productId={item.productId}
                        orderId={order._id}
                        onReviewSubmit={handleReviewSubmit}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Önceki
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            disabled={page === i + 1}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Sonraki
        </button>
      </div>
    </div>
  );
};

export default MyOrders;
