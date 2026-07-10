const express = require("express");
const router = express.Router();

const Estimate = require("../models/estimate");

router.post("/addestimate", async (req, res) => {
  try {
    const estimate = await Estimate.create(req.body);

    res.status(201).json({
      success: true,
      message: "Estimate created successfully.",
      data: estimate,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const estimates = await Estimate.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: estimates.length,
      data: estimates,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/:estimateId", async (req, res) => {
  try {
    const estimate = await Estimate.findOne({
      estimateId: req.params.estimateId,
    });

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: "Estimate not found",
      });
    }

    res.json({
      success: true,
      data: estimate,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


router.put("/:estimateId", async (req, res) => {
  try {
    const estimate = await Estimate.findOneAndUpdate(
      { estimateId: req.params.estimateId },
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: "Estimate not found",
      });
    }

    res.json({
      success: true,
      message: "Estimate updated successfully.",
      data: estimate,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.delete("/:estimateId", async (req, res) => {
  try {
    const estimate = await Estimate.findOneAndDelete({
      estimateId: req.params.estimateId,
    });

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: "Estimate not found",
      });
    }

    res.json({
      success: true,
      message: "Estimate deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;