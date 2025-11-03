import React, { useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  image_url?: string;
  created_at: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/category`);
  return res.data.data || res.data; // depends on your API structure
};

const CategoryList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // --- Fetch categories from API ---
  const { data: categories = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // --- Filter categories based on search term ---
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // --- Handlers ---
  const handleAdd = () => alert("Add Category clicked!");
  const handleEdit = (id: number) => alert(`Edit Category ${id}`);
  const handleDelete = async (id: number) => {
    if (confirm("Delete this category?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/category/${id}`);
        refetch(); // refresh list
      } catch (error) {
        console.error(error);
        alert("Failed to delete category!");
      }
    }
  };

  // --- Loading / Error states ---
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-primary-400">
        Loading categories...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500">Failed to load categories.</div>
    );

  // --- Render UI ---
  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="px-4 sm:px-8">
        {/* Title + Add Button */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-400">
              Category Management
            </h1>
            <p className="text-primary-400 text-xs sm:text-sm">
              Manage, edit, and organize your product categories.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-primary-400 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow hover:bg-primary-500"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80 mt-4 mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 w-full border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        {/* Category Cards Grid */}
        {filteredCategories.length === 0 ? (
          <p className="text-primary-400 text-sm">No categories found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-sm border border-primary-400/10 overflow-hidden hover:shadow-md transition"
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
                      onClick={() => handleEdit(category.id)}
                      className="p-1.5 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
