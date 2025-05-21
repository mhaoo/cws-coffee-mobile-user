import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const NewPostScreen = ({ navigation }) => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Request permission for image library
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Cần quyền truy cập thư viện ảnh');
      }
    })();
  }, []);

  // Function to pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    const newPost = {
      id: Date.now().toString(),
      user: "Bạn",
      avatar: "https://randomuser.me/api/portraits/men/99.jpg",
      image: selectedImage || "https://source.unsplash.com/400x300/?coffee", // User chọn hoặc random ảnh
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
      {/* Button to pick image */}
      <Button title="Chọn ảnh" onPress={pickImage} />
      {/* Preview selected image */}
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
      )}
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
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10, marginTop: 10 },
  previewImage: { width: '100%', height: 200, borderRadius: 10, marginVertical: 10 },
});

export default NewPostScreen;
