// import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import GeneralButton from "../../../components/button/generalButton";
// import axios from "axios";
// import * as Keychain from "react-native-keychain";
// import { AuthContext } from "../../../api/authContext";
// import { AxiosContext } from "../../../api/providerContext";
import useLogin from "../../../hooks/useLogin";
import { saveTokens } from "../../../config/secureStore";

const { width, height } = Dimensions.get("screen");

export default Login = function ({ navigation }) {
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPass, setIsFocusedPass] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  //* Xóa TextInput email, password khi quay lại màn hình Login
  useFocusEffect(
    useCallback(() => {
      setInputEmail("");
      setInputPass("");
    }, [])
  );

  const loginMutation = useLogin();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginPress = async () => {
    if (!isValidEmail(inputEmail)) {
      Alert.alert("Email không hợp lệ", "Vui lòng nhập đúng định dạng email");
      return;
    }
    if (checkPasswordValidity(inputPass)) {
      Alert.alert("Mật khẩu không hợp lệ", checkPasswordValidity(inputPass));
      return;
    }
    loginMutation.mutate(
      { email: inputEmail, password: inputPass },
      {
        onSuccess: async (response) => {
          const { accessToken, refreshToken } = response.data;

          console.log(
            "accessToken:",
            accessToken,
            "refreshToken:",
            refreshToken
          );

          await saveTokens(accessToken, refreshToken); //TODO Lưu token vào SecureStore

          Alert.alert("Đăng nhập thành công");
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }], //TODO Dùng `reset` để xóa màn hình đăng nhập khỏi stack
          });
        },
        onError: (error) => {
          Alert.alert(
            "Đăng nhập thất bại",
            error.response?.data?.message || "Có lỗi xảy ra"
          );
        },
      }
    );
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate("Quên mật khẩu");
  };

  const handleRegisterPress = () => {
    navigation.navigate("Đăng ký");
  };

  const checkPasswordValidity = (value) => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return "Mật khẩu không được chứa khoảng trắng";
    }
    return null;
  };

  return (
    <ImageBackground
      source={require("../../../images/background1.jpg")}
      resizeMode="cover"
      style={styles.container}
    >
      {/* <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.container}
      > */}
      <View style={styles.contentContainer}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Chào mừng bạn đến với</Text>
          <Text style={styles.labelText}>COWORKING SPACE COFFEE</Text>
        </View>
        <TextInput
          style={[
            styles.textInput,
            { borderColor: isFocusedEmail ? "#93540A" : "#A8A8A8" },
          ]}
          placeholder="Nhập email"
          placeholderTextColor="#A8A8A8"
          onChangeText={setInputEmail}
          value={inputEmail}
          onFocus={() => setIsFocusedEmail(true)}
          onBlur={() => setIsFocusedEmail(false)}
          selectionColor={isFocusedEmail ? "#93540A" : "#A8A8A8"}
        ></TextInput>

        <View
          style={[
            styles.passwordInputContainer,
            { borderColor: isFocusedPass ? "#93540A" : "#A8A8A8" },
          ]}
        >
          <TextInput
            style={[
              styles.passwordInput,
              { borderColor: isFocusedPass ? "#93540A" : "#A8A8A8" },
            ]}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#A8A8A8"
            onChangeText={setInputPass}
            value={inputPass}
            secureTextEntry={isPasswordHidden}
            onFocus={() => setIsFocusedPass(true)}
            onBlur={() => setIsFocusedPass(false)}
            selectionColor={isFocusedPass ? "#93540A" : "#A8A8A8"}
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

        {/* Quên mật khẩu */}
        <TouchableOpacity
          onPress={handleForgotPasswordPress}
          style={{
            marginBottom: width * 0.06,
            marginRight: width * 0.075,
            alignSelf: "flex-end",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#93540A",
              fontStyle: "italic",
            }}
          >
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        <View style={styles.loginButtonContainer}>
          <GeneralButton text="Đăng nhập" onPress={handleLoginPress} />
        </View>
        <View style={styles.loginButtonContainer}>
          <GeneralButton
            text="Đăng ký tài khoản mới"
            style={styles.registerButton}
            textStyle={styles.registerButtonText}
            onPress={handleRegisterPress}
          />
        </View>
        {/* <View style={styles.horizontalLineContainer}>
          <View style={styles.horizontalLine}></View>
          <Text style={styles.orText}>HOẶC</Text>
          <View style={styles.horizontalLine}></View>
        </View> */}
        {/* <Button title="Tiep tuc bang Facebook"></Button>
        <Button title="Tiep tuc bang Google"></Button> */}
      </View>

      {/* {isVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={["80%"]}
          handleIndicatorStyle={styles.headerIndicator} // use for hide indicator on header
          enablePanDownToClose={true}
        >
          <BottomSheetView style={styles.bottomSheetContainer}>
            <Text>Xac nhan Ma OTP</Text>
            <Text>Ma xac thuc gom 6 so da duoc gui den</Text>
            <Text>so dien thoai</Text>
            <Text>Nhap ma de tiep tuc</Text>
            <TouchableOpacity
              onPress={navigation.navigate("Register")}
              style={styles.rawStyle}
            >
              <Text>Tiep tuc</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      )} */}
      {/* </KeyboardAvoidingView> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  contentContainer: {
    flex: 0.7,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
  },
  welcomeTextContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: height * 0.05,
  },
  labelText: {
    fontSize: 21,
    fontWeight: "600",
    color: "#93540A",
    lineHeight: height * 0.05,
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
    marginBottom: width * 0.03,
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
  loginButtonContainer: {
    flex: 0.16,
    justifyContent: "center",
  },
  registerButton: {
    borderWidth: 1,
    borderColor: "#93540A",
    backgroundColor: "white",
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#93540A",
  },
  horizontalLineContainer: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.075,
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#A8A8A8",
  },
  orText: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: width * 0.03,
    color: "#A8A8A8",
  },
  bottomSheetContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerIndicator: {
    height: 0,
  },
  rawStyle: {
    marginTop: 0,
  },
});
