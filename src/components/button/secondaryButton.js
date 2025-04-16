import React from "react";
import { Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get("screen");

const SecondaryButton = ({ onPress, text, price, style }) => {
  return (
    <TouchableOpacity
      style={[styles.secondaryButtonContainer, style]}
      onPress={onPress}
    >
      <Text style={styles.secondaryButtonText}>{text}</Text>
      <Text style={styles.secondaryButtonText}>{price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  secondaryButtonContainer: {
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    width: width * 0.55,
    backgroundColor: "#93540A",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 6,
    color: "#ffffff",
  },
});

export default SecondaryButton;
