import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";

interface AdminProfileForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImage: FileList;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const AdminProfile = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<AdminProfileForm>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
  } = useForm<PasswordForm>();

  const onSubmit = async (data: AdminProfileForm) => {
    const isValid = await trigger();
    if (!isValid) return;
    console.log("Admin Profile Data:", data);
    setIsEditing(false);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    console.log("Password Data:", data);
    resetPassword();
    setShowChangePassword(false);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProfileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-400">Admin Profile</h1>
          <p className="text-primary-400 text-sm">
            View and manage your personal information
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
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

              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={handleAddProfileClick}
                    className="px-3 py-1 bg-primary-300 text-white rounded-lg hover:bg-primary-500 transition-colors text-sm"
                  >
                    Add Profile Image
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("profileImage")}
                    ref={fileInputRef}
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                  {errors.profileImage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.profileImage.message}
                    </p>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-primary-400/10 text-sm hover:bg-primary-400/20 text-primary-400 rounded-lg transition-colors font-medium"
            >
              {isEditing ? "Close" : "Edit Profile"}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Personal Info */}
            <h2 className="text-primary-400 font-semibold mt-2 mb-2">Personal Info</h2>

            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                  pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" },
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                disabled={!isEditing}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email address",
                  },
                })}
                disabled={!isEditing}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: { value: /^\d{10}$/, message: "Must be 10 digits" },
                })}
                disabled={!isEditing}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-primary-400 text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                {...register("address", {
                  required: "Address is required",
                  minLength: { value: 10, message: "Minimum 10 characters" },
                })}
                disabled={!isEditing}
                className="w-full p-2 text-sm bg-primary-400/5 rounded-lg text-primary-400 focus:outline-none"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
              )}
            </div>

            {isEditing && (
              <button
                type="submit"
                className="px-4 py-2 bg-primary-400/80 font-semibold text-white rounded-lg text-sm hover:bg-primary-500 transition-colors mt-2"
              >
                Save Profile
              </button>
            )}
          </form>

          {/* Change Password */}
          <div className="mt-4">
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="px-4 py-2 bg-primary-400/10 text-sm hover:bg-primary-400/20 text-primary-400 rounded-lg transition-colors font-medium"
            >
              {showChangePassword ? "Cancel" : "Change Password"}
            </button>

            {showChangePassword && (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="mt-3 space-y-2"
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
                  className="px-4 py-2 bg-primary-300 font-semibold text-white rounded-lg text-sm hover:bg-primary-500 transition-colors mt-2"
                >
                  Save Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
