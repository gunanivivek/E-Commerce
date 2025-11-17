/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
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
import {
  useAdminCoupons,
  useDeleteCoupon,
} from "../../hooks/Seller/useSellerCoupons";

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl border border-primary-400/10 p-4 min-h-[220px] animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 bg-primary-200/40 rounded"></div>
       
      </div>

      <div className="mt-3 h-3 w-32 bg-primary-200/40 rounded"></div>
      <div className="mt-2 h-3 w-40 bg-primary-200/40 rounded"></div>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-4 w-4 bg-primary-200/40 rounded"></div>
        <div className="h-3 w-24 bg-primary-200/40 rounded"></div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-4 w-4 bg-primary-200/40 rounded"></div>
        <div className="h-3 w-28 bg-primary-200/40 rounded"></div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-8 w-8 bg-primary-200/40 rounded"></div>
        <div className="h-8 w-8 bg-primary-200/40 rounded"></div>
      </div>
    </div>
  );
};

const AdminCoupons: React.FC = () => {
  const [viewMode, setViewMode] = useState<"admin" | "seller">("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const deleteMutation = useDeleteCoupon();

  const { adminCoupons, sellerCoupons, isLoading, isError } = useAdminCoupons();

  const coupons = useMemo(() => {
    return viewMode === "admin" ? adminCoupons : sellerCoupons;
  }, [viewMode, adminCoupons, sellerCoupons]);

  const filteredCoupons = useMemo(
    () =>
      coupons.filter((coupon) =>
        coupon.coupon_name?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [coupons, searchTerm]
  );

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-8">Failed to load coupons.</p>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="px-4 sm:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-accent-dark">
              Coupon Management ({viewMode === "admin" ? "Admin" : "Seller"}{" "}
              View)
            </h1>
            <p className="text-primary-300 text-sm sm:text-base">
              Manage, edit, and organize discount coupons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Button */}
            <button
              onClick={() =>
                setViewMode(viewMode === "admin" ? "seller" : "admin")
              }
              className="flex items-center bg-surface-light border-border-light rounded-full px-3 py-1.5 text-sm font-medium text-primary-300 hover:bg-surface hover:cursor-pointer transition"
            >
              {viewMode === "admin"
                ? "Switch to Seller View"
                : "Switch to Admin View"}
            </button>

            {/* Add Coupon Button */}
            <button
              onClick={() => {
                setEditingCoupon(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-1 text-sm sm:text-base bg-accent-light text-white rounded-lg px-3 py-1.5 hover:bg-primary-400 hover:cursor-pointer transition"
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
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCoupons.length === 0 ? (
              <p className="text-primary-400 text-sm col-span-full text-center">
                No coupons found.
              </p>
            ) : (
              filteredCoupons.map((coupon) => {
                const discountText =
                  coupon.discount_type === "flat"
                    ? `₹${coupon.discount_value}`
                    : `${coupon.discount_value}%`;

                return (
                  <div
                    key={coupon.id}
                    className="bg-white rounded-xl border border-primary-400/10 overflow-hidden hover:shadow-md transition flex flex-col justify-between min-h-[220px]"
                  >
                    <div className="p-4 flex flex-col h-full justify-between">
                      <div>
                        <h3 className="flex items-center justify-between text-primary-400 font-bold font-heading text-sm">
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-4 h-4" />
                            {coupon.coupon_code}
                          </div>
                          
                        </h3>

                        <p className="text-primary-400/70 text-sm mt-1">
                          {coupon.coupon_description}
                        </p>
                        <p className="flex items-center gap-1 text-primary-400/80 text-sm mt-1 font-medium">
                          <TicketPercent className="w-4 h-4" />
                          Discount:{" "}
                          <span className="text-primary-400">
                            {discountText}
                          </span>
                        </p>
                        <p className="flex items-center gap-1 text-primary-400/60 text-sm mt-1">
                          <Calendar className="w-4 h-4" />
                          Valid till:{" "}
                          {new Date(coupon.expiry_date).toLocaleDateString()}
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
                        <button
                            onClick={() => deleteMutation.mutate(coupon.id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 hover:cursor-pointer disabled:opacity-50"
                            title="Delete"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Coupon Grid */}
      </div>

      {/* Modal */}
      <CouponModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        coupon={editingCoupon}
      />
    </div>
  );
};

export default AdminCoupons;
