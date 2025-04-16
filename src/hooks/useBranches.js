import { useQuery, useQueryClient } from "@tanstack/react-query";
import authApi from "../api/authApi";

const useBranches = () => {
  const queryClient = useQueryClient(); // Tương tác với cache của React Query

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["branches"], // Cache dữ liệu
    queryFn: async () => {
      const response = await authApi.getBranches();
      return response.data.content;
    },
    // queryFn: async () => {
    //   const response = await authApi.getBranches();
    //   if (!response || !Array.isArray(response)) {
    //     throw new Error("Dữ liệu API không hợp lệ");
    //   }
    //   // Chuẩn hóa dữ liệu trả về
    //   return response.map((branch) => ({
    //     id: branch.id.toString(), // Chuyển id thành string để tránh lỗi keyExtractor
    //     name: branch.name || "Không có tên", // Tránh lỗi khi API trả về name là null
    //     address: branch.address || "Không có địa chỉ",
    //     images: Array.isArray(branch.images) ? branch.images : [], // Đảm bảo images là array
    //   }));
    // },

    staleTime: 1000 * 60 * 15, // Cache trong 15 phút
    // refetchInterval: 1000 * 30, // Tự động cập nhật mỗi 30 giây
    refetchOnWindowFocus: true, // Refresh khi quay lại app
  });

  //* Hàm refresh thủ công khi người dùng kéo xuống
  const refreshBranches = async () => {
    await queryClient.invalidateQueries(["branches"]); // Xóa cache và gọi API mới
  };

  return { data, isLoading, error, refetch, refreshBranches };
};

export default useBranches;
