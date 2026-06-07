import { Link, useNavigate } from "react-router-dom";
import { LogOut, Package, ShoppingCart, User } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useGetCartQuery } from "../../services/react-query/cart/queries/useGetCartQuery";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { data: cartItems = [] } = useGetCartQuery();
  const navigate = useNavigate();

  const itemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          Helfy
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/products"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="relative text-gray-600 transition-colors hover:text-gray-900"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated
            ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  <User className="h-4 w-4" />
                  {user?.name.split(" ")[0]}
                </Link>
                <Link
                  to="/account"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                  aria-label="Orders"
                >
                  <Package className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 transition-colors hover:text-red-600"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )
            : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                >
                  Sign up
                </Link>
              </div>
            )}
        </div>
      </div>
    </nav>
  );
};
