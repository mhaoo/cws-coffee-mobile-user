import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";

const useVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ otp }) => authApi.verifyOtp(otp),
  });
};

export default useVerifyOtp;
