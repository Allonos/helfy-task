import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, Order } from "../../../apiServices/ordersService";

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, string>({
    mutationFn: (shippingAddress: string) => createOrder(shippingAddress),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
