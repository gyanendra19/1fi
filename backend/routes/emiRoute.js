import express from "express";
import {
  createEMI,
  getEMIbyProductId,
  insertEmiPlans,
} from "../controllers/emiController.js";

const route = express.Router();

route.route("/emiByProduct").get(getEMIbyProductId); // GET EMI BT PRODUCT ID
route.route("/insertMultipleEmi").post(insertEmiPlans); // CREATE MULTIPLE EMIS
route.route("/createEmi").post(createEMI); // CREATE A SINGLE EMI

export default route;
