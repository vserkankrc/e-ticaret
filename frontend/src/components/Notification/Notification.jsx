// src/pages/Notification/Notification.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import "./Notifications.css"; // tasarım dosyası

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bildirimleri çek
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Bildirimler alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  // Okundu yap
  const markAsRead = async (id) => {
    try {
      await api.post(
        `/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Okundu hatası:", err);
    }
  };

  // Gizle (silme değil)
  const hideNotification = async (id) => {
    try {
      await api.post(
        `/api/notifications/${id}/hide`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Gizleme hatası:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="notifications-container">Yükleniyor...</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Bildirimler</h2>

      {notifications.length === 0 ? (
        <p className="empty">Hiç bildirimin yok ✔</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className={`notification-item ${n.read ? "read" : ""}`}
          >
            <div className="notification-message">{n.message}</div>

            <div className="notification-actions">
              {!n.read && (
                <button
                  className="btn-read"
                  onClick={() => markAsRead(n._id)}
                >
                  Okundu
                </button>
              )}

              <button
                className="btn-hide"
                onClick={() => hideNotification(n._id)}
              >
                Gizle
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
