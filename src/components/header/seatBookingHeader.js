import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  PixelRatio,
  TextInput,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";

const screenWidth = Dimensions.get("screen").width;
const headerHeightAndroid = PixelRatio.getPixelSizeForLayoutSize(64);
const headerHeightIOS = PixelRatio.getPixelSizeForLayoutSize(64);

export default SeatBookingHeader = function ({ navigation }) {
  const handleNotificationPress = () => {
    navigation.navigate("Giỏ hàng");
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.upperHeader}>
        <Text style={styles.headerText}>Đặt chỗ</Text>
        <TouchableOpacity
          onPress={handleNotificationPress}
          style={styles.notificationContainer}
        >
          <FontAwesome5 name="bell" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>
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
});
