import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  UpdateProfileData,
  UserProfile,
} from "../../../apiServices/accountService";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateProfileData>({
    mutationFn: (profileData: UpdateProfileData) => updateProfile(profileData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
