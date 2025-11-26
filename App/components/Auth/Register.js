import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  return (
    <View style={styles.container}>

      {/* ÜLKE KODU + TELEFON */}
      <View style={styles.phoneContainer}>
        <View style={styles.flagBox}>
          <Image
            source={{ uri: "https://flagcdn.com/w40/tr.png" }}
            style={{ width: 24, height: 16 }}
          />
          <Ionicons name="chevron-down" size={18} color="#555" />
        </View>

        <Text style={styles.phonePrefix}>+90</Text>

        <TextInput
          placeholder="Telefon numarası"
          style={styles.phoneInput}
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      {/* DEVAM ET */}
      <TouchableOpacity style={styles.mainButton}>
        <Text style={styles.mainButtonText}>Devam et</Text>
      </TouchableOpacity>

      {/* E-POSTA İLE ÜYE OL */}
      <TouchableOpacity style={styles.emailButton}>
        <Ionicons name="mail-outline" size={20} color="#333" />
        <Text style={styles.emailButtonText}>E posta ile üye ol</Text>
      </TouchableOpacity>

      {/* VEYA */}
      <Text style={styles.orText}>veya</Text>

      {/* SOSYAL HESAPLAR */}
      <View style={styles.socialBox}>
        <Text style={styles.socialTitle}>Sosyal hesabın ile giriş yap</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIcon}>
            <Image source={{ uri: "https://img.icons8.com/ios-filled/50/apple-logo.png" }}
              style={styles.socialImg}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialIcon}>
            <Image source={{ uri: "https://img.icons8.com/color/48/google-logo.png" }}
              style={styles.socialImg}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialIcon}>
            <Image source={{ uri: "https://img.icons8.com/color/48/facebook.png" }}
              style={styles.socialImg}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ALT METİN */}
      <Text style={styles.bottomText}>
        Kişisel verileriniz, <Text style={styles.link}>Aydınlatma Metni</Text> kapsamında işlenmektedir.
        {"\n"}“Devam et” veya “Sosyal Hesap” butonlarına basarak 
        <Text style={styles.link}> Üyelik Sözleşmesi</Text>
        {" "}ve{" "}
        <Text style={styles.link}>Gizlilik Politikası</Text>
        ’nı kabul etmiş olursunuz.
      </Text>

    </View>
  );
}

// ----------- STYLES -----------
const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 10
  },

  /** TELEFON - ÜLKE KODU INPUT */
  phoneContainer: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12
  },

  flagBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  phonePrefix: {
    fontSize: 16,
    color: "#333"
  },

  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#000"
  },

  /** DEVAM ET BUTONU */
  mainButton: {
    backgroundColor: "#ffa970",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },

  /** E POSTA İLE ÜYE OL */
  emailButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    gap: 8,
    marginBottom: 20
  },
  emailButtonText: {
    fontSize: 15,
    color: "#333"
  },

  orText: {
    textAlign: "center",
    color: "#777",
    marginBottom: 15
  },

  /** SOSYAL GİRİŞ */
  socialBox: {
    backgroundColor: "#f2fff1",
    borderColor: "#cde9cd",
    borderWidth: 1,
    padding: 18,
    borderRadius: 12,
    marginBottom: 20
  },

  socialTitle: {
    textAlign: "center",
    fontSize: 15,
    marginBottom: 15,
    fontWeight: "500"
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18
  },

  socialIcon: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#eee"
  },

  socialImg: {
    width: 26,
    height: 26
  },

  /** ALT YAZI */
  bottomText: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    lineHeight: 17,
    paddingHorizontal: 6
  },

  link: {
    fontWeight: "600",
    color: "#444"
  }
});
