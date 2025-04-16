import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import GeneralButton from "../../../components/button/generalButton";
import useBookingsDetails from "../../../hooks/booking/useBookingsDetails";
import usePayment from "../../../hooks/payment/usePayment";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@env";

const { width, height } = Dimensions.get("screen");
const stripePublicKey = STRIPE_PUBLIC_KEY;

/**
 * Đây là ví dụ HARD-CODE toàn bộ thông tin thẻ và địa chỉ billing.
 * Chỉ nên dùng để demo/test, KHÔNG dùng trong môi trường sản phẩm thật.
 */
export default function SeatBookingSummary({ route, navigation }) {
  const { bookingId } = route.params;

  // 1. Lấy thông tin đặt chỗ
  const {
    data: bookingDetails,
    isLoading,
    error,
  } = useBookingsDetails(bookingId);

  // 2. Lấy clientSecret qua hook usePayment
  const {
    clientSecret,
    isLoading: isPaymentLoading,
    error: paymentError,
  } = usePayment(bookingDetails?.price, bookingId);

  // 3. Setup Stripe
  const { confirmPayment } = useStripe();

  // 4. Hàm thanh toán hard-code toàn bộ thông tin
  const handlePayment = async () => {
    if (!clientSecret) {
      Alert.alert("Lỗi", "Không có client secret để thanh toán.");
      return;
    }

    /**
     * Các trường card: number, expMonth, expYear, cvc
     * - Dữ liệu test: 4242 4242 4242 4242 (VISA), expMonth: 4, expYear: 24, cvc: '123'
     * Các trường billingDetails: name, email, phone, address { line1, line2, city, state, postalCode, country }
     */
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      paymentMethod: {
        card: {
          number: "4242424242424242",
          expMonth: 4,
          expYear: 25,
          cvc: "123",
        },
      },
      billingDetails: {
        name: "Test User", // Tên chủ thẻ (lưu trong Card Object: name)
        email: "test@example.com", // Email (Stripe không đưa trực tiếp vào card object, nhưng lưu trong PaymentMethod)
        phone: "+1 555 555 5555", // Số điện thoại
        address: {
          line1: "123 Example St", // address_line1
          line2: "Apt 7", // address_line2
          city: "New York", // address_city
          state: "NY", // address_state
          postalCode: "10001", // address_zip
          country: "US", // address_country
        },
      },
    });

    if (error) {
      console.log("Lỗi thanh toán:", error);
      Alert.alert("Thanh toán thất bại", error.message);
    } else if (paymentIntent) {
      console.log("Thanh toán thành công:", paymentIntent);
      Alert.alert("Thanh toán thành công", "Bạn đã thanh toán thành công!");
      navigation.reset({
        index: 0,
        routes: [{ name: "Đặt chỗ" }],
      });
    }
  };

  // 5. Loading / error
  if (isLoading || isPaymentLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#93540A" />
        <Text>Đang tải thông tin đơn hàng...</Text>
      </View>
    );
  }

  if (error || paymentError) {
    return (
      <View style={styles.centered}>
        <Text>
          Lỗi khi lấy thông tin đơn hàng:{" "}
          {error?.message || paymentError?.message}
        </Text>
      </View>
    );
  }

  // 6. Giao diện
  return (
    <StripeProvider publishableKey={stripePublicKey}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Thông tin phòng */}
          <View style={styles.card}>
            <Text style={styles.title}>{bookingDetails.room?.name}</Text>
            <Text style={styles.subtitle}>{bookingDetails.branch?.name}</Text>
            <Text style={styles.info}>
              {bookingDetails.room?.capacity} người -{" "}
              {bookingDetails.room?.roomType}
            </Text>
          </View>
          <View style={styles.divider} />

          {/* Thời gian */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Thời gian</Text>
            <Text style={styles.sectionText}>
              {bookingDetails?.bookingDate}, {bookingDetails?.startTime} -{" "}
              {bookingDetails?.endTime}
            </Text>
          </View>
          <View style={styles.divider} />

          {/* Chi tiết đơn hàng */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
            <Text style={styles.sectionText}>
              {bookingDetails?.price}đ ( {bookingDetails?.bookingDate},{" "}
              {bookingDetails?.startTime} - {bookingDetails?.endTime})
            </Text>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>Tổng cộng</Text>
              <Text style={styles.sectionTitle}>{bookingDetails?.price}đ</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Thanh toán */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Thanh toán</Text>
            <View style={styles.paymentMethod}>
              <Image
                source={{
                  uri: "https://cdn.iconscout.com/icon/free/png-256/free-stripe-logo-icon-download-in-svg-png-gif-file-formats--flat-social-media-branding-pack-logos-icons-498440.png",
                }}
                style={styles.paymentIcon}
              />
              <Text style={styles.paymentText}>Stripe</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Hiển thị thông tin cứng */}
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
            Thẻ test &amp; Địa chỉ
          </Text>
          <Text style={styles.info}>
            Số thẻ: 4242 4242 4242 4242 - Hết hạn: 04/24 - CVC: 123
          </Text>
          <Text style={styles.info}>
            Name: Test User • Email: test@example.com • Phone: +1 555 555 5555
          </Text>
          <Text style={styles.info}>
            Địa chỉ: 123 Example St, Apt 7, New York, NY, 10001, US
          </Text>

          {/* Chính sách hủy chỗ */}
          <View style={styles.policySection}>
            <Text style={styles.sectionTitle}>Chính sách hủy chỗ</Text>
            <Text style={styles.policyText}>
              Phí đặt thiết bị sẽ được hoàn trả 100% nếu hủy đặt chỗ trước 24
              giờ.
            </Text>
          </View>
        </ScrollView>

        {/* Nút Đặt ngay */}
        <View style={styles.footerContainer}>
          <GeneralButton
            text="Đặt ngay"
            style={styles.footerButton}
            onPress={handlePayment}
          />
        </View>
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  contentContainer: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#A8A8A8",
  },
  info: {
    fontSize: 14,
    color: "#333333",
    marginTop: 5,
  },
  detailSection: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: "#333333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentSection: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  paymentText: {
    fontSize: 14,
    color: "#333333",
  },
  policySection: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 15,
  },
  policyText: {
    fontSize: 14,
    color: "#333333",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
  },
  footerContainer: {
    borderTopWidth: 0.25,
    borderTopColor: "#A8A8A8",
    backgroundColor: "#FFFFFF",
  },
  footerButton: {
    margin: 20,
  },
});
