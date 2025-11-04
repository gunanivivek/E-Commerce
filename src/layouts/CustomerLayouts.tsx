import React from "react";
import { useQuery } from "@tanstack/react-query";
// import { create } from "zustand";
import { motion } from "framer-motion";
import Slider from "react-slick";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Hero1 from "../assets/Hero1.jpg";
import Hero2 from "../assets/Hero2.jpg";
import Hero3 from "../assets/Hero3.jpg";
import Electronics from "../assets/Electronics.jpg";
import Fashion from "../assets/Fashion.jpg";
import Beauty from "../assets/Beauty.jpg";
import Sports from "../assets/Sports.jpg";
import Toys from "../assets/Toys.jpg";
import Home from "../assets/Home.jpg";
import { User2, User2Icon, type LucideProps } from "lucide-react";

interface Testimonial {
  id?: number;
  name: string;
  message: string;
  // avatar can be an image URL or a Lucide icon component
  avatar: string | React.ComponentType<LucideProps>;
  rating: number;
  location: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
}

// interface CustomerState {
//   selectedCategory: string;
//   setCategory: (category: string) => void;
// }

// const useCustomerStore = create<CustomerState>((set) => ({
//   selectedCategory: "all",
//   setCategory: (category) => set({ selectedCategory: category }),
// }));

const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const res = await fetch("/data/testimonials.json");
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return res.json();
};

const categories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    image: Electronics,
    link: "/categories/electronics",
  },
  {
    id: 2,
    name: "Fashion",
    image: Fashion,
    link: "/categories/fashion",
  },
  {
    id: 3,
    name: "Home",
    image: Home,
    link: "/categories/home",
  },
  {
    id: 4,
    name: "Beauty",
    image: Beauty,
    link: "/categories/beauty",
  },
  {
    id: 5,
    name: "Sports",
    image: Sports,
    link: "/categories/sports",
  },
  {
    id: 6,
    name: "Toys",
    image: Toys,
    link: "/categories/toys",
  },
];

const CustomerPage: React.FC = () => {
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  // const { selectedCategory, setCategory } = useCustomerStore();

  const heroSlides = [
    {
      title: "Shop Smart, Live Better!",
      subtitle: "Discover exclusive deals and top-rated brands.",
      image: Hero1,
    },
    {
      title: "Find Everything You Love in One Place",
      subtitle: "Shop effortlessly with confidence at Merchant Hub.",
      image: Hero2,
    },
    {
      title: "Your Trusted Shopping Destination",
      subtitle: "Enjoy seamless shopping and unmatched service.",
      image: Hero3,
    },
  ];

  const heroSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    // speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <Header />
      <div
        className="text-[var(--color-primary-400)]"
        style={{
          background: "var(--color-background)",
        }}
      >
        {/* Hero Section */}
        <section className="overflow-hidden cursor-grab bg-[var(--color-primary-100)]">
          <Slider {...heroSettings}>
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className="relative flex items-center justify-center h-[400px] md:h-[575px] text-center md:text-left"
              >
                {/* Background Image */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-auto h-auto object-cover brightness-75 rounded-none"
                  />
                </motion.div>

                {/* Overlay Gradient for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-300)]/60 via-[var(--color-primary-200)]/40 to-transparent rounded-lg"></div>

                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="py-40 relative z-10 px-8 md:px-20 max-w-2xl"
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 text-[var(--color-primary-100)] drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-lg mb-6 text-[var(--color-primary-100)]">
                    {slide.subtitle}
                  </p>
                  <button
                    className="px-8 py-3 cursor-pointer font-semibold rounded-lg shadow-md transition hover:scale-105"
                    style={{
                      background: "var(--color-light)",
                      color: "#fff",
                    }}
                  >
                    Shop Now
                  </button>
                </motion.div>
              </div>
            ))}
          </Slider>
        </section>

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
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              className="p-6 rounded-xl shadow-lg"
              style={{
                background: "var(--color-primary-100)",
                borderRadius: "var(--radius)",
              }}
            >
              <h3
                className="text-3xl font-semibold mb-2"
                style={{ color: "var(--color-light)" }}
              >
                {stat.value}
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-primary-400)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </section>

        {/* <div className="flex justify-center flex-wrap gap-4 mb-8">
          {["all", "retail", "corporate", "international"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 font-medium border transition-all duration-300 rounded-full`}
              style={{
                background:
                  selectedCategory === cat
                    ? "var(--color-light)"
                    : "var(--color-primary-100)",
                color:
                  selectedCategory === cat
                    ? "#fff"
                    : "var(--color-primary-400)",
                borderColor: "var(--color-primary-border)",
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div> */}

        <section className="py-14 px-6 md:px-20 bg-[var(--color-background)]">
          <h2 className="text-3xl font-bold text-center mb-10 text-[var(--color-primary-400)]">
            Browse by Category
          </h2>

          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={cat.link}
                className="group flex items-center gap-4 p-5 rounded-lg bg-gradient-to-r from-[var(--color-primary-100)] to-[var(--color-primary-200)] shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
              >
                {/* Category Icon/Image */}
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-light)] bg-white">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Category Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--color-primary-400)] group-hover:text-[var(--color-light)] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[var(--color-primary-300)]">
                    Explore our latest {cat.name.toLowerCase()} products and
                    offers.
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="text-[var(--color-light)] text-xl group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Customer Journey */}
        <section className="py-14 px-6 md:px-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-[var(--color-primary-400)]">
            The Customer Journey
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-6 shadow-lg hover:shadow-2xl transition"
                style={{
                  background: `linear-gradient(90deg, var(--color-light), var(--color-primary-300))`,
                  color: "#fff",
                  borderRadius: "var(--radius)",
                }}
              >
                <div className="text-5xl mb-4 font-bold">{i + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{item.step}</h3>
                <p style={{ color: "var(--color-primary-400)" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-[var(--color-primary-200)]">
          <h2 className="text-3xl font-bold text-center mb-10 text-[var(--color-primary-400)]">
            What Our Customers Say
          </h2>
          <div className="px-6 md:px-20">
            <Slider {...testimonialSettings}>
              {testimonials.length > 0
                ? testimonials.map((t) => {
                    const Avatar = t.avatar;
                    return (
                      <motion.div
                        key={t.id}
                        className="bg-white p-6 rounded-xl shadow-lg mx-3 text-center hover:shadow-2xl transition"
                        whileHover={{ scale: 1.05 }}
                      >
                        {typeof Avatar === "string" ? (
                          <img
                            src={Avatar}
                            alt={t.name}
                            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-[var(--color-light)]"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[var(--color-light)] flex items-center justify-center bg-white">
                            <Avatar className="w-10 h-10 text-[var(--color-primary-400)]" />
                          </div>
                        )}

                        <p className="text-[var(--color-primary-300)] italic mb-4">
                          “{t.message}”
                        </p>
                        <h4 className="text-[var(--color-primary-400)] font-semibold">
                          {t.name}
                        </h4>
                        <p className="text-sm text-[var(--color-primary-300)]">
                          {t.location}
                        </p>
                        <p className="mt-2 text-[var(--color-light)]">
                          {"★".repeat(t.rating)}
                        </p>
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
                        className="bg-white p-6 rounded-xl shadow-lg mx-3 text-center hover:shadow-2xl transition"
                      >
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[var(--color-light)] flex items-center justify-center bg-white">
                          <Avatar className="w-10 h-10 text-[var(--color-primary-400)]" />
                        </div>
                        <p className="text-[var(--color-primary-300)] italic mb-4">
                          “{demo.message}”
                        </p>
                        <h4 className="text-[var(--color-primary-400)] font-semibold">
                          {demo.name}
                        </h4>
                        <p className="text-sm text-[var(--color-primary-300)]">
                          {demo.location}
                        </p>
                        <p className="mt-2 text-[var(--color-light)]">
                          {"★".repeat(demo.rating)}
                        </p>
                      </motion.div>
                    );
                  })}
            </Slider>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-6 md:px-20">
          <h2 className="text-3xl font-bold text-center mb-8 text-[var(--color-primary-400)]">
            Customer FAQs
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
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
            ].map((faq, i) => (
              <motion.details
                key={i}
                className="p-5 shadow rounded-lg"
                style={{
                  background: "var(--color-primary-100)",
                  borderRadius: "var(--radius)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.3 }}
              >
                <summary className="font-semibold cursor-pointer">
                  {faq.q}
                </summary>
                <p className="mt-2 text-sm text-[var(--color-primary-400)]">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-14 text-center"
          style={{
            background: `linear-gradient(90deg, var(--color-light), var(--color-primary-300))`,
            color: "#fff",
          }}
        >
          <h2 className="text-3xl font-bold mb-3">Join Our Customer Family</h2>
          <p className="mb-6 opacity-90">
            Experience seamless shopping and personalized service today.
          </p>
          <button
            className="px-8 py-3 font-semibold rounded-full transition hover:opacity-90"
            style={{
              background: "#fff",
              color: "var(--color-light)",
              borderRadius: "var(--radius)",
            }}
          >
            Start Shopping
          </button>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CustomerPage;