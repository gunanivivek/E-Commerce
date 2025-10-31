import React from "react";

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

// Static demo products used by the UI (no API calls)
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
];

const ProductsCard: React.FC = () => {
  const products = DEMO_PRODUCTS;

  if (!products.length) return <p>No products available right now.</p>;

  return (
    <div className="grid grid-cols-4 overflow-x-auto gap-4 py-6 px-4 bg-[var(--color-background)]">
      {products.map((product) => (
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
  );
};

export default ProductsCard;
