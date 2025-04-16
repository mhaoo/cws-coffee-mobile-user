import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GeneralButton from "../../../components/button/generalButton";
import useRegister from "../../../hooks/useRegister";
import useVerifyOtp from "../../../hooks/useVerifyOtp";
import { OtpInput } from "react-native-otp-entry";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("screen");

export default Register = function ({ navigation }) {
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);
  const [inputLastName, setInputLastName] = useState("");
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const bottomSheetRef = useRef(null);
  const otpInputRef = useRef(null);

  const registerMutation = useRegister();
  const verifyOtpMutation = useVerifyOtp();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordValidity = (value) => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return "Mật khẩu không được chứa khoảng trắng";
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      return "Mật khẩu phải có ít nhất một ký tự viết hoa";
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
      return "Mật khẩu phải có ít nhất một ký tự viết thường";
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
      return "Mật khẩu phải chứa ít nhất một chữ số";
    }

    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(value)) {
      return "Mật khẩu phải có độ dài từ 8-16 ký tự";
    }

    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(value)) {
      return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt";
    }

    return null;
  };

  const handleRegisterPress = async () => {
    // if (!inputLastName.trim() && !inputFirstName.trim()) {
    //   Alert.alert("Thiếu thông tin", "Vui lòng nhập họ và tên của bạn");
    //   return;
    // }
    if (!isValidEmail(inputEmail)) {
      Alert.alert("Email không hợp lệ", "Vui lòng nhập đúng định dạng email");
      return;
    }
    if (checkPasswordValidity(inputPass)) {
      Alert.alert("Mật khẩu không hợp lệ", checkPasswordValidity(inputPass));
      return;
    }

    registerMutation.mutate(
      {
        firstName: inputFirstName,
        lastName: inputLastName,
        email: inputEmail,
        password: inputPass,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Mã OTP đã được gửi tới email mà bạn đăng ký",
            "Vui lòng kiểm tra email của bạn để lấy mã OTP"
          );
          bottomSheetRef.current?.expand(); // Mở BottomSheet nhập OTP
        },
        onError: (error) => {
          Alert.alert(
            "Đăng ký thất bại",
            error.response?.data?.message || "Có lỗi xảy ra"
          );
          console.log(error);
        },
      }
    );
  };

  //* Khi BottomSheet đóng thì reset OTP input
  useEffect(() => {
    if (!isBottomSheetOpen && otpInputRef.current) {
      otpInputRef.current.clear(); // Xóa OTP trên giao diện
      setOtpCode(""); // Reset giá trị OTP trong state
    }
  }, [isBottomSheetOpen]);

  const handleConfirmOTP = () => {
    if (otpCode.length !== 6) {
      Alert.alert("Mã OTP không hợp lệ", "Vui lòng nhập đủ 6 chữ số");
      return;
    }

    verifyOtpMutation.mutate(
      { otp: otpCode },
      {
        onSuccess: async (response) => {
          // await AsyncStorage.setItem("token", response.data.token);
          Alert.alert("Xác thực thành công", "Bạn đã đăng ký thành công!");
          bottomSheetRef.current?.close();
          navigation.navigate("Login");
        },
        onError: (error) => {
          Alert.alert(
            "Xác thực thất bại",
            error.response?.data?.message || "OTP không đúng"
          );
        },
      }
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <TextInput
            style={[
              styles.textInput,
              { borderColor: isLastNameFocused ? "#93540A" : "#A8A8A8" },
            ]}
            placeholder="Nhập họ của bạn"
            placeholderTextColor="#A8A8A8"
            onChangeText={setInputLastName}
            value={inputLastName}
            onFocus={() => setIsLastNameFocused(true)}
            onBlur={() => setIsLastNameFocused(false)}
            selectionColor={isLastNameFocused ? "#93540A" : "#A8A8A8"}
          ></TextInput>
          <TextInput
            style={[
              styles.textInput,
              { borderColor: isFirstNameFocused ? "#93540A" : "#A8A8A8" },
            ]}
            placeholder="Nhập tên của bạn"
            placeholderTextColor="#A8A8A8"
            onChangeText={setInputFirstName}
            value={inputFirstName}
            onFocus={() => setIsFirstNameFocused(true)}
            onBlur={() => setIsFirstNameFocused(false)}
            selectionColor={isFirstNameFocused ? "#93540A" : "#A8A8A8"}
          ></TextInput>
          <TextInput
            style={[
              styles.textInput,
              { borderColor: isEmailFocused ? "#93540A" : "#A8A8A8" },
            ]}
            placeholder="Nhập email của bạn (bắt buộc)"
            placeholderTextColor="#A8A8A8"
            onChangeText={setInputEmail}
            value={inputEmail}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            selectionColor={isEmailFocused ? "#93540A" : "#A8A8A8"}
          ></TextInput>
          <View
            style={[
              styles.passwordInputContainer,
              { borderColor: isPassFocused ? "#93540A" : "#A8A8A8" },
            ]}
          >
            <TextInput
              style={[
                styles.passwordInput,
                { borderColor: isPassFocused ? "#93540A" : "#A8A8A8" },
              ]}
              placeholder="Nhập mật khẩu của bạn (bắt buộc)"
              placeholderTextColor="#A8A8A8"
              onChangeText={setInputPass}
              value={inputPass}
              secureTextEntry={isPasswordHidden}
              onFocus={() => setIsPassFocused(true)}
              onBlur={() => setIsPassFocused(false)}
              selectionColor={isPassFocused ? "#93540A" : "#A8A8A8"}
            ></TextInput>
            <TouchableOpacity
              onPress={() => setIsPasswordHidden(!isPasswordHidden)}
            >
              <MaterialCommunityIcons
                name={isPasswordHidden ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#A8A8A8"
                style={styles.hiddenIcon}
              />
            </TouchableOpacity>
          </View>
          <GeneralButton text="Tạo tài khoản" onPress={handleRegisterPress} />
        </View>

        {/* BottomSheet nhập OTP */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["95%"]}
          enablePanDownToClose={true}
          handleIndicatorStyle={styles.headerIndicator} // use for hide indicator on header
          onChange={(index) => setIsBottomSheetOpen(index !== -1)} // Theo dõi trạng thái BottomSheet
        >
          <BottomSheetView style={styles.bottomSheetContainer}>
            <Text style={styles.titleText}>Xác nhận mã OTP</Text>
            <Text style={styles.subTitleText}>
              Mã xác thực gồm 6 số đã được gửi đến email của bạn đăng ký
            </Text>
            <Text style={styles.subTitleText}>Nhập mã để tiếp tục</Text>

            {/* OTP Input */}
            <OtpInput
              ref={otpInputRef}
              numberOfDigits={6}
              focusColor="#93540A"
              autoFocus={false}
              type="numeric"
              onTextChange={(text) => setOtpCode(text)}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.pinCodeContainer,
                // pinCodeTextStyle: styles.pinCodeText,
                // focusStickStyle: styles.focusStick,
                // focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                // placeholderTextStyle: styles.placeholderText,
                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                // disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
              }}
            />
            <GeneralButton
              text="Tiếp tục"
              onPress={handleConfirmOTP}
              style={styles.confirmOTPButtonStyle}
            />
            <Text style={styles.subTitleText}>Bạn không nhận được mã ?</Text>
            <Text style={styles.resendText}>Gửi lại</Text>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  contentContainer: {
    flex: 0.95,
  },
  textInput: {
    fontSize: 16,
    height: height * 0.06,
    paddingLeft: 20,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: width * 0.075,
    marginBottom: width * 0.06,
    backgroundColor: "#F9F9F9",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: width * 0.075,
    marginBottom: width * 0.06,
    backgroundColor: "#F9F9F9",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    height: height * 0.06,
    paddingLeft: 10,
  },
  hiddenIcon: {
    paddingHorizontal: 5,
  },

  //* Style bottomsheet
  bottomSheetContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: width * 0.075,
  },
  headerIndicator: {
    height: 0,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: width * 0.03,
  },
  subTitleText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: width * 0.03,
  },
  resendText: {
    fontSize: 16,
  },
  otpContainer: {
    marginVertical: width * 0.06,
  },
  pinCodeContainer: {
    backgroundColor: "#F9F9F9",
  },
  filledPinCodeContainer: {
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
  },
  confirmOTPButtonStyle: {
    width: width * 0.55,
    marginBottom: width * 0.06,
  },
});
