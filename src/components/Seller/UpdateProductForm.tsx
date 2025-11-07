/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import ReactDOM from "react-dom";
import type { CreateProductRequest } from "../../types/seller";
import { useCategoryStore } from "../../store/categoryStore";
import { updateProduct } from "../../api/sellerApi";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductQuery } from "../../hooks/useProductQuery";

interface UpdateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
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
  productId,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const categories = useCategoryStore((state) => state.categories);

  const {
    data: product,
    isLoading,
    isError,
  } = useProductQuery(productId || undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id:
          categories.find((c) => c.name === product.category)?.id || 0,
      });
      setIsEditing(false);
    }
  }, [product, reset, categories]);

  const mutation = useMutation({
    mutationFn: (data: CreateProductRequest) => updateProduct(productId!, data),
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || "Failed to update product. Try again."
      );
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (!productId) return;
    const payload: CreateProductRequest = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
      category: Number(data.category_id),
      images: [],
    };
    mutation.mutate(payload);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-4 border border-border transition-all duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold font-heading text-accent-dark">
            Product Details
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:cursor-pointer hover:text-gray-700" />
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-center py-4">Loading product...</p>
        ) : isError ? (
          <p className="text-red-500 text-center py-4">
            Failed to load product details.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-400">
                Product Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                disabled={!isEditing}
                className="w-full p-2 mt-1 border border-border text-primary-300 font-medium text-base rounded-lg focus:ring-2 focus:ring-border disabled:bg-white"
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
                className="w-full p-2 mt-1 border border-border text-primary-300 font-medium text-base rounded-lg focus:ring-2 focus:ring-border disabled:bg-white"
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
                  className="w-full p-2 mt-1 border border-border text-primary-300 font-medium text-base rounded-lg focus:ring-2 focus:ring-border disabled:bg-white"
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
                  className="w-full p-2 mt-1 border border-border text-primary-300 rounded-lg font-medium text-base focus:ring-2 focus:ring-border disabled:bg-white"
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
                {...register("category_id", {
                  required: "Category is required",
                })}
                className="w-full border border-border text-primary-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-border outline-none font-medium text-base transition"
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
                  className="px-4 py-2 bg-primary-400 hover:cursor-pointer hover:bg-[--color-light] text-white rounded-lg transition"
                >
                  Update
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-primary-100 hover:bg-primary-200 text-white hover:cursor-pointer rounded-lg transition"
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
        )}
      </div>
    </div>,
    document.body
  );
};

export default UpdateProductForm;
