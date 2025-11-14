import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Heart, Loader, ShoppingCart, Sparkles } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

interface EMIPlan {
  _id: string;
  productId: string;
  monthlyAmount: number;
  tenureMonths: number;
  interestRate: number;
  Cashback: string | number | (string | number)[];
  mutualFund: {
    _id: string;
    name: string;
    annualReturnRate: number;
    riskLevel: string;
    description: string;
  };
}

interface Product {
  _id: string;
  name: string;
  variant: string;
  MRP: number;
  price: number;
  imageUrl: string[];
  features: string[];
  emiPlans: EMIPlan[];
}

interface GroupedProduct {
  name: string;
  baseProduct: Product;
  variantCount: number;
}

const AllProducts: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>(
    {}
  );
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetching all the products
        const res = await axios.get(
          "https://onefi-a5xm.onrender.com/api/products"
        );
        setLoading(false);
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const groupedProducts = useMemo<GroupedProduct[]>(() => {
    const grouped: { [key: string]: Product[] } = {};

    products.forEach((product) => {
      if (!grouped[product.name]) {
        grouped[product.name] = [];
      }
      grouped[product.name].push(product);
    });

    return Object.entries(grouped).map(([name, variants]) => ({
      name,
      baseProduct: variants[0],
      variantCount: variants.length,
    }));
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  const imageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const handleImageNavigation = (
    productId: string,
    direction: "next" | "prev"
  ) => {
    const product = groupedProducts.find(
      (p) => p.baseProduct._id === productId
    )?.baseProduct;
    if (!product) return;

    const currentIndex = imageIndices[productId] || 0;
    const totalImages = product.imageUrl.length;

    if (direction === "next") {
      setImageIndices((prev) => ({
        ...prev,
        [productId]: (currentIndex + 1) % totalImages,
      }));
    } else {
      setImageIndices((prev) => ({
        ...prev,
        [productId]: (currentIndex - 1 + totalImages) % totalImages,
      }));
    }
  };

  const discount = (product: Product) => {
    return Math.round(((product.MRP - product.price) / product.MRP) * 100);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.p
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Loader className="w-12 h-12 text-purple-400" />
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-900 to-slate-900 p-4 md:p-8 relative overflow-hidden">
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

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
              Featured Products
            </h1>
          </div>
          <div className="h-1 w-24 bg-linear-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full"></div>
          <p className="text-purple-200 mt-4 text-lg">
            {groupedProducts.length} premium products available
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groupedProducts.map(({ baseProduct, variantCount }) => (
            <motion.div
              key={baseProduct._id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="group cursor-pointer"
            >
              <div className="h-full bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex flex-col border border-purple-500/20">
                {/* Image Container */}
                <div
                  className="relative h-72 bg-slate-700/30 overflow-hidden"
                  onMouseEnter={() => setHoveredId(baseProduct._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.img
                    key={imageIndices[baseProduct._id] || 0}
                    src={
                      baseProduct.imageUrl[imageIndices[baseProduct._id] || 0]
                    }
                    alt={baseProduct.name}
                    className="w-full h-full object-cover object-center"
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  />

                  {/* linear overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 via-transparent to-transparent" />

                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-linear-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{discount(baseProduct)}%
                  </div>

                  {/* Variant Badge */}
                  {variantCount > 1 && (
                    <div className="absolute top-4 right-4 bg-linear-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                      +{variantCount - 1} variant{variantCount > 2 ? "s" : ""}
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(baseProduct._id);
                    }}
                    className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-md rounded-full p-2.5 shadow-lg hover:bg-slate-700/80 transition-colors border border-purple-500/20"
                  >
                    <Heart
                      size={20}
                      className={
                        wishlist.has(baseProduct._id)
                          ? "fill-red-500 text-red-500"
                          : "text-purple-300"
                      }
                    />
                  </motion.button>

                  {/* Image Navigation */}
                  {hoveredId === baseProduct._id &&
                    baseProduct.imageUrl.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageNavigation(baseProduct._id, "prev");
                          }}
                          className="bg-slate-800/80 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-slate-700/80 transition-colors border border-purple-500/20"
                        >
                          <svg
                            className="w-5 h-5 text-purple-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageNavigation(baseProduct._id, "next");
                          }}
                          className="bg-slate-800/80 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-slate-700/80 transition-colors border border-purple-500/20"
                        >
                          <svg
                            className="w-5 h-5 text-purple-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    )}

                  {/* Image Indicators */}
                  {baseProduct.imageUrl.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {baseProduct.imageUrl.map((_, idx) => (
                        <motion.div
                          key={idx}
                          className={`h-2 rounded-full transition-all ${
                            idx === (imageIndices[baseProduct._id] || 0)
                              ? "w-6 bg-purple-400"
                              : "w-2 bg-purple-400 bg-opacity-40"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div className="p-5 flex flex-col gap-3 grow">
                  {/* Product Name */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-purple-100 line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {baseProduct.name}
                    </h3>
                    <p className="text-sm text-purple-300/70 mt-1 line-clamp-1">
                      {baseProduct.variant}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold bg-linear-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                      {formatPrice(baseProduct.price)}
                    </span>
                    <span className="text-sm text-purple-400/60 line-through">
                      {formatPrice(baseProduct.MRP)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <Link
                    to={`/product/${baseProduct.name}`}
                    className="w-full bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 hover:scale-105 border border-purple-400/20"
                  >
                    <ShoppingCart size={18} />
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {groupedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-purple-300 text-lg">No products available</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AllProducts;
