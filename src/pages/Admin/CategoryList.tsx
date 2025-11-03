import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface Category {
  id: number;
  name: string;
  image_url?: string;
  created_at: string;
}

const sampleCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    image_url: "https://images.unsplash.com/photo-1510552776732-03e61cf4b144",
    created_at: "2024-01-10",
  },
  {
    id: 2,
    name: "Fashion",
    image_url: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
    created_at: "2024-02-14",
  },
  {
    id: 3,
    name: "Home Decor",
    image_url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    created_at: "2024-03-25",
  },
  {
    id: 4,
    name: "Sports",
    image_url: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    created_at: "2024-05-30",
  },
  {
    id: 5,
    name: "Toys",
    image_url: "https://images.unsplash.com/photo-1606813903172-69a5b9ee8eaf",
    created_at: "2024-06-18",
  },
];

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Filter categories ---
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // --- Handlers ---
  const handleAdd = () => alert("Add Category clicked!");
  const handleEdit = (id: number) => alert(`Edit Category ${id}`);

  const handleDelete = (id: number) => {
    if (confirm("Delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

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
