const express = require("express");
const router = express.Router();



const RequirementEnquiry = require("../models/requirmentEnquiry");

/* ===========================
   Create Requirement Enquiry
=========================== */
router.post("/", async (req, res) => {
    try {
        const enquiry = await RequirementEnquiry.create(req.body);

        res.status(201).json({
            success: true,
            message: "Requirement enquiry created successfully.",
            data: enquiry,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/* ===========================
   Get All Requirement Enquiries
=========================== */
router.get("/", async (req, res) => {
    try {
        const enquiries = await RequirementEnquiry.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: enquiries.length,
            data: enquiries,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/* ===========================
   Get Single Requirement Enquiry
=========================== */
router.get("/:requirementId", async (req, res) => {
    try {
        const enquiry = await RequirementEnquiry.findOne({
            requirementId: req.params.requirementId,
        });

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Requirement enquiry not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: enquiry,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/* ===========================
   Update Requirement Enquiry
=========================== */


router.put("/:requirementId", async (req, res) => {

    
    try {

        
        const enquiry = await RequirementEnquiry.findOneAndUpdate(
            { requirementId: req.params.requirementId },
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Requirement enquiry not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Requirement enquiry updated successfully.",
            data: enquiry,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/* ===========================
   Delete Requirement Enquiry
=========================== */
router.delete("/:requirementId", async (req, res) => {
    try {
        const enquiry = await RequirementEnquiry.findOneAndDelete({
            requirementId: req.params.requirementId,
        });

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Requirement enquiry not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Requirement enquiry deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
module.exports = router;