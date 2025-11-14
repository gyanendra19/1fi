import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import productRoute from "./routes/productRoutes.js";
import emiRoute from "./routes/emiRoute.js";
import mutualFundRoute from "./routes/mutualFundRoute.js";

const app = express();
app.use(express.json());
app.use(cors()); // CORS

const mongoUrl = process.env.MONGO_URI.replace(
  "<db_password>",
  process.env.PASSWORD
);

// CONNECT TO DATABASE
mongoose.connect(mongoUrl).then(() => {
  console.log("Connected to the Database");
});

// API ROUTES
app.use("/api/products", productRoute);
app.use("/api/emi", emiRoute);
app.use("/api/mutualFunds", mutualFundRoute);

// CONNECT TO PORT
app.listen(process.env.PORT, () => {
  console.log("Listening to port 8000");
});
