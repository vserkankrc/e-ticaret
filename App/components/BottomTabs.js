import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BottomTabs() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Home")}>
        <MaterialIcons name="home" size={28} />
        <Text style={styles.label}>Anasayfa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <MaterialIcons name="favorite-border" size={28} />
        <Text style={styles.label}>Listelerim</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <MaterialIcons name="shopping-cart" size={28} />
        <Text style={styles.label}>Sepet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <MaterialIcons name="apps" size={28} />
        <Text style={styles.label}>Kategoriler</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("MyAccount")}>
        <MaterialIcons name="person" size={28} />
        <Text style={styles.label}>Hesabım</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  height: 70,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderTopWidth: 1,
  borderColor: '#ddd',
  backgroundColor: '#fff',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
},

  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 3,
  },
});
