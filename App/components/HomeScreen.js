import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import HomeHeader from "./HomeHeader";
import api from "../utils/axios";

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  const getProducts = async () => {
    try {
      const response = await api.get("api/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Ürünler çekilemedi:", error.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        width: "48%",
        backgroundColor: "#fff",
        marginBottom: 12,
        borderRadius: 10,
        padding: 10,
      }}
      onPress={() => navigation.navigate("ProductDetails", { product: item })}
    >
      <Image
        source={{ uri: item.images?.[0] }}
        style={{
          width: "100%",
          height: 150,
          borderRadius: 10,
          resizeMode: "contain",
          backgroundColor: "#f1f1f1",
        }}
      />

      <Text style={{ marginTop: 8, fontSize: 16, fontWeight: "bold" }}>
        {item.name}
      </Text>

      <Text style={{ fontSize: 14, color: "gray" }}>
        {item.description?.slice(0, 40)}...
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 18,
          fontWeight: "bold",
          color: "#ff6a00",
        }}
      >
        {item.price}₺
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <HomeHeader />

      <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}  // ✔ kaydırma sorunu çözüldü
        />
      </View>
    </View>
  );
}
