import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import AddProductForm from "./AddProductForm";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Outer Wrapper */}
      <div
        className="relative w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto 
                   bg-white border border-primary-border 
                   shadow-2xl rounded-3xl p-8 transition-all duration-200 
                   ease-out animate-fadeIn"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary-400 hover:text-primary-300 
                     transition transform hover:scale-110 active:scale-95"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-primary-400">
            Add Your New Product
          </h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Fill in correct product details below. Once verified by the admin, 
            it will be available for customers.
          </p>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-primary-border mb-6"></div>

        {/* Form */}
        <div className="pb-4">
          <AddProductForm onClose={onClose} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddProductModal;
