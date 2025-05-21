import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

const useNotifications = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await authApi.getNotifications();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return { data, isLoading, error, refetch };
};

export default useNotifications; 