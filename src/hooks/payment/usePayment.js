import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

const usePayment = (amount, bookingId) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["paymentIntent", amount, bookingId],
    queryFn: async () => {
      const response = await authApi.createPaymentIntentBooking(
        amount,
        bookingId
      );
      return response.data;
    },
    enabled: !!amount && !!bookingId, // Only call the API when `amount` and 'bookingId' is provided
  });

  return {
    clientSecret: data?.clientSecret,
    isLoading,
    error,
  };
};

export default usePayment;
