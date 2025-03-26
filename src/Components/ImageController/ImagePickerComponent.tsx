// src/components/ImagePickerComponent.tsx
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity, Text, Image, Alert, StyleSheet, View } from "react-native";

const ImagePickerComponent = ({ setImageUri }: { setImageUri: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  };

  const pickImage = async () => {
    const permission = await requestPermission();
    if (!permission) {
      Alert.alert("Permission Required", "We need permission to access your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);  // Store selected image URI
    }
  };

  return (
      <TouchableOpacity
        style={styles.button}
        onPress={pickImage}
        className="bg-blue-500 p-3 w-full rounded-md mb-4"
      >
          <Text style={styles.text} >Pick an Image</Text>

      </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  text: {
    color: "#00000080",
    fontFamily: "Arial",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button:{
    padding: 8,
    backgroundColor: '#4CAF50', // Green color
    borderRadius: 5,
    margin: 10,
    width: '25%',
    alignItems: 'center',
  }
});

export default ImagePickerComponent;
