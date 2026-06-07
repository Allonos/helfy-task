import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  ProductFilters,
  ProductsResponse,
} from "../../../apiServices/productsService";

export const useGetProductsQuery = (filters: ProductFilters = {}) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });
};
