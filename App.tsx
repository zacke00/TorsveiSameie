import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/Providers/AuthContext'; // Make sure the path is correct
import AppRoutes from './src/routes/App.Routes'; // Your main route for login/signup
import { SafeAreaView } from 'react-native';


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <NavigationContainer>
          <AppRoutes />  
        </NavigationContainer>
      </AuthProvider>
      </SafeAreaView>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6", // Match your app’s background
  },
});
