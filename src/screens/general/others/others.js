import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("screen");

const sections = [
  {
    title: "Thiết bị",
    data: [{ icon: "desktop-windows", title: "Thuê thiết bị" }],
  },
  {
    title: "CWSMates",
    data: [{ icon: "forum", title: "Kết nối diễn đàn" }],
  },
  {
    title: "Tài khoản",
    data: [
      { icon: "person", title: "Thông tin cá nhân" },
      { icon: "feedback", title: "Gửi góp ý về ứng dụng" },
      { icon: "receipt", title: "Đơn hàng của tôi" },
      { icon: "logout", title: "Đăng xuất" },
    ],
  },
  {
    title: "Khác",
    data: [{ icon: "local-offer", title: "Khuyến mãi và tuyển dụng" }],
  },
];

export default Others = function ({ navigation }) {
  const handleOrderHistoryPress = () => {
    navigation.navigate("Đơn hàng của tôi");
  };

  const handleUserInformationPress = () => {
    navigation.navigate("Thông tin cá nhân");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        if (item.title === "Đơn hàng của tôi") {
          handleOrderHistoryPress();
        } else if (item.title === "Thông tin cá nhân") {
          handleUserInformationPress();
        } else if (item.title === "Kết nối diễn đàn") {
          navigation.navigate("Forum"); // Navigate đến màn hình diễn đàn
        }
      }}
    >
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={24} color="#333" />
      </View>
      <Text style={styles.itemText}>{item.title}</Text>
      <Icon name="chevron-right" size={24} color="#333" />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.title + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
});
