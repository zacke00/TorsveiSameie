// src/components/PostTextInputComponent.tsx
import React from "react";
import { TextInput } from "react-native";

const PostTextInputComponent = ({ postText, setPostText }: { postText: string, setPostText: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <TextInput
      className="border p-2 w-full mb-4 rounded-md"
      placeholder="Write your post here..."
      multiline
      numberOfLines={4}
      onChangeText={setPostText}
      value={postText}
    />
  );
};

export default PostTextInputComponent;
