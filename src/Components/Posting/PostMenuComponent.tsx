import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
} from "react-native";

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
  const [showConfirm, setShowConfirm] = React.useState(false);
  console.log("PostMenu rendered, selectedPost:", selectedPost);

  const handleDelete = () => {
    console.log("Delete button pressed");
    if (!selectedPost?.id) {
      console.error("No post ID available for deletion");
      return;
    }
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    console.log("Delete confirmed, calling onDelete with postId:", selectedPost.id);
    onDelete(selectedPost.id);
    setShowConfirm(false);
    onClose();
  };

  const handleEdit = () => {
    console.log("Edit button pressed"); // Debug log
    if (!selectedPost?.id) {
      console.error("No post ID available for editing");
      return;
    }
    const newText = prompt("Edit your post:", selectedPost?.postText || "");
    if (newText !== null && newText !== selectedPost?.postText) {
      onEdit(selectedPost.id, newText);
    }
  };return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <View style={styles.menu}>
          {showConfirm ? (
            <View>
              <Text style={styles.postText}>Are you sure you want to delete this post?</Text>
              <TouchableOpacity onPress={confirmDelete} style={[styles.button, { backgroundColor: "#f44336" }]}>
                <Text style={styles.buttonText}>Yes, Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowConfirm(false)} style={[styles.button, { backgroundColor: "#9E9E9E" }]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.postText}>{selectedPost ? "Post Options" : "No Post Selected"}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleEdit} style={[styles.button, { backgroundColor: "#2196F3" }]} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={[styles.button, { backgroundColor: "#f44336" }]} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: "#9E9E9E" }]} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  postText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PostMenu;