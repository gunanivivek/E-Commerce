import {  Heart,  Star, Truck, Shield, Headphones } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";



const Hero = () => {
  return (
    <section className="relative bg-[#d9e9cf] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium text-[#4e5c46] mb-4">
              New Collection 2025
            </span>
            <h2 className="text-5xl font-bold text-[#4e5c46] mb-6">
              Discover Natural Beauty Products
            </h2>
            <p className="text-lg text-[#96a78d] mb-8">
              Explore our curated collection of eco-friendly and sustainable products that bring nature to your home.
            </p>
            <button className="px-8 py-4 bg-[#74a45a] text-white font-semibold rounded-lg hover:bg-[#4e5c46] transition shadow-lg">
              Shop Now
            </button>
          </div>
          <div className="relative h-96 bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-[#b6ceb4] rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
    { icon: Shield, title: "Secure Payment", description: "100% protected" },
    { icon: Headphones, title: "24/7 Support", description: "Dedicated support" }
  ];

  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#d9e9cf] rounded-full flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-[#74a45a]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#4e5c46]">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Products = () => {
  const products = [
    { name: "Organic Face Cream", price: "$29.99", rating: 4.5, image: "bg-[#d9e9cf]" },
    { name: "Natural Body Lotion", price: "$24.99", rating: 5, image: "bg-[#b6ceb4]" },
    { name: "Herbal Shampoo", price: "$19.99", rating: 4, image: "bg-[#96a78d]" },
    { name: "Essential Oil Set", price: "$39.99", rating: 4.5, image: "bg-[#d9e9cf]" },
    { name: "Green Tea Soap", price: "$14.99", rating: 5, image: "bg-[#b6ceb4]" },
    { name: "Bamboo Toothbrush", price: "$9.99", rating: 4, image: "bg-[#96a78d]" },
    { name: "Eco Bath Bombs", price: "$22.99", rating: 4.5, image: "bg-[#d9e9cf]" },
    { name: "Lavender Candle", price: "$16.99", rating: 5, image: "bg-[#b6ceb4]" }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#f0f0f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#4e5c46] mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600">Handpicked sustainable essentials for you</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group">
              <div className={`${product.image} h-64 flex items-center justify-center relative`}>
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#4e5c46] mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < product.rating ? 'fill-[#74a45a] text-[#74a45a]' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#74a45a]">{product.price}</span>
                  <button className="px-4 py-2 bg-[#74a45a] text-white text-sm rounded-lg hover:bg-[#4e5c46] transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Products />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;