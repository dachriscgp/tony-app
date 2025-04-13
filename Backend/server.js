const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pdfDir = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mailtonyapp@gmail.com",
    pass: process.env.MAIL_PASS,
  },
});

function generatePDFWithPDFKit(data, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(20).text(`Formulaire Client`, { align: "center" }).moveDown();
    doc.fontSize(14).text(`Nom: ${data.nom || "Non renseigné"}`);
    doc.text(`Email: ${data.email || "Non renseigné"}`);
    doc.text(`Téléphone: ${data.telephone || "Non renseigné"}`);
    doc.moveDown();
    doc.text(`Message: ${data.message || "Aucun message fourni."}`);
    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

app.post("/submit-form", async (req, res) => {
  try {
    const formData = req.body;
    const pdfPath = path.join(pdfDir, `${formData.nom || "formulaire"}.pdf`);
    await generatePDFWithPDFKit(formData, pdfPath);

    res.json({ message: "Formulaire enregistré et PDF généré." });
  } catch (error) {
    console.error("Erreur lors de la génération PDF:", error);
    res.status(500).json({ message: "Erreur serveur: " + error.message });
  }
});

app.post("/api/send-pdf", async (req, res) => {
  try {
    const formData = req.body;
    const pdfPath = path.join(pdfDir, `${formData.nom || "formulaire"}.pdf`);
    await generatePDFWithPDFKit(formData, pdfPath);

    await transporter.sendMail({
      from: '"TONY APP" <mailtonyapp@gmail.com>',
      to: "mailtonyapp@gmail.com",
      subject: "Formulaire client soumis",
      text: "Veuillez trouver ci-joint le formulaire rempli.",
      attachments: [{ filename: "formulaire.pdf", path: pdfPath }],
    });

    res.json({ message: "PDF envoyé par email avec succès." });
  } catch (error) {
    console.error("Erreur d'envoi d'email :", error);
    res.status(500).json({ message: "Échec de l'envoi: " + error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de TONY App !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
