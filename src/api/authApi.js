import apiClient from "./apiClient";

const authApi = {
  login: (email, password) =>
    apiClient.post("/api/auth/login", { email, password }),

  // verifyOtp: (otp) =>
  //   apiClient.post("/app/api/auth/verify-email", null, {
  //     params: { otp }, //! Truyền OTP qua query parameters
  //   }),

  verifyOtp: (otp) => apiClient.post("/app/api/auth/verify-email", { otp }),

  register: (firstName, lastName, email, password) =>
    apiClient.post("/app/api/auth/register", {
      firstName,
      lastName,
      email,
      password,
    }),

  forgotPassword: (email) =>
    apiClient.post("/app/api/auth/forgot-password", { email }),

  resetPassword: (otp, password) =>
    apiClient.post("/app/api/auth/reset-password", password, {
      params: { otp },
    }),

  refreshAccessToken: (refreshToken) =>
    apiClient.post("/api/auth/refresh-token", { refreshToken }),

  getBranches: () => apiClient.get("/api/customer/branches"),

  getBranchDetail: (id) => apiClient.get(`/api/customer/branches/${id}`),

  getRoomsByBranchId: (branchId) =>
    apiClient.get(`/api/customer/rooms/${branchId}`),

  getRoomsDetailById: (id) =>
    apiClient.get(`/api/customer/rooms/details/${id}`),

  getFoodsByBranchId: (branchId) =>
    apiClient.get(`/api/customer/product/foods/${branchId}`),

  getDrinksByBranchId: (branchId) =>
    apiClient.get(`/api/customer/product/drinks/${branchId}`),

  //* API kiểm tra slot trống trước khi đặt chỗ
  getAvailableSlots: (roomId, date) =>
    apiClient.get(`/api/customer/bookings/available-slots`, {
      params: { roomId, date },
    }),

  //* API gửi yêu cầu đặt chỗ
  bookSeat: (roomId, bookingData) =>
    apiClient.post(`/api/customer/bookings/${roomId}`, bookingData),
  // bookSeat: (roomId, bookingData, accessToken) =>
  //   apiClient.post(`/api/customer/bookings/${roomId}`, bookingData, {
  //     headers: { Authorization: `Bearer ${accessToken}` },
  //   }),

  //* API tạo payment intent
  createPaymentIntentBooking: (amount, bookingId) =>
    apiClient.post("/api/payments/create-payment-intent-booking", {
      amount,
      bookingId,
    }),

  getBookingsDetailById: (id) =>
    apiClient.get(`/api/customer/bookings/details/${id}`), //TODO lấy thông tin đơn đặt chỗ bằng id đơn hàng

  getPublicProducts: () => apiClient.get("/api/public/products"), //TODO lấy danh sách tất cả các sản phẩm

  getPublicProductsById: (id) => apiClient.get(`/api/public/products/${id}`), //TODO lấy thông tin chi tiết từng sản phẩm theo id

  //TODO lấy danh sách các sản phẩm theo tên danh mục
  getPublicProductsByCategoryName: (
    categoryName,
    page = 0,
    limit = 10,
    sortBy = "createdAt",
    sortDir = "desc"
  ) =>
    apiClient.get(`/api/public/products/category-name`, {
      params: {
        categoryName,
        page,
        limit,
        sortBy,
        sortDir,
      },
    }),

  getPublicProductsByCategoryId: (categoryId) =>
    apiClient.get(`/api/public/products/category/${categoryId}`), //TODO lấy danh sách các sản phẩm theo id của danh mục (categoryId)

  getPublicCategories: () => apiClient.get("/api/public/categories"), //TODO lấy danh sách tên các danh mục của sản phẩm

  //TODO lấy danh sách tên các nhóm của sản phẩm theo id của danh mục (categoryId)
  getPublicProductGroupsByCategoryId: (
    categoryId,
    page = 0,
    limit = 10,
    sortBy = "createdAt",
    sortDir = "desc"
  ) =>
    apiClient.get(`/api/public/product-groups/${categoryId}`, {
      params: {
        page,
        limit,
        sortBy,
        sortDir,
      },
    }),

  getPublicProductGroupsByGroupId: (groupId) =>
    apiClient.get(`/api/public/products/groups/${groupId}`), //TODO lấy danh sách các sản phẩm theo từng nhóm sản phẩm (groupId)
};
export default authApi;
