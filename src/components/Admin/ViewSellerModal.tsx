import React from "react";
import ReactDOM from "react-dom";
import {
  X,
  User,
  Mail,
  Phone,
  Store,
  MapPin,
  Calendar,
  CheckCircle,
  Ban,
  ShieldCheck,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

import type { Seller } from "../../types/admin"; // adjust import if needed

interface ViewSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: Seller | null;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onToggleBlock: (id: number, newState: boolean) => void;
}

const getStatusColor = (isActive: boolean, isBlocked: boolean) => {
  if (isBlocked) return "bg-red-100 text-red-700 border-red-300";
  if (isActive) return "bg-green-100 text-green-700 border-green-300";
  return "bg-yellow-100 text-yellow-800 border-yellow-300";
};

const getStatusLabel = (isActive: boolean, isBlocked: boolean) => {
  if (isBlocked) return "Blocked";
  if (isActive) return "Active";
  return "Pending";
};

const ViewSellerModal: React.FC<ViewSellerModalProps> = ({
  isOpen,
  onClose,
  seller,
  onApprove,
  onReject,
  onToggleBlock,
}) => {
  if (!isOpen || !seller) return null;

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        className=" fixed  inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-white border border-primary-border rounded-xl shadow-xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-primary-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-300 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-primary-400">
                  Seller Details
                </h1>
                <p className="text-xs font-medium text-primary-400/70">
                  {seller.full_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-block px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(
                  seller.is_active,
                  seller.is_blocked
                )}`}
              >
                {getStatusLabel(seller.is_active, seller.is_blocked)}
              </span>
              <button
                onClick={onClose}
                className="p-1 cursor-pointer rounded-full bg-primary-100/50 text-primary-400 hover:bg-primary-200/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Profile */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full border border-primary-border overflow-hidden shadow-sm bg-primary-100/30 flex items-center justify-center">
                {seller.profile_picture ? (
                  <img
                    src={seller.profile_picture}
                    alt={seller.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-primary-400" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-primary-400">
                {seller.full_name}
              </h2>
              <p className="text-sm text-primary-500">Seller ID: #{seller.id}</p>
            </div>

            {/* Seller Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={<Mail />} label="Email" value={seller.email} />
              <InfoCard icon={<Phone />} label="Phone" value={seller.phone} />
              <InfoCard
                icon={<Store />}
                label="Store Name"
                value={seller.store_name || "Not Provided"}
              />
              <InfoCard
                icon={<MapPin />}
                label="Store Address"
                value={seller.store_address || "Not Provided"}
              />
              {/* 🆕 Store Description */}
              <InfoCard
                icon={<FileText />}
                label="Store Description"
                value={seller.store_description || "No description provided"}
              />
              <InfoCard
                icon={<Calendar />}
                label="Joined On"
                value={new Date(seller.created_at).toLocaleDateString()}
              />
            </div>
          </div>

          {/* Footer - Conditional Actions */}
          <div className="p-6 border-t border-primary-border/50 bg-primary-50/50 flex justify-end gap-3">
            {!seller.is_active ? (
              <>
                <button
                  onClick={() => onReject(seller.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium text-sm"
                >
                  <Ban className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => onApprove(seller.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-400 hover:bg-primary-300 text-white shadow-sm transition-all font-medium text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              </>
            ) : (
              <button
                onClick={() => onToggleBlock(seller.id, !seller.is_blocked)}
                className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  seller.is_blocked
                    ? "border border-green-300 bg-green-100 text-green-700 hover:bg-green-200"
                    : "border border-red-300 bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {seller.is_blocked ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Unblock
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    Block
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

// Small subcomponent for cleaner info grid
const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-start gap-3 p-4 rounded-lg border border-primary-border bg-primary-100/30 hover:bg-primary-100/50 transition-colors">
    <div className="w-5 h-5 mt-1 text-primary-400 flex-shrink-0">{icon}</div>
    <div>
      <strong className="text-primary-400 block text-sm mb-1">{label}</strong>
      <p className="text-primary-600 text-sm font-medium break-words whitespace-pre-wrap">
        {value}
      </p>
    </div>
  </div>
);

export default ViewSellerModal;
