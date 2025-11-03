// import React, { useState, useMemo } from "react";
// import { Plus, Edit, Trash2, Search, AlertTriangle } from "lucide-react";
// import { useCategories } from "../../hooks/useFetchCategories";
// import { useDeleteCategory } from "../../hooks/useCategoryActions";
// import { toast } from "react-toastify";

import { useCategoryStore } from "../../store/categoryStore";

// const CategoryList: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [deletingId, setDeletingId] = useState<number | null>(null);
//   const { data: categories = [], isLoading, isError, refetch } = useCategories();
//   const { mutate: deleteCategory } = useDeleteCategory();

//   // --- Filter categories ---
//   const filteredCategories = useMemo(() => {
//     return categories.filter((cat) =>
//       cat.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [categories, searchTerm]);

//   // --- Handlers ---
//   const handleAdd = () => toast.info("Add Category clicked!");
//   const handleEdit = (id: number) => toast.info(`Edit Category ${id}`);
//   const handleDelete = (id: number) => {
//     setDeletingId(id);
//     deleteCategory(id, {
//       onSettled: () => setDeletingId(null),
//     });
//   };

//   // --- Skeleton Loader ---
//   const SkeletonCard = () => (
//     <div className="bg-white rounded-xl shadow-sm border border-primary-400/10 overflow-hidden">
//       <div className="w-full h-36 bg-primary-400/10 animate-pulse"></div>
//       <div className="p-3 space-y-3">
//         <div className="w-2/3 h-4 bg-primary-400/10 rounded animate-pulse"></div>
//         <div className="w-1/3 h-3 bg-primary-400/10 rounded animate-pulse"></div>
//         <div className="flex gap-2 mt-3">
//           <div className="w-8 h-8 bg-primary-400/10 rounded animate-pulse"></div>
//           <div className="w-8 h-8 bg-primary-400/10 rounded animate-pulse"></div>
//         </div>
//       </div>
//     </div>
//   );

//   // --- Error UI ---
//   if (isError)
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
//         <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
//         <h2 className="text-primary-400 font-semibold text-lg mb-1">
//           Failed to load categories
//         </h2>
//         <p className="text-primary-400/70 text-sm mb-4">
//           Something went wrong while fetching data.
//         </p>
//         <button
//           onClick={() => refetch?.()}
//           className="px-4 py-1.5 bg-primary-400 text-white rounded-md text-sm hover:bg-primary-500 transition"
//         >
//           Retry
//         </button>
//       </div>
//     );

//   // --- Main UI ---
//   return (
//     <div className="min-h-screen py-4 sm:py-6">
//       <div className="px-4 sm:px-8">
//         {/* Title + Add Button */}
//         <div className="flex items-center justify-between mb-2">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-primary-400">
//               Category Management
//             </h1>
//             <p className="text-primary-400 text-xs sm:text-sm">
//               Manage, edit, and organize your product categories.
//             </p>
//           </div>
//           <button
//             onClick={handleAdd}
//             className="flex items-center gap-2 bg-primary-400 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow hover:bg-primary-500"
//           >
//             <Plus className="w-4 h-4" />
//             Add Category
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="relative w-full sm:w-80 mt-4 mb-6">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400/50 w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Search categories..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-9 pr-3 py-1.5 w-full border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 focus:ring-2 focus:ring-primary-500 text-sm"
//           />
//         </div>

//         {/* Loading / Data Display */}
//         <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {isLoading
//             ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
//             : filteredCategories.length === 0
//             ? (
//               <p className="text-primary-400 text-sm col-span-full text-center">
//                 No categories found.
//               </p>
//             )
//             : filteredCategories.map((category) => {
//                 const isDeleting = deletingId === category.id;

//                 return (
//                   <div
//                     key={category.id}
//                     className="bg-white rounded-xl shadow-sm border border-primary-400/10 overflow-hidden hover:shadow-md transition"
//                   >
//                     {/* Image */}
//                     <div className="w-full h-36 bg-primary-400/5 overflow-hidden">
//                       {category.image_url ? (
//                         <img
//                           src={category.image_url}
//                           alt={category.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center h-full text-primary-400/60 text-sm">
//                           No Image
//                         </div>
//                       )}
//                     </div>

//                     {/* Content */}
//                     <div className="p-3 flex flex-col justify-between h-[120px]">
//                       <div>
//                         <h3 className="text-primary-400 font-semibold text-sm truncate">
//                           {category.name}
//                         </h3>
//                         <p className="text-primary-400/70 text-xs mt-1">
//                           Created on{" "}
//                           {new Date(category.created_at).toLocaleDateString()}
//                         </p>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex gap-2 mt-2">
//                         <button
//                           onClick={() => handleEdit(category.id)}
//                           className="p-1.5 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100"
//                           title="Edit"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(category.id)}
//                           className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
//                           title="Delete"
//                           disabled={isDeleting}
//                         >
                       
//                             <Trash2 className="w-4 h-4" />
                          
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryList;


const CategoryList = () => {
   const { categories } = useCategoryStore();
   console.log(categories);
   
  return (
    <div>CategoryList</div>
  )
}

export default CategoryList