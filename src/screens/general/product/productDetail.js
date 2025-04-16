import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  PixelRatio,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Checkbox } from "react-native-paper";
import AddButton from "../../../components/button/addButton";
import SecondaryButton from "../../../components/button/secondaryButton";
// CartContext
import { useCart } from "../cart/cartContext";

// Hook React Query
import usePublicProductDetail from "../../../hooks/publicProducts/usePublicProductDetail";

export default function ProductDetail({ route, navigation }) {
  const { productId } = route.params;

  // Gọi hook React Query, không bọc trong if
  const { data: product, isLoading, error } = usePublicProductDetail(productId);

  const [countAmountProduct, setCountAmountProduct] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const { addToCart } = useCart();

  // Loading
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#93540A" />
        <Text>Đang tải chi tiết sản phẩm...</Text>
      </View>
    );
  }
  // Error
  if (error) {
    Alert.alert("Lỗi", "Không thể lấy dữ liệu chi tiết sản phẩm.");
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Đã có lỗi: {error.message}</Text>
      </View>
    );
  }
  // Product rỗng
  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Không tìm thấy sản phẩm hoặc sản phẩm trống.</Text>
      </View>
    );
  }

  // Tính toán giá
  const basePrice = product.price || 0;
  const computeTotalPrice = () => {
    let optionsTotal = 0;
    // Ở đây, DEMO: +5k cho mỗi option
    const pricePerOption = 5000;
    Object.values(selectedOptions).forEach((opt) => {
      if (opt === true) optionsTotal += pricePerOption;
    });
    const finalPrice = (basePrice + optionsTotal) * countAmountProduct;
    setTotalPrice(finalPrice);
  };

  // Tính giá khi mount & khi dependency thay đổi
  // useEffect(() => {
  //   computeTotalPrice();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [product, selectedOptions, countAmountProduct]);

  // Toggle Option
  const handleToggleOption = (option) => {
    setSelectedOptions((prev) => {
      const currentVal = !!prev[option];
      return { ...prev, [option]: !currentVal };
    });
  };

  // Thay đổi số lượng
  const handleAddPress = () => {
    setCountAmountProduct((prev) => Math.max(1, prev + 1));
  };
  const handleRemovePress = () => {
    setCountAmountProduct((prev) => Math.max(1, prev - 1));
  };

  // Add To Cart
  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: totalPrice,
      quantity: countAmountProduct,
      options: selectedOptions,
      notes,
    };
    addToCart(cartItem);
    navigation.goBack();
  };

  // Render UI
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContent}>
        {/* Header */}
        <View style={styles.productContainer}>
          <Image
            source={{
              uri:
                product?.images?.[0] || "https://via.placeholder.com/200.png",
            }}
            style={styles.productImage}
          />
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productPrice}>
            {product.price ? `$${product.price}` : "$0.00"}
          </Text>
          <Text style={styles.productDescription}>
            {product.description || "Không có mô tả cho sản phẩm này"}
          </Text>
        </View>

        {/* Options nếu product.customizable */}
        {product.customizable && product.options?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Tùy chọn sản phẩm</Text>
            {product.options.map((option) => (
              <View key={option} style={styles.checkboxContainer}>
                <Checkbox
                  status={selectedOptions[option] ? "checked" : "unchecked"}
                  onPress={() => handleToggleOption(option)}
                  color="#93540A"
                />
                <Text style={styles.label}>{option}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Yêu cầu khác */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yêu cầu khác</Text>
          <TextInput
            style={styles.input}
            placeholder="Thêm ghi chú"
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.addAmountProductContainer}>
          <AddButton iconName="remove-outline" onPress={handleRemovePress} />
          <Text style={styles.countAmountProductText}>
            {countAmountProduct}
          </Text>
          <AddButton iconName="add" onPress={handleAddPress} />
        </View>
        <View style={styles.secondaryButtonContainer}>
          <SecondaryButton
            text="Chọn"
            price={`${totalPrice.toFixed(2)} đ`}
            style={styles.secondaryButton}
            onPress={handleAddToCart}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Giữ style như bạn đã code
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  footerContainer: {
    flexDirection: "row",
    borderTopWidth: 0.25,
    borderTopColor: "#A8A8A8",
    backgroundColor: "#FFFFFF",
  },
  addAmountProductContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 35,
  },
  countAmountProductText: {
    fontSize: 14,
    fontWeight: "600",
    paddingTop: 5,
    marginHorizontal: 20,
    color: "#000000",
  },
  secondaryButtonContainer: {
    alignItems: "center",
    paddingTop: PixelRatio.getPixelSizeForLayoutSize(8),
  },
  productContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  productPrice: {
    fontSize: 18,
    color: "#888",
    marginVertical: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 15,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
