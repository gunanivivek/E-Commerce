import { useState } from "react";
import { create } from "zustand";
import { useMutation } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

// -------------------- 🧠 Zustand Store --------------------
interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  setField: (field: keyof ContactFormState, value: string) => void;
  reset: () => void;
}

const useContactFormStore = create<ContactFormState>((set) => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  reset: () =>
    set({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    }),
}));

// -------------------- 💬 Fake Submit API --------------------
const sendContactForm = async (data: ContactFormState) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
  console.log("📨 Sent contact form:", data);
  return { success: true, message: "Message sent successfully!" };
};

// -------------------- 📍 Component --------------------
const Contact: React.FC = () => {
  const form = useContactFormStore();
  const [status, setStatus] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: sendContactForm,
    onSuccess: (data) => {
      setStatus(data.message);
      form.reset();
    },
    onError: () => {
      setStatus("❌ Failed to send message. Please try again.");
    },
  });

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@shopease.com",
      link: "mailto:support@shopease.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 12345 67890",
      link: "tel:+91-12345-67890",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "812-816, Times Square 1, opposite Baghban Party Plot Road, Thaltej, Ahmedabad, Gujarat 380059",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 10AM-7PM IST",
      link: null,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="min-h-screen bg-[var(--color-background)] py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--color-primary-400)] mb-4">
              Get in Touch
            </h1>
            <p className="text-[var(--color-primary-300)] max-w-2xl mx-auto">
              Have a question or need assistance? We're here to help! Reach out
              to us through any of the methods below.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg p-8 shadow-md border border-[var(--color-primary-border)]">
              <h2 className="text-2xl font-semibold text-[var(--color-primary-400)] mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => form.setField("firstName", e.target.value)}
                    placeholder="Roohi"
                  />
                  <InputField
                    label="Last Name"
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => form.setField("lastName", e.target.value)}
                    placeholder="Shah"
                  />
                </div>

                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => form.setField("email", e.target.value)}
                  placeholder="you@example.com"
                />

                <InputField
                  label="Phone Number (Optional)"
                  id="phone"
                  type="tel"
                  value={form.phone ?? ""}
                  onChange={(e) => form.setField("phone", e.target.value)}
                  placeholder="+91 12345 67890"
                />

                <InputField
                  label="Subject"
                  id="subject"
                  value={form.subject}
                  onChange={(e) => form.setField("subject", e.target.value)}
                  placeholder="How can we help you?"
                />

                <TextAreaField
                  label="Message"
                  id="message"
                  value={form.message}
                  onChange={(e) => form.setField("message", e.target.value)}
                  placeholder="Tell us more about your inquiry..."
                />

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-[var(--color-light)] text-white py-3 rounded-[var(--radius)] font-semibold hover:bg-[var(--color-primary-400)] transition-colors disabled:opacity-70"
                >
                  {mutation.isPending ? "Sending..." : "Send Message"}
                </button>

                {status && (
                  <p className="text-center text-[var(--color-primary-300)] mt-2">
                    {status}
                  </p>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-8 shadow-md border border-[var(--color-primary-border)]">
                <h2 className="text-2xl font-semibold text-[var(--color-primary-400)] mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, i) => {
                    const Icon = info.icon;
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg flex-shrink-0">
                          <Icon className="h-6 w-6 text-[var(--color-primary-400)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--color-primary-400)] mb-1">
                            {info.title}
                          </h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-[var(--color-primary-300)] hover:text-[var(--color-light)] transition-colors"
                              target={
                                info.link.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                info.link.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-[var(--color-primary-300)]">
                              {info.content}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-md border border-[var(--color-primary-border)]">
                <h3 className="text-xl font-semibold text-[var(--color-primary-400)] mb-4">
                  Frequently Asked Questions
                </h3>
                <p className="text-[var(--color-primary-300)] mb-4">
                  Before reaching out, you might find answers in our FAQ
                  section.
                </p>
                <button className="w-full border border-[var(--color-light)] text-[var(--color-light)] py-2 rounded-[var(--radius)] font-medium hover:bg-[var(--color-light)] hover:text-white transition-colors">
                  Visit FAQ Page
                </button>
              </div>

              <div className="bg-white rounded-lg p-6 border border-[var(--color-primary-200)]">
                <h3 className="font-semibold text-[var(--color-primary-400)] mb-2">
                  💬 Live Chat Support
                </h3>
                <p className="text-sm text-[var(--color-primary-300)] mb-4">
                  Get instant help from our support team during business hours
                </p>
                <button className="w-full border border-[var(--color-light)] text-[var(--color-light)] py-2 rounded-[var(--radius)] font-medium hover:bg-[var(--color-light)] hover:text-white transition-colors">
                  Start Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// -------------------- 📋 Reusable Components --------------------
interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = "text",
  value,
  placeholder,
  onChange,
}) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="text-sm font-medium text-[var(--color-primary-400)]"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-[var(--color-primary-100)] rounded-[var(--radius)] focus:ring-2 focus:ring-[var(--color-light)] focus:outline-none"
    />
  </div>
);

interface TextAreaFieldProps {
  label: string;
  id: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  id,
  value,
  placeholder,
  onChange,
}) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="text-sm font-medium text-[var(--color-primary-400)]"
    >
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={6}
      className="w-full px-4 py-2 border border-[var(--color-primary-border)] rounded-[var(--radius)] focus:ring-2 focus:ring-[var(--color-light)] focus:outline-none resize-none"
    />
  </div>
);

export default Contact;
