export interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  image: File; 
}


export type CreateCategoryResponse = Category;

export interface DeleteCategoryResponse {
  message: string;
}
