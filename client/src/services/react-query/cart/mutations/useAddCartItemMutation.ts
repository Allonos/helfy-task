import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCartItem, CartItem } from "../../../apiServices/cartService";

interface AddCartItemVariables {
  productId: string;
  quantity: number;
}

export const useAddCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, AddCartItemVariables>({
    mutationFn: ({ productId, quantity }) => addCartItem(productId, quantity),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
