import { Link } from "react-router-dom";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { subscribeNewsletter } from "../../api/newsletterApi"; // <-- your API
import { useState } from "react";

const Footer = () => {
  const [success, setSuccess] = useState(false);

  // React Hook Form
  const { register, handleSubmit, reset } = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: subscribeNewsletter,
    onSuccess: () => {
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 2000);
    },
  });

  const onSubmit = (data: { email: string }) => {
    mutation.mutate({ email: data.email });
  };

  return (
    <footer className="bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-t border-[var(--color-border-light)]">
      <div className="max-w-7xl mx-auto px-6 md:px-24 md:py-16 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-5">

          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="hidden font-logo font-bold text-3xl md:inline-block tracking-wider text-accent-darker">
                Cartify
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-base mb-6 leading-relaxed">
              Your trusted destination for premium products at unbeatable
              prices.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { name: "All Products", link: "/products" },
                { name: "About", link: "/about" },
                { name: "Fresh Drops", link: "/new-arrivals" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.link}
                    className="hover:text-[var(--color-accent-light)] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", link: "/help-center" },
                { name: "Contact Us", link: "/contact" },
                { name: "Returns & Refunds", link: "/returns-refunds" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.link}
                    className="hover:text-[var(--color-accent-light)] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Newsletter
            </h3>
            <p className="text-[var(--color-text-secondary)] text-base mb-4">
              Subscribe for special offers & updates.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  {...register("email", { required: true })}
                  className="bg-[var(--color-surface-light)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] border border-[var(--color-border)] rounded-md p-2 focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
                />

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="p-2 rounded-md bg-primary-100 border border-accent-darker text-accent-darker hover:cursor-pointer hover:opacity-90 transition-all flex items-center justify-center w-10"
                >
                  {/* Loader */}
                  {mutation.isPending && (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  )}

                  {/* Success checkmark */}
                  {success && !mutation.isPending && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}

                  {/* Default icon */}
                  {!mutation.isPending && !success && (
                    <Mail className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 border-t border-[var(--color-border-light)] pt-6 text-center text-sm text-[var(--color-text-muted)]">
          <p>&copy; {new Date().getFullYear()} Cartify. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-3 text-[var(--color-text-secondary)]">
            <Link
              to="/privacy-policy"
              className="hover:text-[var(--color-accent-light)]"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              to="/terms-conditions"
              className="hover:text-[var(--color-accent-light)]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
