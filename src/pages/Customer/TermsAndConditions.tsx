import type { FC } from "react";
import {
  FileText,
  Headset,
  AlertCircle,
  ReceiptText,
  Mail,
  Phone,
} from "lucide-react";
import Footer from "../../components/ui/Footer";
import Header from "../../components/ui/Header";

const TermsAndConditions: FC = () => {
  return (
    <>
      <head>
        <title>Terms & Conditions — Cartify</title>
        <meta
          name="description"
          content="Learn about your rights and obligations when using Cartify."
        />
      </head>
      <Header />
      <div className="bg-gradient-to-r from-primary-100/10 to-primary-200/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center">
            <div className="flex justify-center gap-2">
              <ReceiptText className="h-10 w-10 text-accent-dark" />
              <h1 className="text-4xl font-bold text-accent-dark">
                Terms & Conditions
              </h1>
            </div>
            <p className="text-accent-dark">Last updated: November 2025</p>
          </header>

          {/* Agreement to Terms */}
          <section className="p-6 text-accent-darker">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-7 w-7 " />
              <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
            </div>
            <p className="">
              By accessing and using our website, you agree to be bound by these
              terms. Please read them carefully.
            </p>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Use of services */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">
              1. Use of Our Service
            </h2>
            <div className="space-y-4 ">
              <p>
                By using our service, you represent that you are at least 18
                years old and have the legal capacity to enter this agreement.
              </p>
              <div className="bg-muted/30 border border-muted p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  You agree to:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Notify us of unauthorized use</li>
                  <li>Use the service in compliance with the law</li>
                </ul>
              </div>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Product Info */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">
              2. Product Information
            </h2>
            <ul className="list-disc list-inside space-y-2 ">
              <li>Product images may slightly vary from actual products</li>
              <li>Quantities are subject to limits and availability</li>
              <li>Prices may change without notice</li>
              <li>We do not guarantee product availability</li>
            </ul>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Orders & Payment */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">3. Orders & Payment</h2>

            <div className="space-y-6 ">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Order Acceptance
                </h3>
                <p>
                  We reserve the right to refuse or cancel any order at our
                  discretion, including orders that appear fraudulent or violate
                  our terms.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Payment Terms
                </h3>
                <p>
                  Payment is required at the time of purchase. We accept major
                  credit/debit cards and other payment methods displayed at
                  checkout.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Pricing Errors
                </h3>
                <p>
                  In the event of a pricing error, we reserve the right to
                  cancel orders placed at the incorrect price, even after
                  confirmation.
                </p>
              </div>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Shipping */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">
              4. Shipping and Delivery
            </h2>
            <p className=" mb-4">
              Shipping timelines are estimates and not guaranteed. We are not
              responsible for delays caused by carriers or external factors.
            </p>
            <div className="flex items-start gap-3 p-4 bg-muted/30 border border-muted rounded-lg">
              <AlertCircle className="h-5 w-5  mt-0.5" />
              <p className="">
                <strong>Important:</strong> Risk of loss passes to you upon
                shipping.
              </p>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Returns & Refunds */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">
              5. Returns & Refunds
            </h2>

            <div className="space-y-4 ">
              <p>
                Our return policy is defined in our Returns & Refunds page. By
                completing a purchase, you acknowledge and agree to these terms.
              </p>

              <ul className="list-disc list-inside space-y-1">
                <li>Returns must be initiated within 30 days of delivery</li>
                <li>Items must be unused and in original condition</li>
                <li>Some items may not be eligible for return</li>
                <li>
                  Refunds are processed within 5–7 business days after receiving
                  the return
                </li>
              </ul>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Intellectual Property */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">
              6. Intellectual Property
            </h2>
            <p className=" mb-4">
              All content, including text, graphics, and software, is our
              property and protected by intellectual property laws.
            </p>
            <div className="bg-muted/30 border border-muted p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                You may not:
              </h3>
              <ul className="list-disc list-inside space-y-1 ">
                <li>Reproduce or distribute content without permission</li>
                <li>Use our branding without authorization</li>
                <li>Use automated systems on the site</li>
              </ul>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* User Content */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">7. User Content</h2>

            <div className="space-y-4 ">
              <p>
                By submitting reviews, comments, or other content, you grant us
                a non-exclusive, royalty-free license to use, reproduce, and
                display that content.
              </p>
              <p>
                You represent that your content does not violate the rights of
                any third party and adheres to our content policies.
              </p>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Limitation of Liability */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">
              8. Limitation of Liability
            </h2>

            <div className="space-y-4 ">
              <p>
                To the fullest extent allowed by law, we are not liable for any
                indirect, incidental, special, or consequential damages arising
                from:
              </p>

              <ul className="list-disc list-inside space-y-1">
                <li>Your use or inability to use our service</li>
                <li>Unauthorized access to your account</li>
                <li>Errors, inaccuracies, or omissions in content</li>
                <li>Products purchased through our website</li>
              </ul>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Dispute Resolution */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">
              9. Dispute Resolution
            </h2>
            <p className="">
              Disputes will be resolved by binding arbitration under applicable
              laws. Class action participation is waived.
            </p>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Changes to Terms */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">
              10. Changes to Terms
            </h2>

            <p className="">
              We may update these terms at any time. Updated terms become
              effective immediately upon posting. Continued use of the service
              constitutes acceptance of the changes.
            </p>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Termination */}
          <section className="mb-8 p-6 text-accent-darker">
            <h2 className="text-2xl font-semibold mb-6">11. Termination</h2>

            <div className="space-y-4 ">
              <p>
                We may suspend or terminate your account at any time, without
                prior notice, if you violate these terms or engage in prohibited
                activities.
              </p>

              <p>
                Upon termination, your right to use the service ceases
                immediately, and we may delete your account and associated data.
              </p>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent border-dashed" />

          {/* Contact Information */}
          <section className="p-6 text-accent-darker">
            <div className="flex items-center gap-3 justify-center">
              <Headset className="h-7 w-7" />
              <h2 className="text-2xl font-semibold">Contact Information</h2>
            </div>
            <p className=" mb-4 text-center">
              Have questions about these terms? Reach out to us:
            </p>
            <div className="space-y-1 text-center">
              <p>
                <Mail className="inline-block mr-2 h-4 w-4 " />
                <strong>Email:</strong> support@cartify.com
              </p>
              <p>
                <Phone className="inline-block mr-2 h-4 w-4 " />
                <strong>Phone:</strong> +91 12345 67890
              </p>
              {/* <p>
                <MapPin className="inline-block mr-2 h-4 w-4 " />
                <strong>Address:</strong> 812-816, Times Square 1, opposite
                Baghban Party Plot Road, Thaltej, Ahmedabad, Gujarat 380059
              </p> */}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
