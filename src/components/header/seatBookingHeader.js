import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  PixelRatio,
  TextInput,
} from "react-native";
import { useQueries } from "@tanstack/react-query";
import useNotifications from "../../hooks/notification/useNotifications";
import authApi from "../../api/authApi";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";

const screenWidth = Dimensions.get("screen").width;
const headerHeightAndroid = PixelRatio.getPixelSizeForLayoutSize(64);
const headerHeightIOS = PixelRatio.getPixelSizeForLayoutSize(64);

export default SeatBookingHeader = function ({ navigation }) {
  // State to show/hide notifications dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const handleNotificationPress = () => {
    setShowDropdown((prev) => !prev);
  };
  // Fetch list of notifications
  const { data: notifications = [], isLoading: notifsLoading } =
    useNotifications();
  // Fetch details for each notification when dropdown is open
  const detailQueries = useQueries({
    queries: showDropdown
      ? notifications.map((n) => ({
          queryKey: ["notificationDetail", n.id],
          queryFn: async () => {
            const res = await authApi.getNotificationDetailById(n.id);
            return res.data;
          },
          enabled: showDropdown,
          staleTime: 1000 * 60 * 5,
        }))
      : [],
  });

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.upperHeader}>
        <Text style={styles.headerText}>Đặt phòng</Text>
        <TouchableOpacity
          onPress={handleNotificationPress}
          style={styles.notificationContainer}
        >
          <Fontisto name="bell" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {/* Dropdown list of notification details */}
      {showDropdown && (
        <View style={styles.dropdownContainer}>
          {notifsLoading && <Text>Đang tải thông báo...</Text>}
          {!notifsLoading && (
            <ScrollView
              style={styles.dropdownScroll}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator
            >
              {detailQueries.map((q, idx) => {
                const notif = notifications[idx];
                if (q.isLoading)
                  return <Text key={notif.id}>Đang tải chi tiết...</Text>;
                if (q.error) return <Text key={notif.id}>Lỗi tải</Text>;
                const { title, content, createdAt } = q.data;
                return (
                  <View key={notif.id} style={styles.dropdownItem}>
                    <Text style={styles.notifTitle}>{title}</Text>
                    <Text style={styles.notifContent}>
                      {content.replace(/<br\s*\/?>(?:\s*)/gi, "\n")}
                    </Text>
                    <Text style={styles.notifTime}>
                      {new Date(createdAt).toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
      <View style={styles.lowerHeader}>
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Feather name="search" size={24} color={"#93540A"} />
          </View>
          <TextInput
            placeholder="Tìm kiếm cửa hàng"
            placeholderTextColor="#A8A8A8"
          ></TextInput>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#F7B75740",
    height: Platform.OS === "android" ? headerHeightAndroid : headerHeightIOS,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    overflow: "visible",
    zIndex: 10,
  },
  upperHeader: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: screenWidth * 0.06,
    marginBottom: screenWidth * 0.04,
  },
  notificationContainer: {
    marginBottom: screenWidth * 0.03,
    marginRight: screenWidth * 0.03,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    //* Shadow cho iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 }, // X=0, Y=2
    shadowOpacity: 0.25, // tương đương 25%
    shadowRadius: 4, // blur=4
    //* Shadow cho Android
    elevation: 4, // độ đậm của bóng
    backgroundColor: "#F1F1F1",
  },
  icon: {
    color: "#93540A",
  },
  lowerHeader: {
    flex: 0.5,
    justifyContent: "center",
  },
  searchContainer: {
    flex: 0.6,
    flexDirection: "row",
    borderRadius: 8,
    marginHorizontal: 20,
    backgroundColor: "#F1F1F1",
  },
  searchIconContainer: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? headerHeightAndroid : headerHeightIOS,
    left: 0,
    right: 0,
    backgroundColor: "#F1F1F1",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    zIndex: 100,
    elevation: 10,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  notifContent: {
    fontSize: 14,
    marginTop: 5,
  },
  notifTime: {
    fontSize: 12,
    marginTop: 5,
    color: "#A8A8A8",
  },
});
