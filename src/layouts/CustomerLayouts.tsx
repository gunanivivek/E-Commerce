import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Hero1 from "../assets/Hero1.webp";
import Hero2 from "../assets/Hero2.png";
import Hero3 from "../assets/Hero3.jpg";
import { useState } from "react";
import { ChevronDown } from "lucide-react"; // Assuming Lucide icons; adjust as needed
import { User2, User2Icon, type LucideProps } from "lucide-react";
import { useCategoryStore } from "../store/categoryStore";
import { Link } from "react-router-dom";

interface Testimonial {
  id?: number;
  name: string;
  message: string;
  avatar: string | React.ComponentType<LucideProps>;
  rating: number;
  location: string;
}

const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const res = await fetch("/data/testimonials.json");
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return res.json();
};

const CustomerPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const categories = useCategoryStore((state) => state.categories);
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  const faqs = [
    {
      q: "How can I track my order?",
      a: "Track your order anytime from the 'My Orders' section in your account.",
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes, we deliver to 30+ countries with reliable courier partners.",
    },
    {
      q: "What if I receive a damaged product?",
      a: "Contact support within 24 hours for replacement or refund.",
    },
  ];

  const testimonialSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
  const images = [Hero1, Hero2, Hero3];
  const [current, setCurrent] = useState(0);

  // Auto change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <Header />
      <div className="text-[var(--color-primary-400)] bg-[var(--color-background)]">
        {/* Hero Section */}
        <main className="flex-grow">
          <section className="bg-surface mx-auto px-20 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div className="text-center md:text-left">
                <h1 className="font-logo text-[var(--color-white)] text-5xl lg:text-7xl font-extrabold leading-tight">
                  Discover Your
                  <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
                    {" "}
                    Perfect
                  </span>{" "}
                  Find
                </h1>
                <p className="mt-6 text-lg text-text-muted max-w-lg mx-auto md:mx-0">
                  From fashion to furniture, electronics to everyday essentials.
                  Explore our curated collections and find exactly what you're
                  looking for.
                </p>

                {/* Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    to="#"
                    className="inline-block font-semibold rounded-full py-3 px-8 transition-all duration-250 text-center bg-gradient-to-r from-accent to-accent-dark text-[var(--color-white)] hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>

              {/* Right: Auto Image Slider */}
              <div className="flex items-center justify-center relative overflow-hidden rounded-xl shadow-xl w-full max-w-md md:max-w-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={images[current]}
                    src={images[current]}
                    alt="Product showcase"
                    className="rounded-xl w-full h-96 object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                  />
                </AnimatePresence>
              </div>
            </div>
          </section>
        </main>

        {/* Counter Section */}
        <section className="container mx-auto py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Happy Customers", value: "25K+" },
            { label: "Products Sold", value: "150K+" },
            { label: "Positive Reviews", value: "4.9★" },
            { label: "Countries Served", value: "30+" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
              whileHover={{
                scale: 1.02,
                y: -4,
                boxShadow: "var(--shadow-lg)",
              }}
              className="p-6 rounded-lg bg-white border-2 border-gray-200 cursor-pointer group"
            >
              {/* Subtle accent line on hover */}
              <div className="h-1 w-0 group-hover:w-full bg-accent transition-all duration-[var(--transition-normal)] mb-4 mx-auto" />
              <h3 className="text-3xl md:text-4xl font-black mb-3 font-heading text-accent-dark leading-none group-hover:text-[var(--color-accent)] transition-colors duration-[var(--transition-fast)]">
                {stat.value}
              </h3>
              <p className="text-sm font-semibold font-body text-accent-light uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </section>

        <section className="py-20 px-6 md:px-16  ">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold font-logo text-center mb-14"
          >
            Browse by Category
          </motion.h2>

          {/* Category Grid */}
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.a
                key={cat.id}
                href={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="relative group rounded-2xl overflow-hidden bg-accent-darker"
              >
                {/* Image */}
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent-darker/40 via-accent/30 to-transparent flex items-end justify-between p-6">
                  <h3 className="text-2xl font-semibold text-[var(--color-white)] tracking-wide">
                    {cat.name}
                  </h3>
                  <motion.span
                    initial={{ x: 10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-orange-500 text-2xl font-bold"
                  >
                    →
                  </motion.span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <section
          className="py-16 px-6 md:px-20 relative"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          {/* Subtle Timeline Connector Background */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-1/2 left-0 right-0 h-px bg-[var(--color-accent)]"
              style={{ transform: "translateY(-50%)" }}
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black font-heading text-accent text-center mb-16 leading-tight relative z-10"
          >
            The Customer Journey
          </motion.h2>

          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-8 lg:space-y-0 relative z-10">
            {[
              { step: "Discover", desc: "Explore our wide range of products." },
              {
                step: "Engage",
                desc: "Connect with our experts and get help.",
              },
              {
                step: "Purchase",
                desc: "Enjoy smooth checkout and reliable delivery.",
              },
              {
                step: "Delight",
                desc: "Experience exceptional post-purchase support.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "var(--shadow-md)",
                }}
                className={`flex flex-col bg-surface-light border-2 border-gray-600 items-center text-center p-6 rounded-[var(--radius-lg)] relative ${
                  i < 3
                    ? 'lg:after:content-[""] lg:after:absolute lg:after:top-1/2 lg:after:left-full lg:after:w-8 lg:after:h-px lg:after:bg-[var(--color-gray-700)]'
                    : ""
                }`}
              >
                {/* Number Indicator */}
                <motion.div
                  className="w-12 h-12 rounded-full mb-4 bg-accent text-white flex items-center justify-center text-lg font-bold"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {i + 1}
                </motion.div>

                {/* Step Title */}
                <h3
                  className="text-xl md:text-2xl font-bold mb-3 leading-tight"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-[var(--color-white)])",
                  }}
                >
                  {item.step}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed max-w-xs font-body text-text-secondary"
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6 md:px-20">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-12 leading-tight font-heading"
          >
            What Our Customers Say
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            <Slider {...testimonialSettings}>
              {testimonials.length > 0
                ? testimonials.map((t) => {
                    const Avatar = t.avatar;
                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "var(--shadow-md)",
                        }}
                        className="relative  bg-[var(--color-surface-light)] p-6 rounded-[var(--radius-xl)] mx-4 text-center border border-gray-700"
                      >
                        {/* Avatar */}
                        <div className="mx-auto mb-6 w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-accent)]">
                          {typeof Avatar === "string" ? (
                            <img
                              src={Avatar}
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[var(--color-gray-700)]">
                              <Avatar className="w-8 h-8 text-[var(--color-accent)]" />
                            </div>
                          )}
                        </div>

                        {/* Quote */}
                        <p
                          className="text-lg mb-6 leading-relaxed italic text-text-secondary font-body"
                        >
                          "{t.message}"
                        </p>

                        {/* Name & Location */}
                        <h4
                          className="text-xl font-bold mb-1 font-heading text-white"
                        >
                          {t.name}
                        </h4>
                        <p
                          className="text-sm mb-4 text-gray-500"
                        >
                          {t.location}
                        </p>

                        {/* Rating Stars */}
                        <div className="flex justify-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.span
                              key={i}
                              className="text-accent"
                              whileHover={{ scale: 1.2 }}
                              style={{ fontSize: "1.2em" }}
                            >
                              ★
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })
                : [
                    {
                      name: "Priya Mehta",
                      message:
                        "Loved the shopping experience! Super smooth checkout.",
                      avatar: User2Icon,
                      location: "Mumbai, IN",
                      rating: 5,
                    },
                    {
                      name: "Rahul Verma",
                      message:
                        "Great customer service and fast delivery. Highly recommend!",
                      avatar: User2,
                      location: "Delhi, IN",
                      rating: 4,
                    },
                  ].map((demo, i) => {
                    const Avatar =
                      demo.avatar as React.ComponentType<LucideProps>;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                        viewport={{ once: true }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "var(--shadow-md)",
                        }}
                        className="relative bg-[var(--color-surface-light)] p-6 rounded-[var(--radius-xl)] mx-4 text-center border border-[var(--color-gray-700)]"
                      >
                        {/* Avatar */}
                        <div className="mx-auto mb-6 w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-accent)]">
                          <div className="w-full h-full flex items-center justify-center bg-[var(--color-gray-700)]">
                            <Avatar className="w-8 h-8 text-[var(--color-accent)]" />
                          </div>
                        </div>

                        {/* Quote */}
                        <p
                          className="text-lg mb-6 leading-relaxed italic"
                          style={{
                            color: "var(--color-text-secondary)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          "{demo.message}"
                        </p>

                        {/* Name & Location */}
                        <h4
                          className="text-xl font-bold mb-1"
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "var(--color-[var(--color-white)])",
                          }}
                        >
                          {demo.name}
                        </h4>
                        <p
                          className="text-sm mb-4"
                          style={{ color: "var(--color-gray-500)" }}
                        >
                          {demo.location}
                        </p>

                        {/* Rating Stars */}
                        <div className="flex justify-center">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <motion.span
                              key={j}
                              className="text-[var(--color-accent)]"
                              whileHover={{ scale: 1.2 }}
                              style={{ fontSize: "1.2em" }}
                            >
                              ★
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
            </Slider>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="py-16 px-6 md:px-20"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-12 leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-[var(--color-white)])",
            }}
          >
            Customer FAQs
          </motion.h2>

          <div className="max-w-3xl mx-auto space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = activeIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-[var(--radius-lg)] bg-surface-light text-accent-dark hover:text-white hover:bg-accent-dark border border-[var(--color-gray-700)]"
                >
                  <motion.button
                    onClick={() => setActiveIndex(isOpen ? null : i)}
                    className="w-full flex items-center hover:text-white justify-between p-6 font-semibold cursor-pointer"
                    
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-lg">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown
                        size={20}
                      />
                    </motion.div>
                  </motion.button>

                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-sm leading-relaxed font-body"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 md:px-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.h2
              className="text-4xl text-accent md:text-2xl font-black mb-4 leading-tight"
              style={{
                fontFamily: "var(--font-heading)",
              }}
              initial={{ y: -10 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join Our Customer Family
            </motion.h2>
            <motion.p
              className="text-lg mb-8 leading-relaxed font-body text-accent-light"
              initial={{ y: -10 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Experience seamless shopping and personalized service today.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 font-bold cursor-pointer text-white bg-accent rounded-[var(--radius-full)] transition-all duration-[var(--transition-normal)] shadow-[var(--shadow-orange)] hover:shadow-[var(--shadow-xl)]"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CustomerPage;
