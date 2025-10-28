import Footer from "../../components/Footer";
import Header from "../../components/Header";
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
      <Header />
      <div className="min-h-screen bg-[var(--color-background)]">
        {/* Hero Section */}
        <div className="py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary-400)] mb-4">
              About Our Store
            </h1>
            <p className="text-lg text-[var(--color-primary-400)]/90 max-w-2xl mx-auto">
              Your trusted destination for quality products, exceptional
              service, and unbeatable value since 2020.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 border-b border-[var(--color-primary-border)] bg-[var(--color-primary-100)]/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary-400)] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-[var(--color-primary-400) font-normal]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="py-16 bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-300)]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-[var(--color-primary-400)] mb-6 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-[var(--color-primary-50)] space-y-4">
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
        <div className="py-16 bg-[var(--color-primary-100)]/40">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-[var(--color-primary-400)] mb-12 text-center">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white cursor-default rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-[var(--color-primary-border)]"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--color-primary-200)]/50 rounded-lg mb-4">
                      <Icon className="h-6 w-6 text-[var(--color-primary-400)]"/>
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--color-primary-400)] mb-2">
                      {value.title}
                    </h3>
                    <p className="text-[var(--color-primary-400)]">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-[var(--color-primary-400)] mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-[var(--color-primary-300)] mb-8">
              Explore our wide range of products and experience the difference
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/products"
                className="bg-[var(--color-primary-400)] text-white px-8 py-3 rounded-[var(--radius)] font-semibold hover:bg-[var(--color-light)] transition-colors"
              >
                Browse Products
              </Link>
              <Link
                to="/contact"
                className="border-2 border-[var(--color-primary-400)] text-[var(--color-primary-400)] px-8 py-3 rounded-[var(--radius)] font-semibold hover:bg-[var(--color-primary-400)] hover:text-white transition-colors"
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
