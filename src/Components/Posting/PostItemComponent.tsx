import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

const PostItem = ({ item, onMenuPress, user }: any) => {
  return (
    <View style={styles.postContainer}>
      {item.imageUrl && (
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        >
        </ImageBackground>
      )}
      <Text style={styles.postText}>{item.displayName}</Text>
      <Text style={styles.postUser}>Posted on {new Date(item.timestamp).toLocaleString()}</Text>

      {item.userId === user?.uid && (
        <TouchableOpacity onPress={() => onMenuPress(item)} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>...</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 15,
    marginBottom: 20,
    maxWidth: 400,
    alignSelf: 'center',
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  postText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  postUser: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    marginTop: 10,
    height: 20,
    width: 20,
  },
  menuButtonText: {
    color: '#00000050',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PostItem;
