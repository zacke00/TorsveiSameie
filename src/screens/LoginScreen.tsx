import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";  // Ensure this path is correct
import { useUserContext } from "../Providers/AuthContext"; // Access the user context
import useOwnNavigation from "../Hooks/useOwnNav";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentUser } = useUserContext();  // Access user context
  const nav = useOwnNavigation();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      setCurrentUser(userCredential.user);  // Set user in context after login
      // After login success, navigate to the home screen or other screen
      nav.navigate("Home");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Log In</Text>
      
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
        onPress={handleLogin}
      >
        <Text className="text-white text-center">Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => nav.navigate('SignUp')}  // Navigate to SignUp screen
        className="mt-4"
      >
        <Text className="text-blue-500">Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
