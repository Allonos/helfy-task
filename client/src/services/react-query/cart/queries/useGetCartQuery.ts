import { useQuery } from "@tanstack/react-query";
import { getCart, CartItem } from "../../../apiServices/cartService";
import { useAuthStore } from "../../../../store/authStore";

export const useGetCartQuery = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
  });
};
