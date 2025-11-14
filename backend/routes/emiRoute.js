import express from "express";
import {
  createEMI,
  getEMIbyProductId,
  insertEmiPlans,
} from "../controllers/emiController.js";

const route = express.Router();

route.route("/emiByProduct").get(getEMIbyProductId);
route.route("/insertMultipleEmi").post(insertEmiPlans);
route.route("/createEmi").post(createEMI);

export default route;
