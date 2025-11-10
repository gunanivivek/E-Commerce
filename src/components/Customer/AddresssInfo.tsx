import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Pencil } from "lucide-react";
import type { Address } from "../../types/Address";
import { useAddresses } from "../../hooks/useAddresses";
import { useAddressStore } from "../../store/addressStore";

// ✅ Skeleton Component
const AddressSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-md animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-36 bg-gray-200 rounded"></div>
        <div className="h-3 w-28 bg-gray-200 rounded"></div>
        <div className="h-3 w-52 bg-gray-200 rounded"></div>
        <div className="h-3 w-44 bg-gray-200 rounded"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const AddressInfo = () => {
  const {
    addresses,
    createMutation,
    updateMutation,
    deleteMutation,
    isLoading,
  } = useAddresses();
  const { setSelectedAddress } = useAddressStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm<Address>({
    defaultValues: {
      id: 0,
      full_name: "",
      phone_number: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
    },
  });

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    reset({
      id: 0,
      full_name: "",
      phone_number: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
    });
  };

  const startEdit = (address: Address) => {
    setIsAdding(false);
    setEditingId(address.id);
    reset(address);
  };

  const cancelForm = () => {
    reset();
    setEditingId(null);
    setIsAdding(false);
  };

  const onSubmit = (data: Address) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
    cancelForm();
  };

  const onDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <section className="bg-[var(--color-background)] py-5 px-2 md:px-6">
        <h2 className="text-3xl font-bold mb-8 leading-tight text-[var(--color-primary-400)]">
          Address
        </h2>

        <div className="space-y-6">
          {[1].map((i) => (
            <AddressSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-background)] py-5 px-2 md:px-6">
      <h2 className="text-3xl font-bold mb-8 leading-tight text-[var(--color-primary-400)]">
        Address
      </h2>

      {!editingId && (
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium mb-5 transition-all duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "black",
          }}
        >
          <Plus size={18} /> Add New Address
        </button>
      )}

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 mb-6 shadow-md"
        >
          <h3 className="text-[var(--color-primary-400)] text-lg font-semibold">
            {editingId ? "Edit Address" : "Add Address"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("full_name")}
              placeholder="Full Name"
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
            />
            <input
              {...register("phone_number")}
              placeholder="Phone Number"
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
              onChange={(e) => {
                let val = e.target.value;

                val = val.replace(/[^\d+]/g, "");

                if (!val.startsWith("+91")) {
                  val = "+91" + val.replace(/^(\+|91)/, "");
                }

                val = val.replace(/[^+0-9]/g, "");

                e.target.value = val;
              }}
            />
            <input
              {...register("address_line_1")}
              placeholder="Address Line 1"
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
            />
            <input
              {...register("address_line_2")}
              placeholder="Address Line 2"
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
            />
            <input
              {...register("city")}
              placeholder="City"
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
            />
            <input
              {...register("state")}
              placeholder="State"
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
            />
            <input
              {...register("postal_code")}
              placeholder="Postal Code"
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
            />
            <input
              {...register("country")}
              placeholder="Country"
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 rounded-lg border border-gray-300 font-medium transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "black",
              }}
            >
              Save
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {addresses?.map((address) => (
          <div
            key={address.id}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-transform transform"
          >
            <div className="flex justify-between items-start">
              <div
                onClick={() => setSelectedAddress(address)}
                className="cursor-pointer flex-1"
              >
                <p className="text-[var(--color-primary-400)] font-semibold">{address.full_name}</p>
                <p className="text-gray-600 text-sm">{address.phone_number}</p>
                <p className="text-gray-600 text-sm">
                  {address.address_line_1}, {address.address_line_2}
                </p>
                <p className="text-gray-600 text-sm">
                  {address.city}, {address.state} - {address.postal_code}
                </p>
                <p className="text-gray-600 text-sm">{address.country}</p>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => startEdit(address)}
                  className="p-2 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "black",
                  }}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(address.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {addresses?.length === 0 && !isAdding && !editingId && (
          <p className="text-gray-500 text-center py-12">No address added yet.</p>
        )}
      </div>
    </section>
  );
};

export default AddressInfo;