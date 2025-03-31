// src/components/SignOutButton.tsx
import { signOut } from 'firebase/auth';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import useOwnNavigation from '../../Hooks/useOwnNav';

const SignOutButton = () => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const nav = useOwnNavigation();
  
  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      setCurrentUser(null);
      Alert.alert("Signed out", "You have been logged out");
    } catch (error) {
      console.error("Sign-out error:", error);
      Alert.alert("Error", "An error occurred during sign out");
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <Text style={styles.buttonText}>Sign Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SignOutButton;
