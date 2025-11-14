import MutualFund from "../models/mutualFundModel.js";

// CREATE MUTUAL FUNDS
export const createMutualFund = async (req, res) => {
  try {
    const { emiId, name, annualReturnRate, riskLevel, description } = req.body;

    const createdMutualFund = await MutualFund.create({
      emiId,
      name,
      annualReturnRate,
      riskLevel,
      description,
    });

    res.status(201).json({
      status: "success",
      data: createdMutualFund,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
