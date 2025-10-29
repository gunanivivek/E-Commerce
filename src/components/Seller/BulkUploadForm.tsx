/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import * as XLSX from "exceljs";
import Papa from "papaparse";


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
    const fileExtension = uploadedFile.name.split(".").pop()?.toLowerCase();

    console.log("📁 File uploaded:", uploadedFile);

    if (fileExtension === "csv") {
      parseCSV(uploadedFile);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      await parseExcel(uploadedFile);
    } else {
      alert("Unsupported file type!");
      return;
    }

    alert(`✅ File "${uploadedFile.name}" uploaded successfully!`);
    onClose(); // Close modal after upload
  };

  React.useEffect(() => {
    if (fileWatch && fileWatch.length > 0) {
      setSelectedFile(fileWatch[0]);
    }
  }, [fileWatch]);

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("📄 Parsed CSV Data:", results.data);
        alert("✅ CSV file parsed successfully! Check console for output.");
      },
      error: (err) => {
        console.error("❌ CSV parsing error:", err);
        alert("Failed to parse CSV file!");
      },
    });
  };

  const parseExcel = async (file: File) => {
    try {
      const workbook = new XLSX.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets[0];
      const jsonData: any[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const rowData: any = {};
        row.eachCell((cell, colNumber) => {
          const header =
            worksheet.getRow(1).getCell(colNumber).value?.toString() || "";
          rowData[header] = cell.value;
        });
        jsonData.push(rowData);
      });

      console.log("📘 Parsed Excel Data:", jsonData);
      alert("✅ Excel file parsed successfully! Check console for output.");
    } catch (err) {
      console.error("❌ Excel parsing error:", err);
      alert("Failed to parse Excel file!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-gray-800 text-center">
        Bulk Upload
      </h2>

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
