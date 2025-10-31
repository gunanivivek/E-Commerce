export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: File[];
}

export interface BulkUploadRequest{
    file: File;
}

export interface SellerProfile {
  store_name: string;
  store_description: string;
  store_address: string;
  full_name: string;
  phone: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  status: "approved" | "pending" | "rejected";
  addedDate: string; // or Date if you convert it later
}


// export interface SellerRequest {
//   name: string;
//   email: string;
//   phone: string;
//   store_name: string;
//   store_address: string;
//   password: string;
// }

// export interface SellerUpdateRequest {
//   name?: string;
//   email?: string;
//   phone?: string;
//   store_name?: string;
//   store_address?: string;
//   password?: string;
// }