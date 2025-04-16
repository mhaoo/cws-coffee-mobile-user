import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tạo Zustand Store
const useBranchStore = create((set) => ({
  branchId: null,

  // Hàm cập nhật branchId và lưu vào AsyncStorage
  setBranchId: async (branchId) => {
    await AsyncStorage.setItem("branchId", branchId.toString());
    set({ branchId });
  },

  // Hàm tải branchId từ AsyncStorage khi khởi động app
  loadBranchId: async () => {
    const storedBranchId = await AsyncStorage.getItem("branchId");
    if (storedBranchId) {
      set({ branchId: parseInt(storedBranchId) });
    }
  },
}));

export default useBranchStore;
