import { useQuery } from "@tanstack/react-query";
import { getProfile, UserProfile } from "../../../apiServices/accountService";
import { useAuthStore } from "../../../../store/authStore";

export const useGetProfileQuery = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    enabled: isAuthenticated,
  });
};
