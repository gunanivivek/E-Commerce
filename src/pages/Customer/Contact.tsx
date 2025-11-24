import {
  useForm,
  type FieldError,
  type UseFormRegister,
  type SubmitHandler,
} from "react-hook-form";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import type {
  ContactFormPayload,
  ContactFormResponse,
} from "../../types/customer";
import { sendContactForm } from "../../api/customerApi";
import { Link } from "react-router";

// ------------------ FORM TYPES ------------------

interface ContactFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // user inputs only 10 numbers
  subject: string;
  message: string;
}

// ------------------ MAIN COMPONENT ------------------

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>();

  // FULLY TYPED MUTATION
  const mutation: UseMutationResult<
    ContactFormResponse,
    Error,
    ContactFormInputs
  > = useMutation({
    mutationFn: async (data: ContactFormInputs) => {
      const payload: ContactFormPayload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: `+91${data.phone}`, // Auto-add +91 (Option 3)
        subject: data.subject,
        message: data.message,
      };

      return await sendContactForm(payload);
    },
    onSuccess: (res) => {
      toast.success(res.message);
      reset();
    },
    onError: () => {
      toast.error("❌ Failed to send message. Please try again.");
    },
  });

  const onSubmit: SubmitHandler<ContactFormInputs> = (data) =>
    mutation.mutate(data);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@cartify.com",
      link: "mailto:support@cartify.com",
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
      content:
        "812-816, Times Square 1, opposite Baghban Party Plot Road, Thaltej, Ahmedabad, Gujarat 380059",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 10AM-7PM IST",
      link: null,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <head>
        <title>Contact Us — Cartify</title>
        <meta
          name="description"
          content="Read how we collect, use, and protect your personal information at Cartify."
        />
      </head>

      <Header />
      <div className="flex-1 bg-gradient-to-r from-primary-100/10 to-primary-200/5 py-12 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Top Header Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight font-heading text-accent-dark">
              Get in Touch
            </h1>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed font-body text-accent-light">
              Have a question or need assistance? We're here to help! Reach out
              to us through any of the methods below.
            </p>
          </section>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <section className="rounded-xl p-8 shadow-md border border-accent">
              <h2 className="text-2xl font-bold mb-6 leading-tight font-heading text-accent">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    id="firstName"
                    placeholder="John"
                    register={register("firstName", { required: true })}
                    error={errors.firstName}
                  />
                  <InputField
                    label="Last Name"
                    id="lastName"
                    placeholder="Doe"
                    register={register("lastName", { required: true })}
                    error={errors.lastName}
                  />
                </div>

                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="user@gmail.com"
                  register={register("email", {
                    required: true,
                    pattern: /^\S+@\S+\.\S+$/,
                  })}
                  error={errors.email}
                />

                <InputField
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  maxLength={10}
                  placeholder="eg: 9876543210"
                  register={register("phone", {
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                    pattern: /^[0-9]{10}$/,
                  })}
                  error={errors.phone}
                />

                <InputField
                  label="Subject"
                  id="subject"
                  placeholder="How can we help you?"
                  register={register("subject", { required: true })}
                  error={errors.subject}
                />

                <TextAreaField
                  label="Message"
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  register={register("message", { required: true })}
                  error={errors.message}
                />

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-3 rounded-lg bg-accent-dark text-primary-100 border-2 border-accent font-bold transition-all duration-normal disabled:opacity-70"
                >
                  {mutation.isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </section>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="rounded-xl p-8 shadow-md border border-accent">
                <h2 className="text-2xl font-bold mb-6 leading-tight font-heading text-accent">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, i) => {
                    const Icon = info.icon;
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-md flex-shrink-0">
                          <Icon className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1 leading-tight font-heading text-accent">
                            {info.title}
                          </h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="hover:text-accent transition-colors duration-fast font-body text-accent-light"
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
                            <p className="leading-relaxed font-body text-accent-light">
                              {info.content}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FAQ + Live Chat Keep Same */}
              <div className="rounded-xl p-8 shadow-md border border-accent">
                <h3 className="text-xl font-bold mb-4 leading-tight font-heading text-accent">
                  Frequently Asked Questions
                </h3>
                <p className="mb-4 leading-relaxed font-body text-accent-light">
                  Before reaching out, you might find answers in our FAQ
                  section.
                </p>
                <Link
                  to="/#faq"
                  className="w-full block text-center py-2 rounded-md font-medium border border-accent text-accent bg-transparent"
                >
                  Visit FAQ Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;

// ------------------ INPUT FIELD COMPONENT ------------------

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  register: ReturnType<UseFormRegister<ContactFormInputs>>;
  error?: FieldError;
  maxLength?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = "text",
  placeholder,
  register,
  error,
  maxLength,
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium font-body text-accent">
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...register}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-4 py-3 mt-1 rounded-md border-1 border-accent-light focus:ring-2 focus:outline-none text-accent"
    />
    {error && <p className="text-red-500 text-sm">This field is required</p>}
  </div>
);

// ------------------ TEXTAREA COMPONENT ------------------

interface TextAreaFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  register: ReturnType<UseFormRegister<ContactFormInputs>>;
  error?: FieldError;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  id,
  placeholder,
  register,
  error,
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium font-body text-accent">
      {label}
    </label>
    <textarea
      id={id}
      {...register}
      rows={6}
      placeholder={placeholder}
      className="w-full px-4 py-3 mt-1 rounded-md border-1 border-accent-light focus:ring-2 focus:outline-none text-accent"
    />
    {error && <p className="text-red-500 text-sm">This field is required</p>}
  </div>
);
