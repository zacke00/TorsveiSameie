import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import PostMenu from "./PostMenuComponent";
import { ref, remove, update, onValue } from "firebase/database";
import { FIREBASE_DB_POSTS, FIREBASE_DB } from "../../firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { User } from "firebase/auth";

interface PostItemProps {
  item: {
    id: string;
    userId: string;
    postText: string;
    imageUrl?: string;
    timestamp: number;
  };
  user: User | null; // Current user for menu visibility
}

const PostItem: React.FC<PostItemProps> = ({ item, user }) => {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [postUserDisplayName, setPostUserDisplayName] = useState<string>("Loading...");
  const [postUserPhotoURL, setPostUserPhotoURL] = useState<string | null>(null);

  // Fetch displayName and photoURL from users/{item.userId}
  useEffect(() => {
    if (!item.userId) {
      setPostUserDisplayName("Unknown User");
      setPostUserPhotoURL(null);
      return;
    }

    const userRef = ref(FIREBASE_DB, `users/${item.userId}`);
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        const userData = snapshot.val();
        setPostUserDisplayName(userData?.displayName || "Anonymous");
        setPostUserPhotoURL(userData?.photoURL || null);
      },
      (error) => {
        console.error(`Error fetching user data for userId ${item.userId}:`, error);
        setPostUserDisplayName("Anonymous");
        setPostUserPhotoURL(null);
      }
    );

    return () => unsubscribe();
  }, [item.userId]);

  const handleMenuPress = (post: any) => {
    console.log("Menu pressed for post:", post.id, "User UID:", user?.uid, "Post UID:", item.userId);
    setSelectedPost(post);
    setShowMenu(true);
    console.log("ShowMenu set to true, selectedPost:", post);
  };

  const handleDeletePost = async (postId: string) => {
    console.log("Pressed the delete button inside the postitem");
    const postRef = ref(FIREBASE_DB_POSTS, `posts/${postId}`);
    try {
      console.log("Deleting post:", postId);
      await remove(postRef);
      console.log("Post deleted successfully:", postId);
      Alert.alert("Success", "Post has been deleted.");
      setShowMenu(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete the post: " + (error as Error).message);
    }
  };

  const handleEditPost = async (postId: string, newText: string) => {
    const postRef = ref(FIREBASE_DB_POSTS, `posts/${postId}`);
    try {
      console.log("Editing post:", postId, "New text:", newText);
      await update(postRef, { postText: newText });
      Alert.alert("Success", "Post has been updated.");
      setShowMenu(false);
    } catch (error) {
      console.error("Error editing post:", error);
      Alert.alert("Error", "Failed to edit the post: " + (error as Error).message);
    }
  };

  const closeMenu = () => {
    setShowMenu(false);
    setSelectedPost(null);
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.user}>
        <ImageBackground
          source={{ uri: postUserPhotoURL || "https://via.placeholder.com/40" }}
          style={styles.userImage}
          resizeMode="cover"
        />
        <Text style={styles.displayName}>{postUserDisplayName}</Text>
      </View>

      <View style={styles.textBox}>
        <Text style={styles.postText}>{item.postText}</Text>
      </View>

      {item.imageUrl && (
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.postUser}>Posted on {new Date(item.timestamp).toLocaleString()}</Text>

      {item.userId === user?.uid && (
        <TouchableOpacity
          onPress={() => handleMenuPress(item)}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <FontAwesomeIcon icon={faEllipsis} color="#fff" size={18} />
        </TouchableOpacity>
      )}

      <Modal animationType="fade" transparent={true} visible={showMenu} onRequestClose={closeMenu}>
        <PostMenu
          selectedPost={selectedPost}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onClose={closeMenu}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 70,
    width: 340,
    position: "relative",
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    overflow: "hidden",
  },
  displayName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  textBox: {
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  postText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  postImage: {
    width: 340,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  postUser: {
    fontSize: 14,
    color: "#6B7280",
  },
  menuButton: {
    position: "absolute",
    width: 30,
    height: 20,
    borderRadius: 5,
    backgroundColor: "#33f",
    justifyContent: "center",
    alignItems: "center",
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default PostItem;