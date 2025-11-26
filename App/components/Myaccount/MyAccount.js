import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,

} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';


export default function MyAccount() {

   const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Üst Kullanıcı Bilgisi */}
      <View style={styles.header}>
        <Text style={styles.userType}>Misafir kullanıcı</Text>
        <Ionicons name="notifications-outline" size={24} />
      </View>

      {/* Üye Ol - Giriş Yap */}
      <TouchableOpacity style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>Üye ol</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.secondaryBtnText}>Giriş yap</Text> 
      </TouchableOpacity>

      {/* Premium Banner */}
      <View style={styles.premiumBox}>
        <Text style={styles.premiumText}>
          PREMIUM{"\n"}ile avantajlarını katla!
        </Text>
        <TouchableOpacity style={styles.premiumBtn}>
          <Text style={{ fontWeight: "600" }}>Hediye HBO Max</Text>
        </TouchableOpacity>
      </View>

      {/* Menü Liste */}
      <View style={styles.menuList}>
        <MenuItem
          title="Siparişlerim"
          icon={<MaterialIcons name="inventory" size={22} />}
        />
        <MenuItem
          title="Sana Özel Fırsatlar"
          icon={<Feather name="diamond" size={22} />}
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
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ title, icon }) => (
  <TouchableOpacity style={styles.menuItem}>
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

  userType: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
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
});
