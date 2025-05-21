import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

/**
 * Hook để lấy sản phẩm theo category ID
 */
export default function usePublicProductsByCategoryId(
  categoryId,
  page = 0,
  limit = 10,
  sortBy = "createdAt",
  sortDir = "desc"
) {
  return useQuery({
    queryKey: ["publicProductsByCategoryId", categoryId, page, limit, sortBy, sortDir],
    queryFn: async () => {
      if (!categoryId) return [];
      const response = await authApi.getPublicProductsByCategoryId(
        categoryId
      );
      return response.data?.content || [];
    },
    enabled: Boolean(categoryId),
    staleTime: 1000 * 60 * 5,
  });
} 