import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, Modal } from 'react-native';
import { useUserContext } from '../Providers/AuthContext'; 
import { FIREBASE_AUTH, FIREBASE_DB_POSTS } from '../firebaseConfig';  
import { ref, onValue, remove, update } from 'firebase/database';
import { signOut } from 'firebase/auth';
import PostItem from '../Components/Posting/PostItemComponent';
import PostMenu from '../Components/Posting/PostMenuComponent';
import SignOutButton from '../Components/Buttons/SignoutButtonComponent';

export default function HomeScreen() {
  const { user, setCurrentUser } = useUserContext();
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      setCurrentUser(null);
      Alert.alert('Signed out', 'You have been logged out');
    } catch (error) {
      console.error("Sign-out error:", error);
      Alert.alert('Error', 'An error occurred during sign out');
    }
  };

  useEffect(() => {
    const postsRef = ref(FIREBASE_DB_POSTS, 'posts/');
    const fetchPosts = () => {
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        const postsList = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) : [];
        postsList.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(postsList);
      });
    };
    fetchPosts();
  }, []);

  const handleDeletePost = (postId: string) => {
    const postRef = ref(FIREBASE_DB_POSTS, `posts/${postId}`);
    remove(postRef)
      .then(() => {
        Alert.alert("Success", "Post has been deleted.");
        setShowMenu(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to delete the post.");
        console.error(error);
      });
  };

  const handleEditPost = (postId: string, newText: string) => {
    const postRef = ref(FIREBASE_DB_POSTS, `posts/${postId}`);
    update(postRef, { postText: newText })
      .then(() => {
        Alert.alert("Success", "Post has been updated.");
        setShowMenu(false);
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to edit the post.");
        console.error(error);
      });
  };

  const renderPost = ({ item }: { item: any }) => {
    return (
      <PostItem
          item={item}
          onMenuPress={() => {
            setSelectedPost(item);
            setShowMenu(true);
          }}
          user={user}
        />
    );
  };

  const closeMenu = () => {
    setShowMenu(false);
    setSelectedPost(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.displayName ?? 'Guest'}</Text>

      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noPostsText}>No posts available. Be the first to share something!</Text>
      )}

      <SignOutButton onSignOut={handleSignOut} />

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1D4ED8',
    marginBottom: 20,
    textAlign: 'center',
  },
  noPostsText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
});
