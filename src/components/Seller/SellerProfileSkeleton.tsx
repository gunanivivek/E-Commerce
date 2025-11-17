export default function SellerProfileSkeleton() {
  return (
    <div className="min-h-screen py-6 px-4 lg:px-0">
      <div className="max-w-3xl px-5 space-y-6 animate-pulse">

        {/* -------- Header Skeleton -------- */}
        <div>
          <div className="h-6 w-40 bg-primary-100 rounded"></div>
          <div className="h-4 w-72 bg-primary-100 rounded mt-2"></div>
        </div>

        {/* -------- Profile Image Section -------- */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="h-6 w-32 bg-primary-100 rounded mb-4"></div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-100"></div>
            <div className="h-8 w-24 bg-primary-100 rounded"></div>
          </div>
        </div>

        {/* -------- Store & Personal Details Section -------- */}
        <div className="bg-white rounded-lg p-4 shadow-sm">

          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-44 bg-primary-100 rounded"></div>
            <div className="h-8 w-24 bg-primary-100 rounded"></div>
          </div>

          <div className="space-y-4">

            {/* Store Info title */}
            <div className="h-5 w-32 bg-primary-100 rounded"></div>

            {/* Store Name */}
            <div>
              <div className="h-3 w-28 bg-primary-100 rounded mb-2"></div>
              <div className="h-9 w-full bg-primary-100 rounded"></div>
            </div>

            {/* Store Description */}
            <div>
              <div className="h-3 w-32 bg-primary-100 rounded mb-2"></div>
              <div className="h-20 w-full bg-primary-100 rounded"></div>
            </div>

            {/* Store Address */}
            <div>
              <div className="h-3 w-28 bg-primary-100 rounded mb-2"></div>
              <div className="h-9 w-full bg-primary-100 rounded"></div>
            </div>

            {/* Personal Info title */}
            <div className="h-5 w-40 bg-primary-100 rounded mt-4"></div>

            {/* Full Name */}
            <div>
              <div className="h-3 w-24 bg-primary-100 rounded mb-2"></div>
              <div className="h-9 w-full bg-primary-100 rounded"></div>
            </div>

            {/* Email */}
            <div>
              <div className="h-3 w-20 bg-primary-100 rounded mb-2"></div>
              <div className="h-9 w-full bg-primary-100 rounded"></div>
            </div>

            {/* Phone */}
            <div>
              <div className="h-3 w-32 bg-primary-100 rounded mb-2"></div>
              <div className="h-9 w-full bg-primary-100 rounded"></div>
            </div>

            {/* Save button skeleton */}
            <div className="h-9 w-28 bg-primary-100 rounded mt-2"></div>
          </div>
        </div>

        {/* -------- Change Password Section -------- */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="h-10 w-36 bg-primary-100 rounded"></div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="h-3 w-24 bg-primary-100 rounded mb-2"></div>
              <div className="h-9 w-full bg-primary-100 rounded"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-primary-100 rounded mb-2"></div>
              <div className="h-9 w-full bg-primary-100 rounded"></div>
            </div>
            <div>
              <div className="h-3 w-32 bg-primary-100 rounded mb-2"></div>
              <div className="h-9 w-full bg-primary-100 rounded"></div>
            </div>
            <div className="h-9 w-32 bg-primary-100 rounded"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
