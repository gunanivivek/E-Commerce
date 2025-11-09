import React from "react";
import ReactDOM from "react-dom";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Ban,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";

import type { Customer } from "../../types/admin"; // adjust the import path as needed

interface ViewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
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

const ViewCustomerModal: React.FC<ViewCustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
  onToggleBlock,
}) => {
  if (!isOpen || !customer) return null;

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
          className="relative bg-white border border-primary-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
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
                  Customer Details
                </h1>
                <p className="text-xs font-medium text-primary-400/70">
                  {customer.full_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-block px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(
                  customer.is_active,
                  customer.is_blocked
                )}`}
              >
                {getStatusLabel(customer.is_active, customer.is_blocked)}
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:cursor-pointer text-primary-400 transition-colors"
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
                {customer.profile_picture ? (
                  <img
                    src={customer.profile_picture}
                    alt={customer.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-primary-400" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-primary-400">
                {customer.full_name}
              </h2>
              <p className="text-sm text-primary-500">
                Customer ID: #{customer.id}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={<Mail />} label="Email" value={customer.email} />
              <InfoCard icon={<Phone />} label="Phone" value={customer.phone} />
              <InfoCard
                icon={<Calendar />}
                label="Joined On"
                value={new Date(customer.created_at).toLocaleDateString()}
              />
              <InfoCard
                icon={<Calendar />}
                label="Last Updated"
                value={new Date(customer.updated_at).toLocaleDateString()}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-primary-border/50 bg-primary-50/50 flex justify-end">
            <button
              onClick={() => onToggleBlock(customer.id, !customer.is_blocked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                customer.is_blocked
                  ? "border border-green-300 bg-green-100 text-green-700 hover:bg-green-200"
                  : "border border-red-300 bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {customer.is_blocked ? (
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
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};


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

export default ViewCustomerModal;
