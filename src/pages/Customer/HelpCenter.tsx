import { useState } from "react";
import Footer from "../../components/ui/Footer";
import Header from "../../components/ui/Header";

const HelpCenter = () => {
  const menu = [
    "Orders & Shipping",
    "Payments & Billing",
    "Returns & Exchanges",
    "Account & Security",
    "Warranty & Repairs",
    "App & Website Help",
    "Privacy Policies",
    "Contact Support"
  ];

  const [activeSection, setActiveSection] = useState("Orders & Shipping");

  // SECTION CONTENT MAPPING
  const sectionContent = {
    "Orders & Shipping": (
      <>
        <h2 className="text-2xl font-semibold text-accent-dark mb-2">Orders & Shipping</h2>
        <hr className="border-accent border-dashed mb-4" />
        <p className="text-accent-darker leading-relaxed mb-4">
          After placing an order, you will receive updates about packing, dispatch,
          transit and delivery. You can track your order anytime from the “My Orders”
          page after logging into your account.
        </p>
        <p className="text-accent-darker leading-relaxed">
          Standard delivery typically takes 5–7 business days, while express delivery
          options are available at checkout for faster shipping.
        </p>
      </>
    ),

    "Payments & Billing": (
      <>
        <h2 className="text-2xl font-semibold text-accent-dark mb-2">Payments & Billing</h2>
        <hr className="border-accent border-dashed mb-4" />
        <p className="text-accent-darker mb-4">
          We support UPI, Net Banking, Debit/Credit Cards, Wallets, and EMI options.
          All payments are secured using industry-standard encryption.
        </p>
        <p className="text-accent-darker">
          For billing or failed payment concerns, you will automatically receive an email
          confirmation of your transaction status.
        </p>
      </>
    ),

    "Returns & Exchanges": (
      <>
        <h2 className="text-2xl font-semibold text-accent-dark mb-2">Returns & Exchanges</h2>
        <hr className="border-accent border-dashed mb-4" />
        <p className="text-accent-darker mb-4">
          Most items can be returned within 7–30 days depending on the category.
          Returned items must be unused, undamaged, and with original tags/packaging.
        </p>
        <p className="text-accent-darker">
          You can request a return or exchange directly from the "My Orders" page.
        </p>
      </>
    ),

    "Account & Security": (
      <>
        <h2 className="text-2xl font-semibold text-accent-dark mb-2">Account & Security</h2>
        <hr className="border-accent border-dashed mb-4" />
        <p className="text-accent-darker mb-4">
          Keep your account secure by using strong passwords and enabling login notifications.
        </p>
        <p className="text-accent-darker">
          Your personal information is encrypted and never shared with third-party vendors.
        </p>
      </>
    ),

    "Warranty & Repairs": (
      <>
        <h2 className="text-2xl font-semibold text-accent-dark mb-2">Warranty & Repairs</h2>
        <hr className="border-accent border-dashed mb-4" />
        <p className="text-accent-darker mb-4">
          Electronic items come with manufacturer warranty ranging from 6–24 months.
        </p>
        <p className="text-accent-darker">
          For warranty claims, contact our support team and provide invoice details.
        </p>
      </>
    ),

    "App & Website Help": (
      <>
        <h2 className="text-2xl font-semibold text-accent-dark mb-2">App & Website Help</h2>
        <hr className="border-accent border-dashed mb-4" />
        <p className="text-accent-darker mb-4">
          Facing glitches or errors? Try clearing cache, updating the app, or re-logging.
        </p>
        <p className="text-accent-darker">
          If issues continue, send us screenshots and device details for quick support.
        </p>
      </>
    ),

    "Privacy Policies": (
      <>
        <h2 className="text-2xl font-semibold text-accent-dark mb-2">Policies</h2>
        <hr className="border-accent border-dashed mb-4" />
        <p className="text-accent-darker mb-4">
          We follow transparent policies related to privacy, cookies, returns, warranty,
          and user safety. Our policies are updated periodically.
        </p>
        <p className="text-accent-darker">
          Check the official policy pages for full details.
        </p>
      </>
    ),

    "Contact Support": (
      <>
        <h2 className="text-2xl font-semibold text-accent-dark mb-2">Contact Support</h2>
        <hr className="border-accent border-dashed mb-4" />
        <p className="text-accent-darker mb-4">
          Need help? Our support team is here for you Monday to Saturday.
        </p>

        <ul className="text-accent-darker space-y-1">
          <li>Email: <span className="font-semibold">support@store.com</span></li>
          <li>Phone: <span className="font-semibold">1800-000-000</span></li>
          <li>Working Hours: 9 AM – 7 PM</li>
        </ul>
      </>
    )
  };

  return (
    <div className="bg-gradient-to-r from-primary-100/10 to-primary-200/5">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-10">
        
        {/* SIDEBAR */}
        <aside className="w-64 hidden md:block">
          <div className="border border-accent border-dashed rounded-xl p-4 bg-white/60 shadow-sm">
            <h3 className="font-bold text-lg text-accent-dark mb-3">Help Topics</h3>

            <ul className="space-y-2">
              {menu.map((item) => (
                <li
                  key={item}
                  onClick={() => setActiveSection(item)}
                  className={`cursor-pointer px-2 py-1 rounded transition
                    ${
                      activeSection === item
                        ? "bg-primary-100 text-accent-dark font-medium"
                        : "text-accent-darker hover:text-accent-dark"
                    }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <h1 className="text-4xl font-bold mb-4 text-accent-dark">Help Center</h1>
          <p className="text-accent-darker mb-10">
            Find answers, troubleshoot issues, and learn more about using our platform.
          </p>

          {/* RENDER ACTIVE SECTION */}
          <section className="mb-16">
            {sectionContent[activeSection]}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
