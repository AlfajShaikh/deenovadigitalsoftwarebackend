const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Employee Information
    staffId: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: false,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
     
      required: false,
    },

    dob: {
      type: Date,
    },

    mobile: {
      type: String,
      required: false,
      unique: true,
    },

    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
    },

    photo: {
      type: String, // Store image URL or file path
      default: "",
    },

    // Job Details
    department: {
      type: String,
      required: false,
    },

    designation: {
      type: String,
      required: false,
    },

    manager: {
      type: String,
      default: "",
    },

    employeeType: {
      type: String,

      default: "Permanent",
    },

    joiningDate: {
      type: Date,
      required: false,
    },

    workLocation: {
      type: String,
    },

    shift: {
      type: String,
    },

    // Address
    address: {
      type: String,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
    },

    // Salary Details
    salary: {
      type: Number,
      default: 0,
    },

    bankName: {
      type: String,
    },

    accountNumber: {
      type: String,
    },

    ifscCode: {
      type: String,
    },

    // Government IDs
    panNo: {
      type: String,
    },

    aadhaarNo: {
      type: String,
    },

    // Login Details
    username: {
      type: String,
      required: false,
      unique: true,
    },

    password: {
      type: String,
      required: false,
    },

    role: {
      type: String,
     
      default: "Employee",
    },

    // Emergency Contact
    emergencyName: {
      type: String,
    },

    emergencyRelation: {
      type: String,
    },

    emergencyMobile: {
      type: String,
    },

    // Status
    status: {
      type: String,
    
      default: "Active",
    },

    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);