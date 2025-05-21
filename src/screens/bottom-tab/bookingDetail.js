import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import GeneralButton from "../../components/button/generalButton";
import useOrdersByBookingId from "../../hooks/order/useOrdersByBookingId";
import useOrderDetailsById from "../../hooks/order/useOrderDetailsById";
import useDeleteItemToOrder from "../../hooks/order/useDeleteItemToOrder";
import { useFocusEffect } from "@react-navigation/native";

export default function BookingDetail({ route, navigation }) {
  const { booking } = route.params;
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const { data: orders = [], isLoading: loadingOrders, error: errorOrders, refetch: refetchOrders } = useOrdersByBookingId(booking.id);
  const deleteMutation = useDeleteItemToOrder();

  // Refetch orders whenever this screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      refetchOrders();
    }, [refetchOrders])
  );

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderIds(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  // Component to display order details and handle item deletion, scoped inside BookingDetail
  const OrderDetails = ({ orderId }) => {
    const { data: orderDetails, isLoading, error, refetch } = useOrderDetailsById(orderId);
    return (
      <View style={{ marginTop: 8, paddingLeft: 12 }}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#93540A" />
        ) : error ? (
          <Text style={{ color: 'red' }}>Lỗi: {error.message}</Text>
        ) : (
          orderDetails?.items?.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image
                source={{ uri: item.images?.[0] || 'https://via.placeholder.com/50' }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>Size: {item.size}</Text>
                <Text style={styles.itemDetails}>
                  x{item.quantity} • {item.price.toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  deleteMutation.mutate(item.id, {
                    onSuccess: () => {
                      refetch();
                      refetchOrders();
                    },
                  })
                }
              >
                <Text style={{ color: 'red' }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        <TouchableOpacity
          style={{ marginTop: 8 }}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'Sản phẩm',
              params: { booking, orderId },
            })
          }
        >
          <Text style={{ color: '#93540A' }}>Chuẩn bị món</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: booking.image }} style={styles.roomImage} />
        <Text style={styles.title}>{booking.room}</Text>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Số lượng tối đa</Text>
            <Text style={styles.value}>{booking.capacity}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá</Text>
            <Text style={styles.value}>
              {booking.price.toLocaleString()} VNĐ
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày</Text>
            <Text style={styles.value}>{booking.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Thời gian</Text>
            <Text style={styles.value}>
              {booking.startTime} - {booking.endTime}
            </Text>
          </View>
        </View>

        {booking.items && booking.items.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.subheading}>Các sản phẩm đã đặt</Text>
            {booking.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    x{item.quantity} • {item.price.toLocaleString()} VNĐ
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Orders Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Đơn hàng</Text>
          {loadingOrders ? (
            <ActivityIndicator size="small" color="#93540A" />
          ) : errorOrders ? (
            <Text style={{ color: 'red' }}>Lỗi tải đơn hàng: {errorOrders.message}</Text>
          ) : orders.length === 0 ? (
            <Text>Chưa có đơn hàng.</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.label}>Đơn #{order.id}</Text>
                  <TouchableOpacity onPress={() => toggleOrderDetails(order.id)}>
                    <Text style={{ color: '#93540A' }}>
                      {expandedOrderIds.includes(order.id) ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {expandedOrderIds.includes(order.id) && (
                  <OrderDetails orderId={order.id} />
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <GeneralButton
          text="Chuẩn bị món"
          onPress={() =>
            navigation.navigate("Home", {
              screen: "Sản phẩm",
              params: { booking },
            })
          }
          style={styles.actionButton}
          textStyle={styles.buttonText}
        />
        <GeneralButton
          text="Thuê thiết bị"
          onPress={() => navigation.navigate("EquipmentRental", { booking })}
          style={[styles.actionButton, styles.rentButton]}
          textStyle={styles.buttonText}
        />
        <GeneralButton
          text="Xác nhận thanh toán"
          onPress={() =>
            navigation.navigate("Xác nhận đặt chỗ", { bookingId: booking.id })
          }
          style={[styles.actionButton, styles.confirmButton]}
          textStyle={styles.buttonText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  roomImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  label: {
    fontSize: 14,
    color: "#4B5563",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  itemDetails: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 30 : 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3B82F6",
  },
  rentButton: {
    backgroundColor: "#10B981",
  },
  confirmButton: {
    backgroundColor: "#93540A",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
