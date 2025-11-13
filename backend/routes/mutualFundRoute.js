import express from "express";
import { createMutualFund } from "../controllers/mutualFundController.js";

const route = express.Router();

route.route("/createMutualFund").post(createMutualFund);

export default route;
