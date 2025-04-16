import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DropDownPicker from "react-native-dropdown-picker";

export default UserInformation = function ({ navigation }) {
  const [gender, setGender] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://mcdn.coolmate.me/image/July2023/gigachad-la-ai-2138_928.jpg",
          }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraIcon}>
          <Icon name="photo-camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder="Hào" />
      <TextInput style={styles.input} placeholder="Võ Mạnh" />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputDisabled}
          placeholder="vomanhhao@gmail.com"
          editable={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputDisabled}
          placeholder="09/09/2001"
          editable={false}
        />
        <Icon
          name="calendar-today"
          size={20}
          color="#fff"
          style={styles.icon}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputDisabled}
          placeholder="0365426461"
          editable={false}
        />
        <Icon name="phone" size={20} color="#fff" style={styles.icon} />
      </View>
      {/* <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Chọn giới tính" />
        <Icon name="arrow-drop-down" size={24} color="#333" />
      </View> */}

      <DropDownPicker
        open={open}
        value={gender}
        items={items}
        setOpen={setOpen}
        setValue={setGender}
        setItems={setItems}
        placeholder="Chọn giới tính"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <TextInput style={styles.input} placeholder="Nhập địa chỉ" />
      <TextInput style={styles.input} placeholder="Nhập nghề nghiệp của bạn" />
      <TextInput style={styles.input} placeholder="Nhập sở thích của bạn" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#333",
    borderRadius: 50,
    padding: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    flex: 1,
  },
  inputDisabled: {
    flex: 1,
    height: 40,
    color: "#000",
  },
  icon: {
    marginLeft: 10,
  },
  dropdown: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 15,
    borderColor: "#E0E0E0",
  },
  dropdownContainer: {
    backgroundColor: "#E0E0E0",
    borderColor: "#E0E0E0",
  },
});
