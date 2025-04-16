import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  PixelRatio,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import useBranches from "../../../hooks/useBranches";
import useBranchStore from "../../../store/branchStore";

const { width, height } = Dimensions.get("screen");

export default SeatBooking = function ({ navigation }) {
  const { data: branches, isLoading, error, refreshBranches } = useBranches();
  // console.log("Branches Data:", branches);
  const [isRefreshing, setIsRefreshing] = useState(false);

  //*  Lưu branchId khi chọn chi nhánh
  const saveBranchId = async (branchId) => {
    try {
      await AsyncStorage.setItem("branchId", branchId.toString());
      console.log("Đã lưu branchId:", branchId);
    } catch (error) {
      console.error("Lỗi khi lưu branchId:", error);
    }
  };

  //* Hàm xử lý kéo để làm mới
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBranches();
    setIsRefreshing(false);
  };

  //* Nếu đang tải, hiển thị ActivityIndicator
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#93540A" />
        <Text>Đang tải danh sách chi nhánh...</Text>
      </View>
    );
  }

  //* Nếu có lỗi khi gọi API
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Lỗi: {error.message}</Text>
      </View>
    );
  }

  //* Render mỗi chi nhánh trong danh sách chi nhánh
  const renderStoreListContainer = ({ item }) => (
    <TouchableOpacity
      style={styles.storeListContainer}
      onPress={() => handleStorePress(item.id)}
    >
      <View style={styles.storeDetailContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                // item.images[0] ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0lat9Ryng1UhE-3c5u7O-ZFCVXYGoANxWrw&s",
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.storeDetail}>
          <Text style={styles.basicName}>CWS COFFEE</Text>
          <Text style={styles.branchName}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleStorePress = (id) => {
    navigation.navigate("SeatList", { branchId: id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={branches}
        renderItem={renderStoreListContainer}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#93540A"]}
          />
        }
        ListHeaderComponent={
          <Text style={styles.headerText}>Danh sách cửa hàng:</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  storeListContainer: {
    marginHorizontal: 20,
  },
  storeDetailContainer: {
    flexDirection: "row",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    padding: PixelRatio.getPixelSizeForLayoutSize(5),
  },
  image: {
    height: PixelRatio.getPixelSizeForLayoutSize(30),
    width: PixelRatio.getPixelSizeForLayoutSize(30),
    borderRadius: 8,
  },
  storeDetail: {
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  basicName: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "#A8A8A8",
    marginVertical: PixelRatio.getPixelSizeForLayoutSize(4),
  },
  branchName: {
    fontSize: 16,
  },
});
