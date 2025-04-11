const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Création du dossier ./pdfs s’il n’existe pas
const pdfDir = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

// Configuration du moteur de template EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mailtonyapp@gmail.com",
    pass: process.env.MAIL_PASS, // Assure-toi que .env contient MAIL_PASS
  }
});

// Fonction pour générer un PDF
async function generatePDF(html, filePath) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({ path: filePath, format: "A4", printBackground: true });
  await browser.close();
}

// Route pour soumettre le formulaire (depuis /negociations.html)
app.post("/submit-form", async (req, res) => {
  try {
    const formData = req.body;
    const html = await ejs.renderFile("views/template-pdf.ejs", { data: formData });
    const pdfPath = path.join(pdfDir, `${formData.nom || "formulaire"}.pdf`);

    await generatePDF(html, pdfPath);

    res.json({ message: "Formulaire enregistré, prêt à l'envoi." });
  } catch (error) {
    console.error("Erreur lors de la génération :", error);
    res.status(500).json({ message: "Erreur serveur : " + error.message });
  }
});

// Route pour envoyer le PDF par email (depuis /apercu.html)
app.post("/api/send-pdf", async (req, res) => {
  try {
    const formData = req.body;
    const html = await ejs.renderFile("views/template-pdf.ejs", { data: formData });
    const pdfPath = path.join(pdfDir, `${formData.nom || "formulaire"}.pdf`);

    await generatePDF(html, pdfPath);

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
    res.status(500).json({ message: "Échec de l'envoi : " + error.message });
  }
});


const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});




// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
