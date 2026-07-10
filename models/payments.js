const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        staffId: {
            type: String,
            required: true,
            trim: true,
        },

        employeeName: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: String,
            trim: true,
        },

        designation: {
            type: String,
            trim: true,
        },

        employeeType: {
            type: String,
            trim: true,
        },

        joiningDate: {
            type: Date,
        },

        salaryEffectiveFrom: {
            type: Date,
        },

        salaryType: {
            type: String,

            default: "MONTHLY",
        },

        basicSalary: {
            type: Number,
            default: 0,
        },

        hra: {
            type: Number,
            default: 0,
        },

        da: {
            type: Number,
            default: 0,
        },

        specialAllowance: {
            type: Number,
            default: 0,
        },

        conveyanceAllowance: {
            type: Number,
            default: 0,
        },

        medicalAllowance: {
            type: Number,
            default: 0,
        },

        otherAllowances: {
            type: Number,
            default: 0,
        },

        grossSalary: {
            type: Number,
            default: 0,
        },

        salaryMonth: {
            type: Number,
            required: true,
        }, // 1-12

        salaryYear: {
            type: Number,
            required: true,
        }, // 2026

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Payment Successfully Done",
                "Failed"
            ],
            default: "Pending",
        },

        paymentDate: Date,

        transactionId: String,

        paymentMode: {
            type: String,
            default: "Bank Transfer",
        },

        invoiceNo: {
            type: String,
           
        },

        salarySlip: String,

        bankName: String,

        accountNumber: String,

        ifscCode: String,

        upiId: String,

        panNo: String,

        aadhaarNo: String,

        pfNo: String,

        esicNo: String,

        tdsApplicable: {
            type: String,
            default: "NO",
        },
        deductions: [
    {
        title: {
            type: String,
            trim: true,
        },
        amount: {
            type: Number,
            default: 0,
        },
    },
],  
    },
    {
        timestamps: true,
        strict: false,  
    }
);

module.exports = mongoose.model("Payment", paymentSchema);