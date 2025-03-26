import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";  // Ensure this path is correct
import { useUserContext } from "../Providers/AuthContext"; // Access the user context

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useUserContext(); // To set user when signed up
  const [displayName, setDisplayName] = useState(""); // Add display name

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password); // Add display name
      setCurrentUser(userCredential.user); // Set user in context after sign-up
      updateProfile(userCredential.user, {
        displayName: displayName,
      });
      console.log("Account Created", "You can now log in.");
    } catch (error: any) {
      console.log("Sign Up Error", error.message);
      Alert.alert("Sign Up Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Display Name"
        onChangeText={setDisplayName}
        value={displayName}
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
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {}}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
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

export default SignUpScreen;
