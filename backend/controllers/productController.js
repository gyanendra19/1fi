import Product from "../models/productModel.js";

export const createProduct = async (req, res) => {
  try {
    const { name, variant, MRP, price, imageUrl, features } = req.body;

    const createdProduct = await Product.create({
      name,
      variant,
      MRP,
      price,
      imageUrl,
      features,
    });

    res.status(201).json({
      status: "success",
      data: createdProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "emiPlans",
      populate: {
        path: "mutualFund",
        model: "MutualFund",
      },
    });
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getProductByName = async (req, res) => {
  try {
    const { productName } = req.params;
    const product = await Product.find({ name: productName }).populate({
      path: "emiPlans",
      populate: {
        path: "mutualFund",
        model: "MutualFund",
      },
    });

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
