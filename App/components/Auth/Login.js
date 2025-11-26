import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Register from "./Register"; // 👈 ARTIK AYRI DOSYADAN ALIYORUZ

export default function Login() {
  const [tab, setTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>

      {/* ÜST TAB BAR */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setTab("login")} style={styles.tabButton}>
          <Text style={[styles.tabText, tab === "login" && styles.activeTabText]}>
            Giriş yap
          </Text>
          {tab === "login" && <View style={styles.activeLine} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("register")} style={styles.tabButton}>
          <Text style={[styles.tabText, tab === "register" && styles.activeTabText]}>
            Üye ol
          </Text>
          {tab === "register" && <View style={styles.activeLine} />}
        </TouchableOpacity>
      </View>

      {/* ------------------ GİRİŞ FORMU ------------------ */}
      {tab === "login" && (
        <>
          <TextInput
            placeholder="E-posta adresi"
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <View style={styles.passwordBox}>
            <TextInput
              placeholder="Şifre"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgot}>Şifremi unuttum</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Giriş yap</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.phoneLogin}>
            <Ionicons name="call-outline" size={18} color="#333" />
            <Text style={styles.phoneLoginText}>Telefon numarası ile giriş yap</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>veya</Text>

          <View style={styles.socialBox}>
            <Text style={styles.socialText}>Sosyal hesabın ile giriş yap</Text>
            <View style={styles.socialRow}>{/* sosyal ikonlar buraya */}</View>
          </View>

          <Text style={styles.helpText}>Yardıma ihtiyacım var</Text>
        </>
      )}

      {/* ------------------ ÜYE OL SAYFASI (AYRI DOSYADAN) ------------------ */}
      {tab === "register" && <Register />}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 80 },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },
  tabButton: { alignItems: "center", width: "50%" },
  tabText: { fontSize: 18, color: "#8e8e8e" },
  activeTabText: { color: "#000", fontWeight: "600" },
  activeLine: { width: "100%", height: 3, backgroundColor: "#ff7f2a", marginTop: 5 },

  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  passwordBox: {
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: { flex: 1, paddingVertical: 12 },

  forgot: {
    color: "#ff7f2a",
    marginBottom: 20,
    fontWeight: "500",
  },

  loginButton: {
    backgroundColor: "#ffaf79",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  phoneLogin: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  phoneLoginText: { fontSize: 15 },

  orText: { textAlign: "center", marginVertical: 10, color: "#777" },

  socialBox: {
    borderWidth: 1,
    borderColor: "#c8eec0",
    backgroundColor: "#f4fff2",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  socialText: { textAlign: "center", marginBottom: 15, fontSize: 15, fontWeight: "500" },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 15 },

  helpText: {
    color: "#ff7f2a",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
});
