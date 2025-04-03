import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { FIREBASE_STORAGE, FIREBASE_DB_POSTS } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUserContext } from "../Providers/AuthContext";
import { ref as dbRef, set } from "firebase/database";
import ImagePickerComponent from "../Components/ImageController/ImagePickerComponent";
import useOwnNavigation from "../Hooks/useOwnNav";

const NewPostScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const nav = useOwnNavigation();

  const uploadImage = async () => {
    if (!imageUri || !user) {
      Alert.alert("No image selected", "Please select an image first.");
      return;
    }
  
    setLoading(true);
    const response = await fetch(imageUri);
    const blob = await response.blob();
  
    // Define the storage path explicitly
    const storagePath = `posts/${user.uid}/${Date.now()}.jpg`;
    const imageRef = ref(FIREBASE_STORAGE, storagePath);
  
    try {
      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);
  
      // Pass both downloadUrl and storagePath
      savePostToDatabase(downloadUrl, storagePath);
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload the image.");
      setLoading(false);
    }
  };
  
  const savePostToDatabase = async (imageUrl: string, imagePath: string) => {
    if (!postText) {
      Alert.alert("Post Error", "Please write some content for your post.");
      setLoading(false);
      return;
    }
  
    const postRef = dbRef(FIREBASE_DB_POSTS, `posts/${Date.now()}`);
    try {
      await set(postRef, {
        userId: user!.uid,
        postText: postText,
        imageUrl: imageUrl,   // for displaying image
        imagePath: imagePath, // for future deletion purposes
        timestamp: Date.now(),
      });
  
      Alert.alert("Post Created", "Your post has been successfully created!");
      setLoading(false);
      nav.navigate("Home");
    } catch (error) {
      console.error("Error saving post: ", error);
      Alert.alert("Error", "Failed to save your post.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>
      <ImagePickerComponent setImageUri={setImageUri} />
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.imagePreview} /> : null}
      <TextInput
        style={styles.textInput}
        placeholder="Write something..."
        value={postText}
        onChangeText={setPostText}
        multiline
      />
      <TouchableOpacity
        onPress={uploadImage}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Create Post</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e2e2",
  },
  textInput: {
    width: "90%",
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default NewPostScreen;