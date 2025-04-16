// hooks/public/usePublicGroupsByCategoryId.js
import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

/**
 * Hook này gọi API:
 *   authApi.getPublicProductGroupsByCategoryId(categoryId)
 * để lấy danh sách product groups (CAKE, BREAD, BAKE, WATER,...)
 * dựa trên id category (FOOD=1, DRINK=2, v.v.)
 */

export default function usePublicGroupsByCategoryId(
  categoryId,
  page = 0,
  limit = 10,
  sortBy = "createdAt",
  sortDir = "desc"
) {
  return useQuery({
    queryKey: ["groupsByCategoryId", categoryId, page, limit, sortBy, sortDir],
    queryFn: async () => {
      if (!categoryId) return [];
      // Gọi API (có thể truyền thêm page, limit, sortBy, sortDir nếu cần)
      const response = await authApi.getPublicProductGroupsByCategoryId(
        categoryId,
        page,
        limit,
        sortBy,
        sortDir
      );

      // API MỚI => dữ liệu bạn cần thực tế nằm ở response.data.content
      // Vì ở file product.js, bạn đang .map(...) trên "foodGroups" (mong muốn 1 mảng),
      // nên trả về response.data.content || [] để tránh lỗi khi content = undefined.
      const content = response.data?.content || [];

      // Tuỳ vào backend trả về field "images" cho group, mà code cũ của bạn dùng `item?.imageURL`.
      // Nếu bạn muốn tiếp tục dùng `item.imageURL` ở trên giao diện, ta có thể "gán" thêm:
      const mappedGroups = content.map((g) => ({
        ...g,
        // Gán imageURL = images[0], để code trên UI không bị lỗi khi gọi item.imageURL
        imageURL: g.images?.[0] || "",
      }));

      return mappedGroups;
    },
    enabled: Boolean(categoryId),
  });
}
