import { View, Text } from "react-native";

export default function CalendarScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">📅 Calendar Screen</Text>
      <Text className="text-lg text-gray-600">This is where events will be added</Text>
    </View>
  );
}