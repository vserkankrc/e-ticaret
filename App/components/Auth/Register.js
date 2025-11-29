import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function Register() {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !surname || !email || !password || !phoneNumber) {
      return Alert.alert("Hata", "Lütfen tüm alanları doldurunuz.");
    }

    try {
      const res = await api.post("/api/auth/register", {
        name,
        surname,
        email,
        password,
        phoneNumber
      });

      if (res.data?.user && res.data?.token) {
        await login(res.data.user, res.data.token.replace("Bearer ", ""));
        navigation.replace("Home");
      }
    } catch (err) {
      console.log("Register error:", err);
      Alert.alert("Hata", err.response?.data?.message || "Kayıt başarısız.");
    }
  };

  return (
    <View style={styles.container}>

      {/* AD */}
      <TextInput
        placeholder="Ad"
        style={styles.input}
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      {/* SOYAD */}
      <TextInput
        placeholder="Soyad"
        style={styles.input}
        placeholderTextColor="#999"
        value={surname}
        onChangeText={setSurname}
      />

      {/* E POSTA */}
      <TextInput
        placeholder="E posta"
        style={styles.input}
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* ŞİFRE */}
      <TextInput
        placeholder="Şifre"
        style={styles.input}
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* TELEFON */}
      <View style={styles.phoneContainer}>
        <Text style={styles.phonePrefix}>+90</Text>
        <TextInput
          placeholder="Telefon numarası"
          style={styles.phoneInput}
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* KAYIT OL */}
      <TouchableOpacity style={styles.mainButton} onPress={handleRegister}>
        <Text style={styles.mainButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}

// ----------- STYLES -----------
const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 60,
  },

  input: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#000",
  },

  phoneContainer: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    gap: 12
  },

  phonePrefix: { fontSize: 16, color: "#333" },
  phoneInput: { flex: 1, fontSize: 16, color: "#000" },

  mainButton: {
    backgroundColor: "#ffa970",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
});
