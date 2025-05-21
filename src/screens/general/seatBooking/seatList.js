import React, { useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  PixelRatio,
  ScrollView,
  Platform,
  Animated,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import GeneralButton from "../../../components/button/generalButton";
import useBranchDetail from "../../../hooks/useBranchDetail";
import useRoomsByBranch from "../../../hooks/useRoomsByBranch";
import useRoomsByBranchIdAndRoomTypeId from "../../../hooks/room/useRoomsByBranchIdAndRoomTypeId";

const { width, height } = Dimensions.get("screen");

export default SeatList = function ({ route, navigation }) {
  const { branchId, roomTypeId } = route.params;

  //* Lấy dữ liệu chi nhánh
  const {
    data: branch,
    isLoading: isBranchLoading,
    error: branchError,
  } = useBranchDetail(branchId);

  //* Lấy dữ liệu phòng theo chi nhánh và loại phòng
  const {
    data: rooms,
    isLoading: isRoomsLoading,
    error: roomsError,
  } = roomTypeId
    ? useRoomsByBranchIdAndRoomTypeId(branchId, roomTypeId)
    : useRoomsByBranch(branchId);

  //* Nếu đang tải dữ liệu, hiển thị loading
  if (isBranchLoading || isRoomsLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#93540A" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  //* Nếu có lỗi, hiển thị thông báo lỗi
  if (branchError || roomsError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Lỗi: {branchError?.message || roomsError?.message}
        </Text>
      </View>
    );
  }

  //* Nếu branch vẫn chưa có dữ liệu (trường hợp re-fetch hay chuyển đổi), hiển thị fallback UI
  if (!branch) {
    return (
      <View style={styles.centered}>
        <Text>Đang tải thông tin chi nhánh...</Text>
      </View>
    );
  }

  //* Render header chứa thông tin chi nhánh
  const renderHeader = () => (
    <View style={styles.storeDetailContainer}>
      <View style={styles.storeImageContainer}>
        {branch?.images && branch.images.length > 0 ? (
          <Image source={{ uri: branch.images[0] }} style={styles.storeImage} />
        ) : (
          <Text>Không có ảnh</Text>
        )}
      </View>
      <View style={styles.storeDescriptionContainer}>
        <Text style={styles.branchText}>
          {branch?.name || "Không có thông tin"}
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>
            {branch?.address || "Không có thông tin"}
          </Text>
        </View>
        <View style={styles.clockContainer}>
          <Feather name="clock" size={20} style={styles.clockIcon} />
          <Text style={styles.clockText}>Mở cửa: 06:00 - 22:00</Text>
        </View>
        <View style={styles.phoneContainer}>
          <Feather name="phone" size={20} style={styles.phoneIcon} />
          <Text style={styles.phoneText}>
            {branch?.phone || "Không có thông tin"}
          </Text>
        </View>
        <Text style={styles.descriptionHeaderText}>Giới thiệu</Text>
        <Text style={styles.descriptionText}>
          {branch?.bio || "Không có mô tả về chi nhánh này."}
        </Text>
      </View>
    </View>
  );

  const renderRoomList = ({ item }) => (
    <TouchableOpacity
      style={styles.roomDetailContainer}
      onPress={() => handleBookingPress(item.id)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.images[0],
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.roomInformationContainer}>
        <View style={styles.roomInformation}>
          <Text style={styles.roomName}>{item.name}</Text>
          <Text style={styles.capacity}>Số lượng tối đa: {item.capacity}</Text>
          <Text style={styles.price}>
            Giá: {item.price.toLocaleString()} VNĐ
          </Text>
        </View>
        <GeneralButton
          text="Đặt chỗ"
          style={styles.customSecondaryButton}
          onPress={() => handleBookingPress(item.id)}
        />
      </View>
    </TouchableOpacity>
  );

  const handleBookingPress = (roomId) => {
    console.log("Đang chuyển đến SeatDetail với roomId:", roomId);
    navigation.navigate("Chi tiết chỗ ngồi", { roomId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        renderItem={renderRoomList}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  storeDetailContainer: {
    marginBottom: 20,
  },
  storeImageContainer: {
    marginBottom: 12,
  },
  storeImage: {
    height: PixelRatio.getPixelSizeForLayoutSize(90),
    width: width,
  },
  storeDescriptionContainer: {
    marginHorizontal: 20,
  },
  branchText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationIcon: {
    color: "#A8A8A8",
    paddingRight: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: "#A8A8A8",
  },
  clockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  clockIcon: {
    color: "#A8A8A8",
    paddingRight: 12,
  },
  clockText: {
    flex: 1,
    fontSize: 14,
    color: "#A8A8A8",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  phoneIcon: {
    color: "#A8A8A8",
    paddingRight: 12,
  },
  phoneText: {
    flex: 1,
    fontSize: 14,
    color: "#A8A8A8",
  },
  imageContainer: {
    flex: 0.3,
    alignItems: "center",
  },
  image: {
    height: PixelRatio.getPixelSizeForLayoutSize(80),
    width: width - 40,
    marginBottom: 12,
  },
  descriptionHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#A8A8A8",
  },
  roomDetailContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  roomInformationContainer: {
    flexDirection: "row",
  },
  roomInformation: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  capacity: {
    fontSize: 14,
    color: "#A8A8A8",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#A8A8A8",
  },
  customSecondaryButton: {
    height: height * 0.045,
    width: width * 0.25,
    marginHorizontal: 0,
  },
});
