const mongoose = require("mongoose");

const requirementPointSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    point: {
      type: String,
      required: true,
      trim: true,
    },
    createdDate: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const requirementEnquirySchema = new mongoose.Schema(
  {
    requirementId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    contactPerson: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    source: {
      type: String,
      default: "Website",
    },

    status: {
      type: String,
      default: "New",
    },

    // PDF Path / URL
    pdf: {
      type: String,
      default: "",
    },

    // Signature PDF/Image Path / URL
    signature: {
      type: String,
      default: "",
    },

    requirementPoints: [requirementPointSchema],
  },
  {
    timestamps: true,
    strict: false, // Allow extra fields
  }
);

module.exports = mongoose.model(
  "RequirementEnquiry",
  requirementEnquirySchema
);