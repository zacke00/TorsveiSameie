// src/components/ImageController/ImagePickerComponent.tsx
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity, Text, Alert, StyleSheet, View } from "react-native";

const ImagePickerComponent = ({ setImageUri }: { setImageUri: React.Dispatch<React.SetStateAction<string | null>> }) => {
  // Request media library permission
  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need permission to access your photo library.");
      return false;
    }
    return true;
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need permission to access your camera.");
      return false;
    }
    return true;
  };

  // Pick image from gallery
  const pickImageFromGallery = async () => {
    const permissionGranted = await requestMediaLibraryPermission();
    if (!permissionGranted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct syntax
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const permissionGranted = await requestCameraPermission();
    if (!permissionGranted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct syntax
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
        <Text style={styles.text}>Pick from Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.text}>Take a Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  button: {
    padding: 8,
    backgroundColor: "#4CAF50", // Green color
    borderRadius: 5,
    width: "48%", // Adjust width to fit two buttons side by side
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    fontFamily: "Arial",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ImagePickerComponent;