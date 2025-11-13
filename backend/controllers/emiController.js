import EMI from "../models/emiModel.js";

export const createEMI = async (req, res) => {
  try {
    const { productId, monthlyAmount, tenureMonths, interestRate, Cashback } =
      req.body;

    const createdEMI = await EMI.create({
      productId,
      monthlyAmount,
      tenureMonths,
      interestRate,
      Cashback,
    });

    res.status(201).json({
      status: "success",
      data: createdEMI,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const insertEmiPlans = async (req, res) => {
  try {
    const emiPlans = req.body.emiPlans;

    if (!emiPlans || emiPlans.length === 0) {
      return res.status(400).json({ message: "No EMI plans provided" });
    }

    // Insert all EMI plans at once
    const result = await EMI.insertMany(emiPlans);
    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEMIbyProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const emi = await EMI.find({ productId }).populate("mutualFund");

    res.status(200).json({
      status: "success",
      data: emi,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
