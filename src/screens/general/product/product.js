import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  PixelRatio,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

// Hooks
import usePublicGroupsByCategoryId from "../../../hooks/publicProducts/usePublicGroupsByCategoryId";
import usePublicProductsByCategoryName from "../../../hooks/publicProducts/usePublicProductsByCategoryName";

// ID & NAME Constants
const FOOD_CATEGORY_ID = 1;
const DRINK_CATEGORY_ID = 2;
const FOOD_NAME = "FOOD";
const DRINK_NAME = "DRINK";

const { width, height } = Dimensions.get("screen");

export default function Product({ navigation }) {
  // 1) Gọi hooks lấy "groups" (FOOD=1, DRINK=2)
  const {
    data: foodGroups,
    isLoading: isLoadingFoodGroups,
    error: foodGroupErr,
  } = usePublicGroupsByCategoryId(FOOD_CATEGORY_ID);

  const {
    data: drinkGroups,
    isLoading: isLoadingDrinkGroups,
    error: drinkGroupErr,
  } = usePublicGroupsByCategoryId(DRINK_CATEGORY_ID);

  // 2) Gọi hooks lấy "products" (FOOD, DRINK)
  const {
    data: foodProducts,
    isLoading: isLoadingFoodProd,
    error: foodProdErr,
  } = usePublicProductsByCategoryName(FOOD_NAME);

  const {
    data: drinkProducts,
    isLoading: isLoadingDrinkProd,
    error: drinkProdErr,
  } = usePublicProductsByCategoryName(DRINK_NAME);

  // 3) Kiểm tra trạng thái loading
  if (
    isLoadingFoodGroups ||
    isLoadingDrinkGroups ||
    isLoadingFoodProd ||
    isLoadingDrinkProd
  ) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#93540A" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // 4) Kiểm tra lỗi
  if (foodGroupErr || drinkGroupErr || foodProdErr || drinkProdErr) {
    return (
      <View style={styles.centered}>
        <Text>
          Lỗi:{" "}
          {foodGroupErr?.message ||
            drinkGroupErr?.message ||
            foodProdErr?.message ||
            drinkProdErr?.message}
        </Text>
      </View>
    );
  }

  // 5) Kết hợp group FOOD + DRINK → combinedGroups
  //   Mỗi phần tử: { id, name, ... } (đặt theo API),
  //   ta bổ sung field categoryName: "FOOD" hoặc "DRINK"
  const combinedGroups = [
    ...(foodGroups || []).map((g) => ({ ...g, categoryName: "FOOD" })),
    ...(drinkGroups || []).map((g) => ({ ...g, categoryName: "DRINK" })),
  ];

  // 6) Kết hợp product FOOD + DRINK → combinedProducts
  //   Mỗi sp: { id, name, price, image, ... }
  //   ta thêm { categoryName: "FOOD" } hoặc "DRINK"
  const combinedProducts = [
    ...(foodProducts || []).map((p) => ({ ...p, categoryName: "FOOD" })),
    ...(drinkProducts || []).map((p) => ({ ...p, categoryName: "DRINK" })),
  ];

  // 7) Bạn đang dùng structure:
  //    data = [ { category: string, data: [product, ...] }, ... ]
  //    => Ta cần group combinedProducts theo categoryName
  function groupProductsByCategory(arr) {
    const map = {};
    for (const item of arr) {
      const cat = item.categoryName || "Unknown";
      if (!map[cat]) {
        map[cat] = [];
      }
      map[cat].push(item);
    }
    // Trả về mảng { category, data[] }
    return Object.entries(map).map(([category, data]) => ({ category, data }));
  }
  const productListData = groupProductsByCategory(combinedProducts);

  /** ============== RENDER ============== */

  // Render Group (phần trên, ScrollView ngang)
  const renderGroupItem = ({ item }) => (
    <View style={styles.categoryItemContainer}>
      <View style={styles.imageCategoryBox}>
        <Image
          source={{
            uri:
              item?.images?.[0] ||
              "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/flat-white-3402c4f.jpg",
          }}
          style={styles.categoryImage}
        />
      </View>
      <View style={styles.categoryName}>
        <Text style={styles.categoryTextStyle}>{item.name}</Text>
      </View>
    </View>
  );

  // Render 1 khối "category" + các sản phẩm
  // item = { category: "FOOD" or "DRINK", data: [...] }
  const renderItem = ({ item }) => (
    <View style={styles.productList}>
      <View style={styles.productCategoryNameContainer}>
        <Text style={styles.productCategoryNameText}>{item.category}</Text>
      </View>
      {item.data.map((product) => (
        <TouchableOpacity
          key={product.id}
          style={styles.productContainer}
          onPress={() => handleProductPress(product)}
        >
          <View style={styles.imageBox}>
            <Image
              source={{
                uri:
                  product.images[0] ||
                  "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/flat-white-3402c4f.jpg",
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.detailBox}>
            <View style={styles.productTextContainer}>
              <Text style={styles.productNameText}>{product.name}</Text>
              <Text style={styles.productPriceText}>
                {product.price ? `${product.price} VND` : "0 VND"}
              </Text>
            </View>
            <View style={styles.addButtonContainer}>
              <TouchableOpacity style={styles.addButton}>
                <Feather name="plus" size={20} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Handle user nhấn vào 1 product
  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { productId: product.id });
  };

  // ============== UI ==============
  return (
    <View style={styles.container}>
      {/* Phần category */}
      <View style={styles.categoryContainer}>
        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Feather name="search" size={24} color={"#93540A"} />
          </View>
          <TextInput placeholder="Tìm kiếm" placeholderTextColor="#A8A8A8" />
        </View>

        {/* ScrollView ngang hiển thị GROUPS FOOD, DRINK */}
        <ScrollView
          style={styles.scrollContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
        >
          <FlatList
            contentContainerStyle={styles.renderCategoryItemContainer}
            data={combinedGroups}
            renderItem={renderGroupItem}
            keyExtractor={(item, index) => `group-${item.id}-${index}`}
            showsVerticalScrollIndicator={false}
            numColumns={Math.ceil(combinedGroups.length / 2) || 1}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>

      {/* Phần hiển thị products */}
      <View style={styles.productListContainer}>
        {/* Sử dụng data = productListData = [ { category, data: [...]}, { category, data: [...] } ] */}
        <FlatList
          data={productListData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `cat-${item.category}-${index}`}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  categoryContainer: {
    flex: 0.35,
    marginHorizontal: width * 0.03,
    marginVertical: width * 0.03,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    flex: 0.25,
    flexDirection: "row",
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#F1F1F1",
  },
  searchIconContainer: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 0.75,
  },
  renderCategoryItemContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  categoryItemContainer: {
    width: PixelRatio.getPixelSizeForLayoutSize(30),
  },
  imageCategoryBox: {
    alignItems: "center",
  },
  categoryImage: {
    height: PixelRatio.getPixelSizeForLayoutSize(18),
    width: PixelRatio.getPixelSizeForLayoutSize(18),
    borderRadius: PixelRatio.getPixelSizeForLayoutSize(9),
  },
  categoryName: {
    alignItems: "center",
  },
  categoryTextStyle: {
    fontSize: 12,
    textAlign: "center",
  },
  productListContainer: {
    flex: 0.65,
  },
  productList: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: width * 0.03,
  },
  productCategoryNameContainer: {
    flex: 0.2,
    marginBottom: 10,
  },
  productCategoryNameText: {
    fontSize: 18,
    fontWeight: "600",
  },
  productContainer: {
    flex: 0.8,
    flexDirection: "row",
    marginBottom: 10,
  },
  imageBox: {
    flex: 0.3,
  },
  image: {
    borderRadius: 10,
    aspectRatio: 1,
  },
  detailBox: {
    flex: 0.7,
    flexDirection: "row",
  },
  productTextContainer: {
    flex: 0.8,
  },
  addButtonContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  productNameText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  productPriceText: {
    fontSize: 14,
    marginLeft: 15,
  },
  addButton: {
    height: PixelRatio.getPixelSizeForLayoutSize(12),
    width: PixelRatio.getPixelSizeForLayoutSize(12),
    borderRadius: PixelRatio.getPixelSizeForLayoutSize(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#93540A",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
