type BadgeVariant =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  default: "bg-gray-100 text-gray-800",
};

export const Badge = ({
  label,
  variant = "default",
  className = "",
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        variantClasses[variant]
      } ${className}`}
    >
      {label}
    </span>
  );
};
