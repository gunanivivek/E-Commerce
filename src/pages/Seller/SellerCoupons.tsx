/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  Calendar,
  TicketPercent,
} from "lucide-react";

// Dummy static data
const sampleCoupons = [
  {
    id: 1,
    code: "SAVE10",
    discount: "10%",
    description: "Get 10% off on all products.",
    validTill: "2025-12-31",
  },
  {
    id: 2,
    code: "FREESHIP",
    discount: "Free Shipping",
    description: "Enjoy free delivery on orders above ₹500.",
    validTill: "2025-06-30",
  },
  {
    id: 3,
    code: "NEWUSER20",
    discount: "20%",
    description: "New users get 20% off on first order.",
    validTill: "2025-08-15",
  },
  {
    id: 4,
    code: "DIWALI50",
    discount: "50%",
    description: "Celebrate Diwali with 50% off storewide!",
    validTill: "2025-11-20",
  },
];

const SellerCoupons: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [coupons, setCoupons] = useState(sampleCoupons);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (coupon: any) => {
    console.log("Edit coupon:", coupon);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setDeletingId(null);
      console.log("Deleted coupon:", id);
    }, 800);
  };

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="px-4 sm:px-8">
        {/* Title + Add Button */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-accent-dark">
              Coupon Management
            </h1>
            <p className="text-primary-300 text-sm sm:text-base">
              Manage, edit, and organize discount coupons.
            </p>
          </div>
          <button
            onClick={() => console.log("Add Coupon clicked")}
            className="flex items-center gap-1 text-sm sm:text-base bg-primary-300 text-white rounded-lg px-3 py-1.5 hover:cursor-pointer hover:bg-primary-400 transition"
          >
            <Plus className="w-4 h-4" />
            Add Coupon
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80 mt-4 mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300 w-4 h-4" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 w-full border border-border-light rounded-lg bg-primary-100/30 text-primary-300 focus:outline-none focus:ring-2 focus:ring-border text-sm"
          />
        </div>

        {/* Coupons Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCoupons.length === 0 ? (
            <p className="text-primary-400 text-sm col-span-full text-center">
              No coupons found.
            </p>
          ) : (
            filteredCoupons.map((coupon) => {
              const isDeleting = deletingId === coupon.id;
              return (
                <div
                  key={coupon.id}
                  className="bg-white rounded-xl shadow-xl border border-primary-400/10 overflow-hidden hover:shadow-md transition flex flex-col justify-between min-h-[220px]"
                >
                  <div className="p-4 flex flex-col h-full justify-between">
                    {/* Coupon Details */}
                    <div>
                      <h3 className="flex items-center justify-between text-primary-400 font-bold font-heading text-sm">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-4 h-4" />
                          {coupon.code}
                        </div>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 hover:cursor-pointer disabled:opacity-50"
                          title="Delete"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </h3>

                      <p className="text-primary-400/70 text-sm mt-1">
                        {coupon.description}
                      </p>
                      <p className="flex items-center gap-1 text-primary-400/80 text-sm mt-1 font-medium">
                        <TicketPercent className="w-4 h-4" />
                        Discount:{" "}
                        <span className="text-primary-400">
                          {coupon.discount}
                        </span>
                      </p>
                      <p className="flex items-center gap-1 text-primary-400/60 text-sm mt-1">
                        <Calendar className="w-4 h-4" />
                        Valid till:{" "}
                        {new Date(coupon.validTill).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-1.5 bg-surface-light text-accent-dark rounded hover:bg-surface hover:cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerCoupons;
