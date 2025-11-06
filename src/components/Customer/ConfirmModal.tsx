import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const confirmClass = danger
    ? "bg-[var(--color-accent-light)] hover:bg-[var(--color-accent-darker)] text-[var(--color-white)]"
    : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-[var(--color-text-dark)]";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--color-white)] rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative" style={{ fontFamily: "var(--font-body)" }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition"
          aria-label="close"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-[var(--color-text-dark)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{title}</h2>

        <div className="text-sm text-[var(--color-text-muted)] mb-6">{message}</div>

        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[var(--color-border-orange)] text-[var(--color-text-orange)] font-medium py-2 rounded-lg hover:bg-[var(--color-accent-darker)] hover:text-[var(--color-white)] transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            className={`flex-1 font-medium py-2 rounded-lg transition ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
