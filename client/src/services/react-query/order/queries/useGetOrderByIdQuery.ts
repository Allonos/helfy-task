import { useQuery } from "@tanstack/react-query";
import { getOrderById, Order } from "../../../apiServices/ordersService";
import { useAuthStore } from "../../../../store/authStore";

export const useGetOrderByIdQuery = (orderId: string) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: isAuthenticated && !!orderId,
  });
};
