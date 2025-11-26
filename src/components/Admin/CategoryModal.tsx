import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X, Image as ImageIcon, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateCategory, useUpdateCategory } from "../../hooks/useCategoryActions";
import type { Category, CreateCategoryRequest } from "../../types/category";
import { toast } from "react-toastify";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const isEdit = !!category;

  const { register, handleSubmit, reset, formState, setValue } =
    useForm<CreateCategoryRequest>({
      defaultValues: {
        name: "",
        description: "",
        image: undefined,
      },
    });

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const [preview, setPreview] = useState<string | null>(null);

  //  Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset({
        name: "",
        description: "",
        image: undefined,
      });
      setPreview(null);
    }
  }, [isOpen, reset]);

  //  Pre-fill form in edit mode
  useEffect(() => {
    if (isEdit && category) {
      reset({
        name: category.name,
        description: category.description,
      });
      setPreview(category.image_url || null);
    } else {
      reset();
      setPreview(null);
    }
  }, [isEdit, category, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = (data: CreateCategoryRequest) => {
    if (isEdit && category) {
      // 🧠 Compare new data with old and only append changed fields
      const formData = new FormData();

      if (data.name !== category.name) {
        formData.append("name", data.name);
      }

      if (data.description !== category.description) {
        formData.append("description", data.description);
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      //  If no changes, show info toast and close
      if ([...formData.keys()].length === 0) {
        toast.info("No changes detected ✨");
        onClose();
        return;
      }


      updateCategory(
        { id: category.id, formData },
        {
          onSuccess: () => {
            onClose();
            reset();
            setPreview(null);
          },
        }
      );
    } else {
      //  Create new category
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      if (data.image) formData.append("image", data.image);

      createCategory(formData, {
        onSuccess: () => {
          onClose();
          reset();
          setPreview(null);
        },
      });
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-md border border-primary-border relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-primary-border flex justify-between items-center">
            <h2 className="text-primary-400 font-bold text-base sm:text-lg">
              {isEdit ? "Edit Category" : "Create Category"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 cursor-pointer rounded-full  text-primary-400 hover:cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-1">
                Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full border border-primary-border rounded-lg px-3 py-2 text-sm text-primary-600 focus:ring-2 focus:ring-primary-400"
                placeholder="Enter category name"
              />
              {formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {formState.errors.name.message}
                </p>
              )}
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
                placeholder="Enter category description"
                rows={3}
              />
              {formState.errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-primary-500 mb-2">
                Category Image
              </label>

              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-md border border-primary-border bg-primary-100/20 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-primary-400" />
                  )}
                </div>

                <label className="flex items-center gap-2 px-3 py-2 text-sm border border-primary-border rounded-lg bg-primary-50 hover:bg-primary-100 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-primary-400" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
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
                disabled={isCreating || isUpdating}
                className="px-4 py-2 cursor-pointer text-sm rounded-lg bg-primary-400 text-white hover:bg-primary-500 disabled:opacity-60"
              >
                {isEdit
                  ? isUpdating
                    ? "Saving..."
                    : "Save Changes"
                  : isCreating
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

export default CategoryModal;
