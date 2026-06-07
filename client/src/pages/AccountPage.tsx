import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, User } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

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

type Tab = "profile" | "orders";

export const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [profileErrors, setProfileErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    void fetchProfile();
    void fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<UserProfile>("/account/profile");
      setProfile(data);
      setProfileForm({ name: data.name, email: data.email });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get<Order[]>("/orders");
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const validateProfileForm = (): boolean => {
    const errors: { name?: string; email?: string } = {};

    if (!profileForm.name.trim()) {
      errors.name = "Name is required";
    }
    if (!profileForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = "Invalid email format";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setIsSaving(true);
    try {
      const { data } = await api.patch<UserProfile>("/account/profile", {
        name: profileForm.name,
        email: profileForm.email,
      });
      setProfile(data);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsSaving(true);
    try {
      await api.patch("/account/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully");
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Failed to change password. Check your current password.");
    } finally {
      setIsSaving(false);
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.h1
        className="text-3xl font-bold text-gray-900"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        My Account
      </motion.h1>

      <div className="mt-8 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className="h-4 w-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "orders"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Package className="h-4 w-4" />
          Order History
        </button>
      </div>

      <div className="mt-8">
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h2>
              <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
                <Input
                  label="Name"
                  value={profileForm.name}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, name: e.target.value });
                    setProfileErrors({ ...profileErrors, name: undefined });
                  }}
                  error={profileErrors.name}
                />
                <Input
                  label="Email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, email: e.target.value });
                    setProfileErrors({ ...profileErrors, email: undefined });
                  }}
                  error={profileErrors.email}
                />
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => {
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    });
                    setPasswordErrors({
                      ...passwordErrors,
                      currentPassword: undefined,
                    });
                  }}
                  error={passwordErrors.currentPassword}
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => {
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    });
                    setPasswordErrors({
                      ...passwordErrors,
                      newPassword: undefined,
                    });
                  }}
                  error={passwordErrors.newPassword}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => {
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    });
                    setPasswordErrors({
                      ...passwordErrors,
                      confirmPassword: undefined,
                    });
                  }}
                  error={passwordErrors.confirmPassword}
                />
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Changing..." : "Change password"}
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {orders.length === 0
              ? (
                <div className="rounded-2xl border border-gray-100 p-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-lg font-medium text-gray-900">
                    No orders yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Start shopping to see your orders here
                  </p>
                  <Button
                    className="mt-6"
                    onClick={() => navigate("/products")}
                  >
                    Browse products
                  </Button>
                </div>
              )
              : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-gray-100 p-6 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-mono text-sm font-medium text-gray-900">
                              #{order.id.slice(0, 8)}
                            </p>
                            <Badge
                              label={order.status}
                              variant={getStatusVariant(order.status)}
                            />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                          <p className="mt-2 text-sm text-gray-600">
                            {order.shippingAddress}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id,
                          )}
                        className="mt-4 text-sm font-medium text-gray-900 hover:underline"
                      >
                        {expandedOrder === order.id
                          ? "Hide details"
                          : "View details"}
                      </button>

                      {expandedOrder === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 space-y-3 border-t border-gray-100 pt-4"
                        >
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
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
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
