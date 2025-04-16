import React, { useState, useRef } from "react";
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
import Feather from "react-native-vector-icons/Feather";
import DropDownPicker from "react-native-dropdown-picker";

const screenWidth = Dimensions.get("screen").width;
const headerHeightAndroid = PixelRatio.getPixelSizeForLayoutSize(36);
const headerHeightIOS = PixelRatio.getPixelSizeForLayoutSize(36);

export default SeatListHeader = function ({ navigation }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [items, setItems] = useState([]);
  const [selectedRoomName, setSelectedRoomName] = useState("");

  const handleDropdownChange = (value) => {
    const selectedRoomId =
      typeof value === "function" ? value(selectedValue) : value;
    setSelectedValue(selectedRoomId);

    const selectedRoom = items.find((item) => item.value === selectedRoomId);
    if (selectedRoom) {
      setSelectedRoomName(selectedRoom.label);
    }

    onSelectRoom(selectedRoomId);
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Feather name="chevron-left" size={28} style={styles.icon} />
      </TouchableOpacity>
      <DropDownPicker
        open={open}
        items={items}
        value={selectedValue}
        setOpen={setOpen}
        setValue={handleDropdownChange}
        setItems={setItems}
        placeholder="Loại phòng:"
        style={{
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "#93540A",
        }}
        containerStyle={styles.dropdownContainer}
        dropDownContainerStyle={{
          borderTopWidth: 0,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "#93540A",
        }}
        selectedItemContainerStyle={{
          backgroundColor: "rgba(27, 97, 181, 0.1)",
        }}
        labelStyle={{
          paddingLeft: 5,
          fontSize: 20,
          color: "black",
        }}
        arrowIconStyle={{
          tintColor: "#93540A",
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7B75740",
    height: Platform.OS === "android" ? headerHeightAndroid : headerHeightIOS,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  icon: {
    color: "black",
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 12,
    // backgroundColor: "white",
  },
  // iconContainer: {
  //   flex: 0.2,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "rgba(0,0,0,0.5)",
  // },
  // modalContent: {
  //   padding: 16,
  //   borderRadius: 10,
  //   elevation: 5,
  //   width: 0.8 * screenWidth,
  //   backgroundColor: "white",
  // },
  // informContainer: {
  //   padding: 10,
  //   marginVertical: 10,
  //   borderRadius: 10,
  //   alignItems: "center",
  //   backgroundColor: "rgba(27, 97, 181, 0.10)",
  // },
  // label: {
  //   fontSize: 20,
  //   fontFamily: "Poppins_400Regular",
  //   color: "rgba(27, 97, 181, 0.89)",
  // },
});
