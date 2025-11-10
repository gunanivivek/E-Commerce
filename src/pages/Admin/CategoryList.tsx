import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search, AlertTriangle } from "lucide-react";
import { useDeleteCategory } from "../../hooks/useCategoryActions";

import { useCategoryStore } from "../../store/categoryStore";
import { useFetchCategories } from "../../hooks/useFetchCategories";
import CategoryModal from "../../components/Admin/CategoryModal"; // ✅ Import your modal
import type { Category } from "../../types/category";

const CategoryList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null); // for edit mode

  const { isLoading, isError, refetch } = useFetchCategories();
  const { categories } = useCategoryStore();

  const { mutate: deleteCategory } = useDeleteCategory();
  // const { mutate: updateCategory } = useUpdateCategory();

  // --- Filter categories ---
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // --- Handlers ---
  const handleAdd = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteCategory(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  // --- Skeleton Loader ---
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-primary-400/10 overflow-hidden">
      <div className="w-full h-36 bg-primary-400/10 animate-pulse"></div>
      <div className="p-3 space-y-3">
        <div className="w-2/3 h-4 bg-primary-400/10 rounded animate-pulse"></div>
        <div className="w-1/3 h-3 bg-primary-400/10 rounded animate-pulse"></div>
        <div className="flex gap-2 mt-3">
          <div className="w-8 h-8 bg-primary-400/10 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-primary-400/10 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // --- Error UI ---
  if (isError)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
        <h2 className="text-primary-400 font-semibold text-lg mb-1">
          Failed to load categories
        </h2>
        <p className="text-primary-400/70 text-sm mb-4">
          Something went wrong while fetching data.
        </p>
        <button
          onClick={() => refetch?.()}
          className="px-4 py-1.5 bg-primary-400 text-white rounded-md text-sm hover:bg-primary-500 transition"
        >
          Retry
        </button>
      </div>
    );

  // --- Main UI ---
  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="px-4 sm:px-8">
        {/* Title + Add Button */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-accent-dark">
              Category Management
            </h1>
            <p className="text-primary-300 text-sm sm:text-base">
              Manage, edit, and organize your product categories.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 text-sm sm:text-base bg-primary-300 text-white rounded-lg px-3 py-1.5 hover:cursor-pointer hover:bg-primary-400 transition"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80 mt-4 mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300 w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 w-full  border border-border-light rounded-lg bg-primary-100/30 text-primary-300 focus:outline-none focus:ring-2 focus:ring-border text-sm"
          />
        </div>

        {/* Loading / Data Display */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredCategories.length === 0 ? (
              <p className="text-primary-400 text-sm col-span-full text-center">
                No categories found.
              </p>
            ) : (
              filteredCategories.map((category) => {
                const isDeleting = deletingId === category.id;
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl  border-1 border-primary-400/10 overflow-hidden hover:shadow-md  transition"
                  >
                    {/* Image */}
                    <div className="w-full h-36 bg-primary-400/5 overflow-hidden">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-primary-400/60 text-sm">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 flex flex-col justify-between h-[120px]">
                      <div>
                        <h3 className="text-primary-400 font-semibold text-sm truncate">
                          {category.name}
                        </h3>
                        <p className="text-primary-400/70 text-xs mt-1">
                          Created on{" "}
                          {new Date(category.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-1.5 bg-surface-light text-accent-dark rounded hover:bg-surface hover:cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 hover:cursor-pointer disabled:opacity-50"
                          title="Delete"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
        </div>
      </div>

    
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoryList;
