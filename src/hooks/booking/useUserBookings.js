import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

const useUserBookings = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userBookings"],
    queryFn: async () => {
      const response = await authApi.getUserBooking();
      return response.data.content;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return { data, isLoading, error, refetch };
};

export default useUserBookings;
