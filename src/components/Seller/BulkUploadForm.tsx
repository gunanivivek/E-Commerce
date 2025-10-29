import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";

interface BulkUploadFormProps {
  onClose: () => void;
}

interface FormValues {
  file: FileList;
}

const BulkUploadForm: React.FC<BulkUploadFormProps> = ({ onClose }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<FormValues>();
  const [dragActive, setDragActive] = useState(false);
  const file = watch("file");

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);

    try {
      console.log("Uploading file:", data.file[0]);
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setValue("file", files);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
          dragActive ? "border-primary-400 bg-primary-50" : "border-gray-300"
        }`}
      >
        <Upload className="mx-auto mb-2 text-primary-400" size={28} />
        <p className="text-gray-700 mb-1">
          Drag and drop your Excel file here, or{" "}
          <label className="text-primary-400 font-medium cursor-pointer hover:underline">
            browse
            <input
              type="file"
              accept=".xls,.xlsx,.csv"
              {...register("file", { required: "File is required" })}
              className="hidden"
              onChange={(e) => setValue("file", e.target.files as FileList)}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500">
          Supported file types: .xls, .xlsx, .csv (Max size: 5MB)
        </p>
        {file?.length ? (
          <p className="mt-2 text-sm text-green-600">
            Selected file: {file[0].name}
          </p>
        ) : null}
        {errors.file && (
          <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
        )}
      </div>


      <button
        type="submit"
        className="w-full bg-primary-400 text-white py-2 rounded-lg hover:bg-primary-500 transition"
      >
        Upload File
      </button>
    </form>
  );
};

export default BulkUploadForm;
