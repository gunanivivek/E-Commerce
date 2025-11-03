/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import ReactDOM from "react-dom";
import type { CreateProductRequest, ViewProduct } from "../../types/seller";
import { useCategoryStore } from "../../store/categoryStore";
import { updateProduct } from "../../api/sellerApi";
import { toast } from "react-toastify";

interface UpdateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ViewProduct | null;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
}

const UpdateProductForm: React.FC<UpdateProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: product || {},
  });

  useEffect(() => {
    if (product) {
      reset(product);
      setIsEditing(false); // Always start in view mode
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (!product?.id) {
      console.error("❌ No product ID found");
      return;
    }
    try {
      const productData: CreateProductRequest = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        category: Number(data.category_id),
        images: [], 
      };
      const response = await updateProduct(product?.id, productData);

      toast.success("Product updated successfully!");

      console.log("✅ Updated Product:", response);
      onClose();
    } catch (error: any) {
      if (error.response) {
        console.error("❌ Server error:", error.response.data);
        toast.error(
          error.response.data.detail || "Failed to update product. Try again."
        );
      } else {
        console.error("❌ Unexpected error:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  const categories = useCategoryStore((state) => state.categories);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-4 border border-[--color-primary-border] transition-all duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold text-[--color-primary-400]">
            Product Details
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Product name is required" })}
              disabled={!isEditing}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--color-light] disabled:bg-gray-100"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              disabled={!isEditing}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--color-light] disabled:bg-gray-100"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
                disabled={!isEditing}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--color-light] disabled:bg-gray-100"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                {...register("stock", { required: "Stock is required" })}
                disabled={!isEditing}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--color-light] disabled:bg-gray-100"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-400 mb-1">
              Category
            </label>
            <select
              {...register("category_id", { required: "Category is required" })}
              className="w-full border border-primary-border rounded-xl p-3 bg-primary-100/40 focus:ring-2 focus:ring-primary-300 outline-none transition"
              disabled={!isEditing}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-400 hover:bg-[--color-light] text-white rounded-lg transition"
              >
                Update
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-red-100 hover:bg-red-300 text-black hover:cursor-pointer rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-300 hover:bg-primary-400 hover:cursor-pointer text-white rounded-lg transition"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default UpdateProductForm;
