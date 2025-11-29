import { 
  StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, SafeAreaView 
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; // Kalp icon için

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const product = route.params?.product;

  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Ürün bulunamadı</Text>
      </View>
    );
  }

  const userLoggedIn = false; // AsyncStorage veya Context ile değiştirilecek

  const handleAddToCart = () => {
    if (!userLoggedIn) {
      navigation.navigate("Login");
      return;
    }
    console.log("SEPETE EKLENDİ:", product.name, "Adet:", quantity);
  };

  const handleFavorite = () => {
    if (!userLoggedIn) {
      navigation.navigate("Login");
      return;
    }
    setFavorite(prev => !prev);
  };

  const cleanDescription = product.description
    ? product.description.replace(/<[^>]+>/g, '')
    : "Bu ürün için açıklama bulunmamaktadır.";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 180, paddingTop: 10 }}>
          {/* ANA ÜRÜN GÖRSELİ */}
          <Image source={{ uri: selectedImage }} style={styles.mainImage} />

          {/* THUMBNAILS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailContainer}>
            {product.images?.map((img, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedImage(img)}>
                <Image 
                  source={{ uri: img }} 
                  style={[styles.thumbnail, selectedImage === img && styles.selectedThumbnail]} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* TITLE + FAVORITE */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.name}</Text>
            <TouchableOpacity onPress={handleFavorite}>
              <AntDesign name={favorite ? "heart" : "hearto"} size={28} color={favorite ? "#ff3b30" : "#333"} />
            </TouchableOpacity>
          </View>

          {/* PRICE AREA */}
          <View style={styles.priceContainer}>
            {product.oldPrice && (
              <Text style={styles.oldPrice}>{product.oldPrice} ₺</Text>
            )}
            <Text style={styles.price}>{product.price} ₺</Text>
          </View>

          {/* QUANTITY */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>Adet:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNumber}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => setQuantity(prev => prev + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.desc}>{cleanDescription}</Text>
        </ScrollView>

        {/* ADD TO CART */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <Text style={styles.cartBtnText}>Sepete Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  mainImage: { width: width, height: 300, resizeMode: "contain", backgroundColor: "#f2f2f2" },
  thumbnailContainer: { flexDirection: "row", marginVertical: 10, paddingHorizontal: 10 },
  thumbnail: { width: 50, height: 50, marginRight: 10, borderRadius: 5, borderWidth: 1, borderColor: "#ececec" },
  selectedThumbnail: { borderColor: "#06c167", borderWidth: 2 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15, marginTop: 5 },
  title: { fontSize: 18, fontWeight: "600", flex: 1, marginRight: 10 },
  priceContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, marginTop: 5 },
  oldPrice: { textDecorationLine: "line-through", color: "gray", marginRight: 10, fontSize: 16 },
  price: { fontSize: 22, fontWeight: "700", color: "#06c167" },
  quantityContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, marginTop: 10 },
  quantityText: { fontSize: 16, marginRight: 10 },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { width: 35, height: 35, justifyContent: "center", alignItems: "center", backgroundColor: "#ececec", borderRadius: 5 },
  qtyBtnText: { fontSize: 18, fontWeight: "600" },
  qtyNumber: { marginHorizontal: 10, fontSize: 16, fontWeight: "500" },
  desc: { paddingHorizontal: 15, fontSize: 14, color: "#333", marginTop: 10 },
  footer: {
    position: "absolute",
    bottom: 60, // Tab bar varsa üstünde duracak
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cartBtn: {
    backgroundColor: "#06c167",
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 7,
  },
  cartBtnText: { color: "#fff", fontSize: 18, textAlign: "center", fontWeight: "700" },
});
