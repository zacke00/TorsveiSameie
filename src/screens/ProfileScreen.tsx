import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, } from "react-native";
import { useUserContext } from "../Providers/AuthContext";
import { FIREBASE_AUTH, FIREBASE_STORAGE } from "../firebaseConfig"; // Remove FIREBASE_DB_POSTS if unused

import { updateProfile } from "firebase/auth";
import ImagePickerComponent from "../Components/ImageController/ImagePickerComponent";
import { ref, uploadBytes, getDownloadURL,  } from "firebase/storage";


const ProfileScreen: React.FC = () => {
  const { user, setCurrentUser } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.displayName?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.displayName?.split(" ")[1] || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
      const [first, ...last] = user.displayName.split(" ");
      setFirstName(first || "");
      setLastName(last.join(" ") || "");
    }
    if (user?.photoURL) {
      setImageUri(user.photoURL);
    }
  }, [user]);

  const handleImageUpload = async (uri: string) => {
    if (!uri) return;

    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Image blob:", blob);
      const imageRef = ref(FIREBASE_STORAGE, `profile_images/${FIREBASE_AUTH.currentUser.uid}`);

      console.log("Uploading image to Firebase Storage...");
      await uploadBytes(imageRef, blob);
      
      const downloadURL = await getDownloadURL(imageRef);
      console.log("Download URL:", downloadURL);

      await updateProfile(FIREBASE_AUTH.currentUser, { photoURL: downloadURL });
      setImageUri(downloadURL);
      setCurrentUser({ ...user, photoURL: downloadURL });
      Alert.alert("Success", "Image uploaded successfully!");
    }catch (error) {
      console.error("Error uploading image:", error.code, error.message);
      Alert.alert("Error", "Failed to upload image: " + error.message);
    }
  }

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "First name and last name are required.");
      return;
    }

    const newDisplayName = `${firstName} ${lastName}`;
    try {
      console.log("User UID:", FIREBASE_AUTH.currentUser.uid);
      console.log("Updating Firebase Auth profile with displayName:", newDisplayName);
      await updateProfile(FIREBASE_AUTH.currentUser, {
        displayName: newDisplayName,
      });
      console.log("Firebase Auth profile updated successfully");

      // Update local user context and state
      setCurrentUser({ ...user, displayName: newDisplayName });
      setDisplayName(newDisplayName);

      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.code, error.message);
      Alert.alert("Error", "Failed to update profile: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>
      {isEditing ? (
        <ImagePickerComponent setImageUri={handleImageUpload} />
      ) : null}

      {/* User Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.header}>👤 Profile</Text>
        {isEditing ? (
          <>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
            />
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Display Name</Text>
            <Text style={styles.detailText}>{displayName || "Not set"}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.detailText}>{user?.email || "Not set"}</Text>
          </>
        )}
      </View>

      {/* Edit/Save Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Text style={styles.buttonText}>{isEditing ? "Save" : "Edit Profile"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 20,
    paddingTop: 100,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#1D4ED8",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#6B7280",
    fontSize: 16,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1D4ED8",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;