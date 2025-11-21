import Footer from "../../components/ui/Footer";
import Header from "../../components/ui/Header";
import { Link } from "react-router-dom";
import { Target, Users, Award, TrendingUp } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To provide high-quality products that enhance everyday life while maintaining exceptional customer service and competitive prices.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "We put our customers at the heart of everything we do, ensuring satisfaction with every purchase and interaction.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description:
        "Every product is carefully selected and tested to meet our high standards of quality and reliability.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description:
        "We continuously evolve our offerings and services to bring you the latest and best products in the market.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "10K+", label: "Products" },
    { number: "99.9%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <head>
        <title>About Us — Cartify</title>
        <meta
          name="description"
          content="Read how we collect, use, and protect your personal information at Cartify."
        />
      </head>

      <Header />
      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight font-heading text-accent-dark">
              About Our Store
            </h1>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed font-body text-accent-light">
              Your trusted destination for quality products, exceptional
              service, and unbeatable value since 2025.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-surface-light">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-black mb-2 leading-none font-heading text-accent-dark">
                    {stat.number}
                  </div>
                  <div
                    className="text-sm uppercase tracking-wide"
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <div className="py-16 bg-surface">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-black mb-6 text-center leading-tight text-accent-dark font-heading">
              Our Story
            </h2>
            <div className="space-y-4 text-lg leading-relaxed max-w-3xl mx-auto text-accent font-body">
              <p>
                Founded in 2020, we started with a simple mission: to make
                quality products accessible to everyone. What began as a small
                operation has grown into a thriving e-commerce platform serving
                thousands of satisfied customers.
              </p>
              <p>
                Our commitment to excellence drives everything we do. From
                carefully curating our product selection to providing
                outstanding customer support, we strive to exceed expectations
                at every touchpoint.
              </p>
              <p>
                Today, we're proud to offer an extensive catalog of products
                across multiple categories, all backed by our satisfaction
                guarantee and delivered with care to your doorstep.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-black mb-12 text-center leading-tight font-heading text-accent-dark">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="rounded-[var(--radius-lg)] text-center p-6 border bg-surface border-[var(--color-gray-700)] hover:border-[var(--color-accent)] transition-all duration-[var(--transition-normal)] cursor-default"
                  >
                    <div className="text-accent inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] mb-4">
                      <Icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 leading-tight font-heading text-accent-dark">
                      {value.title}
                    </h3>
                    <p className="leading-relaxed font-body text-accent">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-surface-light">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-black mb-4 leading-tight font-heading text-accent-dark">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg mb-8 leading-relaxed font-body text-accent-light">
              Explore our wide range of products and experience the difference
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/products"
                className="bg-accent-dark text-primary-100 px-8 py-3 rounded-[var(--radius-lg)] font-bold transition-all duration-[var(--transition-normal)] shadow-[var(--shadow-orange)] hover:shadow-[var(--shadow-xl)]"
              >
                Browse Products
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 rounded-[var(--radius-lg)] font-semibold border-2 border-accent text-accent transition-all duration-[var(--transition-normal)] hover:shadow-[var(--shadow-xl)]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
