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





function generatePDFWithPDFKit(data, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Titre principal
    doc
      .fontSize(20)
      .fillColor("#2300bd")
      .text("Résumé du Formulaire Client", { align: "center" })
      .moveDown(1);

    // Fonction réutilisable pour chaque section
    const renderSection = (title, contentArray) => {
      doc
        .fontSize(16)
        .fillColor("#5916af")
        .text(title)
        .moveDown(0.5);

      contentArray.forEach(({ label, value }) => {
        doc
          .fontSize(12)
          .fillColor("#555")
          .font("Helvetica-Bold")
          .text(`${label}: `, { continued: true })
          .font("Helvetica")
          .fillColor("#000")
          .text(value || "Non renseigné");
      });

      doc.moveDown(1);
    };

    // Sections équivalentes à ton template EJS
    renderSection("Informations Générales", [
      { label: "Fournisseur", value: data.nom },
      { label: "Localisation", value: data.localisation },
      { label: "Statut", value: data.statut }
    ]);

    renderSection("Présentation", [
      { label: "Point de Vente", value: data.Point_de_vente },
      { label: "Type de point de vente", value: data.categories },
      { label: "Nom du Propriétaire", value: data.owner_name },
      { label: "Téléphone", value: data.owner_phone },
      { label: "Province", value: data.province },
      { label: "Ville", value: data.ville },
      { label: "Référence", value: data.reference },
      { label: "Nom du Gérant", value: data.nom_du_gerant },
      { label: "Téléphone", value: data.manager_phone }
    ]);

    renderSection("Distribution", [
      { label: "Type de client", value: data.Type_Client },
      { label: "Grossiste", value: data.nom_grossiste },
      { label: "Réalisation Bralima", value: data.realisation },
      { label: "Réalisations du mois cochés", value: data.realisation_du_mois },
      { label: "Prix Brasimba par format", value: data.prix }
    ]);

    renderSection("Emballage", [
      { label: "Parc d'emballages Brasimba", value: data.brasimba },
      { label: "Parc d'emballages Bralima", value: data.bralima }
    ]);

    renderSection("Décoration", [
      { label: "Décoration", value: data.decoration }
    ]);

    renderSection("Besoins", [
      { label: "Besoins Matériels", value: data.besoins_materiels }
    ]);

    renderSection("Négociations", [
      { label: "Demande de consignation", value: data.demande },
      { label: "Infos concurrents", value: data.infos_concurrents },
      { label: "Avis & Commentaires", value: data.commentaires }
    ]);

    // Footer
    doc
      .moveDown(2)
      .fontSize(10)
      .fillColor("#aaaaaa")
      .text("Document généré automatiquement par TONY APP", { align: "center" });

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

