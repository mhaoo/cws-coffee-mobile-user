import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";

export default OrderHistory = function ({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("inProgress"); // "inProgress" or "completed"

  const handleOrderPress = (orderId) => {
    navigation.navigate("OrderDetail", { orderId });
  };

  // Dữ liệu mẫu cho danh sách đơn hàng
  const orders = [
    {
      id: "1000123",
      date: "16/03/2024",
      items: [
        { name: "Cà phê Hà...", image: "image-url-1" },
        { name: "Cà phê ủ...", image: "image-url-2" },
        { name: "Cà phê ủ...", image: "image-url-3" },
      ],
      total: "200.000 vnd",
      itemCount: 4,
    },
    {
      id: "1000122",
      date: "15/03/2024",
      items: [
        { name: "Cà phê Hà...", image: "image-url-1" },
        { name: "Cà phê ủ...", image: "image-url-2" },
        { name: "Cà phê ủ...", image: "image-url-3" },
      ],
      total: "150.000 vnd",
      itemCount: 3,
    },
    {
      id: "1000121",
      date: "15/03/2024",
      items: [
        { name: "Cà phê Hà...", image: "image-url-1" },
        { name: "Cà phê ủ...", image: "image-url-2" },
        { name: "Cà phê ủ...", image: "image-url-3" },
      ],
      total: "150.000 vnd",
      itemCount: 3,
    },
    {
      id: "1000120",
      date: "15/03/2024",
      items: [
        { name: "Cà phê Hà...", image: "image-url-1" },
        { name: "Cà phê ủ...", image: "image-url-2" },
        { name: "Cà phê ủ...", image: "image-url-3" },
      ],
      total: "150.000 vnd",
      itemCount: 3,
    },
    {
      id: "1000119",
      date: "15/03/2024",
      items: [
        { name: "Cà phê Hà...", image: "image-url-1" },
        { name: "Cà phê ủ...", image: "image-url-2" },
        { name: "Cà phê ủ...", image: "image-url-3" },
      ],
      total: "150.000 vnd",
      itemCount: 3,
    },
    {
      id: "1000118",
      date: "15/03/2024",
      items: [
        { name: "Cà phê Hà...", image: "image-url-1" },
        { name: "Cà phê ủ...", image: "image-url-2" },
        { name: "Cà phê ủ...", image: "image-url-3" },
      ],
      total: "150.000 vnd",
      itemCount: 3,
    },
    {
      id: "1000117",
      date: "15/03/2024",
      items: [
        { name: "Cà phê Hà...", image: "image-url-1" },
        { name: "Cà phê ủ...", image: "image-url-2" },
        { name: "Cà phê ủ...", image: "image-url-3" },
      ],
      total: "150.000 vnd",
      itemCount: 3,
    },
  ];

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderContainer}
      onPress={() => handleOrderPress(item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Đồ ăn #{item.id}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      <View style={styles.orderContent}>
        <FlatList
          data={item.items}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>{item.total}</Text>
          <Text style={styles.orderItemCount}>{item.itemCount} món</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "inProgress" && styles.activeTab]}
          onPress={() => setSelectedTab("inProgress")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "inProgress" && styles.activeTabText,
            ]}
          >
            Đang thực hiện
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "completed" && styles.activeTab]}
          onPress={() => setSelectedTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "completed" && styles.activeTabText,
            ]}
          >
            Đã hoàn tất
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách đơn hàng */}
      {selectedTab === "inProgress" && orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: "empty-image-url" }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>
            Chưa có đơn hàng{" "}
            {selectedTab === "inProgress" ? "đang thực hiện" : "đã hoàn tất"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#B5835A",
    marginHorizontal: 10,
  },
  activeTab: {
    backgroundColor: "#B5835A",
  },
  tabText: {
    fontSize: 16,
    color: "#B5835A",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  orderContainer: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#888",
  },
  orderContent: {
    marginTop: 10,
  },
  itemContainer: {
    alignItems: "center",
    marginRight: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  itemText: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderItemCount: {
    fontSize: 14,
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
