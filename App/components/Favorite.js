import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "../utils/axios"; // axios.js üzerinden
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          navigation.replace("Login");
          return;
        }

        setLoading(true);
        const res = await axios.get("/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.favorites || [];
        setFavorites(data);
      } catch (err) {
        console.error("Favoriler yüklenemedi:", err);
        setError("Favoriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (productId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await axios.delete(`/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((fav) => fav.productId._id !== productId));
    } catch (err) {
      console.error("Favoriden kaldırma hatası:", err);
      alert("Favoriden kaldırma işlemi başarısız oldu.");
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  if (favorites.length === 0)
    return (
      <View style={styles.center}>
        <Text>Favori ürününüz bulunmamaktadır.</Text>
      </View>
    );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={favorites}
      keyExtractor={(item) => item.productId._id}
      renderItem={({ item }) => {
        const product = item.productId;
        return (
          <View style={styles.favoriteItem}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetailsPage", { id: product._id })}
            >
              <Image source={{ uri: product.images?.[0] }} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.details}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProductDetailsPage", { id: product._id })}
              >
                <Text style={styles.name}>{product.name}</Text>
              </TouchableOpacity>
              <Text style={styles.description}>{product.description}</Text>
              <Text style={styles.price}>{product.price}₺</Text>
              <TouchableOpacity
                onPress={() => removeFavorite(product._id)}
                style={styles.removeBtn}
              >
                <Text style={{ color: "white" }}>❤️ Favoriden Kaldır</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    color: "#555",
  },
  price: {
    color: "#000",
    fontWeight: "bold",
  },
  removeBtn: {
    marginTop: 5,
    backgroundColor: "#e74c3c",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
  },
});
