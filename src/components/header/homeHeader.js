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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
const headerHeightAndroid = PixelRatio.getPixelSizeForLayoutSize(36);
const headerHeightIOS = PixelRatio.getPixelSizeForLayoutSize(36);

export default HomeHeader = function ({ navigation }) {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <Text style={styles.headerText}>Chao ban moi</Text>
      <TouchableOpacity>
        <FontAwesome5 name="shopping-cart" size={28} style={styles.icon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: "#F7B75740",
    height: Platform.OS === "android" ? headerHeightAndroid : headerHeightIOS,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: screenWidth * 0.06,
    marginBottom: screenWidth * 0.04,
  },
  icon: {
    marginBottom: screenWidth * 0.04,
    marginRight: screenWidth * 0.06,
  },
});
