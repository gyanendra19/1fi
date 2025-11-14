import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Heart, Loader, ShoppingCart } from "lucide-react";
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

  // Group products by name and get the first variant of each
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
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }, // cubic-bezier for easeOut
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

  // Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.p
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Loader className="w-12 h-12 text-blue-600" />
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Featured Products
          </h1>
          <div className="h-1 w-20 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <p className="text-slate-600 mt-4">
            {groupedProducts.length} unique products available
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groupedProducts.map(({ baseProduct, variantCount }) => (
            <motion.div
              key={baseProduct._id}
              variants={cardVariants}
              initial="hidden" // corresponds to cardVariants.hidden
              animate="visible"
              whileHover="hover"
              className="group cursor-pointer"
            >
              <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                {/* Image Container */}
                <div
                  className="relative h-72 bg-slate-100 overflow-hidden"
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

                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-linear-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{discount(baseProduct)}%
                  </div>

                  {/* Variant Badge */}
                  {variantCount > 1 && (
                    <div className="absolute top-4 right-4 bg-linear-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
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
                    className="absolute bottom-4 right-4 bg-white rounded-full p-2.5 shadow-lg hover:bg-slate-100 transition-colors"
                  >
                    <Heart
                      size={20}
                      className={
                        wishlist.has(baseProduct._id)
                          ? "fill-red-500 text-red-500"
                          : "text-slate-400"
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
                          className="bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
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
                          className="bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
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
                              ? "w-6 bg-white"
                              : "w-2 bg-white bg-opacity-60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div className="p-4 flex flex-col gap-3 grow">
                  {/* Product Name */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {baseProduct.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                      {baseProduct.variant}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-slate-900">
                      {formatPrice(baseProduct.price)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(baseProduct.MRP)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <Link
                    to={`/product/${baseProduct.name}`}
                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105"
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
            <p className="text-slate-500 text-lg">No products available</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AllProducts;
