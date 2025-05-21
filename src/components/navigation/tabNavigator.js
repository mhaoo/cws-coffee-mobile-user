import { React } from "react";
import { StyleSheet, Platform } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import home from "../../screens/general/home/home";
import product from "../../screens/general/product/product";
import seatBooking from "../../screens/general/seatBooking/seatBooking";
import rank from "../../screens/general/rank/rank";
import others from "../../screens/general/others/others";
import Scanner from "../../screens/general/scan/scanner";
import listBooking from "../../screens/bottom-tab/listBooking";

import BasicHeader from "../header/basicHeader";
import ProductHeader from "../header/productHeader";
import SeatBookingHeader from "../header/seatBookingHeader";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: "#93540A",
        tabBarInactiveTintColor: "#A8A8A8",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          ...Platform.select({
            android: {
              marginTop: -5,
            },
          }),
        },
      })}
    >
      {/* <Tab.Screen
        name="Trang chủ"
        component={home}
        options={{
          header: ({ navigation }) => <HomeHeader navigation={navigation} />,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={focused ? "#93540A" : "#A8A8A8"}
              size={24}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Đặt phòng"
        component={seatBooking}
        options={{
          header: ({ navigation }) => (
            <SeatBookingHeader navigation={navigation} />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="seat-outline"
              color={focused ? "#93540A" : "#A8A8A8"}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Lịch đặt"
        component={listBooking}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader
              navigation={navigation}
              route={route}
              title="Lịch đặt chỗ của tôi"
              showBackButton={false}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="calendar"
              color={focused ? "#93540A" : "#A8A8A8"}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Sản phẩm"
        component={product}
        options={{
          header: ({ navigation }) => <ProductHeader navigation={navigation} />,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="coffee-outline"
              color={focused ? "#93540A" : "#A8A8A8"}
              size={24}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Quét mã"
        component={Scanner}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="line-scan"
              color={focused ? "#93540A" : "#A8A8A8"}
              size={24}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Hạng"
        component={rank}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="tag-heart-outline"
              color={focused ? "#93540A" : "#A8A8A8"}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Khác"
        component={others}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="menu"
              color={focused ? "#93540A" : "#A8A8A8"}
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    ...Platform.select({
      android: {
        height: 56,
      },
      ios: {},
    }),
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
  },
});
