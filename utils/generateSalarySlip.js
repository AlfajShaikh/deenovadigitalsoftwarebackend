const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateSalarySlip = (payment) => {
    const uploadDir = path.join(__dirname, "../uploads/salary-slips");

    // Create directory folder framework if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, `${payment.staffId}-${Date.now()}.pdf`);
    
    // Page margins configuration
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    doc.pipe(fs.createWriteStream(filePath));

    // --- DESIGN SYSTEM THEME COLORS ---
    const primaryColor = "#1e3a8a";   // Corporate Deep Navy
    const secondaryColor = "#475569"; // Cool Slate
    const darkText = "#1e293b";       // Dark Slate Text
    const lightBg = "#f8fafc";        // Soft Cream Gray
    const borderColor = "#e2e8f0";    // Light Table Border
    const dangerRed = "#991b1b";      // Elegant Muted Red

    const formatCurrency = (num) => "₹ " + (Number(num) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

    // ==========================================
    // 1. BRAND HEADER SECTION
    // ==========================================
    doc.rect(40, 40, 42, 42).fill(primaryColor);
    doc.fillColor("#ffffff").fontSize(22).font("Helvetica-Bold").text("D", 53, 50);

    doc.fillColor(primaryColor).fontSize(18).font("Helvetica-Bold").text("DEENOVA DIGITAL", 95, 43);
    doc.fillColor(secondaryColor).fontSize(9).font("Helvetica-Bold").text("SOFTWARE SOLUTIONS & HR OPERATIONS", 95, 62, { characterSpacing: 1 });

    doc.fillColor(primaryColor).fontSize(14).font("Helvetica-Bold").text("EARNINGS STATEMENT / SALARY SLIP", 40, 110, { align: "right" });
    doc.moveTo(40, 130).lineTo(555, 130).strokeColor(primaryColor).lineWidth(1.5).stroke();

    // ==========================================
    // 2. PERSONNEL INFORMATION META BLOCK
    // ==========================================
    doc.rect(40, 145, 515, 75).fill(lightBg);
    doc.fillColor(darkText).fontSize(9).font("Helvetica-Bold");
    
    // Left Column
    doc.text(`EMPLOYEE NAME :`, 55, 158);
    doc.font("Helvetica").text(`${(payment.employeeName || "N/A").toUpperCase()}`, 160, 158);
    doc.font("Helvetica-Bold").text(`STAFF ID :`, 55, 176);
    doc.font("Helvetica-Bold").fillColor(primaryColor).text(`${payment.staffId}`, 160, 176);
    doc.fillColor(darkText).font("Helvetica-Bold").text(`DEPARTMENT :`, 55, 194);
    doc.font("Helvetica").text(`${(payment.department || "—").toUpperCase()}`, 160, 194);

    // Right Column
    doc.font("Helvetica-Bold").text(`DESIGNATION :`, 320, 158);
    doc.font("Helvetica").text(`${(payment.designation || "—").toUpperCase()}`, 435, 158);
    doc.font("Helvetica-Bold").text(`EMPLOYEE TYPE :`, 320, 176);
    doc.font("Helvetica").text(`${(payment.employeeType || "—").toUpperCase()}`, 435, 176);
    doc.font("Helvetica-Bold").text(`PAY PERIOD :`, 320, 194);
    
    // Fallback format for pay period targeting month string
    const payPeriodDate = new Date(payment.salaryYear || 2026, (payment.salaryMonth || 7) - 1);
    const formattedPeriod = payPeriodDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase();
    doc.font("Helvetica").text(formattedPeriod, 435, 194);

    // ==========================================
    // 3. FINANCIAL ITEMIZED MATRIX (EARNINGS VS DEDUCTIONS)
    // ==========================================
    let currentY = 245;
    doc.fillColor(primaryColor).fontSize(11).font("Helvetica-Bold").text("Financial Settlement Breakdown", 40, currentY);
    
    currentY += 18;
    // Table Headers
    doc.rect(40, currentY, 255, 22).fill(primaryColor);
    doc.rect(300, currentY, 255, 22).fill(secondaryColor);
    
    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
    doc.text("EARNING COMPONENT", 50, currentY + 7);
    doc.text("AMOUNT", 240, currentY + 7, { align: "right" });
    doc.text("DEDUCTIONS / TAXES", 310, currentY + 7);
    doc.text("AMOUNT", 500, currentY + 7, { align: "right" });

    currentY += 22;

    // Build lists from data payload
const earningsRows = [
    {
        title: "Basic Salary",
        amount: payment.basicSalary || 0,
    },
    {
        title: "Gross Salary",
        amount: payment.grossSalary || 0,
    },
    {
        title: "Conveyance",
        amount: payment.conveyanceAllowance || 0,
    },
    {
        title: "Special Allowance",
        amount: payment.specialAllowance || 0,
    },
    {
        title: "Medical",
        amount: payment.medicalAllowance || 0,
    },
    {
        title: "Other Allowance",
        amount: payment.otherAllowances || 0,
    },
];

    const deductionsRows = [];
    if (payment.deductions && payment.deductions.length > 0) {
        payment.deductions.forEach(d => {
            deductionsRows.push({ title: d.title, amount: d.amount });
        });
    }

    // Dynamic handling for TDS
    if (payment.tdsApplicable === "YES") {
        // Calculate 10% TDS from TotalAmount or fallback percentage values
        const calculatedTds = (Number(payment.totalAmount) * (payment.tdsPercentage || 10)) / 100;
        deductionsRows.push({ title: `Income TDS (${payment.tdsPercentage}%)`, amount: calculatedTds });
    }

    const totalLines = Math.max(earningsRows.length, deductionsRows.length, 4);

    // Print rows
    for (let i = 0; i < totalLines; i++) {
        if (i % 2 === 0) {
            doc.rect(40, currentY, 515, 20).fill("#f8fafc");
        }

        doc.fontSize(8.5).fillColor("#334155");

        // Write earnings cell side
      if (earningsRows[i]) {
    doc
        .font("Helvetica")
        .fillColor("#334155")
        .text(earningsRows[i].title, 50, currentY + 6);

    doc
        .font("Helvetica-Bold")
        .text(
            formatCurrency(earningsRows[i].amount),
            195,
            currentY + 6,
            {
                width: 90,
                align: "right",
            }
        );
}

        // Write deductions cell side
        if (deductionsRows[i]) {
            doc.font("Helvetica").fillColor(dangerRed).text(deductionsRows[i].title, 310, currentY + 6);
            doc.font("Helvetica-Bold").text(`- ${formatCurrency(deductionsRows[i].amount)}`, 455, currentY + 6, { width: 90, align: "right" });
        }

        doc.moveTo(40, currentY + 20).lineTo(555, currentY + 20).strokeColor(borderColor).lineWidth(0.5).stroke();
        currentY += 20;
    }

    // ==========================================
    // 4. ACCUMULATOR TOTALS ROW
    // ==========================================
    doc.rect(40, currentY, 515, 22).fill("#f1f5f9");
    doc.fillColor(darkText).font("Helvetica-Bold").fontSize(8.5);
    
    // Left side total (Gross Accrued)
    doc.text("TOTAL ACCRUED GROSS", 50, currentY + 7);
    doc.text(formatCurrency(payment.totalAmount), 195, currentY + 7, { width: 90, align: "right" });

    // Right side total (Sum of deductions)
    const totalDeductions = deductionsRows.reduce((sum, item) => sum + Number(item.amount), 0);
    doc.text("TOTAL DEDUCTIONS", 310, currentY + 7);
    doc.fillColor(dangerRed).text(formatCurrency(totalDeductions), 455, currentY + 7, { width: 90, align: "right" });

    doc.moveTo(40, currentY + 22).lineTo(555, currentY + 22).strokeColor(borderColor).lineWidth(1).stroke();
    currentY += 22;

    // ==========================================
    // 5. FINAL AMOUNT DISBURSED HIGHLIGHT
    // ==========================================
    currentY += 15;
    doc.rect(40, currentY, 515, 34).fill("#f0fdf4");
    doc.rect(40, currentY, 515, 34).strokeColor("#bbf7d0").lineWidth(1).stroke();
    
    doc.fillColor("#166534").fontSize(10).font("Helvetica-Bold");
    doc.text("FINAL NET DISBURSED AMOUNT (TAKE HOME)", 55, currentY + 13);
    
    // Render final Amount
    doc.fontSize(13).text(formatCurrency(payment.finalAmount), 415, currentY + 11, { width: 125, align: "right" });

    // ==========================================
    // 6. SETTLEMENT BANK DESTINATION BLOCK
    // ==========================================
    currentY += 55;
    doc.fillColor(primaryColor).fontSize(10).font("Helvetica-Bold").text("Bank Settlement Protocol Destination", 40, currentY);
    
    currentY += 16;
    doc.rect(40, currentY, 515, 45).strokeColor(borderColor).lineWidth(1).stroke();
    
    doc.fillColor(secondaryColor).fontSize(8).font("Helvetica-Bold");
    doc.text("BANK NAME:", 55, currentY + 10);
    doc.fillColor(darkText).font("Helvetica").text(payment.bankName || "—", 130, currentY + 10);
    doc.fillColor(secondaryColor).font("Helvetica-Bold").text("ACCOUNT NO:", 55, currentY + 25);
    doc.fillColor(darkText).font("Helvetica").text(payment.accountNumber || "————————————————", 130, currentY + 25);

    doc.fillColor(secondaryColor).font("Helvetica-Bold").text("IFSC CODE:", 300, currentY + 10);
    doc.fillColor(darkText).font("Helvetica").text(payment.ifscCode || "—", 375, currentY + 10);
    doc.fillColor(secondaryColor).font("Helvetica-Bold").text("PAYMENT MODE:", 300, currentY + 25);
    doc.fillColor(darkText).font("Helvetica").text((payment.paymentMode || "—").toUpperCase(), 375, currentY + 25);

    // ==========================================
    // 7. COMPLIANCE & LEGAL SYSTEM FOOTER
    // ==========================================
    doc.fillColor("#94a3b8")
       .fontSize(7.5)
       .font("Helvetica-Oblique")
       .text("This document constitutes an electronic authorization summary generated directly from corporate payroll database logs. No physical ink sign-off seal is structurally required.", 40, 715, { width: 515, align: "center" });

    doc.moveTo(40, 740).lineTo(555, 740).strokeColor(borderColor).lineWidth(0.5).stroke();

    doc.fillColor("#cbd5e1")
       .fontSize(9)
       .font("Helvetica-Bold")
       .text("DEENOVA DIGITAL SOFTWARE SOLUTIONS", 40, 755, { align: "center", characterSpacing: 0.8 });

    // Wrap-up and compile output stream execution
    doc.end();
    return filePath;
};

module.exports = generateSalarySlip;