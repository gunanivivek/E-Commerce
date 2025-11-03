/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BulkUploadRequest,
  CreateProductRequest,
  Product,
  SellerProfile,
} from "../types/seller";
import API from "./axiosInstance";

// SELLER'S Profile Related APIs
export const getSellerProfile = async (
  sellerId: string
): Promise<SellerProfile> => {
  const res = await API.get(`/sellers/${sellerId}`);
  return res.data;
};

export const updateSellerProfile = async (
  sellerId: string,
  data: Partial<SellerProfile>
): Promise<SellerProfile> => {
  const res = await API.patch(`/sellers/${sellerId}`, data);
  return res.data;
};

//BULK Upload APIs
export const handleDownloadFormat = async () => {
  try {
    const res = await API.get("/products/bulk-upload/template", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download","seller_upload_format.csv"); // adjust filename/extension
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading format:", error);
  }
};

export const bulkUploadProducts = async (data: BulkUploadRequest) => {
  const formData = new FormData();
  formData.append("file", data.file);

  const res = await API.post("products/bulk-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


// Product Related APIs
// Create new product
export const createProduct = async (data: CreateProductRequest) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());
  formData.append("stock", data.stock.toString());
  formData.append("category", data.category);
  data.images.forEach((file) => formData.append("images", file));
  const res = await API.post("products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};


export const getSellerProducts = async (
  sellerId: string
): Promise<Product[]> => {
  const res = await API.get(`/products/${sellerId}/`);
  return res.data.map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category?.name, // ✅ safe fallback
    price: p.price,
    status: p.status ,
    addedDate: p.created_at,
  }));
};

export const getProductById = async (ProductId: number): Promise<Product> => {
  const res = await API.get(`products/${ProductId}/`);
  return res.data;
};

// // ✅ Update product
// export const updateProduct = async (
//   id: number,
//   data: ProductUpdateRequest
// ): Promise<Product> => {
//   const res = await API.patch(`products/${id}`, data);
//   return res.data;
// };

// ✅ Delete product
export const deleteProduct = async (
  ProductId: number
): Promise<{ message: string }> => {
  const res = await API.delete(`products/${ProductId}/delete`);
  return res.data;
};
