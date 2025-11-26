import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen email adresinizi girin.');
      return;
    }
    // Burada API çağrısı yapılabilir
    Alert.alert('Başarılı', `Şifre sıfırlama linki ${email} adresine gönderildi.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şifremi Unuttum</Text>
      <Text style={styles.subtitle}>
        Şifrenizi sıfırlamak için kayıtlı email adresinizi girin
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email adresiniz"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Şifre Sıfırlama Linki Gönder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4e73df',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
