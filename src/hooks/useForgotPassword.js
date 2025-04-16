import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";

const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ email }) => authApi.forgotPassword(email),
  });
};

export default useForgotPassword;
