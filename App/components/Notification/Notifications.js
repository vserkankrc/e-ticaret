import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl 
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axios";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bildirimleri çek
  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get("/api/notifications"); // API endpoint
      // Eğer res.data array değilse boş array ata
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Bildirim çekme hatası:", err);
      setNotifications([]); // Hata varsa da boş array ata
    }
    setLoading(false);
  };

  // Bildirimi okundu olarak işaretle
  const markAsRead = async (id) => {
    try {
      await api.post(`/api/notifications/${id}/read`); // Backend API
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.log("Bildirim okundu hatası:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unread]}
      onPress={() => markAsRead(item._id)}
    >
      <View style={styles.left}>
        {!item.read && <View style={styles.unreadDot} />}
        <View style={styles.textContainer}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Sort için güvenli kontrol
  const sortedNotifications = Array.isArray(notifications)
    ? [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bildirimler</Text>
      <FlatList
        data={sortedNotifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchNotifications} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Hiç bildiriminiz yok.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: { fontSize: 22, fontWeight: "700", padding: 20, color: "#FF6A00" },
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  unread: {
    backgroundColor: "#FFF5F5",
  },
  left: { flexDirection: "row", alignItems: "center" },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF2B2B",
    marginRight: 10,
  },
  textContainer: { flex: 1 },
  message: { fontSize: 16, fontWeight: "500", color: "#333" },
  date: { fontSize: 12, color: "#999", marginTop: 4 },
  empty: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999", fontSize: 16 },
});
