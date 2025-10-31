import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import BulkUploadForm from "./BulkUploadForm";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => Promise<void>;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  fetchData,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-primary-400 mb-1">
          Bulk Upload Products
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload your product list using an Excel sheet. Ensure the file follows
          the correct format before uploading.
        </p>

        <BulkUploadForm
          onClose={onClose}
          onSuccess={async () => {
            await fetchData();
          }}
        />
      </div>
    </div>,
    document.body
  );
};

export default BulkUploadModal;
