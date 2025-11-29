import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../components/HomeScreen';
import MyAccount from '../components/Myaccount/MyAccount';
import BottomTabs from '../components/BottomTabs';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register'
import ProductDetails from '../components/ProductDetails'
import Favorite from '../components/Favorite';
import Notifications from '../components/Notification/Notifications'
const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <View style={{ flex: 1 }}>
      
      {/* SAYFALAR BURADA DEĞİŞECEK */}
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MyAccount" component={MyAccount} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="Favorite" component={Favorite} />
          <Stack.Screen name="Notifications" component={Notifications} />





        </Stack.Navigator>
      </View>

      {/* TAB BAR HER ZAMAN SABİT */}
      <BottomTabs/>

    </View>
  );
}
