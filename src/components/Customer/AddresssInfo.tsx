import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Pencil } from "lucide-react";
import type { Address } from "../../types/Address";
import { useAddresses } from "../../hooks/useAddresses";
import { useAddressStore } from "../../store/addressStore";

// ✅ Skeleton Component
const AddressSkeleton = () => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-36 bg-gray-700 rounded"></div>
        <div className="h-3 w-28 bg-gray-700 rounded"></div>
        <div className="h-3 w-52 bg-gray-700 rounded"></div>
        <div className="h-3 w-44 bg-gray-700 rounded"></div>
        <div className="h-3 w-24 bg-gray-700 rounded"></div>
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
      <div>
        <h2
          className="text-3xl font-bold mb-8 leading-tight"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-white)",
          }}
        >
          Address
        </h2>

        <div className="space-y-6">
          {[1].map((i) => (
            <AddressSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2
        className="text-3xl font-bold mb-8 leading-tight"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-white)",
        }}
      >
        Address
      </h2>

      {!editingId && (
        <button
          onClick={startAdd}
          className="flex items-center gap-2 bg-accent px-4 py-2 rounded-lg font-medium mb-5"
        >
          <Plus size={18} /> Add New Address
        </button>
      )}

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-4 mb-6"
        >
          <h3 className="text-white text-lg font-medium">
            {editingId ? "Edit Address" : "Add Address"}
          </h3>

          <div className="grid grid-cols-2 gap-4 text-white">
            <input
              {...register("full_name")}
              placeholder="Full Name"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
            <input
              {...register("phone_number")}
              placeholder="Phone Number"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
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
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
            <input
              {...register("address_line_2")}
              placeholder="Address Line 2"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
            <input
              {...register("city")}
              placeholder="City"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
            <input
              {...register("state")}
              placeholder="State"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
            <input
              {...register("postal_code")}
              placeholder="Postal Code"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
            <input
              {...register("country")}
              placeholder="Country"
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
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
            className="bg-gray-800 border border-gray-700 rounded-xl p-5"
          >
            <div className="flex justify-between items-start text-white">
              <div
                onClick={() => setSelectedAddress(address)}
                className="cursor-pointer"
              >
                <p className="font-medium">{address.full_name}</p>
                <p className="text-gray-400 text-sm">{address.phone_number}</p>
                <p className="text-gray-400 text-sm">
                  {address.address_line_1}, {address.address_line_2}
                </p>
                <p className="text-gray-400 text-sm">
                  {address.city}, {address.state} - {address.postal_code}
                </p>
                <p className="text-gray-400 text-sm">{address.country}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(address)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(address.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {addresses?.length === 0 && (
          <p className="text-gray-400">No address added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddressInfo;
