import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";  // Ensure this path is correct
import { useUserContext } from "../Providers/AuthContext"; // Access the user context
import React from "react";
import { ref, set } from "firebase/database";

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const { setCurrentUser } = useUserContext(); // To set user when signed up
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [displayName, setDisplayName] = useState(""); // Add display name

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Sign Up Error", "Email and password are required.");
      return;
    } else if (password !== password2) {
      Alert.alert("Sign Up Error", "Passwords do not match.");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      const finalDisplayName = displayName.trim() === "" || displayName == null ? "Anonymous" : displayName;

      // Update Firebase Auth profile with displayName
      await updateProfile(user, {
        displayName: finalDisplayName,
      });
      console.log("Firebase Auth profile updated with displayName:", finalDisplayName);

      // User is now signed in, but we'll use onAuthStateChanged to confirm and write to DB
      setCurrentUser(user); // Set user in context immediately for UI
      console.log("Account creation initiated, waiting for auth state to confirm...");
    } catch (error: any) {
      console.error("Sign Up Error", error.code, error.message);
      Alert.alert("Sign Up Error", error.message);
    }
  };

  // Listener to write to database once user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        // User is signed in, now safe to write to database
        const finalDisplayName = displayName.trim() === "" || displayName == null ? "Anonymous" : displayName;
        const userRef = ref(FIREBASE_DB, `users/${user.uid}`);
        set(userRef, {
          displayName: finalDisplayName,
          photoURL: null,
        })
          .then(() => {
            console.log("User data saved to Realtime Database under users/", user.uid);
            Alert.alert("Success", "Account created successfully! You can now proceed.");
          })
          .catch((error) => {
            console.error("Database Write Error", error.message);
            Alert.alert("Database Error", "Failed to save user data: " + error.message);
            // Optionally delete the user if DB write fails
            user.delete().catch((deleteError) => console.error("Failed to rollback user:", deleteError));
          });
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [displayName]); // Re-run if displayName changes (though it’s set before signup)

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
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        onChangeText={setPassword2}
        value={password2}
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
