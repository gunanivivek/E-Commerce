export interface ContactFormPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;      // must be valid phone: "+91xxxxxxxxxx"
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  status: "success";
  message: string;
}