import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  stock: number;
  slug: string;
  is_active: boolean;
  created_at: string;
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Demo Product A",
    description: "This is a demo product shown while the API is unreachable.",
    price: 499,
    discount_price: 399,
    stock: 12,
    slug: "demo-product-a",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Demo Product B",
    description: "Another demo product to populate the card list.",
    price: 299,
    discount_price: null,
    stock: 5,
    slug: "demo-product-b",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Demo Product C",
    description: "Sample product C for layout consistency.",
    price: 199,
    discount_price: 149,
    stock: 8,
    slug: "demo-product-c",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Demo Product D",
    description: "Sample product D for layout consistency.",
    price: 199,
    discount_price: 149,
    stock: 8,
    slug: "demo-product-d",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Demo Product E",
    description: "Fifth product goes to next row correctly.",
    price: 250,
    discount_price: 200,
    stock: 15,
    slug: "demo-product-e",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

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
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredProducts = table.getFilteredRowModel().rows.map((row) => row.original);

  if (!filteredProducts.length)
    return (
      <p className="text-center text-gray-500 py-12">
        No products available right now.
      </p>
    );

  return (
    <section className=" py-10 px-4 md:px-20">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Image Placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-lg font-semibold">
                {product.name.slice(0, 1)}
              </span>
              {product.discount_price && (
                <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded-md font-medium">
                  SALE
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col justify-between h-[180px]">
              <div>
                <h3 className="text-base font-semibold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {product.description}
                </p>
              </div>

              {/* Price Section */}
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    ₹{product.discount_price ?? product.price}
                  </span>
                  {product.discount_price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.price}
                    </span>
                  )}
                </div>
                <div className="flex justify-end items-center mt-1">
                 
                  <div className="flex text-yellow-400">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="mt-4 bg-[var(--color-primary)] text-white text-sm py-2 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ProductsCard;
