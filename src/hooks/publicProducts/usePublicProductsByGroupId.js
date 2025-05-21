import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

/**
 * Hook này gọi API:
 *   authApi.getPublicProductGroupsByGroupId(groupId)
 * để lấy danh sách sản phẩm theo groupId
 */
export default function usePublicProductsByGroupId(
  groupId,
  page = 0,
  limit = 10,
  sortBy = "createdAt",
  sortDir = "desc"
) {
  return useQuery({
    queryKey: ["publicProductsByGroupId", groupId, page, limit, sortBy, sortDir],
    queryFn: async () => {
      if (!groupId) return [];
      const response = await authApi.getPublicProductGroupsByGroupId(groupId);
      // Nếu API trả về dạng { content: [...] }
      return response.data?.content || [];
    },
    enabled: Boolean(groupId),
  });
} 