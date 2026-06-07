import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem, CartItem } from "../../../apiServices/cartService";

interface UpdateCartItemVariables {
  itemId: string;
  quantity: number;
}

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, UpdateCartItemVariables>({
    mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, quantity),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
