import React, { useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  PixelRatio,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GeneralButton from "../../../components/button/generalButton";
import useRoomDetail from "../../../hooks/useRoomDetail";

const { width, height } = Dimensions.get("window");

export default SeatDetail = function ({
  navigation,
  route,
  // events = [
  //   {
  //     id: 1,
  //     description: "Đã đặt",
  //     startDate: new Date(2024, 10, 18, 9, 0),
  //     endDate: new Date(2024, 10, 18, 10, 0),
  //     color: "#D3D3D3",
  //   },
  // ],
  // selectedDate = new Date(2024, 10, 18),
  // numberOfDays = 7,
  // hoursInDisplay = 7,
  // timeStep = 60,
  // formatDateHeader = "ddd",
  // locale = "vi",
  // startHour = 9,
  // endHour = 13,
}) {
  // const [eventList, setEvents] = useState(events);
  // const [dragStartDate, setDragStartDate] = useState(null);
  // const [tempEvent, setTempEvent] = useState(null); // Sự kiện tạm thời

  // const isTimeSlotAvailable = (newStartDate, newEndDate) => {
  //   return !eventList.some(
  //     (event) => newStartDate < event.endDate && newEndDate > event.startDate
  //   );
  // };

  // const onDragStart = (event, startHour, date) => {
  //   const startDate = new Date(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     date.getDate(),
  //     startHour,
  //     0
  //   );
  //   setDragStartDate(startDate);

  //   // Tạo sự kiện tạm thời với màu đặc biệt
  //   const temp = {
  //     id: "temp",
  //     description: "Đang chọn...",
  //     startDate: startDate,
  //     endDate: new Date(startDate.getTime() + 60 * 60 * 1000), // Tạm thời là 1 giờ
  //     color: "#ADD8E6", // Màu xanh nhạt để đánh dấu
  //   };
  //   setTempEvent(temp);
  // };

  // const onDragEnd = (event, endHour, date) => {
  //   if (dragStartDate) {
  //     const endDate = new Date(
  //       date.getFullYear(),
  //       date.getMonth(),
  //       date.getDate(),
  //       endHour,
  //       0
  //     );

  //     if (endDate <= dragStartDate) {
  //       Alert.alert("Lỗi", "Thời gian kết thúc phải sau thời gian bắt đầu.");
  //       setDragStartDate(null);
  //       setTempEvent(null); // Xóa sự kiện tạm thời nếu không hợp lệ
  //     } else if (isTimeSlotAvailable(dragStartDate, endDate)) {
  //       const newEvent = {
  //         id: eventList.length + 1,
  //         description: "Đã đặt",
  //         startDate: dragStartDate,
  //         endDate,
  //         color: "#D3D3D3",
  //       };

  //       Alert.alert(
  //         "Xác nhận đặt chỗ",
  //         `Bạn có muốn đặt chỗ từ ${dragStartDate.toLocaleTimeString()} đến ${endDate.toLocaleTimeString()} không?`,
  //         [
  //           {
  //             text: "Hủy",
  //             style: "cancel",
  //             onPress: () => {
  //               setDragStartDate(null);
  //               setTempEvent(null);
  //             },
  //           },
  //           {
  //             text: "Đồng ý",
  //             onPress: () => {
  //               setEvents((prevEvents) => [...prevEvents, newEvent]);
  //               setDragStartDate(null);
  //               setTempEvent(null);
  //             },
  //           },
  //         ]
  //       );
  //     } else {
  //       Alert.alert(
  //         "Thông báo",
  //         "Khung giờ đã được đặt, vui lòng chọn khung giờ khác."
  //       );
  //       setDragStartDate(null);
  //       setTempEvent(null);
  //     }
  //   }
  // };

  // const onGridClick = (event, hour, date) => {
  //   if (!dragStartDate) {
  //     onDragStart(event, hour, date);
  //   } else {
  //     // Cập nhật thời gian kết thúc của sự kiện tạm thời khi kéo
  //     const tempEndDate = new Date(
  //       date.getFullYear(),
  //       date.getMonth(),
  //       date.getDate(),
  //       hour,
  //       0
  //     );
  //     setTempEvent((prevTempEvent) => ({
  //       ...prevTempEvent,
  //       endDate: tempEndDate,
  //     }));
  //     onDragEnd(event, hour, date);
  //   }
  // };

  const { roomId } = route.params;
  console.log("📌 SeatDetail nhận roomId:", roomId);
  const { data: room, isLoading, error } = useRoomDetail(roomId);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#93540A" />
        <Text>Đang tải thông tin phòng...</Text>
      </View>
    );
  }

  if (error) {
    return <Text>Lỗi: {error.message}</Text>;
  }

  const utilities = [
    { id: "1", icon: "desk", text: "Bàn cao cấp & ghế công thái học" },
    { id: "2", icon: "cleaning-services", text: "Vệ sinh hằng ngày" },
    { id: "3", icon: "directions-car", text: "Miễn phí gửi xe" },
    { id: "4", icon: "wifi", text: "Wifi tốc độ cao" },
    { id: "5", icon: "ac-unit", text: "Máy lạnh" },
    { id: "6", icon: "health-and-safety", text: "Diệt khuẩn bằng UVC" },
  ];

  const handleBookingPress = () => {
    console.log("🚀 Chuyển sang đặt chỗ với roomId:", roomId);
    if (!roomId || typeof roomId !== "number") {
      console.error("Lỗi: roomId không hợp lệ tại SeatDetail:", roomId);
      Alert.alert("Lỗi", "Không thể lấy thông tin phòng.");
      return;
    }
    navigation.navigate("Đặt chỗ ngồi", { roomId });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.seatInformationContainer}>
          <View style={styles.seatImageContainer}>
            <Image
              source={{
                uri: room.images[0],
              }}
              style={styles.seatImage}
            />
          </View>
          <View style={styles.seatDescriptionContainer}>
            <Text style={styles.seatNameText}>{room.name}</Text>
            <Text style={styles.descriptionText}>{room.description}</Text>
          </View>
          <Text style={styles.utilitiesHeaderText}>Tiện ích</Text>
          <View style={styles.seatUtilities}>
            {utilities.map((utility, index) => (
              <View
                key={utility.id}
                style={[
                  styles.utilityItemContainer,
                  index === utilities.length - 1 && { borderBottomWidth: 0 }, // Xóa border cho mục cuối cùng
                ]}
              >
                <MaterialIcons
                  name={utility.icon}
                  size={24}
                  style={styles.utilityIcon}
                />
                <Text style={styles.utilityText}>{utility.text}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.utilitiesHeaderText}>Lưu ý</Text>
          <Text style={styles.noteText}>
            • Chỗ ngồi chỉ được đặt theo slot 30 phút, thời gian đặt chỗ tối
            thiểu là 30 phút.
          </Text>
        </View>
      </ScrollView>
      {/* <View style={styles.timeSelectContainer}>
        <WeekView
          events={tempEvent ? [...eventList, tempEvent] : eventList} // Hiển thị sự kiện tạm thời
          selectedDate={selectedDate}
          numberOfDays={numberOfDays}
          onEventPress={(event) => Alert.alert("Chi tiết", event.description)}
          onGridClick={onGridClick}
          hoursInDisplay={hoursInDisplay}
          timeStep={timeStep}
          formatDateHeader={formatDateHeader}
          locale={locale}
          startHour={startHour}
          endHour={endHour}
        />
      </View> */}
      <View style={styles.footerContainer}>
        <View style={styles.footerContent}>
          <View style={styles.footerInfo}>
            <Text style={styles.capacityText}>Số lượng tối đa:</Text>
            <Text style={styles.capacityText}>{room.capacity}</Text>
          </View>
          <View style={styles.footerInfo}>
            <Text style={styles.priceText}>Giá:</Text>
            <Text style={styles.priceText}>
              {room.price.toLocaleString()} VNĐ/giờ
            </Text>
          </View>
        </View>
        <GeneralButton
          text="Đặt chỗ ngồi"
          style={styles.footerButton}
          // textStyle={styles.footerButtonText}
          onPress={handleBookingPress}
        />
        <Text style={styles.noteText}>
          Phí đặt chỗ ngồi sẽ được hoàn trả 100% nếu hủy đặt chỗ trước 24 giờ.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContent: {
    paddingBottom: 50,
  },
  seatInformationContainer: {},
  seatImageContainer: {
    marginBottom: 12,
  },
  seatImage: {
    height: PixelRatio.getPixelSizeForLayoutSize(90),
    width: width,
  },
  seatDescriptionContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  seatNameText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#A8A8A8",
  },
  seatUtilities: {
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A8A8A8",
    marginBottom: 12,
  },
  utilitiesHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  utilityItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    width: "90%",
    alignSelf: "center",
    borderBottomColor: "#A8A8A8",
  },
  utilityIcon: {
    marginRight: 12,
    color: "#A8A8A8",
  },
  utilityText: {
    fontSize: 14,
    color: "#A8A8A8",
  },
  noteText: {
    fontSize: 14,
    color: "#A8A8A8",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  footerContainer: {
    borderTopWidth: 0.25,
    borderTopColor: "#A8A8A8",
    backgroundColor: "#FFFFFF",
  },
  footerContent: {
    flexDirection: "row",
  },
  footerInfo: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  footerButton: {
    marginBottom: 12,
  },
});
