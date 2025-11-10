import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X, Calendar, Percent, IndianRupee } from "lucide-react";
import { useForm } from "react-hook-form";

interface Coupon {
  id?: number;
  code: string;
  discountType: "flat" | "percentage";
  discountValue: number;
  description: string;
  validTill: string;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon?: Coupon | null;
}

const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  coupon,
}) => {
  const isEdit = !!coupon;

  const { register, handleSubmit, reset, watch, formState } = useForm<Coupon>({
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      description: "",
      validTill: "",
    },
  });

  const discountType = watch("discountType");
  const [symbol, setSymbol] = useState("%");

  useEffect(() => {
    // Update symbol dynamically based on selection
    setSymbol(discountType === "flat" ? "₹" : "%");
  }, [discountType]);

  useEffect(() => {
    if (isEdit && coupon) {
      reset(coupon);
    } else {
      reset({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        description: "",
        validTill: "",
      });
    }
  }, [isEdit, coupon, reset]);

  const onSubmit = (data: Coupon) => {
    if (isEdit) {
      console.log("Updated Coupon:", data);
    } else {
      console.log("Created New Coupon:", data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-md border border-primary-border relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-primary-border flex justify-between items-center">
            <h2 className="text-primary-400 font-bold text-lg">
              {isEdit ? "Edit Coupon" : "Create Coupon"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-primary-400 hover:cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            {/* Coupon Code */}
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-1">
                Coupon Code
              </label>
              <input
                {...register("code", { required: "Coupon code is required" })}
                className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                placeholder="Enter coupon code (e.g., SAVE10)"
              />
              {formState.errors.code && (
                <p className="text-red-500 text-xs mt-1">
                  {formState.errors.code.message}
                </p>
              )}
            </div>

            {/* Discount Type + Value */}
            <div className="grid grid-cols-2 gap-3">
              {/* Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-primary-500 mb-1">
                  Discount Type
                </label>
                <select
                  {...register("discountType", { required: true })}
                  className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 bg-white focus:ring-2 focus:ring-primary-400"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>

              {/* Value Input */}
              <div>
                <label className="block text-sm font-medium text-primary-500 mb-1">
                  Discount Value
                </label>
                <div className="flex items-center gap-2">
                  {discountType === "flat" ? (
                    <IndianRupee className="w-4 h-4 text-primary-400" />
                  ) : (
                    <Percent className="w-4 h-4 text-primary-400" />
                  )}
                  <input
                    type="number"
                    {...register("discountValue", {
                      required: "Discount value is required",
                      min: 1,
                    })}
                    className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                    placeholder={`Enter value in ${symbol}`}
                  />
                </div>
                {formState.errors.discountValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {formState.errors.discountValue.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-1">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                rows={3}
                placeholder="Describe the coupon (e.g., 10% off on all products)"
              />
              {formState.errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Valid Till */}
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-1">
                Valid Till
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-400" />
                <input
                  type="date"
                  {...register("validTill", {
                    required: "Valid till date is required",
                  })}
                  className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                />
              </div>
              {formState.errors.validTill && (
                <p className="text-red-500 text-xs mt-1">
                  {formState.errors.validTill.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border border-primary-border text-primary-500 hover:bg-primary-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-primary-400 text-white hover:bg-primary-500"
              >
                {isEdit ? "Save Changes" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CouponModal;
