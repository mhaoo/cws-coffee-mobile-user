import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

const useBookingsDetails = (id) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bookingDetails", id], // Caching dữ liệu với key là id
    queryFn: async () => {
      const response = await authApi.getBookingsDetailById(id);
      return response.data; // Trả về dữ liệu từ API
    },
    enabled: !!id, // Chỉ chạy query khi có id
    staleTime: 1000 * 60 * 15, // Cache trong 15 phút
    // refetchOnWindowFocus: true, // Refetch khi chuyển lại app
  });

  return { data, isLoading, error, refetch };
};

export default useBookingsDetails;
