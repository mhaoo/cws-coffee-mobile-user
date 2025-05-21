import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

const useRoomTypes = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: async () => {
      const response = await authApi.getRoomType();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return { data, isLoading, error, refetch };
};

export default useRoomTypes; 