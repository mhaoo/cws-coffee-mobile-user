import React, { useState } from "react";
import {
  Button,
  SafeAreaView, // SafeAreaView thường dùng ở cấp cao nhất, cân nhắc dùng nếu cần
  StyleSheet,
  Text,
  View,
  TextInput, // TextInput chưa dùng trong code này
  Dimensions,
  FlatList, // Thêm FlatList
  TouchableOpacity, // Thêm TouchableOpacity
  ActivityIndicator,
  Image,
} from "react-native";
import useUserBookings from "../../hooks/booking/useUserBookings";

const { width, height } = Dimensions.get("screen");

// --- Bắt đầu định nghĩa HorizontalStatusList ---
// Danh sách các trạng thái (đã dịch)
const STATUSES = [
  { id: "pending", title: "Chờ xử lý" },
  { id: "paid", title: "Đã đặt trước" },
  { id: "ongoing", title: "Đang diễn ra" },
  { id: "completed", title: "Đã hoàn thành" },
  { id: "canceled", title: "Đã hủy" },
];

const HorizontalStatusList = ({ selectedStatus, setSelectedStatus }) => {
  const renderStatusItem = ({ item }) => {
    const isSelected = item.id === selectedStatus;
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          isSelected && styles.selectedItemContainer,
        ]}
        onPress={() => {
          setSelectedStatus(item.id);
          console.log("Selected Status:", item.title);
          // Thêm logic xử lý khi chọn trạng thái
        }}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.statusListContainer}>
      {/* Đổi tên style container để tránh trùng */}
      <FlatList
        data={STATUSES}
        renderItem={renderStatusItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};
// --- Kết thúc định nghĩa HorizontalStatusList ---

// Component chính ListBooking
export default ListBooking = function ({ navigation }) {
  // State for current status filter
  const [selectedStatus, setSelectedStatus] = useState(STATUSES[0].id);
  // Fetch current user's bookings
  const { data: bookings = [], isLoading, error } = useUserBookings();
  const now = new Date();

  // Process bookings to map into UI items and determine status tab
  const processed = (bookings || []).map((b) => {
    // parse start/end times
    const dateStr = b.bookingDate;
    const pad = (n) => String(n).padStart(2, "0");
    const start = new Date(
      `${dateStr}T${pad(b.startTime.hour)}:${pad(b.startTime.minute)}:00`
    );
    const end = new Date(
      `${dateStr}T${pad(b.endTime.hour)}:${pad(b.endTime.minute)}:00`
    );
    // determine tab status
    let statusId = "pending";
    if (b.status === "PENDING") statusId = "pending";
    else if (b.status === "PAID") statusId = "paid";
    else if (b.status === "CONFIRMED") {
      const today = now.toISOString().split("T")[0];
      if (dateStr === today && now >= start && now <= end) statusId = "ongoing";
      else if (now > end) statusId = "completed";
      else statusId = "paid";
    } else if (b.status === "CANCELED" || b.status === "EXPIRED")
      statusId = "canceled";
    return {
      id: String(b.id),
      room: b.room.name || b.room.code,
      capacity: b.room.capacity,
      price: b.price,
      date: dateStr,
      image: b.room.images?.[0] || "https://via.placeholder.com/80",
      startTime: `${pad(b.startTime)}`,
      endTime: `${pad(b.endTime)}`,
      status: statusId,
    };
  });
  // Filter by selected status
  const filteredBookings = processed.filter((b) => b.status === selectedStatus);

  // Render individual booking item
  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingItem}
      onPress={() => navigation.navigate("BookingDetail", { booking: item })}
    >
      <Image source={{ uri: item.image }} style={styles.bookingImage} />
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingTitle}>{item.room}</Text>
        <Text style={styles.bookingDetail}>Số lượng: {item.capacity}</Text>
        <Text style={styles.bookingDetail}>
          Giá: {item.price.toLocaleString()} VNĐ
        </Text>
        <Text style={styles.bookingDetail}>Ngày: {item.date}</Text>
        <Text style={styles.bookingDetail}>
          Thời gian: {item.startTime} - {item.endTime}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Status filter tabs */}
      <HorizontalStatusList
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Booking list or empty state */}
      <View style={styles.contentArea}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#93540A" />
        ) : error ? (
          <Text>Lỗi tải lịch: {error.message}</Text>
        ) : filteredBookings.length === 0 ? (
          <Text>Hiện chưa có lịch đặt chỗ nào.</Text>
        ) : (
          <FlatList
            style={styles.list}
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBookingItem}
          />
        )}
      </View>
    </View>
  );
};

// Gộp tất cả styles vào một StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  contentArea: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  list: {
    width: "100%",
  },
  bookingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  bookingDetail: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 4,
  },
  // Styles cho HorizontalStatusList (copy từ trước)
  statusListContainer: {
    paddingVertical: 10,
    backgroundColor: "#f0f0f0", // Hoặc màu nền bạn muốn
    borderBottomWidth: 1, // Thêm đường viền dưới nếu muốn tách biệt
    borderBottomColor: "#e0e0e0",
  },
  listContentContainer: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedItemContainer: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  itemText: {
    fontSize: 14,
    color: "#333333",
  },
  selectedItemText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
