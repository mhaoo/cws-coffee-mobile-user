import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

const useRoomsByBranchIdAndRoomTypeId = (branchId, roomTypeId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["roomsByBranchAndType", branchId, roomTypeId],
    queryFn: async () => {
      const response = await authApi.getRoomsByBranchIdAndRoomTypeId(branchId, roomTypeId);
      return response.data;
    },
    enabled: !!branchId && !!roomTypeId,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return { data, isLoading, error, refetch };
};

export default useRoomsByBranchIdAndRoomTypeId; 