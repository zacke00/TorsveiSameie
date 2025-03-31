import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useUserContext } from "../Providers/AuthContext";
import { FIREBASE_AUTH, FIREBASE_DB_POSTS } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { signOut } from "firebase/auth";
import PostItem from "../Components/Posting/PostItemComponent";
import SignOutButton from "../Components/Buttons/SignoutButtonComponent";
import useOwnNavigation from "../Hooks/useOwnNav";
import useCameraPermission from "../Hooks/useCameraPermissions";

const HomeScreen: React.FC = () => {
  const { user, setCurrentUser } = useUserContext();
  const [posts, setPosts] = useState<any[]>([]);
  const nav = useOwnNavigation();
  const { permissionStatus } = useCameraPermission();

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      setCurrentUser(null);
      Alert.alert("Signed out", "You have been logged out");
      nav.navigate("Login");
    } catch (error) {
      console.error("Sign-out error:", error);
      Alert.alert("Error", "An error occurred during sign out");
    }
  };

  useEffect(() => {
    if (permissionStatus === "granted") {
      console.log("Camera permission granted");
    } else if (permissionStatus === "denied") {
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera access in settings to create posts.",
        [{ text: "OK" }]
      );
    }
  }, [permissionStatus]);

  useEffect(() => {
    const postsRef = ref(FIREBASE_DB_POSTS, "posts/");
    const fetchPosts = () => {
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        const postsList = data
          ? Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }))
          : [];
        postsList.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(postsList);
      });
    };
    fetchPosts();
  }, []);

  const renderPost = ({ item }: { item: any }) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => nav.navigate("PostDetail", { postId: item.id })}
          style={{ flex: 1 }}
        >
          <PostItem item={item} user={user} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.displayName ?? "Guest"}</Text>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatlist}
        />
      ) : (
        <Text style={styles.noPostsText}>No posts available. Be the first to share something!</Text>
      )}
      <SignOutButton onSignOut={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "600",
    fontSize: 32,
    color: "#1D4ED8",
    marginBottom: 20,
    textAlign: "center",
  },
  flatlist: {
    maxWidth: 360,
    width: "100%",
    marginTop: 20,
  },
  noPostsText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HomeScreen;