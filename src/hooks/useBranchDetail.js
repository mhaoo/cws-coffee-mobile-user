import { useQuery } from "@tanstack/react-query";
import authApi from "../api/authApi";

const useBranchDetail = (branchId) => {
  return useQuery({
    queryKey: ["branchDetail", branchId],
    queryFn: () => authApi.getBranchDetail(branchId).then((res) => res.data),
    enabled: !!branchId, // Chỉ fetch khi branchId có giá trị
  });
};

export default useBranchDetail;
