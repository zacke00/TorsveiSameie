import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FIREBASE_DB_POSTS } from '../firebaseConfig';  // Firebase Realtime Database
import { ref, onValue } from 'firebase/database';

const PostDetailScreen: React.FC = ({ route, navigation }: any) => {
  const { postId } = route.params;  // Retrieve the postId from navigation params
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);  // Comments for the post

  useEffect(() => {
    const postRef = ref(FIREBASE_DB_POSTS, `posts/${postId}`);
    const fetchPost = () => {
      onValue(postRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPost(data);
        }
      });
    };
    fetchPost();

    // Fetch comments if you have a comments section in your database
    const commentsRef = ref(FIREBASE_DB_POSTS, `comments/${postId}`);
    const fetchComments = () => {
      onValue(commentsRef, (snapshot) => {
        const data = snapshot.val();
        const commentsList = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) : [];
        setComments(commentsList);
      });
    };
    fetchComments();
  }, [postId]);

  return (
    <View style={styles.container}>
      {post ? (
        <>
          <Text style={styles.postTitle}>{post.displayName}</Text>
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          <Text style={styles.postText}>{post.postText}</Text>

          <Text style={styles.commentsTitle}>Comments:</Text>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentUser}>{item.user}</Text>
                <Text style={styles.commentText}>{item.commentText}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Posts</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 200,
    marginVertical: 15,
    borderRadius: 8,
  },
  postText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    color: '#6B7280',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default PostDetailScreen;
