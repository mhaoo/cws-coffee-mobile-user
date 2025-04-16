import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("screen");

export default Home = function ({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>This is Home screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
});
