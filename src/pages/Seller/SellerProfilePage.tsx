/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { toast } from "react-toastify";
import { useChangePassword } from "../../hooks/useChangePassword";
import { useParams } from "react-router";
import { useUploadProfilePicture } from "../../hooks/useUploadProfilePicture";
import { useSellerProfile } from "../../hooks/Seller/useSellerProfile";
import { useUpdateSellerProfile } from "../../hooks/Seller/useUpdateSellerProfile";
import SellerProfileSkeleton from "../../components/Seller/SellerProfileSkeleton";
import { showToast } from "../../components/toastManager";

interface SellerProfileForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  storeName: string;
  storeDescription: string;
  storeAddress: string;
  profile_picture: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const SellerProfilePage = () => {
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [previousProfileImage, setPreviousProfileImage] = useState<
    string | null
  >(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const changePasswordMutation = useChangePassword();

  // ---------------- Form: Seller Details ----------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<SellerProfileForm>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      storeName: "",
      storeDescription: "",
      storeAddress: "",
      profile_picture: "",
    },
  });

  const { mutate: uploadImage, isPending } = useUploadProfilePicture();
  const { sellerId } = useParams<{ sellerId: string }>();

  // Convert safely to number
  const numericSellerId = sellerId ? Number(sellerId) : undefined;
  const { data: sellerData, isLoading } = useSellerProfile(numericSellerId);
  const { mutateAsync, isPending: isPendingProfile } = useUpdateSellerProfile();

  useEffect(() => {
    if (sellerData) {
      reset({
        fullName: sellerData.full_name || "",
        email: sellerData.email || "",
        phoneNumber: sellerData.phone || "",
        storeName: sellerData.store_name || "",
        storeDescription: sellerData.store_description || "",
        storeAddress: sellerData.store_address || "",
        profile_picture: sellerData.profile_picture || "",
      });

      setProfilePreview(sellerData.profile_picture || null);
      setPreviousProfileImage(sellerData.profile_picture || null);
    }
  }, [sellerData, reset]);

  // ---------------- Form: Password ----------------
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
  } = useForm<PasswordForm>();

  // Submit updated seller details
  const onSubmit = async (formData: SellerProfileForm) => {
    if (!numericSellerId) return;

    const payload = {
      store_name: formData.storeName,
      store_description: formData.storeDescription,
      store_address: formData.storeAddress,
      full_name: formData.fullName,
      phone: formData.phoneNumber,
    };

    try {
      const updatedSeller = await mutateAsync({
        sellerId: numericSellerId,
        payload,
      });

      reset({
        storeName: updatedSeller.store_name,
        storeDescription: updatedSeller.store_description,
        storeAddress: updatedSeller.store_address,
        fullName: updatedSeller.full_name,
        phoneNumber: updatedSeller.phone,
      });
      showToast(" Seller profile updated successfully!", "success");
      setIsEditingDetails(false);
    } catch (err) {
  const errorMessage =
    (err as any)?.response?.data?.detail?.[0]?.msg ||
    (err as any)?.response?.data?.msg ||
    (err as Error)?.message ||
    "❌ Failed to update profile. Try again.";

  toast.error(errorMessage);
}
  };

  // Handle profile image upload
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
          showToast(res.message || "Password changed successfully!", "success");
          resetPassword();
          setShowChangePassword(false);
        },
        onError: (err) => {
          toast.error((err as Error).message);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <SellerProfileSkeleton />
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 lg:px-0">
      <div className="max-w-3xl px-5 space-y-6">
        {/* -------- Header -------- */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-accent-dark">
            Seller Profile
          </h1>
          <p className="text-primary-300 text-sm sm:text-base">
            Manage your personal and store information
          </p>
        </div>
        {}

        {/* -------- Profile Image Section -------- */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-accent-dark font-normal mb-3 font-heading text-xl">
            Profile Image
          </h2>

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
                className="px-4 py-1 bg-surface text-base hover:bg-accent-light/25 text-accent-dark hover:cursor-pointer rounded-lg transition-colors font-medium"
              >
                Edit Image
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAddProfileClick}
                  className="px-3 py-1 bg-primary-300 text-white rounded-lg hover:bg-primary-400 hover:cursor-pointer transition-colors text-base"
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
                  className="px-3 py-1 bg-white text-primary-300 text-base rounded-lg hover:bg-primary-100 hover:cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            {isPending && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            )}
          </div>
        </div>

        {/* -------- Seller Details Section -------- */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-accent-dark font-normal mb-3 font-heading text-xl">
              Store & Personal Info
            </h2>

            <button
              onClick={() => {
                if (isEditingDetails) {
                  clearErrors();

                  if (sellerData) {
                    reset({
                      storeName: sellerData.store_name || "",
                      storeDescription: sellerData.store_description || "",
                      storeAddress: sellerData.store_address || "",
                      fullName: sellerData.full_name || "",
                      phoneNumber: sellerData.phone || "",
                    });
                  }
                }
                setIsEditingDetails(!isEditingDetails);
              }}
              type="button"
              className="px-4 py-1.5 bg-surface text-base hover:bg-accent-light/25 text-accent-dark hover:cursor-pointer rounded-lg transition-colors font-medium"
            >
              {isEditingDetails ? "Close" : "Edit Details"}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-4 space-y-3">
            <h3 className="text-primary-400 text-lg font-heading font-semibold mb-2">
              Store Info
            </h3>
            <div>
              <label className="block text-xs text-primary-300 mb-1 font-medium">
                Store Name
              </label>
              <input
                type="text"
                {...register("storeName", {
                  required: "Store name is required",
                })}
                disabled={!isEditingDetails}
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full"
              />
              {errors.storeName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-primary-300 mb-1 font-medium">
                Store Description
              </label>
              <textarea
                {...register("storeDescription", {
                  required: "Description is required",
                })}
                rows={3}
                disabled={!isEditingDetails}
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-primary-300 mb-1 font-medium">
                Store Address
              </label>
              <input
                type="text"
                {...register("storeAddress", {
                  required: "Store address is required",
                })}
                disabled={!isEditingDetails}
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full"
              />
            </div>

            <h3 className="text-primary-400 text-lg font-heading font-semibold mb-2">
              Personal Info
            </h3>
            <div>
              <label className="block text-xs text-primary-300 mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                disabled={!isEditingDetails}
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-primary-300 mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                disabled
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-primary-300 mb-1 font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
                disabled={!isEditingDetails}
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full"
              />
            </div>

            {isEditingDetails && (
              <button
                type="submit"
                disabled={isPendingProfile}
                className="px-4 py-1.5 bg-surface text-sm hover:bg-accent-light/25 text-accent-dark hover:cursor-pointer rounded-lg transition-colors font-medium mt-2"
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
            className="px-4 py-2 bg-accent-dark text-sm hover:bg-accent-darker text-surface hover:cursor-pointer rounded-lg transition-colors"
          >
            {showChangePassword ? "Cancel" : "Change Password"}
          </button>

          {showChangePassword && (
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="mt-3 space-y-3"
            >
              <div>
                <label className="block text-xs text-primary-300 mb-1 font-medium">
                  Old Password
                </label>
                <input
                  type="password"
                  {...registerPassword("oldPassword", { required: true })}
                  className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-primary-300 mb-1 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  {...registerPassword("newPassword", { required: true })}
                  className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-primary-300 mb-1 font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...registerPassword("confirmNewPassword", {
                    required: true,
                  })}
                  className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full"
                />
              </div>

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className={`px-4 py-1.5 bg-surface text-base hover:bg-accent-light/25 text-accent-dark hover:cursor-pointer rounded-lg transition-colors font-medium mt-2 ${
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

export default SellerProfilePage;
