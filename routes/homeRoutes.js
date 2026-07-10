const express = require("express");
const router = express.Router();

const RequirementEnquiry = require("../models/requirmentEnquiry");
const Estimate = require("../models/estimate");
const Payment = require("../models/payments");
const User = require("../models/User");

// ===============================
// Dashboard API
// ===============================
router.get("/", async (req, res) => {
    try {

        const [
            totalRequirements,
            totalEstimates,
            totalPayments,
            totalEmployees,

            pendingRequirements,
            approvedEstimates,
            pendingPayments,

            recentRequirements,
            recentEstimates,
            recentPayments,
            recentEmployees
        ] = await Promise.all([

            RequirementEnquiry.countDocuments(),

            Estimate.countDocuments(),

            Payment.countDocuments(),

            User.countDocuments(),

            RequirementEnquiry.countDocuments({
                status: "New"
            }),

            Estimate.countDocuments({
                status: "Approved"
            }),

            Payment.countDocuments({
                paymentStatus: "Pending"
            }),

            RequirementEnquiry.find()
                .sort({ createdAt: -1 })
                .limit(5),

            Estimate.find()
                .sort({ createdAt: -1 })
                .limit(5),

            Payment.find()
                .sort({ createdAt: -1 })
                .limit(5),

            User.find()
                .sort({ createdAt: -1 })
                .limit(5)

        ]);

        res.status(200).json({
            success: true,

            dashboard: {

                counts: {

                    requirements: totalRequirements,

                    estimates: totalEstimates,

                    payments: totalPayments,

                    employees: totalEmployees

                },

                pending: {

                    requirements: pendingRequirements,

                    estimates: approvedEstimates,

                    payments: pendingPayments

                },

                recent: {

                    requirements: recentRequirements,

                    estimates: recentEstimates,

                    payments: recentPayments,

                    employees: recentEmployees

                }

            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

module.exports = router;