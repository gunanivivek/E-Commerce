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

// export interface Seller {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   store_name: string;
//   store_address: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

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