import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductByName,
} from "../controllers/productController.js";

const route = express.Router();

route.route("/").get(getAllProducts);
route.route("/newProduct").post(createProduct);
route.route("/singleProduct/:productName").get(getProductByName);

export default route;
