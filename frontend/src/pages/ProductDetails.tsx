import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronDown,
  ChevronUp,
  Loader,
  Sparkles,
} from "lucide-react";
import { useParams } from "react-router-dom";

interface MutualFund {
  _id: string;
  name: string;
  annualReturnRate: number;
  riskLevel: string;
  description: string;
}

interface EMIPlan {
  _id: string;
  productId: string;
  monthlyAmount: number;
  tenureMonths: number;
  interestRate: number;
  Cashback: string | number | (string | number)[];
  mutualFund: MutualFund;
}

interface Product {
  _id: string;
  name: string;
  variant: string;
  MRP: number;
  price: number;
  features: string[];
  imageUrl: string[];
  emiPlans: EMIPlan[];
}

const ProductDetails: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedEMI, setExpandedEMI] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEMIPlan, setSelectedEMIPlan] = useState<EMIPlan | null>(null);
  const { productName } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // FETCHING SINGLE PRODUCT FOR DETAILS PAGE
        const response = await fetch(
          `https://onefi-a5xm.onrender.com/api/products/singleProduct/${productName}`
        );
        const data = await response.json();
        if (data.status === "success" && data.data) {
          setProducts(data.data);
          setSelectedProduct(data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productName]);

  const discount = (product: Product) => {
    return Math.round(((product.MRP - product.price) / product.MRP) * 100);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const formatCashback = (
    cashback: string | number | (string | number)[]
  ): string => {
    if (Array.isArray(cashback)) {
      return String(cashback[1] || cashback[0]);
    }
    return String(cashback);
  };

  // Calculate montly amount for the EMI
  function calculateMonthlyEMI(
    totalPrice: number,
    annualInterestRate: number,
    tenureMonths: number
  ) {
    if (annualInterestRate === 0) {
      return (totalPrice / tenureMonths).toFixed(2);
    }
    // Convert annual interest rate to monthly and decimal form
    const monthlyInterestRate = annualInterestRate / 12 / 100;

    // EMI formula: [P x R x (1+R)^N] / [(1+R)^N - 1]
    const emi =
      (totalPrice *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, tenureMonths)) /
      (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);

    return emi.toFixed(2);
  }

  // Variants for Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Loader className="w-12 h-12 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-2xl text-purple-300">Product not found</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-900 to-slate-900 py-8 px-4 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Section */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedProduct.imageUrl[selectedImage]}
                  alt={selectedProduct.name}
                  className="w-full h-[500px] object-contain p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-6 right-6 bg-slate-800/80 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-slate-700/80 transition-colors border border-purple-500/20"
              >
                <Heart
                  size={24}
                  className={
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-purple-300"
                  }
                />
              </motion.button>

              {/* Discount Badge */}
              {discount(selectedProduct) !== 0 && (
                <div className="absolute top-6 left-6 bg-linear-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  {discount(selectedProduct)}% off
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {selectedProduct.imageUrl.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(idx)}
                  className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all backdrop-blur-sm ${
                    selectedImage === idx
                      ? "border-purple-500 shadow-lg shadow-purple-500/30"
                      : "border-purple-500/30"
                  }`}
                >
                  <div className="w-full h-full bg-slate-700/50 flex items-center justify-center">
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: Details Section */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <motion.h1 className="text-4xl font-bold bg-linear-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
                  {selectedProduct.name}
                </motion.h1>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-purple-300/80">(2,543 reviews)</span>
              </div>
              <p className="text-purple-300/70 text-lg">
                {selectedProduct.variant}
              </p>
            </div>

            {/* Price Section */}
            <motion.div className="bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-purple-500/20">
              <div className="flex items-end gap-4 mb-4">
                <span className="text-4xl font-bold bg-linear-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  {formatPrice(selectedProduct.price)}
                </span>
                <span className="text-2xl text-purple-400/60 line-through">
                  {formatPrice(selectedProduct.MRP)}
                </span>
              </div>
              {selectedProduct.MRP - selectedProduct.price !== 0 && (
                <p className="text-green-400 font-semibold text-lg">
                  Save{" "}
                  {formatPrice(selectedProduct.MRP - selectedProduct.price)}
                </p>
              )}
            </motion.div>

            {/* Variant Selector */}
            {products.length > 1 && (
              <motion.div className="bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-purple-500/20">
                <h3 className="font-bold text-lg text-purple-200 mb-4">
                  Select Variant
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {products.map((product) => (
                    <motion.button
                      key={product._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedImage(0);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all text-sm font-semibold ${
                        selectedProduct._id === product._id
                          ? "border-purple-500 bg-purple-500/20 text-purple-200"
                          : "border-purple-500/30 bg-slate-700/50 text-purple-300 hover:border-purple-400/50"
                      }`}
                    >
                      <div>{product.variant}</div>
                      <div className="text-xs mt-2 text-purple-300/80">
                        {formatPrice(product.price)}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Offers and Benefits */}
            <motion.div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: Truck,
                  title: "Free Delivery",
                  desc: "On orders above ₹500",
                },
                {
                  icon: RotateCcw,
                  title: "7 Day Returns",
                  desc: "Easy return policy",
                },
                {
                  icon: Shield,
                  title: "Warranty",
                  desc: "1 Year manufacturer",
                },
                {
                  icon: ShoppingCart,
                  title: "Easy Checkout",
                  desc: "Quick & secure",
                },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  className="bg-slate-800/90 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-purple-500/20"
                >
                  <benefit.icon className="w-6 h-6 text-purple-400 mb-2" />
                  <p className="font-semibold text-sm text-purple-200">
                    {benefit.title}
                  </p>
                  <p className="text-xs text-purple-300/70">{benefit.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Add to Cart Section */}
            <motion.div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2 text-lg border border-purple-400/20"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2 text-lg border border-yellow-400/20"
              >
                Buy Now
              </motion.button>
            </motion.div>

            {/* Selected EMI Plan Display */}
            {selectedEMIPlan && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 backdrop-blur-xl border-2 border-green-400/30 p-4 rounded-xl"
              >
                <p className="text-sm font-semibold text-green-300 mb-1">
                  Selected EMI Plan:
                </p>
                <p className="text-lg font-bold text-purple-100">
                  ₹
                  {calculateMonthlyEMI(
                    selectedProduct.price,
                    selectedEMIPlan.interestRate,
                    selectedEMIPlan.tenureMonths
                  )}{" "}
                  × {selectedEMIPlan.tenureMonths} months
                </p>
                <p className="text-sm text-purple-300/80">
                  {selectedEMIPlan.interestRate}% interest • Cashback:{" "}
                  {formatCashback(selectedEMIPlan.Cashback)}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left: Key Features */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20">
              <h2 className="text-2xl font-bold bg-linear-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
                Key Features
              </h2>
              <div className="space-y-4">
                {selectedProduct.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 pb-4 border-b border-purple-500/20 last:border-b-0"
                  >
                    <div className="shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                      <Star size={16} className="text-purple-400" />
                    </div>
                    <p className="text-purple-200">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: EMI Plans */}
          <div className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20 h-fit">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold text-purple-200">EMI Plans</h3>
            </div>
            <p className="text-sm text-purple-300/70 mb-4">
              Backed by Mutual Funds
            </p>

            <div className="space-y-2 max-h-fit overflow-y-auto">
              {selectedProduct.emiPlans.map((plan) => (
                <motion.button
                  key={plan._id}
                  onClick={() =>
                    setExpandedEMI(expandedEMI === plan._id ? null : plan._id)
                  }
                  className="w-full text-left bg-slate-700/50 hover:bg-slate-700/70 p-4 rounded-xl transition-all border border-purple-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-purple-100">
                        ₹
                        {calculateMonthlyEMI(
                          selectedProduct.price,
                          plan.interestRate,
                          plan.tenureMonths
                        )}{" "}
                        × {plan.tenureMonths}M
                      </p>
                      <p className="text-sm text-purple-300/70">
                        {plan.interestRate}% interest
                      </p>
                    </div>
                    {expandedEMI === plan._id ? (
                      <ChevronUp size={20} className="text-purple-400" />
                    ) : (
                      <ChevronDown size={20} className="text-purple-400" />
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedEMI === plan._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-purple-500/20 space-y-2"
                      >
                        <p className="text-sm text-green-400 font-semibold">
                          Cashback: {formatCashback(plan.Cashback)}
                        </p>
                        <p className="text-xs text-purple-300/80">
                          {plan.mutualFund.name}
                        </p>
                        <p className="text-xs text-purple-300/80">
                          {plan.mutualFund.annualReturnRate}% annual return
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEMIPlan(plan);
                          }}
                          className={`w-full mt-3 py-2 rounded-lg font-semibold text-sm transition-all border ${
                            selectedEMIPlan?._id === plan._id
                              ? "bg-purple-600 text-white border-purple-500"
                              : "bg-purple-500/20 text-purple-200 border-purple-500/30 hover:bg-purple-500/30"
                          }`}
                        >
                          {selectedEMIPlan?._id === plan._id
                            ? "Selected"
                            : "Select Plan"}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
