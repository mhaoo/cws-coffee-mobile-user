import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const NewPostScreen = ({ navigation }) => {
  const [content, setContent] = useState("");

  const handlePost = () => {
    const newPost = {
      id: Date.now().toString(),
      user: "Bạn",
      avatar: "https://randomuser.me/api/portraits/men/99.jpg",
      image: "https://source.unsplash.com/400x300/?coffee", // Random ảnh
      content,
      likes: 0,
      liked: false,
      timestamp: new Date(),
      comments: [],
    };
    alert("Đã đăng bài: " + content);
    navigation.navigate("Forum", { newPost });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Viết gì đó..."
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <Button title="Đăng bài" onPress={handlePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
});

export default NewPostScreen;
