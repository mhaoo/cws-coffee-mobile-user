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
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("screen").width;
const headerHeightAndroid = PixelRatio.getPixelSizeForLayoutSize(36);
const headerHeightIOS = PixelRatio.getPixelSizeForLayoutSize(36);

export default ProductDetailHeader = function ({ scrollOpacity }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.closeButton}>
        <Ionicons name={"close"} size={20} color={"black"}></Ionicons>
        <Text style={styles.headerText}>Danh mục</Text>
      </TouchableOpacity>
    </View>
    // <Animated.View style={[styles.headerContainer, { opacity: scrollOpacity }]}>
    //   <TouchableOpacity style={styles.closeButton}>
    //     <Ionicons name={"close"} size={20} color={"black"} />
    //   </TouchableOpacity>
    // </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    // position: "absolute",
    flexDirection: "row",
    // width: "100%",
    height: Platform.OS === "android" ? headerHeightAndroid : headerHeightIOS,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
  },
  closeButton: {
    height: PixelRatio.getPixelSizeForLayoutSize(12),
    width: PixelRatio.getPixelSizeForLayoutSize(12),
    borderRadius: PixelRatio.getPixelSizeForLayoutSize(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
