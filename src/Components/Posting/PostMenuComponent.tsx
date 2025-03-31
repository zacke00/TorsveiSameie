import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
} from 'react-native';

type PostMenuProps = {
  selectedPost: any | null;
  onEdit: (postId: string, newText: string) => void;
  onDelete: (postId: string) => void;
  onClose: () => void;
};

const PostMenu: React.FC<PostMenuProps> = ({
  selectedPost,
  onEdit,
  onDelete,
  onClose,
}) => {
  const handleDelete = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          onDelete(selectedPost?.id);
          onClose();
        },
      },
    ]);
  };

  const handleEdit = () => {
    const newText = prompt('Edit your post:', selectedPost?.postText);
    if (newText !== null && newText !== selectedPost?.postText) {
      onEdit(selectedPost?.id, newText);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.menu}>
            <Text style={styles.postText}>...</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleEdit}
                style={[styles.button, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.button, { backgroundColor: '#f44336' }]}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.button, { backgroundColor: '#9E9E9E' }]}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // darkens background
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  postText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostMenu;
