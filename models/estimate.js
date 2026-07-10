const mongoose = require("mongoose");

const estimateItemSchema = new mongoose.Schema(
  {
    id: Number,

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    unit: {
      type: String,
      default: "Nos",
    },

    price: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    gst: {
      type: Number,
      default: 18,
    },

    amount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const estimateSchema = new mongoose.Schema(
  {
    estimateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    estimateDate: {
      type: Date,
      default: Date.now,
    },

    validTill: Date,

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: String,

    contactPerson: String,

    mobile: String,

    email: String,

    address: String,

    projectName: String,

    projectType: String,

    reference: String,

    status: {
      type: String,
      enum: [
        "Draft",
        "Pending",
        "Approved",
        "Rejected",
        "Expired",
      ],
      default: "Draft",
    },

    estimateItems: [estimateItemSchema],

    subTotal: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    gstAmount: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      default: 0,
    },

    notes: String,

    termsConditions: String,

    pdf: String,

    createdBy: String,
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("Estimate", estimateSchema);