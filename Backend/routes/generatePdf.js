const express = require("express");
const router = express.Router();
const generatePDF = require("../utils/pdfGenerator");
const sendEmail = require("../utils/mailer");

router.post("/send-pdf", async (req, res) => {
  const data = req.body;

  try {
    const pdfBuffer = await generatePDF(data);
    await sendEmail(pdfBuffer, data.nom || "document");

    res.status(200).json({ message: "PDF envoyé avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'envoi :", err);
    res.status(500).json({ error: "Erreur lors de l'envoi du PDF" });
  }
});

module.exports = router;
