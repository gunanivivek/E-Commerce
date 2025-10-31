import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import { bulkUploadProducts, handleDownloadFormat } from "../../api/sellerApi";
import { toast } from "react-toastify";

interface BulkUploadFormProps {
  onClose: () => void;
}

interface FormValues {
  file: FileList;
}

const BulkUploadForm: React.FC<BulkUploadFormProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileWatch = watch("file");

  const onSubmit = async (data: FormValues) => {
    const uploadedFile = data.file[0];
    if (!uploadedFile) return;
    try {
      const response = await bulkUploadProducts({ file: uploadedFile });

      console.log("✅ Upload successful:", response);
      toast.success(`✅ File "${uploadedFile.name}" uploaded successfully!`);
      onClose();
    } catch (error) {
      console.error("❌ Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    }
  };

  React.useEffect(() => {
    if (fileWatch && fileWatch.length > 0) {
      setSelectedFile(fileWatch[0]);
    }
  }, [fileWatch]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm max-w-md mx-auto"
    >
      <p className="text-sm text-gray-500 mb-4">
        Upload your file in the format provided. To check the format please
        click &nbsp;
        <button
          type="button"
          onClick={handleDownloadFormat}
          className="text-blue-500 underline hover:text-blue-600 hover:cursor-pointer"
        >
          here
        </button>
        .
      </p>
      .
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Upload Excel or CSV File
        </label>

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Click to browse</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-400">
              Supported: .xls, .xlsx, .csv
            </p>
          </div>

          <input
            id="file-upload"
            type="file"
            accept=".xls,.xlsx,.csv"
            {...register("file", { required: "File is required" })}
            className="hidden"
          />
        </label>

        {selectedFile && (
          <p className="mt-2 text-sm text-green-600">
            Selected file: {selectedFile.name}
          </p>
        )}

        {errors.file && (
          <p className="text-red-500 text-sm mt-2">{errors.file.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        Upload File
      </button>
    </form>
  );
};

export default BulkUploadForm;
