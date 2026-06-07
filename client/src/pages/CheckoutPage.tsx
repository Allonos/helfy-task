import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { useGetCartQuery } from "../services/react-query/cart/queries/useGetCartQuery";
import { useCreateOrderMutation } from "../services/react-query/order/mutations/useCreateOrderMutation";

interface ShippingFormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
}

export const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState<string>("");
  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});
  const [formData, setFormData] = useState<ShippingFormData>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: items = [] } = useGetCartQuery();
  const createOrderMutation = useCreateOrderMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingFormData> = {};

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = () => {
    const shippingAddress =
      `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`;

    createOrderMutation.mutate(shippingAddress, {
      onSuccess: (data) => {
        setOrderId(data.id);
        setStep(3);
      },
      onError: (error) => {
        console.error("Order creation failed:", error);
        alert("Failed to place order. Please try again.");
      },
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0 && step < 3) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
        <Button className="mt-6" onClick={() => navigate("/products")}>
          Browse products
        </Button>
      </div>
    );
  }

  const steps = [
    { number: 1, label: "Shipping" },
    { number: 2, label: "Review" },
    { number: 3, label: "Confirmation" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.h1
        className="text-3xl font-bold text-gray-900"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Checkout
      </motion.h1>

      {/* Progress Indicator */}
      <div className="mt-8 flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                  step >= s.number
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                {step > s.number ? <Check className="h-5 w-5" /> : (
                  s.number
                )}
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step >= s.number ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 flex-1 transition-colors ${
                  step > s.number ? "bg-gray-900" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Shipping Address
              </h2>
              <form onSubmit={handleShippingSubmit} className="mt-6 space-y-4">
                <Input
                  label="Street Address"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  error={errors.street}
                  placeholder="123 Main St"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    error={errors.city}
                    placeholder="New York"
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    error={errors.state}
                    placeholder="NY"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)}
                    error={errors.zipCode}
                    placeholder="10001"
                  />
                  <Input
                    label="Country"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)}
                    error={errors.country}
                    placeholder="United States"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/cart")}
                    className="flex-1"
                  >
                    Back to cart
                  </Button>
                  <Button type="submit" className="flex-1">
                    Continue to review
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Review Order
              </h2>

              <div className="mt-6 rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900">
                  Shipping Address
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {formData.street}
                  <br />
                  {formData.city}, {formData.state} {formData.zipCode}
                  <br />
                  {formData.country}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900">Order Items</h3>
                <div className="mt-4 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-lg object-cover bg-gray-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  disabled={createOrderMutation.isPending}
                >
                  Back
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  className="flex-1"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending
                    ? "Placing order..."
                    : "Place order"}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="confirmation"
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
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Order Placed Successfully!
              </h2>
              <p className="mt-2 text-gray-600">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="mt-1 font-mono text-lg font-semibold text-gray-900">
                  {orderId}
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={() => navigate("/account")}>
                  View order history
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/products")}
                >
                  Continue shopping
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
