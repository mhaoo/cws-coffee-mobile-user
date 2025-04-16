import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { format } from "date-fns";

const CommentScreen = ({ route }) => {
  const { comments: initialComments = [] } = route.params || {}; // Tránh undefined
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        user: "Bạn",
        text: newComment,
        timestamp: new Date(), // Đảm bảo timestamp hợp lệ
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Danh sách bình luận */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.username}>{item.user}:</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp
                ? format(new Date(item.timestamp), "dd/MM/yyyy HH:mm")
                : "Không rõ thời gian"}
            </Text>
          </View>
        )}
      />

      {/* Ô nhập bình luận */}
      <View style={styles.commentInputContainer}>
        <TextInput
          placeholder="Thêm bình luận..."
          value={newComment}
          onChangeText={setNewComment}
          style={styles.input}
        />
        <Button title="Gửi" onPress={addComment} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  comment: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: { fontWeight: "bold", marginRight: 5 },
  commentText: { flex: 1, color: "#333" },
  timestamp: { fontSize: 12, color: "#666" },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default CommentScreen;
