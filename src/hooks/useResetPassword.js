import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";

const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ otp, password }) => authApi.resetPassword(otp, password),
  });
};

export default useResetPassword;
