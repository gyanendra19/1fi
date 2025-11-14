import mongoose from "mongoose";

// EMI SCHEMA
const emiSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  monthlyAmount: {
    type: Number,
    required: [true, "Monthly Amount is required"],
  },
  tenureMonths: {
    type: Number,
    required: [true, "Tenure Months is required"],
  },
  interestRate: {
    type: Number,
    required: [true, "Interest Rate is required"],
  },
  Cashback: {
    type: mongoose.Schema.Types.Mixed,
  },
  mutualFund: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MutualFund",
  },
});

const EMI = mongoose.model("EMI", emiSchema);

export default EMI;
