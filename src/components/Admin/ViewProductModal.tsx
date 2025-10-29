import React from "react";
import ReactDOM from "react-dom";
import {
  X,
  User,
  Tag,
  DollarSign,
  Hash,
  FileText,
  Image,
  Package,
} from "lucide-react";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    seller: string;
    category: string;
    price: number;
    status: string;
    description?: string;
    images?: string[];
  } | null;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-700 border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !product) return null;

  const isPending = product.status.toLowerCase() === "pending";

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-white border border-primary-border rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden transition-all duration-300 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Inspired by Sidebar */}
          <div className="p-6 border-b border-primary-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-300 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-primary-400">
                  Product Review
                </h1>
                <p className="text-xs font-medium text-primary-400/70">
                  {product.name}
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-2">
            
              <span
                className={`inline-block px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(
                  product.status
                )}`}
              >
                {product.status.charAt(0).toUpperCase() +
                  product.status.slice(1)}
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-primary-100/50 text-primary-400 hover:bg-primary-200/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Product Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-primary-border bg-primary-100/30 hover:bg-primary-100/50 transition-colors">
                <User className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <strong className="text-primary-400 block text-sm mb-1">
                    Seller
                  </strong>
                  <p className="text-primary-600 text-sm font-medium truncate">
                    {product.seller}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-primary-border bg-primary-100/30 hover:bg-primary-100/50 transition-colors">
                <Tag className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <strong className="text-primary-400 block text-sm mb-1">
                    Category
                  </strong>
                  <p className="text-primary-600 text-sm font-medium">
                    {product.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-primary-border bg-primary-100/30 hover:bg-primary-100/50 transition-colors">
                <DollarSign className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <strong className="text-primary-400 block text-sm mb-1">
                    Price
                  </strong>
                  <p className="text-primary-600 text-sm font-medium">
                    ₹{product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-primary-border bg-primary-100/30 hover:bg-primary-100/50 transition-colors">
                <Hash className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <strong className="text-primary-400 block text-sm mb-1">
                    Product ID
                  </strong>
                  <p className="text-primary-600 text-sm font-medium">
                    #{product.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-400" />
                <h3 className="text-primary-400 font-semibold">Description</h3>
              </div>
              <div className="p-4 rounded-lg border border-primary-border bg-primary-100/30 hover:bg-primary-100/50 transition-colors">
                <p className="text-primary-600 text-sm leading-relaxed">
                  {product.description ||
                    "This product description is currently unavailable."}
                </p>
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-primary-400" />
                <h3 className="text-primary-400 font-semibold">
                  Product Images
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(product.images || []).length > 0 ? (
                  product.images!.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg border border-primary-border bg-primary-100/30 overflow-hidden shadow-sm hover:shadow-md hover:bg-primary-100/50 transition-all"
                    >
                      <img
                        src={img}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="aspect-square rounded-lg border border-primary-border bg-primary-100/30 flex items-center justify-center col-span-full hover:bg-primary-100/50 transition-colors">
                    <p className="text-primary-400 text-sm text-center">
                      No images available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Actions */}
          {isPending && (
            <div className="p-6 border-t border-primary-border/50 bg-primary-50/50 flex justify-end gap-3">
              <button
                onClick={() => onReject?.(product.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove?.(product.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-400 hover:bg-primary-300 text-white shadow-sm transition-all font-medium text-sm"
              >
                Approve
              </button>
            </div>
          )}

          {/* Close Button */}
        </div>
      </div>
    </>,
    document.body
  );
};

export default ViewProductModal;
