import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import api from "../services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  stock: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home"];
const PAGE_SIZE = 12;

export const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["products", search, category, minPrice, maxPrice, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      const { data } = await api.get<ProductsResponse>(
        `/products?${params.toString()}`,
      );
      return data;
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory((prev) => (prev === cat ? "" : cat));
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          {data?.total ?? 0} items available
        </p>
      </motion.div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
              <button
                onClick={handleClearFilters}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      category === cat
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Price range
              </p>
              <div className="mt-2 flex flex-col gap-2">
                <Input
                  placeholder="Min price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                />
                <Input
                  placeholder="Max price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="mb-6">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {isLoading
            ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-100 p-4"
                  >
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="mt-3 h-3 w-1/3" />
                    <Skeleton className="mt-2 h-4 w-2/3" />
                    <Skeleton className="mt-2 h-4 w-1/4" />
                  </div>
                ))}
              </div>
            )
            : data?.products.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-lg font-medium text-gray-900">
                  No products found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or search term
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={handleClearFilters}
                >
                  Clear filters
                </Button>
              </div>
            )
            : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data?.products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={`/products/${product.id}`}>
                      <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          {product.category}
                        </p>
                        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
