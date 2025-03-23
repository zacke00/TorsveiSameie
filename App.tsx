import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/Providers/AuthContext'; // Make sure the path is correct
import WelcomeRoutes from './src/routes/App.Routes'; // Your main route for login/signup


  export default function App() {
    return (
      <AuthProvider>
        {/* NavigationContainer wraps the entire app */}
        <NavigationContainer>
          <WelcomeRoutes />  {/* All routes must be inside the NavigationContainer */}
        </NavigationContainer>
      </AuthProvider>
    );
  }
