import { useQuery } from "@tanstack/react-query";
import authApi from "../../api/authApi";

const usePublicCategories = () => {
  //   const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publicCategories"],
    queryFn: async () => {
      const response = await authApi.getPublicCategories();
      if (!Array.isArray(response.data)) {
        throw new Error("Dữ liệu API không hợp lệ");
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
    // refetchOnWindowFocus: true,
    retry: 3,
  });

  if (error) {
    console.error("Lỗi khi tải danh mục:", error.message);
  }

  return { data, isLoading, error, refetch };
};

export default usePublicCategories;
