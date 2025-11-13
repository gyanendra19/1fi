import mongoose from "mongoose";

const mutualFundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Mutual fund name is required"],
  },
  annualReturnRate: {
    type: Number,
    required: [true, "Return Rate is required"],
  },
  riskLevel: {
    type: String,
    required: [true, "Risk level is required"],
  },
  description: {
    type: String,
  },
});

const MutualFund = mongoose.model("MutualFund", mutualFundSchema);

export default MutualFund;
