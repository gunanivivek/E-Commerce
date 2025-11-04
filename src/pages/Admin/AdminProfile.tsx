import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User as UserIcon } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useUploadProfilePicture } from "../../hooks/useUploadProfilePicture";

interface AdminProfileForm {
  fullName: string;
  email: string;
  phoneNumber: string;
}

const AdminProfile = () => {
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [previousProfileImage, setPreviousProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuthStore();

  const {
    register,
    formState: { errors },
    setValue,
  } = useForm<AdminProfileForm>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (user) {
      const formattedPhone = user.phone
        ? user.phone.replace(/^tel:/, "").replace(/[^+\d]/g, "")
        : "";

      setValue("fullName", user.full_name || "");
      setValue("email", user.email || "");
      setValue("phoneNumber", formattedPhone);
      setProfilePreview(user.profile_picture || null);
      setPreviousProfileImage(user.profile_picture || null);
    }
  }, [user, setValue]);

  const { mutate: uploadImage, isPending } = useUploadProfilePicture();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediate local preview
    const localPreview = URL.createObjectURL(file);
    setProfilePreview(localPreview);

    const formData = new FormData();
    formData.append("file", file);

    uploadImage(formData, {
      onSuccess: (data) => {
        setProfilePreview(data.image_url);
        setPreviousProfileImage(data.image_url); // update backup on success
        // Optionally: you could also optimistically update the user object's profile image if needed.
      },
      onError: () => {
        setProfilePreview(previousProfileImage); // revert if upload fails
      },
    });

    setIsEditingImage(false);
  };

  const handleAddProfileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen py-6 px-4 lg:px-0">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-primary-400">Admin Profile</h1>
          <p className="text-primary-400 text-sm">
            View and manage your personal information
          </p>
        </div>

        {/* Profile Image Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-primary-400 font-semibold mb-3">Profile Image</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-8 h-8 text-primary-400" />
              )}
            </div>
            {!isEditingImage ? (
              <button
                type="button"
                onClick={() => setIsEditingImage(true)}
                className="px-3 py-1 bg-primary-400/10 text-primary-400 text-sm rounded-lg hover:bg-primary-400/20 transition-colors"
              >
                Edit Image
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAddProfileClick}
                  className="px-3 py-1 bg-primary-300 text-white rounded-lg hover:bg-primary-500 transition-colors text-sm"
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
                  className="px-3 py-1 bg-gray-200 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            {isPending && <p>Uploading...</p>}
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-primary-400 font-semibold">Personal Info</h2>
          </div>
          <form className="space-y-3">
            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces allowed",
                  },
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                disabled
                className="w-full p-2 text-sm bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: { value: /^\d{10}$/, message: "Must be 10 digits" },
                })}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
