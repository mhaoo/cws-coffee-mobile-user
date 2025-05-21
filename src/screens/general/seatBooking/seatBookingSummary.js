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
import {
  StripeProvider,
  useStripe,
  CardField,
} from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@env";

const { width, height } = Dimensions.get("screen");
const stripePublicKey = STRIPE_PUBLIC_KEY;

export default function SeatBookingSummary({ route, navigation }) {
  const { bookingId } = route.params;

  const {
    data: bookingDetails,
    isLoading,
    error,
  } = useBookingsDetails(bookingId);

  const {
    clientSecret,
    isLoading: isPaymentLoading,
    error: paymentError,
  } = usePayment(bookingDetails?.price, bookingId);

  const { confirmPayment } = useStripe();

  // Lưu trạng thái cardDetails
  const [cardDetails, setCardDetails] = useState(null);

  const handlePayment = async () => {
    if (!clientSecret) {
      Alert.alert("Lỗi", "Không có client secret để thanh toán.");
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin thẻ.");
      return;
    }

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      paymentMethod: {
        card: cardDetails,
        billingDetails: {
          name: "Test User",
          email: "test@example.com",
          address: {
            country: "US",
          },
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
        routes: [{ name: "Home" }],
      });
    }
  };

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

            {/* Thêm CardField để nhập thẻ */}
            <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: "4242 4242 4242 4242",
              }}
              cardStyle={{
                backgroundColor: "#FFFFFF",
                textColor: "#000000",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#CCCCCC",
              }}
              style={{
                width: "100%",
                height: 50,
                marginTop: 15,
                marginBottom: 20,
              }}
              onCardChange={(card) => {
                setCardDetails(card);
              }}
            />
          </View>
          <View style={styles.divider} />

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
