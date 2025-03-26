import React from 'react';
import tailwind from 'tailwind-rn';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/Providers/AuthContext'; // Make sure the path is correct
import AppRoutes from './src/routes/App.Routes'; // Your main route for login/signup


  export default function App() {
    return (
      <AuthProvider>
        <NavigationContainer>
          <AppRoutes />  
        </NavigationContainer>
      </AuthProvider>
    );
  }
