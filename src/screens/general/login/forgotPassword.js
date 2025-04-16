import React, { useState, useRef, useEffect } from "react";
import {
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
import { OtpInput } from "react-native-otp-entry";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GeneralButton from "../../../components/button/generalButton";
import useForgotPassword from "../../../hooks/useForgotPassword";
import useResetPassword from "../../../hooks/useResetPassword";

const { width, height } = Dimensions.get("screen");

export default ForgotPassword = function ({ navigation }) {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [isPassFocused, setIsPassFocused] = useState(false);
  const [inputPass, setInputPass] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const bottomSheetRef = useRef(null);
  const otpInputRef = useRef(null);

  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

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

  const handleForgotPress = async () => {
    if (!isValidEmail(inputEmail)) {
      Alert.alert("Email không hợp lệ", "Vui lòng nhập đúng định dạng email");
      return;
    }

    forgotPasswordMutation.mutate(
      {
        email: inputEmail,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Mã OTP đã được gửi tới email của bạn",
            "Vui lòng kiểm tra email để lấy mã OTP"
          );
          bottomSheetRef.current?.expand(); // Mở BottomSheet
        },
        onError: (error) => {
          Alert.alert(error.response?.data?.message || "Có lỗi xảy ra");
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

  const handleResetPassword = async () => {
    if (otpCode.length !== 6) {
      Alert.alert("Mã OTP không hợp lệ", "Vui lòng nhập đủ 6 chữ số");
      return;
    }

    if (checkPasswordValidity(inputPass)) {
      Alert.alert("Mật khẩu không hợp lệ", checkPasswordValidity(inputPass));
      return;
    }

    resetPasswordMutation.mutate(
      {
        password: inputPass,
        otp: otpCode,
      },
      {
        onSuccess: async (response) => {
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
              { borderColor: isEmailFocused ? "#93540A" : "#A8A8A8" },
            ]}
            placeholder="Nhập email của bạn"
            placeholderTextColor="#A8A8A8"
            onChangeText={setInputEmail}
            value={inputEmail}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            selectionColor={isEmailFocused ? "#93540A" : "#A8A8A8"}
          ></TextInput>

          <GeneralButton text="Tiếp tục" onPress={handleForgotPress} />
        </View>

        {/* BottomSheet nhập OTP và mật khẩu mới*/}
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
                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
              }}
            />

            <Text style={styles.titleText}>Dat lai mat khau moi</Text>
            <Text style={styles.subTitleText}>
              Nhap mat khau moi cua ban de dat lai mat khau
            </Text>

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
                placeholder="Nhập mật khẩu mới"
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

            <GeneralButton
              text="Đặt lại mật khẩu"
              onPress={handleResetPassword}
              style={styles.resetPasswordButtonStyle}
            />
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
  resetPasswordButtonStyle: {
    width: width * 0.55,
    marginBottom: width * 0.06,
  },
});
