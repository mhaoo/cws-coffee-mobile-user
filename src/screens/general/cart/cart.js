import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
} from "react-native";
import SecondaryButton from "../../../components/button/secondaryButton";
import { useCart } from "../cart/cartContext";

const { width, height } = Dimensions.get("screen");

export default Cart = function ({ navigation }) {
  const { cart, removeFromCart } = useCart();

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image
        source={{
          uri: item.image || "https://example.com/image-placeholder.png",
        }}
        style={styles.image}
      />
      <View style={styles.productInfo}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.details}>
          Options: {JSON.stringify(item.options)}
        </Text>
        <Text style={styles.price}>Giá: {item.totalPrice} VND</Text>
        <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Text style={styles.deleteText}>🗑 Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <View style={styles.footerContainer}>
        <SecondaryButton
          text="Xác nhận thanh toán"
          onPress={() => {
            /* Handle thanh toán */
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  productContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  details: {
    fontSize: 12,
    color: "#777",
  },
  price: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  quantity: {
    fontSize: 14,
  },
  deleteText: {
    fontSize: 16,
    color: "red",
  },
  footerContainer: {
    flex: 0.14,
    flexDirection: "row",
    borderTopWidth: 0.25,
    borderTopColor: "#A8A8A8",
    backgroundColor: "#FFFFFF",
  },
});
