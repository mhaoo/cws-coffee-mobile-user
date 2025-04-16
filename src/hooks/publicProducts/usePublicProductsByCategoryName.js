// hooks/public/usePublicProductGroupsByCategoryName.js
import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

/**
 * Hook này gọi API:
 *  authApi.getPublicProductsByCategoryName(categoryName)
 * để lấy danh sách product (hoặc product group) theo tên categoryName
 */
export default function usePublicProductsByCategoryName(
  categoryName,
  page = 0,
  limit = 10,
  sortBy = "createdAt",
  sortDir = "desc"
) {
  return useQuery({
    queryKey: [
      "publicProductsByCategoryName",
      categoryName,
      page,
      limit,
      sortBy,
      sortDir,
    ],
    queryFn: async () => {
      if (!categoryName) return [];
      const response = await authApi.getPublicProductsByCategoryName(
        categoryName,
        page,
        limit,
        sortBy,
        sortDir
      );
      return response.data?.content || [];
    },
    enabled: Boolean(categoryName),
  });
}
