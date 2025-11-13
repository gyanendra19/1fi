import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    required: [true, "Variant is a required field"],
    unique: [true, "Variant should be unique"],
  },
  MRP: {
    type: Number,
    required: true,
    min: [0, "MRP must be greater than 0"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be greater than 0"],
  },
  features: {
    type: Array,
  },
  imageUrl: {
    type: Array,
    required: [true, "Image url of the product is required"],
  },
});

productSchema.virtual("emiPlans", {
  ref: "EMI",
  localField: "_id",
  foreignField: "productId",
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
