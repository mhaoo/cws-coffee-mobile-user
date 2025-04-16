import { createStackNavigator } from "@react-navigation/stack";
import login from "../../screens/general/login/login";
import forgotPassword from "../../screens/general/login/forgotPassword";
import register from "../../screens/general/register/register";
import BasicHeader from "../header/basicHeader";
import HomeHeader from "../header/homeHeader";
import home from "../../screens/general/home/home";
import BottomTabNavigator from "./tabNavigator";
import productDetail from "../../screens/general/product/productDetail";
import ProductDetailHeader from "../header/productDetailHeader";
import seatList from "../../screens/general/seatBooking/seatList";
import SeatListHeader from "../header/seatListHeader";
import seatDetail from "../../screens/general/seatBooking/seatDetail";
import cart from "../../screens/general/cart/cart";
import orderHistory from "../../screens/general/order/orderHistory";
import orderDetail from "../../screens/general/order/orderDetail";
import userInformation from "../../screens/general/others/userInformation";
import seatBookingDetail from "../../screens/general/seatBooking/seatBookingDetail";
import seatBookingSummary from "../../screens/general/seatBooking/seatBookingSummary";
import ForumScreen from "../../screens/general/others/forumScreen";
import NewPostScreen from "../../screens/general/others/newPostScreen";
import CommentScreen from "../../screens/general/others/commentScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Quên mật khẩu"
        component={forgotPassword}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="Đăng ký"
        component={register}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={productDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SeatList"
        component={seatList}
        options={{
          header: ({ navigation }) => (
            <SeatListHeader navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="Chi tiết chỗ ngồi"
        component={seatDetail}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="Đặt chỗ ngồi"
        component={seatBookingDetail}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="Xác nhận đặt chỗ"
        component={seatBookingSummary}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="Giỏ hàng"
        component={cart}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="Đơn hàng của tôi"
        component={orderHistory}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={orderDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Thông tin cá nhân"
        component={userInformation}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen
        name="Forum"
        component={ForumScreen}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
      <Stack.Screen name="NewPost" component={NewPostScreen} />
      <Stack.Screen
        name="Comments"
        component={CommentScreen}
        options={{
          header: ({ navigation, route }) => (
            <BasicHeader navigation={navigation} route={route} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
