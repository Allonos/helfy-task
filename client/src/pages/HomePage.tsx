import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../components/ui/Skeleton";
import api from "../services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
}

interface ProductsResponse {
  products: Product[];
}

const ProductCard = ({ product }: { product: Product }) => (
  <motion.div
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
);

export const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await api.get<ProductsResponse>(
        "/products?limit=8&page=1",
      );
      return data;
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Shop the things
            <br />
            <span className="text-gray-400">you actually want</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Curated products across electronics, clothing, books, and home
            essentials.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            <Link
              to="/products"
              className="inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              Browse products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Featured products
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Hand-picked items just for you
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="mt-3 h-3 w-1/3" />
                <Skeleton className="mt-2 h-4 w-2/3" />
                <Skeleton className="mt-2 h-4 w-1/4" />
              </div>
            ))
            : data?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            View all products →
          </Link>
        </div>
      </section>
    </div>
  );
};
