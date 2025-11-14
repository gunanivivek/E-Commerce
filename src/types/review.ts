export interface Review {
  id: number;
  author?: string | null;
  rating?: number | null;
  comment?: string | null;
  date?: string | null;
}

export interface CreateReviewPayload {
  reviews: Review[];
  average_rating?: number | null;
  comment?: string;
  author?: string;
}