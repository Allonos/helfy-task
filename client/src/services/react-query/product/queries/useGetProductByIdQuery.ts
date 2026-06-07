import { useQuery } from "@tanstack/react-query";
import { getProductById, Product } from "../../../apiServices/productsService";

export const useGetProductByIdQuery = (id: string) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};
