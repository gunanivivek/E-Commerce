export interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  text: string;
}

export interface ChatbotRequest {
  product_id: number;
  message: string;
}

export interface ChatbotResponse {
  reply: string;
}
