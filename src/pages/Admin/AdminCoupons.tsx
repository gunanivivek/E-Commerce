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
import CouponModal from "../../components/Admin/CouponModal";


// Dummy data
const adminCoupons = [
  {
    id: 1,
    code: "ADMIN25",
    discount: "25%",
    description: "Admin-wide 25% off on all items.",
    validTill: "2025-12-31",
  },
  {
    id: 2,
    code: "NEWYEAR50",
    discount: "50%",
    description: "Flat 50% off during New Year Sale!",
    validTill: "2025-01-10",
  },
];

const sellerCoupons = [
  {
    id: 3,
    code: "SELLER10",
    discount: "10%",
    description: "10% off by Seller A",
    validTill: "2025-09-30",
  },
  {
    id: 4,
    code: "SELLER20",
    discount: "20%",
    description: "20% off on electronics by Seller B",
    validTill: "2025-11-10",
  },
];

const AdminCoupons: React.FC = () => {
  const [viewMode, setViewMode] = useState<"admin" | "seller">("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [coupons, setCoupons] = useState(adminCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Toggle between admin/seller coupons
  const handleToggle = () => {
    if (viewMode === "admin") {
      setViewMode("seller");
      setCoupons(sellerCoupons);
    } else {
      setViewMode("admin");
      setCoupons(adminCoupons);
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setDeletingId(null);
    }, 800);
  };

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="px-4 sm:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-accent-dark">
              Coupon Management ({viewMode === "admin" ? "Admin" : "Seller"} View)
            </h1>
            <p className="text-primary-300 text-sm sm:text-base">
              Manage, edit, and organize discount coupons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Button */}
            <button
              onClick={handleToggle}
              className="flex items-center bg-primary-100 border border-primary-300 rounded-full px-3 py-1.5 text-sm font-medium text-primary-400 hover:bg-primary-200 transition"
            >
              {viewMode === "admin" ? "Switch to Seller View" : "Switch to Admin View"}
            </button>

            {/* Add Coupon Button */}
            <button
              onClick={() => {
                setEditingCoupon(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-1 text-sm sm:text-base bg-primary-300 text-white rounded-lg px-3 py-1.5 hover:bg-primary-400 transition"
            >
              <Plus className="w-4 h-4" />
              Add Coupon
            </button>
          </div>
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

        {/* Coupon Grid */}
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
                  className="bg-white rounded-xl  border border-primary-400/10 overflow-hidden hover:shadow-md transition flex flex-col justify-between min-h-[220px]"
                >
                  <div className="p-4 flex flex-col h-full justify-between">
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
                        <span className="text-primary-400">{coupon.discount}</span>
                      </p>
                      <p className="flex items-center gap-1 text-primary-400/60 text-sm mt-1">
                        <Calendar className="w-4 h-4" />
                        Valid till: {new Date(coupon.validTill).toLocaleDateString()}
                      </p>
                    </div>

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

 
      <CouponModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        coupon={editingCoupon}
      />
    </div>
  );
};

export default AdminCoupons;
