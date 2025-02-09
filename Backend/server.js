require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connecté"))
    .catch(err => console.error(err));

// Schéma de stockage des PDFs
const pdfSchema = new mongoose.Schema({
    name: String,
    location: String,
    status: String,
    pdfPath: String,
    createdAt: { type: Date, default: Date.now }
});
const PdfModel = mongoose.model("PDF", pdfSchema);

// 📌 Générer un PDF et stocker en base de données
app.post("/generate-pdf", async (req, res) => {
    const { name, location, status } = req.body;
    const pdfName = `${name}_${Date.now()}.pdf`;
    const pdfPath = `./pdfs/${pdfName}`;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(20).text(`Nom: ${name}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Lieu: ${location}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Statut: ${status}`, { align: "center" });
    doc.end();

    const pdfRecord = new PdfModel({ name, location, status, pdfPath });
    await pdfRecord.save();

    res.json({ pdfUrl: `http://localhost:3000/pdfs/${pdfName}` });
});

// 📌 Récupérer la liste des PDFs enregistrés
app.get("/pdfs", async (req, res) => {
    const pdfs = await PdfModel.find().sort({ createdAt: -1 });
    res.json(pdfs);
});

app.use("/pdfs", express.static("pdfs"));

// 📌 Envoi de PDF par email
app.post("/send-email", async (req, res) => {
    const { email, pdfPath } = req.body;

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Votre fichier PDF",
        text: "Voici votre fichier PDF.",
        attachments: [{ filename: pdfPath.split("/").pop(), path: pdfPath }]
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "E-mail envoyé avec succès !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur d'envoi d'e-mail" });
    }
});

app.listen(3000, () => console.log("Serveur sur http://localhost:3000"));
