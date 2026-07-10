const express = require("express");
const router = express.Router();

const Payment = require("../models/payments");
const User = require("../models/User");
const transporter = require("../utils/sendMail");
const generateSalarySlip = require("../utils/generateSalarySlip");




// =====================
// Create Payment
// =====================
router.post("/addpayments", async (req, res) => {
    try {

        const now = new Date();

        const payments = req.body.map((item, index) => ({
            ...item,
            salaryMonth: item.salaryMonth || now.getMonth() + 1,
            salaryYear: item.salaryYear || now.getFullYear(),

            invoiceNo:
                item.invoiceNo ||
                `INV-${Date.now()}-${index + 1}`,
        }));

        const result = await Payment.insertMany(payments);

        res.json({
            success: true,
            data: result,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});


// =====================
// Get All Payments
// =====================
router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// =====================
// Get Payment By Staff ID
// =====================
router.get("/staff/:staffId", async (req, res) => {
    try {
        const payment = await Payment.findOne({
            staffId: req.params.staffId,
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment details not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// =====================
// Update Payment By Staff ID
// =====================
router.put("/staff/:staffId", async (req, res) => {
    try {
        const payment = await Payment.findOneAndUpdate(
            { staffId: req.params.staffId },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment details not found.",
            });
        }

        // Send mail only if payment is completed
        if (payment.status === "Payment Successfully Done") {
            const user = await User.findOne({
                staffId: payment.staffId,
            });

            if (user && user.email) {
                const pdfPath = generateSalarySlip(payment);

                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: user.email,
                    subject: "Salary Payment Confirmation",
                    html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Salary Slip Confirmation</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              
              <!-- Wrapper Container Table for Email Client Viewports -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f9fc; padding: 40px 10px;">
                <tr>
                  <td align="center">
                    
                    <!-- Main Body Email Card Frame -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px border #eef2f6;">
                      
                      <!-- BRAND HEADER BLOCK -->
                      <thead style="background-color: #2563eb; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
                        <tr>
                          <td style="padding: 32px; text-align: center;">
                            <!-- Digital Company Logo Typography Badge Layout -->
                            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                <td style="background-color: rgba(255, 255, 255, 0.15); padding: 8px 14px; border-radius: 8px; font-weight: 900; color: #ffffff; font-size: 20px; letter-spacing: -0.5px;">
                                  D
                                </td>
                                <td style="padding-left: 12px; text-align: left;">
                                  <div style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; margin: 0; line-height: 1;">DEENOVA</div>
                                  <div style="font-size: 10px; font-weight: 600; color: #93c5fd; uppercase; tracking: 1px; margin: 2px 0 0 0; line-height: 1;">Digital</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </thead>

                      <!-- CONTENT BODY PANEL -->
                      <tbody>
                        <tr>
                          <td style="padding: 32px 32px 20px 32px;">
                            
                            <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #1e293b; text-align: center;">
                              Salary Disbursement Successful
                            </h2>

                            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                              Dear <b>${payment.employeeName}</b>,
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                              We are pleased to inform you that your compensation statement for the recent payroll window has been compiled, and the transaction has been credited successfully to your registered banking layout.
                            </p>

                            <!-- STYLED LEDGER DETAILS MATRIX TABLE -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                              <tr style="background-color: #f8fafc;">
                                <td style="padding: 12px 16px; font-size: 14px; color: #64748b; border-bottom: 1px solid #e2e8f0; width: 40%;"><b>Staff ID</b></td>
                                <td style="padding: 12px 16px; font-size: 14px; font-family: monospace; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${payment.staffId}</td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 16px; font-size: 14px; color: #64748b; border-bottom: 1px solid #e2e8f0;"><b>Department</b></td>
                                <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #1e293b; border-bottom: 1px solid #e2e8f0; text-transform: uppercase;">${payment.department}</td>
                              </tr>
                              <tr style="background-color: #f8fafc;">
                                <td style="padding: 12px 16px; font-size: 14px; color: #64748b; border-bottom: 1px solid #e2e8f0;"><b>Designation</b></td>
                                <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #e2e8f0; text-transform: uppercase;">${payment.designation}</td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 16px; font-size: 14px; color: #64748b; border-bottom: 1px solid #e2e8f0;"><b>Salary Type</b></td>
                                <td style="padding: 12px 16px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #e2e8f0; text-transform: uppercase;">${payment.salaryType}</td>
                              </tr>
                              <tr style="background-color: #eff6ff;">
                                <td style="padding: 14px 16px; font-size: 14px; color: #1d4ed8; font-weight: bold;"><b>Net Credited Amount</b></td>
                                <td style="padding: 14px 16px; font-size: 16px; font-weight: 800; color: #1d4ed8;">₹${Number(payment.finalAmount).toLocaleString('en-IN')}</td>
                              </tr>
                            </table>

                            <!-- ATTACHMENT INFORMATIONAL BANNER CALLOUT -->
                            <table border="0" cellpadding="12" cellspacing="0" width="100%" style="background-color: #f0f9ff; border: 1px dashed #bee3f8; border-radius: 8px; margin-bottom: 32px;">
                              <tr>
                                <td width="36" valign="middle" style="padding-right: 0;">
                                  <span style="font-size: 22px;">📎</span>
                                </td>
                                <td valign="middle" style="font-size: 13px; line-height: 1.4; color: #0369a1; font-weight: 500;">
                                  A secure, detailed calculation breakdown breakdown sheet (<b>SalarySlip.pdf</b>) has been attached to this message for your permanent financial ledger.
                                </td>
                              </tr>
                            </table>

                          </td>
                        </tr>
                        
                        <!-- SEPARATOR BRIDGING CONTAINER -->
                        <tr>
                          <td style="padding: 0 32px;"><hr style="border: 0; border-top: 1px solid #eef2f6; margin: 0;" /></td>
                        </tr>

                       
                        <tr>
                          <td style="padding: 24px 32px 32px 32px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td>
                                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #64748b;">
                                    Sincerely,<br>
                                    <span style="font-weight: 700; color: #334155;">Human Resources Operations</span><br>
                                    <span style="font-size: 12px; color: #94a3b8;">Deenova Digital</span>
                                  </p>
                                </td>
                                <td style="text-align: right; vertical-align: bottom;">
                                  <span style="font-size: 11px; color: #cbd5e1; font-weight: 500; tracking: 0.5px;">CONFIDENTIALITY NOTICE</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                      </tbody>

                    </table>

                  </td>
                </tr>
              </table>

            </body>
            </html>
          `,
                    attachments: [
                        {
                            filename: "SalarySlip.pdf",
                            path: pdfPath,
                        },
                    ],
                });
            }
        }

        res.status(200).json({
            success: true,
            message: "Payment updated successfully.",
            data: payment,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// =====================
// Delete Payment By Staff ID
// =====================
router.delete("/staff/:staffId", async (req, res) => {
    try {
        const payment = await Payment.findOneAndDelete({
            staffId: req.params.staffId,
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment details not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;