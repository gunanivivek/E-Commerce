import { useState } from "react";
import { Edit2, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useUpdateQuantity } from "../../hooks/Seller/useUpdateQuantity";

interface EditableQuantityCellProps {
  product: {
    id: number;
    stock: number;
  };
}

export const EditableQuantityCell: React.FC<EditableQuantityCellProps> = ({
  product,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [stock, setStock] = useState(product.stock);
  const { mutate: updateQuantity, isPending } = useUpdateQuantity();

  const handleSave = () => {
    if (stock < 0) {
      toast.error("Quantity cannot be negative!");
      return;
    }

    updateQuantity({ id: product.id, quantity: stock });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Left side: stock value or input */}
      {isEditing ? (
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="w-16 border border-border-light rounded-md text-sm px-1.5 py-0.5 focus:ring-2 focus:ring-primary-300 outline-none"
        />
      ) : (
        <span className="text-primary-400">{stock}</span>
      )}

      {/* Right side: edit/save button */}
      <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        disabled={isPending}
        type="button"
        title="Add product's Quantity"
        className={`p-1.5 rounded-md transition ${
          isEditing
            ? "bg-green-50 text-green-600 hover:cursor-pointer hover:bg-green-100"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
        }`}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isEditing ? (
          <Check className="w-4 h-4" />
        ) : (
          <Edit2 className="w-4 h-4 hover:cursor-pointer" />
        )}
      </button>
    </div>
  );
};
