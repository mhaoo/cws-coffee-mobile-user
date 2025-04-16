import { useQuery } from "@tanstack/react-query";
import authApi from "../api/authApi";

const useProducts = (branchId) => {
  const {
    data: foods,
    isLoading: isLoadingFoods,
    error: errorFoods,
  } = useQuery({
    queryKey: ["foods", branchId],
    queryFn: () => authApi.getFoodsByBranchId(branchId).then((res) => res.data),
    enabled: !!branchId, // Chỉ fetch nếu có branchId
    staleTime: 1000 * 60 * 15, // Cache 5 phút
    retry: 1,
  });

  const {
    data: drinks,
    isLoading: isLoadingDrinks,
    error: errorDrinks,
  } = useQuery({
    queryKey: ["drinks", branchId],
    queryFn: () =>
      authApi.getDrinksByBranchId(branchId).then((res) => res.data),
    enabled: !!branchId, // Chỉ fetch nếu có branchId
    staleTime: 1000 * 60 * 15, // Cache 5 phút
    retry: 1,
  });

  return {
    foods,
    drinks,
    isLoading: isLoadingFoods || isLoadingDrinks,
    error: errorFoods || errorDrinks,
  };
};

export default useProducts;
