import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

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
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredProducts = table.getFilteredRowModel().rows.map((row) => row.original);

  if (!filteredProducts.length) return <p>No products available right now.</p>;

  return (
    <section className="bg-[var(--color-background)] py-10 px-6 md:px-20">
      
      {/* Product Grid (4 columns max, wraps to new row for 5th product) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="h-40 bg-[var(--color-primary-100)] rounded-md flex items-center justify-center mb-3">
              <span className="text-[var(--color-primary-400)] font-semibold text-lg text-center px-2">
                {product.name.length > 20
                  ? product.name.slice(0, 20) + "..."
                  : product.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{product.description}</p>
            <p className="text-[var(--color-primary-400)] font-bold text-lg">
              ₹{product.discount_price ?? product.price}
            </p>
            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
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
