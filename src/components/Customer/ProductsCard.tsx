import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useProductStore } from "../../store/useProductStore";
import { useCartStore } from "../../store/cartStore";
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
  const user = useAuthStore((s) => s.user);
  const { addToCart, addToWishlist } = useProductStore();
  const { cartItems, updateQuantity, removeItem } = useCartStore();

  const filteredProducts = table
    .getFilteredRowModel()
    .rows.map((row) => row.original);

  if (!filteredProducts.length) return <p>No products available right now.</p>;

  return (
    <section className="bg-[var(--color-background)] py-5 px-6 md:px-20">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stock = Number(product.stock ?? NaN);

          const handleNavigate = () => {
            // don't navigate to product details when out of stock (stock === 0)
            if (stock === 0) return;
            navigate(`/product/${product.id}`);
          };

          const handleAddToCart = (e: React.MouseEvent) => {
            e.stopPropagation();
            // don't add if out of stock
            if (stock === 0) return;
            // add via product store which already syncs to cartStore
            addToCart(product as Product);
          };

          const handleWishlist = (e: React.MouseEvent) => {
            e.stopPropagation();
            // require login to add to wishlist
            if (!user) return navigate("/login");
            addToWishlist(product as Product);
          };

          return (
            <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform flex flex-col justify-between"
          >
            <div className="relative h-40 w-full cursor-pointer rounded-md overflow-hidden mb-3 flex items-center justify-center">
              {/* Out of stock badge - overlays the image when stock === 0 */}
              {stock === 0 && (
                <div
                  aria-hidden
                  className="absolute top-2 right-2 z-20 bg-[var(--color-light)] text-black px-3 py-1 rounded-full text-xs font-semibold"
                >
                  Out of stock
                </div>
              )}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                  onClick={handleNavigate}
                />
              ) : (
                <span className="text-gray-400 text-sm" onClick={handleNavigate}>
                  No Image Available
                </span>
              )}
            </div>

            {/* Product Info */}
            <div onClick={handleNavigate} className="cursor-pointer">
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

              {/* Hide stock count when product is in stock (stock > 0). Show stock info when not in stock. */}
              {/* Show textual stock only when we have a valid numeric stock and it's <= 0 */}
              {Number.isFinite(stock) && stock <= 0 ? (
                <p className="text-xs text-gray-500 mb-2">
                  Stock: {stock > 0 ? stock : "Out of stock"}
                </p>
              ) : null}

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
              {/* If product exists in cart, show quantity controls */}
              {cartItems.find((c) => c.id === product.id) ? (
                (() => {
                  const c = cartItems.find((ci) => ci.id === product.id)!;
                  const dec = (ev: React.MouseEvent) => {
                    ev.stopPropagation();
                    if (c.quantity <= 1) {
                      removeItem(c.id);
                    } else {
                      updateQuantity(c.id, -1);
                    }
                  };
                  const inc = (ev: React.MouseEvent) => {
                    ev.stopPropagation();
                    updateQuantity(c.id, 1);
                  };

                  return (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={dec}
                        className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                        aria-label="decrease"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border rounded-md min-w-[70px] text-center">
                        {c.quantity}
                      </span>
                      <button
                        onClick={inc}
                        className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                        aria-label="increase"
                      >
                        +
                      </button>
                    </div>
                  );
                })()
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-150 shadow-sm ${
                    stock === 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] hover:shadow-md transform hover:-translate-y-0.5"
                  }`}
                >
                  Add to Cart
                </button>
              )}
              <button
                onClick={handleWishlist}
                className="ml-2 p-2 border cursor-pointer rounded-lg transition-all duration-150 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black"
                aria-label="add to wishlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-5 h-5"
                >
                  <path d="M12 21C12 21 4 13.647 4 8.75C4 6.17893 6.17893 4 8.75 4C10.2355 4 11.6028 4.80549 12 6.00613C12.3972 4.80549 13.7645 4 15.25 4C17.8211 4 20 6.17893 20 8.75C20 13.647 12 21 12 21Z" />
                </svg>
              </button>
            </div>
          </div>
          );
        })}
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
