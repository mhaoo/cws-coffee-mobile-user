import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

const useNotificationDetail = (id) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notificationDetail", id],
    queryFn: async () => {
      const response = await authApi.getNotificationDetailById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return { data, isLoading, error, refetch };
};

export default useNotificationDetail; 