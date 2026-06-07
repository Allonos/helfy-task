import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";
import { useGetCartQuery } from "../services/react-query/cart/queries/useGetCartQuery";
import { useUpdateCartItemMutation } from "../services/react-query/cart/mutations/useUpdateCartItemMutation";
import { useRemoveCartItemMutation } from "../services/react-query/cart/mutations/useRemoveCartItemMutation";

export const CartPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: items = [], isLoading } = useGetCartQuery();
  const updateQuantityMutation = useUpdateCartItemMutation();
  const removeItemMutation = useRemoveCartItemMutation();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantityMutation.mutate({ itemId, quantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-gray-900">
          Sign in to view your cart
        </p>
        <Link
          to="/login"
          className="mt-4 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
        <p className="mt-1 text-sm text-gray-500">
          Add some products to get started
        </p>
        <Link
          to="/products"
          className="mt-6 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.h1
        className="text-3xl font-bold text-gray-900"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Your cart
      </motion.h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-4 border-b border-gray-100 py-5"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-xl object-cover bg-gray-50"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-medium text-gray-900 hover:underline line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {item.product.category}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center rounded-lg border border-gray-200">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.id,
                        Math.max(1, item.quantity - 1),
                      )}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.id,
                        Math.min(item.product.stock, item.quantity + 1),
                      )}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>

                <p className="w-20 text-right text-sm font-semibold text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="w-full lg:w-72">
          <div className="rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Order summary
            </h2>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button
              className="mt-6 w-full"
              onClick={() => navigate("/checkout")}
            >
              Proceed to checkout
            </Button>
            <Link
              to="/products"
              className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-900"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
