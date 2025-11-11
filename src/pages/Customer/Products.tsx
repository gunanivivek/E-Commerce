import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ProductsCard from "../../components/Customer/ProductsCard";
import { useCategoryStore } from "../../store/categoryStore";

type Filters = {
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  ratingGte?: number | null;
  ordering?: string | null;
};

const ProductsPage: React.FC = () => {
  const [openFilter, setOpenFilter] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const categories = useCategoryStore((s) => s.categories);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenFilter(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const data = [
    { title: "Category", opts: ["All", ...(categories || []).map((c) => c.name)] },
    {
      title: "Price",
      opts: ["All", "₹0–1K", "₹1K–5K", "₹5K–10K", "₹10K–20K", "₹20K+"],
      map: {
        "₹0–1K": [0, 1000],
        "₹1K–5K": [1000, 5000],
        "₹5K–10K": [5000, 10000],
        "₹10K–20K": [10000, 20000],
        "₹20K+": [20000, null],
      } as Record<string, [number, number | null]>,
    },
    { title: "Rating", opts: ["All", "4★+", "3★+", "2★+", "1★+"] },
    { title: "Sort", opts: ["Default", "Low→High", "High→Low", "Rating", "Newest"] },
  ];

  const updateFilter = (type: string, val: string) => {
    const f = { ...filters };
    if (type === "Category") f.category = val === "All" ? null : val;
    if (type === "Price") {
      const range = data[1].map?.[val];
      f.minPrice = range ? range[0] : null;
      f.maxPrice = range ? range[1] : null;
    }
    if (type === "Rating") f.ratingGte = val === "All" ? null : +val[0];
    if (type === "Sort") {
      f.ordering =
        val === "Low→High"
          ? "price"
          : val === "High→Low"
          ? "-price"
          : val === "Rating"
          ? "rating"
          : val === "Newest"
          ? "-created"
          : null;
    }
    setFilters(f);
    setOpenFilter(null);
  };

  return (
    <>
      <Header />
      <section className="px-8 md:px-20 py-10 text-center bg-background">
        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-bold text-accent-darker font-logo">
          Explore <span className="text-accent">Products</span>
        </motion.h1>
        <p className="text-gray-600 mt-3">Smart, stylish, and quality items curated for you.</p>

        {/* Filter Bar */}
        <div ref={ref} className="mt-10 flex flex-wrap gap-4 justify-center">
          {data.map((f, i) => (
            <div key={i} className="relative min-w-[200px]">
              <button
                onClick={() => setOpenFilter(openFilter === i ? null : i)}
                className="flex w-full items-center justify-between px-4 py-2 bg-gray-100 border rounded-md hover:bg-gray-200"
              >
                {filters[f.title.toLowerCase() as keyof Filters] ?? f.title}
                <motion.div animate={{ rotate: openFilter === i ? 180 : 0 }}>
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              {openFilter === i && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute mt-2 w-full bg-white shadow-md border rounded-md z-10"
                >
                  {f.opts.map((opt, j) => (
                    <button
                      key={j}
                      onClick={() => updateFilter(f.title, opt)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Products */}
        <div className="mt-12">
          <ProductsCard filters={filters} key={JSON.stringify(filters)} />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProductsPage;
