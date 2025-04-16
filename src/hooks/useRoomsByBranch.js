import { useQuery } from "@tanstack/react-query";
import authApi from "../api/authApi";

const useRoomsByBranch = (branchId) => {
  return useQuery({
    queryKey: ["rooms", branchId], // Cache theo từng branchId
    queryFn: () =>
      authApi.getRoomsByBranchId(branchId).then((res) => res.data.content),
    enabled: !!branchId, // Chỉ fetch nếu có branchId
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút
  });
};

export default useRoomsByBranch;
