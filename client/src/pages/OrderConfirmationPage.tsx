import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Package } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export const OrderConfirmationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (id) {
      void fetchOrder(id);
    }
  }, [isAuthenticated, id, navigate]);

  const fetchOrder = async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Order>(`/orders/${orderId}`);
      setOrder(data);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setError("Order not found");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusVariant = (
    status: string,
  ): "pending" | "processing" | "shipped" | "delivered" | "default" => {
    const statusMap: Record<
      string,
      "pending" | "processing" | "shipped" | "delivered" | "default"
    > = {
      pending: "pending",
      processing: "processing",
      shipped: "shipped",
      delivered: "delivered",
    };
    return statusMap[status.toLowerCase()] || "default";
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package className="h-16 w-16 text-gray-400" />
        <p className="mt-4 text-lg font-medium text-gray-900">
          {error || "Order not found"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          The order you're looking for doesn't exist or you don't have access to
          it.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate("/account")}>View all orders</Button>
          <Button variant="secondary" onClick={() => navigate("/products")}>
            Continue shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <motion.div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Check className="h-10 w-10 text-green-600" />
        </motion.div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Order Confirmed!
        </h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your order has been received.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-8"
      >
        <div className="rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="mt-1 font-mono text-lg font-semibold text-gray-900">
                #{order.id.slice(0, 8)}
              </p>
            </div>
            <Badge
              label={order.status}
              variant={getStatusVariant(order.status)}
            />
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Date</p>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500">
              Shipping Address
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {order.shippingAddress}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
          <div className="mt-4 space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-lg object-cover bg-gray-50"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate("/account")}>
            View order history
          </Button>
          <Button variant="secondary" onClick={() => navigate("/products")}>
            Continue shopping
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
