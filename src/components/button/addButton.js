import React from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddButton = ({ onPress, iconName }) => {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Ionicons name={iconName} size={20} color={"white"}></Ionicons>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    height: PixelRatio.getPixelSizeForLayoutSize(12),
    width: PixelRatio.getPixelSizeForLayoutSize(12),
    borderRadius: PixelRatio.getPixelSizeForLayoutSize(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#93540A",
  },
});

export default AddButton;
