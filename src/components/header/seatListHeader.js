import React, { useState, useEffect } from "react";
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
import useRoomTypes from "../../hooks/room/useRoomTypes";

const screenWidth = Dimensions.get("screen").width;
const headerHeightAndroid = PixelRatio.getPixelSizeForLayoutSize(36);
const headerHeightIOS = PixelRatio.getPixelSizeForLayoutSize(36);

export default SeatListHeader = function ({ navigation, route }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedRoomName, setSelectedRoomName] = useState("");

  const { data: roomTypes = [], isLoading: typesLoading, error: typesError } = useRoomTypes();
  const branchId = route.params?.branchId;

  // Populate dropdown items when roomTypes fetched
  useEffect(() => {
    if (roomTypes && roomTypes.length > 0) {
      const mapped = roomTypes.map((rt) => ({ label: rt.name, value: rt.id }));
      setItems(mapped);
      // Optionally select first by default
      if (!selectedValue) {
        setSelectedValue(mapped[0].value);
        navigation.setParams({ branchId, roomTypeId: mapped[0].value });
      }
    }
  }, [roomTypes]);

  const handleDropdownChange = (value) => {
    const selected = typeof value === "function" ? value(selectedValue) : value;
    setSelectedValue(selected);
    navigation.setParams({ branchId, roomTypeId: selected });
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
        placeholder={typesLoading ? "Đang tải..." : "Chọn loại phòng"}
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
          fontSize: 14,
          color: "black",
        }}
        textStyle={{ fontSize: 14, color: "black" }}
        placeholderStyle={{ fontSize: 14, color: "#A8A8A8" }}
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
