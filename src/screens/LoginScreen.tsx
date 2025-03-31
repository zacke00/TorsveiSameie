import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig"; // Ensure this path is correct
import { useUserContext } from "../Providers/AuthContext"; // Access user context
import useOwnNavigation from "../Hooks/useOwnNav";


const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useUserContext(); // Access user context
  const nav = useOwnNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true); // Show the spinner
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      setCurrentUser(userCredential.user);
      setErrorMessage("");
      //Do not use navigation.navigate('Home') here. Use the setCurrentUser method to update the user context
    } catch (error: any) {
      let message = "Failed to log in. Please try again."; // Default message

      // Handle specific Firebase Auth error codes
      if (error.code === "auth/missing-password") {
        message = "Please enter password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format. Please check your email and try again.";
      } else if (error.code === "auth/network-request-failed") {
        message = "Network error. Please check your internet connection and try again.";
      } else if (email.toString().includes("@" && ".")) {
        message = "Invalid email format. Please check your email and try again.";
      }
      console.log(error.code, error.message); // Log the error code and message
      setErrorMessage(message); // Set the error message to display
    } finally {
      setIsLoading(false); // Hide the spinner after login attempt (success or failure)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => nav.navigate('SignUp')}
        style={styles.linkContainer}
      >
        <Text style={styles.errorTextFailedToLogin}>{errorMessage}</Text>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: '#1D4ED8', // Tailwind equivalent of blue-600
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB", // Tailwind equivalent of gray-300
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#3B82F6", // Tailwind equivalent of blue-500
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row', // Align text and spinner side by side
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 16,
  },
  linkText: {
    color: "#3B82F6", // Tailwind equivalent of blue-500
    textAlign: "center",
  },
  errorTextFailedToLogin: {
    color: "red",
    textAlign: "center",
    paddingBottom: 10,
    fontWeight: "bold",
  },
});

export default LoginScreen;
