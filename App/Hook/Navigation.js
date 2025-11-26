import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../components/HomeScreen';
import MyAccount from '../components/Myaccount/MyAccount';
import BottomTabs from '../components/BottomTabs';
import Login from '../components/Auth/Login'
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


        </Stack.Navigator>
      </View>

      {/* TAB BAR HER ZAMAN SABİT */}
      <BottomTabs/>

    </View>
  );
}
