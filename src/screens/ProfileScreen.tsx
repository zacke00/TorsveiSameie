import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">👤 Profile Screen</Text>
      <Text className="text-lg text-gray-600">User details and settings go here</Text>
    </View>
  );
}