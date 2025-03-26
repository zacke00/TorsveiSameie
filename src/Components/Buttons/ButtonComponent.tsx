// src/components/ButtonComponent.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";

const ButtonComponent = ({ onPress, title, style }: { onPress: () => void, title: string, style?: object }) => {
  return (
    <TouchableOpacity onPress={onPress} className="bg-blue-500 p-3 w-full rounded-md">
        <Text className="text-white text-center">{title}</Text>
      </TouchableOpacity>
  );
};

export default ButtonComponent;
