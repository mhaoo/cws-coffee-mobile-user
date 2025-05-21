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

export default Cart = function ({ navigation, route }) {
  const { cart, removeFromCart } = useCart();
  const booking = route.params?.booking;

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          x{item.quantity} • {item.price} VND
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
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
            if (booking) {
              navigation.navigate("BookingDetail", {
                booking: { ...booking, items: cart },
              });
            } else {
              console.warn("No booking to add to.");
            }
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
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 4,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemDetails: {
    fontSize: 14,
    color: "#555555",
    marginTop: 2,
  },
  deleteText: {
    fontSize: 16,
    color: "red",
  },
  footerContainer: {
    flex: 0.14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.25,
    borderTopColor: "#A8A8A8",
    backgroundColor: "#FFFFFF",
  },
});
