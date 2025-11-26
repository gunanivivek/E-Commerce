import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { Mail, Ban } from "lucide-react";
import { type AxiosError } from "axios";

import {
  unsubscribeNewsletter,
  type NewsletterPayload,
  type NewsletterResponse,
} from "../../api/newsletterApi";

interface UnsubscribeFormInputs {
  email: string;
}

const UnsubscribePage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlEmail = params.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UnsubscribeFormInputs>({
    defaultValues: { email: urlEmail },
  });

  const mutation = useMutation<
    NewsletterResponse,
    AxiosError<{ detail: string }>,
    UnsubscribeFormInputs
  >({
    mutationFn: async (data) => {
      const payload: NewsletterPayload = { email: data.email };
      return await unsubscribeNewsletter(payload);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Successfully unsubscribed!");
    },
    onError: (err) => {
      const apiMessage = err?.response?.data?.detail;
      toast.error(apiMessage || "Unsubscribe failed. Please try again.");
    },
  });

  const onSubmit: SubmitHandler<UnsubscribeFormInputs> = (data) =>
    mutation.mutate(data);

  return (
    <div className="flex flex-col min-h-screen">
      <head>
        <title>Unsubscribe — Cartify Newsletter</title>
      </head>

      <div className="flex-1 bg-gradient-to-r from-primary-100/10 to-primary-200/5 py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <section className="text-center mb-10">
            <Ban className="h-14 w-14 mx-auto text-accent mb-4" />
            <h1 className="text-4xl font-black mb-4 text-accent-dark">
              Unsubscribe Request
            </h1>
            <p className="text-lg max-w-xl mx-auto text-accent-light">
              We're sorry to see you go.
            </p>
          </section>

          <section className="rounded-xl p-8 shadow-md justify-center flex flex-col items-center  border border-accent bg-white">
            <h2 className="text-2xl font-bold mb-6 text-accent">
              Confirm Unsubscription
            </h2>

            {/* SUCCESS MESSAGE UI */}
            {mutation.isSuccess ? (
              <div className="text-center py-6">
                <p className="text-green-600 text-lg font-semibold">
                  You have successfully unsubscribed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-accent">
                    Your Email
                  </label>

                  <div className="flex items-center gap-3 px-4 py-3 border border-accent-light rounded-md bg-gray-50">
                    <Mail className="h-5 w-5 text-accent" />
                    <input
                      readOnly
                      {...register("email", { required: true })}
                      className="flex-1 bg-transparent outline-none text-accent"
                    />
                  </div>

                  {errors.email && (
                    <p className="text-red-500 text-sm">Email is required</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-3 rounded-lg bg-accent-dark text-primary-100 border-2 border-accent font-bold disabled:opacity-70"
                >
                  {mutation.isPending ? "Processing..." : "Confirm Unsubscribe"}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;
