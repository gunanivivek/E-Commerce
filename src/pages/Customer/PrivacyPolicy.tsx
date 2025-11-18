import type { FC } from "react";
import {
  ShieldUser,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertTriangle,
  Headset,
  Mail,
  Phone,
  FolderLock,
  Handshake,
  Baby,
  CalendarSync, 
//   RefreshCcw,
  //   ShieldAlert,
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

const PrivacyPolicy: FC = () => {
  return (
    <>
      <head>
        <title>Privacy Policy — Cartify</title>
        <meta
          name="description"
          content="Read how we collect, use, and protect your personal information at Cartify."
        />
      </head>

      <Header />

      <div className="bg-gradient-to-r from-primary-100/10 to-primary-200/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <header className="mb-12 text-center">
            <div className="flex justify-center gap-2 items-center">
              <ShieldUser className="h-10 w-10 text-accent-dark" />
              <h1 className="text-4xl font-bold text-accent-dark">
                Privacy Policy
              </h1>
            </div>
            <p className="text-accent-dark">Last updated: November 2025</p>
          </header>

          {/* Your Privacy Matters */}
          <section className="p-6 text-accent-dark">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FolderLock className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-semibold">Your Privacy Matters</h2>
            </div>
            <p className="">
              We are committed to protecting your personal information and your
              right to privacy. This policy explains how we collect, use, and
              safeguard your data.
            </p>
          </section>
          <hr className="my-3 mb-8 border-accent"/>

          {/* Information We Collect */}
          <section className="mb-8 p-6 text-accent-dark">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Database className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
            </div>

            <div className="space-y-6 ">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Name, email address, and contact information</li>
                  <li>Shipping addresses</li>
                  <li>
                    Payment information (processed securely by third-party
                    providers)
                  </li>
                  <li>Account credentials and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Pages viewed and time spent on our site</li>
                  <li>Referring website and search terms used</li>
                </ul>
              </div>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent"/>

          {/* How We Use Your Information */}
          <section className="mb-8 p-6 text-accent-dark">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Eye className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-semibold">
                How We Use Your Information
              </h2>
            </div>

            <div className="space-y-4 ">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold mb-2">To Provide Services</h3>
                <p>
                  Process your orders, manage your account, and deliver products
                  you purchase.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold mb-2">
                  To Improve Your Experience
                </h3>
                <p>
                  Personalize content, recommend products, and optimize our
                  website performance.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold mb-2">To Communicate</h3>
                <p>
                  Send order updates, promotional offers, and important service
                  announcements.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold mb-2">To Ensure Security</h3>
                <p>
                  Detect fraud, prevent unauthorized access, and protect our
                  users.
                </p>
              </div>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent"/>

          {/* Data Security */}
          <section className="mb-8 p-6 text-accent-dark">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Lock className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-semibold">Data Security</h2>
            </div>

            <div className="space-y-4 ">
              <p>
                We implement industry-standard security measures to protect your
                personal information:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through certified providers</li>
                <li>Regular security audits and monitoring</li>
                <li>
                  Restricted access to personal data within our organization
                </li>
                <li>Secure data storage with backup and recovery systems</li>
              </ul>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent"/>

          {/* Your Rights */}
          <section className="mb-8 p-6 text-accent-dark">
            <div className="flex justify-center items-center gap-3 mb-4">
              <UserCheck className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-semibold">Your Rights</h2>
            </div>

            <div className="space-y-4 ">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Access</strong> – Request a copy of the personal data
                  we hold about you
                </li>
                <li>
                  <strong>Correction</strong> – Request correction of inaccurate
                  or incomplete information
                </li>
                <li>
                  <strong>Deletion</strong> – Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Opt-out</strong> – Unsubscribe from marketing
                  communications at any time
                </li>
                <li>
                  <strong>Data Portability</strong> – Request transfer of your
                  data to another service
                </li>
                <li>
                  <strong>Object</strong> – Object to processing of your
                  personal data
                </li>
              </ul>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent"/>

          {/* Cookies & Tracking */}
          <section className="mb-8 p-6 text-accent-dark">
            <div className="flex justify-center items-center gap-3 mb-4">
              <AlertTriangle className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-semibold">Cookies & Tracking</h2>
            </div>

            <div className="space-y-4 ">
              <p>
                We use cookies and similar technologies to enhance your browsing
                experience, analyze site traffic, and personalize content.
              </p>

              <div className="p-4 rounded-lg space-y-2">
                <p>
                  <strong>Essential Cookies:</strong> Required for basic site
                  functionality
                </p>
                <p>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors use our site
                </p>
                <p>
                  <strong>Marketing Cookies:</strong> Used to deliver relevant
                  advertisements
                </p>
              </div>

              <p>
                You can control cookie preferences through your browser
                settings. Note that disabling certain cookies may limit site
                functionality.
              </p>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent"/>

          {/* Third-Party Sharing */}
          <section className="mb-8 p-6 text-accent-dark">
            <div className="flex justify-center gap-3 mb-4">
              <Handshake className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-semibold mb-4">
                Third-Party Sharing
              </h2>
            </div>
            <div className="space-y-4 ">
              <p>
                We do not sell your personal information. We may share data
                with:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Service providers who assist in operations (shipping, payment
                  processing)
                </li>
                <li>Analytics and advertising partners</li>
                <li>Law enforcement when legally required</li>
                <li>Business partners with your consent</li>
              </ul>
            </div>
          </section>
          <hr className="my-3 mb-8 border-accent"/>

          {/* Children's Privacy */}
          <section className="mb-8 p-6 text-accent-dark">
            <div className="flex justify-center gap-3 mb-4">
              <Baby className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-semibold mb-4">
                Children's Privacy
              </h2>
            </div>
            <p className="">
              Our services are not directed to individuals under 13 years of
              age. We do not knowingly collect personal information from
              children. If you believe we have collected data from a child,
              please contact us immediately.
            </p>
          </section>
          <hr className="my-3 mb-8 border-accent" />

          {/* Changes to This Policy */}
          <section className="mb-8 p-6 text-accent-dark">
            <div className="flex justify-center gap-3 mb-4">
              <CalendarSync className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-semibold mb-4">
                Changes to This Policy
              </h2>
            </div>
            <p className="">
              We may update this privacy policy periodically. Changes will be
              posted on this page with an updated revision date. We encourage
              you to review this policy regularly.
            </p>
          </section>
          <hr className="my-3 mb-8 border-accent"/>

          {/* Contact Information */}
          <section className="p-6 text-accent-dark">
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

export default PrivacyPolicy;
