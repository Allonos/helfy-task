import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-gray-900"
          >
            Helfy
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link
              to="/products"
              className="transition-colors hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              to="/account"
              className="transition-colors hover:text-gray-900"
            >
              Account
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Helfy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
