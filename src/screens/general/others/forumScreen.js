import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { format } from "date-fns";

const initialPosts = [
  {
    id: "1",
    user: "Cà phê Đắk Lắk",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    image: "https://source.unsplash.com/400x300/?coffee",
    content: "Hôm nay trời đẹp, làm ly cafe cho tỉnh táo nào! ☕",
    likes: 12,
    liked: false,
    timestamp: new Date(),
    comments: [
      { id: "c1", user: "Ngọc", text: "Nhìn ngon quá!", timestamp: new Date() },
      {
        id: "c2",
        user: "Duy",
        text: "Hương vị thế nào vậy bạn?",
        timestamp: new Date(),
      },
    ],
  },
  {
    id: "2",
    user: "Cafe Lovers",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    image: "https://source.unsplash.com/400x300/?espresso",
    content: "Cà phê Espresso - đậm đà, khó quên!",
    likes: 30,
    liked: false,
    timestamp: new Date(),
    comments: [
      {
        id: "c3",
        user: "An",
        text: "Nhìn là thấy thèm luôn!",
        timestamp: new Date(),
      },
    ],
  },
  {
    id: "3",
    user: "Latte Art",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    image: "https://source.unsplash.com/400x300/?latte",
    content: "Thử vẽ Art Latte đầu tiên của tôi! ☕🎨",
    likes: 18,
    liked: false,
    timestamp: new Date(),
    comments: [],
  },
  {
    id: "4",
    user: "Barista Club",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    image: "https://source.unsplash.com/400x300/?cappuccino",
    content: "Cappuccino buổi sáng - Sảng khoái tinh thần!",
    likes: 25,
    liked: false,
    timestamp: new Date(),
    comments: [],
  },
  {
    id: "5",
    user: "Coffee World",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    image: "https://source.unsplash.com/400x300/?mocha",
    content: "Mocha ngọt ngào cho ngày cuối tuần.",
    likes: 10,
    liked: false,
    timestamp: new Date(),
    comments: [],
  },
];

const ForumScreen = ({ navigation, route }) => {
  const [posts, setPosts] = useState(initialPosts);

  // Nếu có bài mới từ `NewPostScreen`, thêm vào danh sách
  React.useEffect(() => {
    if (route.params?.newPost) {
      setPosts((prevPosts) => [route.params.newPost, ...prevPosts]);
    }
  }, [route.params?.newPost]);

  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.timestamp}>
            {format(item.timestamp, "dd/MM/yyyy HH:mm")}
          </Text>
        </View>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.image }} style={styles.postImage} />

      {/* Post Content */}
      <Text style={styles.postText}>{item.content}</Text>

      {/* Like & Comment */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => toggleLike(item.id)}
          style={styles.actionButton}
        >
          <FontAwesome
            name="heart"
            size={24}
            color={item.liked ? "red" : "gray"}
          />
          <Text style={styles.actionText}>{item.likes} likes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Comments", { comments: item.comments })
          }
          style={styles.actionButton}
        >
          <FontAwesome name="comment" size={24} color="gray" />
          <Text style={styles.actionText}>{item.comments.length} comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("NewPost")}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  postContainer: {
    padding: 15,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  username: { fontSize: 16, fontWeight: "bold" },
  timestamp: { fontSize: 12, color: "#666" },
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginVertical: 10,
  },
  postText: { fontSize: 14, marginVertical: 5, color: "#333" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: { flexDirection: "row", alignItems: "center" },
  actionText: { marginLeft: 5, fontSize: 14, color: "#333" },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
});

export default ForumScreen;
