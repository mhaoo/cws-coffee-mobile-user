import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

/**
 * Lấy chi tiết 1 sản phẩm bằng productId
 * sử dụng API:
 *   getPublicProductsById: (id) => apiClient.get(`/api/public/products/${id}`)
 */
export default function usePublicProductDetail(productId) {
  return useQuery({
    queryKey: ["publicProductDetail", productId],
    queryFn: async () => {
      // Nếu productId chưa có, trả về null
      if (!productId) return null;
      // Gọi API qua authApi
      const response = await authApi.getPublicProductsById(productId);
      // Giả sử response.data = {...product}
      return response.data;
    },
    // Chỉ chạy khi có productId
    enabled: Boolean(productId),
  });
}
