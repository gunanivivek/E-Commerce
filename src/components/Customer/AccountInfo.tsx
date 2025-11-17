import { useState, useRef, useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useUploadProfilePicture } from "../../hooks/useUploadProfilePicture";
import { useMutation } from "@tanstack/react-query";
import { updateCustomerProfile } from "../../api/customerApi";
import { toast } from "react-toastify";

const AccountInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [previousProfileImage, setPreviousProfileImage] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState({ full_name: "", phone: "" });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, updateUser } = useAuthStore();
  const { mutate: uploadImage } = useUploadProfilePicture();

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: { full_name: string; phone: string }) =>
      updateCustomerProfile(String(user?.id ?? 0), data),

    onMutate: () => toast.loading("Updating profile..."),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      toast.dismiss();
      toast.success("Profile updated successfully!");

      // Merge updated fields safely
      updateUser(data);

      setIsEditing(false);
    },

    onError: () => {
      toast.dismiss();
      toast.error("Failed to update profile.");
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
      });
      setProfilePreview(user.profile_picture || null);
      setPreviousProfileImage(user.profile_picture || null);
    }
  }, [user]);

  const handleAddProfileClick = () => fileInputRef.current?.click();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setProfilePreview(localPreview);
    setIsUploading(true);
    setIsEditingImage(false);

    const formData = new FormData();
    formData.append("file", file);

    uploadImage(formData, {
      onSuccess: (data) => {
        setProfilePreview(data.image_url);
        setPreviousProfileImage(data.image_url);
        setIsUploading(false);
      },
      onError: () => {
        toast.error("Failed to upload image");
        setProfilePreview(previousProfileImage);
        setIsUploading(false);
      },
    });
  };

  const handleSave = () => updateProfile(formData);
  const handleCancel = () => {
    setFormData({ full_name: user?.full_name || "", phone: user?.phone || "" });
    setIsEditing(false);
  };

  return (
    <section className="bg-[var(--color-background)] py-5 px-2 md:px-6">
      <h2 className="text-3xl font-bold mb-8 leading-tight text-[var(--color-primary-400)]">
        Personal Information
      </h2>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
          {profilePreview ? (
            <img
              src={profilePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-8 h-8 text-gray-500" />
          )}
        </div>

        {isUploading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        ) : !isEditingImage ? (
          <button
            type="button"
            onClick={() => setIsEditingImage(true)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 cursor-pointer transition-all"
          >
            Change Image
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleAddProfileClick}
              className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "black",
              }}
            >
              Choose Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => setIsEditingImage(false)}
              className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Info Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          value={formData.full_name}
          readOnly={!isEditing}
          onChange={(e) =>
            setFormData((p) => ({ ...p, full_name: e.target.value }))
          }
        />

        <InputField
          label="Mobile Number"
          value={formData.phone}
          readOnly={!isEditing}
          onChange={(e) => {
            let val = e.target.value.replace(/[^\d]/g, "");

            if (val === "") {
              setFormData((p) => ({ ...p, phone: "" }));
              return;
            }
            if (!val.startsWith("91")) {
              val = "91" + val;
            }

            setFormData((p) => ({ ...p, phone: `+${val}` }));
          }}
        />

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 text-white font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--color-accent)",
            }}
          >
            Edit Details
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="cursor-pointer px-6 py-3 text-white font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-accent)",
              }}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="cursor-pointer px-6 py-3 rounded-lg border border-gray-300 font-medium transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </section>
  );
};

const InputField = ({
  label,
  value,
  readOnly,
  onChange,
}: {
  label: string;
  value: string;
  readOnly: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:outline-none focus:ring-[var(--color-accent)]"
    />
  </div>
);

export default AccountInfo;
