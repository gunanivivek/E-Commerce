import React from "react";
import ReactDOM from "react-dom";
import { Trash2, X } from "lucide-react";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  productId: number;
  productName?: string;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productId,
  productName,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition hover:cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            <Trash2 size={28} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
          Delete Product
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-primary-400">
            {productName || "this product"}
          </span>
          ? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(productId)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition hover:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteProductModal;
