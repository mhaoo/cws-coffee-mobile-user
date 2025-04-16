import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";

const useRegister = () => {
  return useMutation({
    mutationFn: ({ firstName, lastName, email, password }) =>
      authApi.register(firstName, lastName, email, password),
  });
};

export default useRegister;
