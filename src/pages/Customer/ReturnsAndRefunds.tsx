import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Headset,
  Mail,
  Phone,
} from "lucide-react";

const ReturnsRefunds = () => {
  return (
    <div className="bg-gradient-to-r from-primary-100/10 to-primary-200/5">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* PAGE HEADER */}
        <h1 className="text-4xl font-bold text-accent-dark mb-2">
          Returns & Refunds Policy
        </h1>
        <p className="text-accent-darker mb-8">
          We want you to be completely satisfied with your purchase. Here’s how
          our return and refund process works.
        </p>

        {/* SECTION 1 – RETURN POLICY */}
        <section className="p-6 mb-10 rounded-xl bg-surface-light shadow-sm border border-accent-light">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="h-8 w-8 text-accent" />
            <h2 className="text-2xl font-semibold text-accent-dark">
              30-Day Return Policy
            </h2>
          </div>

          <p className="text-accent-darker leading-relaxed mb-4">
            Not satisfied? You may return your product within 30 days for a full
            refund or exchange.
          </p>
        </section>

        {/* SECTION 2 – ELIGIBILITY */}
        <section className="p-6 mb-10 rounded-xl bg-white/70 border border-accent-light shadow-sm">
          <h2 className="text-2xl font-semibold text-accent-dark mb-6">
            Return Eligibility
          </h2>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-accent-dark mb-2">
                  Eligible for Return
                </h3>
                <ul className="list-disc list-inside space-y-1 text-accent-darker">
                  <li>Item is in original condition with all tags</li>
                  <li>Unused and unopened products</li>
                  <li>Products with original packaging intact</li>
                  <li>Items purchased within the last 30 days</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <XCircle className="h-6 w-6 text-error mt-1" />
              <div>
                <h3 className="font-semibold text-accent-dark mb-2">
                  Not Eligible for Return
                </h3>
                <ul className="list-disc list-inside space-y-1 text-accent-darker">
                  <li>Hygiene / personal care products</li>
                  <li>Digital or downloadable items</li>
                  <li>Gift cards and vouchers</li>
                  <li>Items marked “Final Sale”</li>
                  <li>Customized or personalized products</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 – HOW TO RETURN */}
        <section className="p-6 mb-10 rounded-xl bg-surface-light border border-accent-light shadow-sm">
          <h2 className="text-2xl font-semibold text-accent-dark mb-6">
            How to Return an Item
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-dark text-primary-100 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-accent-dark mb-1">
                  Initiate a Return Request
                </h3>
                <p className="text-accent-darker">
                  Go to the “My Orders” section, select the item, and click
                  “Return Item” with a valid reason.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-dark text-primary-100 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-accent-dark mb-1">
                  Print Return Label
                </h3>
                <p className="text-accent-darker">
                  A prepaid return shipping label will be emailed to you upon
                  approval.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-dark text-primary-100 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-accent-dark mb-1">
                  Ship the Package
                </h3>
                <p className="text-accent-darker">
                  Pack your item securely and drop it off at any authorized
                  courier center.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-dark text-primary-100 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-accent-dark mb-1">
                  Receive Your Refund
                </h3>
                <p className="text-accent-darker">
                  Refund will be issued after inspection, usually within 5–7
                  business days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 – REFUND TIMELINE */}
        <section className="p-6 mb-10 rounded-xl bg-white/70 border border-accent-light shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-8 w-8 text-accent" />
            <h2 className="text-2xl font-semibold text-accent-dark">
              Refund Timeline
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-surface-light rounded-lg">
              <h3 className="font-semibold text-accent-dark mb-1">
                Processing Time
              </h3>
              <p className="text-accent-darker">
                Refunds are processed within 5–7 business days after we receive
                your return.
              </p>
            </div>

            <div className="p-4 bg-surface-light rounded-lg">
              <h3 className="font-semibold text-accent-dark mb-1">
                Refund Method
              </h3>
              <p className="text-accent-darker">
                The refund is initiated to the original payment method.
                Depending on your bank, it may take 3–5 additional days to
                reflect.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5 – EXCHANGES */}
        <section className="p-6 mb-10 rounded-xl bg-surface-light border border-accent-light shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-8 w-8 text-accent" />
            <h2 className="text-2xl font-semibold text-accent-dark">
              Exchanges
            </h2>
          </div>

          <p className="text-accent-darker mb-3">
            To exchange an item (size, color, or product), follow these steps:
          </p>

          <ol className="list-decimal list-inside text-accent-darker space-y-1">
            <li>Initiate a return for the original item</li>
            <li>Place a new order for the desired item</li>
            <li>
              Your refund will be issued after the returned item is received
            </li>
          </ol>

          <p className="text-accent-muted text-sm mt-4 p-4 bg-white/70 rounded-lg">
            <strong>Note:</strong> For popular items, we recommend ordering
            early as stock may run out.
          </p>
        </section>

        {/* CONTACT INFORMATION — SAME AS T&C */}
        <section className="p-6 text-accent-darker">
          <div className="flex items-center gap-3 justify-center">
            <Headset className="h-7 w-7" />
            <h2 className="text-2xl font-semibold">Contact Information</h2>
          </div>
          <p className="mb-4 text-center">
            Need help with a return or refund? Reach out to us:
          </p>

          <div className="space-y-1 text-center">
            <p>
              <Mail className="inline-block mr-2 h-4 w-4" />
              <strong>Email:</strong> support@cartify.com
            </p>
            <p>
              <Phone className="inline-block mr-2 h-4 w-4" />
              <strong>Phone:</strong> +91 12345 67890
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ReturnsRefunds;
