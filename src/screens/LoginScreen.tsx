import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig"; // Ensure this path is correct
import { useUserContext } from "../Providers/AuthContext"; // Access the user context
import useOwnNavigation from "../Hooks/useOwnNav";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useUserContext(); // Access user context
  const nav = useOwnNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      setCurrentUser(userCredential.user);
      nav.navigate("Home");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
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
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => nav.navigate('SignUp')}
        style={styles.linkContainer}
      >
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
});

export default LoginScreen;
