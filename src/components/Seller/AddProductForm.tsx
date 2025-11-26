import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCategoryStore } from "../../store/categoryStore";
import { useCreateProduct } from "../../hooks/Seller/useCreateProduct";

interface ProductFormValues {
  productName: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  image: FileList;
}

interface AddProductFormProps {
  onClose: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProductFormValues>();

  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const imageFile = watch("image");

  const categories = useCategoryStore((state) => state.categories);
  const { mutate: createProductMutation, isPending } = useCreateProduct(onClose);

  React.useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const filesArray = Array.from(imageFile);
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImage(urls); // set all URLs
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [imageFile]);

  const onSubmit = async (data: ProductFormValues) => {
      const productData = {
        name: data.productName,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        category: Number(data.category_id),
        images: Array.from(data.image), 
      };

     createProductMutation(productData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-primary-border rounded-2xl shadow-lg p-8 max-w-lg mx-auto space-y-6 transition-all duration-300"
    >
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-primary-400 mb-1">
          Product Name
        </label>
        <input
          type="text"
          {...register("productName", { required: "Product name is required" })}
          placeholder="Enter product name"
          className="w-full border border-primary-border rounded-xl p-3 bg-primary-100/40 focus:ring-2 focus:ring-primary-300 outline-none transition"
        />
        {errors.productName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.productName.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-primary-400 mb-1">
          Description
        </label>
        <textarea
          {...register("description", {
            required: "Description is required",
          })}
          placeholder="Enter product description"
          rows={3}
          className="w-full border border-primary-border rounded-xl p-3 bg-primary-100/40 focus:ring-2 focus:ring-primary-300 outline-none resize-none transition"
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary-400 mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price cannot be negative" },
            })}
            placeholder="Enter price"
            className="w-full border border-primary-border rounded-xl p-3 bg-primary-100/40 focus:ring-2 focus:ring-primary-300 outline-none transition"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-primary-400 mb-1">
            Stock
          </label>
          <input
            type="number"
            {...register("stock", {
              required: "Stock is required",
              min: { value: 0, message: "Stock cannot be negative" },
            })}
            placeholder="Enter quantity"
            className="w-full border border-primary-border rounded-xl p-3 bg-primary-100/40 focus:ring-2 focus:ring-primary-300 outline-none transition"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-primary-400 mb-1">
          Category
        </label>
        <select
          {...register("category_id", { required: "Category is required" })}
          className="w-full border border-primary-border rounded-xl p-3 bg-primary-100/40 focus:ring-2 focus:ring-primary-300 outline-none transition"
        >
           {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
        </select>
        {errors.category_id && (
          <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-primary-400 mb-2">
          Upload Image
        </label>
        <div className="border-2 border-dashed border-primary-200 bg-primary-100/30 rounded-2xl p-4 text-center hover:bg-primary-100/50 transition">
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("image", { required: "Image is required" })}
            className="w-full text-sm text-gray-700 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary-400 file:text-white hover:file:bg-primary-300 transition"
          />
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
        )}

        {previewImage.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {previewImage.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-accent-dark hover:bg-accent-light text-surface-light font-heading py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:cursor-pointer"
      >
         {isPending ? "Submitting..." : "Submit Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
