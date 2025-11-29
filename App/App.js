import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './Hook/Navigation';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
