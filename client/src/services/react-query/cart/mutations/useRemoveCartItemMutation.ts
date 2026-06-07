import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItem } from "../../../apiServices/cartService";

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
