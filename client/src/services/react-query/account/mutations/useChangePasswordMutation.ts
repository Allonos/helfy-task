import { useMutation } from "@tanstack/react-query";
import {
  changePassword,
  ChangePasswordData,
} from "../../../apiServices/accountService";

export const useChangePasswordMutation = () => {
  return useMutation<void, Error, ChangePasswordData>({
    mutationFn: (passwordData: ChangePasswordData) =>
      changePassword(passwordData),
  });
};
