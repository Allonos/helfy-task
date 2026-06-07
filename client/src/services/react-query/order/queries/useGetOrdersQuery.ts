import { useQuery } from "@tanstack/react-query";
import { getOrders, Order } from "../../../apiServices/ordersService";
import { useAuthStore } from "../../../../store/authStore";

export const useGetOrdersQuery = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: isAuthenticated,
  });
};
