import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "../../store/useProductStore";
import { DEMO_PRODUCTS } from "../../data/demoProducts";

const ProductsCard: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const data = useMemo(() => DEMO_PRODUCTS, []);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "price", header: "Price" },
      { accessorKey: "stock", header: "Stock" },
      { accessorKey: "description", header: "Description" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const navigate = useNavigate();

  const filteredProducts = table
    .getFilteredRowModel()
    .rows.map((row) => row.original);

  if (!filteredProducts.length) return <p>No products available right now.</p>;

  return (
    <section className="bg-[var(--color-background)] py-5 px-6 md:px-20">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform flex flex-col justify-between"
          >
            {/* Product Image */}
            <div
              onClick={() => navigate(`/product/${product.id}`)}
              className="h-40 w-full cursor-pointer rounded-md overflow-hidden mb-3 flex items-center justify-center"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <span className="text-gray-400 text-sm">
                  No Image Available
                </span>
              )}
            </div>

            {/* Product Info */}
            <div
              onClick={() => navigate(`/product/${product.id}`)}
              className="cursor-pointer"
            >
              <h3 className="text-[var(--color-primary-400)] font-semibold text-lg text-center mb-2 hover:underline">
                {product.name.length > 25
                  ? product.name.slice(0, 25) + "..."
                  : product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {product.description}
              </p>

              {/* Price */}
              <p className="text-[var(--color-primary-400)] font-bold text-lg">
                ₹{product.discount_price ?? product.price}
                {product.discount_price && (
                  <span className="text-gray-400 line-through text-sm ml-2">
                    ₹{product.price}
                  </span>
                )}
              </p>

              <p className="text-xs text-gray-500 mb-2">
                Stock: {product.stock > 0 ? product.stock : "Out of stock"}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={index < 4 ? "#facc15" : "#e5e7eb"}
                    className="w-5 h-5"
                  >
                    <path d="M12 .587l3.668 7.568L24 9.75l-6 5.854L19.335 24 12 19.896 4.665 24 6 15.604 0 9.75l8.332-1.595z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600 ml-2">(4.0)</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between mt-3">
              <button className="cursor-pointer flex-1 bg-[var(--color-primary-400)] hover:bg-[var(--color-primary-200)] hover:text-[var(--color-primary-400)] text-white py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
              <button className="ml-2 p-2 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-5 h-5 text-[var(--color-primary-400)]"
                >
                  <path d="M12 21C12 21 4 13.647 4 8.75C4 6.17893 6.17893 4 8.75 4C10.2355 4 11.6028 4.80549 12 6.00613C12.3972 4.80549 13.7645 4 15.25 4C17.8211 4 20 6.17893 20 8.75C20 13.647 12 21 12 21Z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ProductsCard;
