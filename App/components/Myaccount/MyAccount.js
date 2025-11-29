import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axios";
import { useEffect, useState } from "react";

export default function MyAccount() {
  const navigation = useNavigation();
  const { isAuthenticated, user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0); // Okunmamış mesaj sayısı

  const username = user?.name || user?.email || "Misafir";

  // Bildirimleri çek (örnek API)
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await api.get("/api/notifications"); // API endpoint
        const unread = res.data.filter((msg) => !msg.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.log("Bildirim çekme hatası:", err);
      }
    };
    fetchNotifications();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      logout(); // AuthContext'teki token ve user silinir
      navigation.replace("Login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        {isAuthenticated ? (
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.welcome}>Hoş geldin</Text>
              <Text style={styles.username}>{username}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.userType}>Misafir kullanıcı</Text>
        )}

        {/* --- Bildirim Çanı Başlangıç --- */}
        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() => navigation.navigate("Notifications")} // Notifications ekranına git
        >
          <Ionicons name="notifications-outline" size={28} color="red" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* --- Bildirim Çanı Bitiş --- */}
      </View>

      {/* Giriş yapılmamışsa */}
      {!isAuthenticated && (
        <>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.primaryBtnText}>Üye ol</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.secondaryBtnText}>Giriş yap</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Premium Banner */}
      <View style={styles.premiumBox}>
        <Text style={styles.premiumText}>
          PREMIUM{"\n"}ile avantajlarını katla!
        </Text>
        <TouchableOpacity style={styles.premiumBtn}>
          <Text style={{ fontWeight: "600" }}>Hediye HBO Max</Text>
        </TouchableOpacity>
      </View>

      {/* Menü Listesi */}
      <View style={styles.menuList}>
        <MenuItem
          title="Siparişlerim"
          icon={<MaterialIcons name="inventory" size={22} />}
        />
        <MenuItem
          title="Kuponlarım"
          icon={<MaterialIcons name="local-offer" size={22} />}
        />
        <MenuItem
          title="Premium Worldcard"
          icon={<MaterialIcons name="credit-card" size={22} />}
        />
        <MenuItem
          title="Hepsipay"
          icon={<Ionicons name="wallet-outline" size={22} />}
        />
        <MenuItem
          title="Beğendiklerim"
          icon={<Ionicons name="heart-outline" size={22} />}
        />
        <MenuItem
          title="Link Gelir"
          icon={<MaterialIcons name="attach-money" size={22} />}
        />

        {/* Çıkış Butonu */}
        {isAuthenticated && (
          <MenuItem
            title="Çıkış Yap"
            icon={<MaterialIcons name="logout" size={22} color="red" />}
            onPress={handleLogout}
          />
        )}
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>{icon}</View>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: "#FF6A00",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  welcome: {
    fontSize: 14,
    color: "#555",
  },

  username: {
    fontSize: 18,
    fontWeight: "700",
  },

  userType: {
    fontSize: 20,
    fontWeight: "600",
  },

  primaryBtn: {
    backgroundColor: "#FF6A00",
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  primaryBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },

  secondaryBtn: {
    backgroundColor: "#FFE8DD",
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 20,
  },

  secondaryBtnText: {
    color: "#FF6A00",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },

  premiumBox: {
    backgroundColor: "#FFEAF2",
    padding: 15,
    borderRadius: 12,
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  premiumText: {
    fontWeight: "700",
    color: "#FF2B77",
  },

  premiumBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  menuList: {
    marginTop: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  menuIcon: {
    width: 30,
  },

  menuText: {
    flex: 1,
    fontSize: 16,
  },

  notificationContainer: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
