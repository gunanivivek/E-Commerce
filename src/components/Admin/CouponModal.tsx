import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X, Calendar, Percent, IndianRupee } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useCreateCoupon,
  useUpdateCoupon,
} from "../../hooks/Seller/useSellerCoupons";

interface CouponFormData {
  coupon_name: string;
  coupon_description: string;
  discount_type: "flat" | "percentage";
  discount_value: number;
  minimum_value: number;
  expiry_date: string;
  usage_limit: number;
  coupon_status?: true;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon?: {
    id: number;
    coupon_name: string;
    coupon_description: string;
    discount_type: "flat" | "percentage";
    discount_value: number;
    minimum_value: number;
    expiry_date: string;
    usage_limit: number;
    coupon_status?: true;
  } | null;
}

const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  coupon,
}) => {
  const isEdit = !!coupon;

  const { register, handleSubmit, reset, watch, formState } =
    useForm<CouponFormData>({
      defaultValues: {
        coupon_name: "",
        coupon_description: "",
        discount_type: "percentage",
        discount_value: 0,
        minimum_value: 0,
        expiry_date: "",
        usage_limit: 0,
      },
    });

  const discountType = watch("discount_type");
  const [symbol, setSymbol] = useState("%");

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();

  useEffect(() => {
    setSymbol(discountType === "flat" ? "₹" : "%");
  }, [discountType]);

  useEffect(() => {
    if (isEdit && coupon) {
      reset(coupon);
    } else {
      reset({
        coupon_name: "",
        coupon_description: "",
        discount_type: "percentage",
        discount_value: 0,
        minimum_value: 0,
        expiry_date: "",
        usage_limit: 0,
      });
    }
  }, [isEdit, coupon, reset]);

  const onSubmit = async (data: CouponFormData) => {
  try {
    const formattedData = {
      ...data,
      expiry_date: new Date(data.expiry_date).toISOString(),
      usage_limit: Number(data.usage_limit),
    };

    if (isEdit && coupon?.id) {
      // include coupon_status only during update
      const updateData = {
        ...formattedData,
        coupon_status: true as const 
      };

      await updateMutation.mutateAsync({ id: coupon.id, data: updateData });
    } else {
      await createMutation.mutateAsync(formattedData);
    }

    onClose();
  } catch (err) {
    console.error("Coupon mutation error:", err);
  }
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
              className="p-1 cursor-pointer rounded-full text-primary-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            {/* Coupon Name */}
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-1">
                Coupon Name
              </label>
              <input
                {...register("coupon_name", {
                  required: "Coupon name is required",
                })}
                className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                placeholder="Enter coupon name (e.g., Diwali Offer)"
              />
              {formState.errors.coupon_name && (
                <p className="text-red-500 text-xs mt-1">
                  {formState.errors.coupon_name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-1">
                Description
              </label>
              <textarea
                {...register("coupon_description", {
                  required: "Description is required",
                })}
                className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                rows={3}
                placeholder="Describe the coupon (e.g., 10% off on all products)"
              />
              {formState.errors.coupon_description && (
                <p className="text-red-500 text-xs mt-1">
                  {formState.errors.coupon_description.message}
                </p>
              )}
            </div>

            {/* Discount Type + Value */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-primary-500 mb-1">
                  Discount Type
                </label>
                <select
                  {...register("discount_type", { required: true })}
                  className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 bg-white focus:ring-2 focus:ring-primary-400"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>

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
                    {...register("discount_value", {
                      required: "Discount value is required",
                      min: 1,
                    })}
                    className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                    placeholder={`Enter value in ${symbol}`}
                  />
                </div>
                {formState.errors.discount_value && (
                  <p className="text-red-500 text-xs mt-1">
                    {formState.errors.discount_value.message}
                  </p>
                )}
              </div>
            </div>

            {/* Minimum Value */}
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-1">
                Minimum Order Value (₹)
              </label>
              <input
                type="number"
                {...register("minimum_value", {
                  required: "Minimum value is required",
                  min: 0,
                })}
                className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                placeholder="e.g., 1000"
              />
              {formState.errors.minimum_value && (
                <p className="text-red-500 text-xs mt-1">
                  {formState.errors.minimum_value.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-500 mb-1">
                Usage Limit
              </label>
              <input
                type="number"
                {...register("usage_limit", { required: true, min: 1 })}
                className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                placeholder="Enter usage limit"
              />
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
                  {...register("expiry_date", {
                    required: "Valid till date is required",
                  })}
                  className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                />
              </div>
              {formState.errors.expiry_date && (
                <p className="text-red-500 text-xs mt-1">
                  {formState.errors.expiry_date.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 cursor-pointer py-2 text-sm rounded-lg border border-primary-border text-primary-500 hover:bg-primary-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 cursor-pointer py-2 text-sm rounded-lg bg-primary-400 text-white hover:bg-primary-500"
              >
                {isEdit
                  ? updateMutation.isPending
                    ? "Saving..."
                    : "Save Changes"
                  : createMutation.isPending
                  ? "Creating..."
                  : "Create"}
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
