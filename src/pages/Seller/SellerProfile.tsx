import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { toast } from "react-toastify";
import { useChangePassword } from "../../hooks/useChangePassword";
import { useAuthStore } from "../../store/authStore"; // ✅ same as admin
// import { updateSellerProfile, uploadSellerImage } from "../../api/sellerApi";

interface SellerProfileForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  storeName: string;
  storeDescription: string;
  storeAddress: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const SellerProfile = () => {
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthStore();
  const changePasswordMutation = useChangePassword();

  // ---------------- Form: Seller Details ----------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    clearErrors,
    reset,
    setValue,
  } = useForm<SellerProfileForm>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      storeName: "",
      storeDescription: "",
      storeAddress: "",
    },
  });

  // ---------------- Form: Password ----------------
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
  } = useForm<PasswordForm>();

// ✅ Prefill seller info from Zustand user
useEffect(() => {
  if (user) {
    // Format phone number to remove "tel:" or unwanted symbols
    const formattedPhone = user.phone
      ? user.phone.replace(/^tel:/, "").replace(/[^+\d]/g, "")
      : "";

    setValue("fullName", user.full_name || "");
    setValue("email", user.email || "");
    setValue("phoneNumber", formattedPhone);
    setProfilePreview(user.profile_picture || null);
  }
}, [user, setValue]);


  // ✅ Submit updated seller details
  const onSubmit = async (data: SellerProfileForm) => {
    const isValid = await trigger();
    if (!isValid) return;

    console.log("Updated Seller Details:", data);
    // await updateSellerProfile(data);

    toast.success("Profile details updated successfully!");
    setIsEditingDetails(false);
  };

  // ✅ Handle profile image upload
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      console.log("Selected seller image:", file);
      // await uploadSellerImage(file);
      toast.success("Profile image updated!");
      setIsEditingImage(false);
    }
  };

  // ✅ Handle password change
  const onPasswordSubmit = (data: PasswordForm) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    changePasswordMutation.mutate(
      { old_password: data.oldPassword, new_password: data.newPassword },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Password changed successfully!");
          resetPassword();
          setShowChangePassword(false);
        },
        onError: (err) => {
          toast.error((err as Error).message);
        },
      }
    );
  };

  const handleAddProfileClick = () => fileInputRef.current?.click();

  return (
    <div className="min-h-screen py-6 px-4 lg:px-0">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* -------- Header -------- */}
        <div>
          <h1 className="text-2xl font-bold text-primary-400">Seller Profile</h1>
          <p className="text-primary-400 text-sm">
            Manage your personal and store information
          </p>
        </div>

        {/* -------- Profile Image Section -------- */}
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
                <User className="w-8 h-8 text-primary-400" />
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
          </div>
        </div>

        {/* -------- Seller Details Section -------- */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-primary-400 font-semibold">
              Store & Personal Info
            </h2>

            <button
              onClick={() => {
                if (isEditingDetails) {
                  clearErrors();
                  if (user) {
                    reset({
                      fullName: user.full_name || "",
                      email: user.email || "",
                      phoneNumber: user.phone || "",
               
                    });
                  }
                }
                setIsEditingDetails(!isEditingDetails);
              }}
              className="px-4 py-1.5 bg-primary-400/10 text-sm hover:bg-primary-400/20 text-primary-400 rounded-lg transition-colors font-medium"
            >
              {isEditingDetails ? "Close" : "Edit Details"}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <h3 className="text-primary-400 text-sm font-semibold mb-2">
              Store Info
            </h3>
            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">
                Store Name
              </label>
              <input
                type="text"
                {...register("storeName", { required: "Store name is required" })}
                disabled={!isEditingDetails}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
              {errors.storeName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">
                Store Description
              </label>
              <textarea
                {...register("storeDescription", {
                  required: "Description is required",
                })}
                rows={3}
                disabled={!isEditingDetails}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">
                Store Address
              </label>
              <input
                type="text"
                {...register("storeAddress", {
                  required: "Store address is required",
                })}
                disabled={!isEditingDetails}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
            </div>

            <h3 className="text-primary-400 text-sm font-semibold mt-4">
              Personal Info
            </h3>
            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                disabled={!isEditingDetails}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
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
                })}
                disabled={!isEditingDetails}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
            </div>

            {isEditingDetails && (
              <button
                type="submit"
                className="px-4 py-2 bg-primary-400/80 font-semibold text-white rounded-lg text-sm hover:bg-primary-500 transition-colors mt-2"
              >
                Save Changes
              </button>
            )}
          </form>
        </div>

        {/* -------- Change Password Section -------- */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="px-4 py-2 bg-primary-400/10 text-sm hover:bg-primary-400/20 text-primary-400 rounded-lg transition-colors font-medium"
          >
            {showChangePassword ? "Cancel" : "Change Password"}
          </button>

          {showChangePassword && (
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="mt-3 space-y-3"
            >
              <div>
                <label className="block text-primary-400 text-sm font-medium mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  {...registerPassword("oldPassword", { required: true })}
                  className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-primary-400 text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  {...registerPassword("newPassword", { required: true })}
                  className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-primary-400 text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...registerPassword("confirmNewPassword", { required: true })}
                  className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className={`px-4 py-2 bg-primary-300 font-semibold text-white rounded-lg text-sm transition-colors mt-2 ${
                  changePasswordMutation.isPending
                    ? "cursor-not-allowed opacity-70"
                    : "hover:bg-primary-500"
                }`}
              >
                {changePasswordMutation.isPending
                  ? "Saving..."
                  : "Save Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
