import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductByName,
} from "../controllers/productController.js";

const route = express.Router();

route.route("/").get(getAllProducts); // GET ALL THE PRODUCTS
route.route("/newProduct").post(createProduct); // ADD A PRODUCT
route.route("/singleProduct/:productName").get(getProductByName); // GET A SINGLE PRODUCT

export default route;
