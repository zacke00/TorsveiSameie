import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";  // Ensure this path is correct
import { useUserContext } from "../Providers/AuthContext"; // Access the user context

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useUserContext(); // To set user when signed up

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      setCurrentUser(userCredential.user); // Set user in context after sign-up
      console.log("Account Created", "You can now log in.");
    } catch (error: any) {
      console.log("Sign Up Error", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Sign Up</Text>
      
      <TextInput
        className="border p-2 w-full mb-4 rounded-md"
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        className="border p-2 w-full mb-4 rounded-md"
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        className="bg-blue-500 p-3 w-full rounded-md"
        onPress={handleSignUp}
      >
        <Text className="text-white text-center">Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // Navigate to login screen if needed
        }}
        className="mt-4"
      >
        <Text className="text-blue-500">Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
