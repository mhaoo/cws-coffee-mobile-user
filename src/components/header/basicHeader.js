// basicHeader.js
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
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

const headerHeight = Platform.select({
  android: PixelRatio.getPixelSizeForLayoutSize(36),
  ios: PixelRatio.getPixelSizeForLayoutSize(36),
});

const placeholderWidth = iconSize + 10;
const iconSize = 28;

export default BasicHeader = function ({
  navigation,
  route,
  title,
  showBackButton = true,
}) {
  const headerTitle = title || route?.name || "";

  return (
    <SafeAreaView style={styles.headerContainer}>
      {/* Phần bên trái: Nút back hoặc Placeholder */}
      {showBackButton ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Feather name="chevron-left" size={iconSize} style={styles.icon} />
          </TouchableOpacity>
        </View>
      ) : (
        // Render một View trống để giữ khoảng trống nếu không có nút back
        <View style={styles.placeholder} />
      )}

      {/* Phần giữa: Tiêu đề */}
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText} numberOfLines={1}>
          {headerTitle}
        </Text>
      </View>

      {/* Phần bên phải: Placeholder để cân bằng với bên trái */}
      <View style={styles.placeholder} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: headerHeight,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#F7B75740",
  },
  buttonContainer: {
    width: placeholderWidth,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  placeholder: {
    width: placeholderWidth,
    height: "100%",
  },
  icon: {
    color: "black",
  },
});
