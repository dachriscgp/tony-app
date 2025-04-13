const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Dossier PDF
const pdfDir = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

// Transporteur mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mailtonyapp@gmail.com",
    pass: process.env.MAIL_PASS
  }
});

// Fonction PDFKit stylée
function generatePDFWithPDFKit(data, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // En-tête stylé
    doc
      .fillColor("#2300bd")
      .fontSize(22)
      .text("Résumé du Formulaire Client", { align: "center" })
      .moveDown(1);

    const sections = [
      {
        title: "Informations Générales",
        content: [
          { label: "Fournisseur", value: data.nom || "Tony K." },
          { label: "Localisation", value: data.localisation || "Non renseigné" },
          { label: "Statut", value: data.statut || "CEO" }
        ]
      },
      {
        title: "Présentation",
        content: [
          { label: "Point de Vente", value: data.Point_de_vente || "Non renseigné" },
          { label: "Type de point de vente", value: data.categories || "Non renseigné" },
          { label: "Nom du Propriétaire", value: data.owner_name || "Non renseigné" },
          { label: "Téléphone", value: data.owner_phone || "Non renseigné" },
          { label: "Province", value: data.province || "Non renseigné" },
          { label: "Ville", value: data.ville || "Non renseigné" },
          { label: "Référence", value: data.reference || "Non renseigné" },
          { label: "Nom du Gérant", value: data.nom_du_gerant || "Non renseigné" },
          { label: "Téléphone Gérant", value: data.manager_phone || "Non renseigné" }
        ]
      },
      {
        title: "Distribution",
        content: [
          { label: "Type de client", value: data.Type_Client || "Non renseigné" },
          { label: "Grossiste", value: data.nom_grossiste || "Non renseigné" },
          { label: "Réalisation Bralima", value: data.realisation || "Non renseigné" },
          { label: "Réalisations du mois cochés", value: data.realisation_du_mois || "Non renseigné" },
          { label: "Prix Brasimba par format", value: data.prix || "Non renseigné" }
        ]
      },
      {
        title: "Emballage",
        content: [
          { label: "Parc d'emballages Brasimba", value: data.brasimba || "Non renseigné" },
          { label: "Parc d'emballages Bralima", value: data.bralima || "Non renseigné" }
        ]
      },
      {
        title: "Décoration",
        content: [
          { label: "Décoration", value: data.decoration || "Non renseigné" }
        ]
      },
      {
        title: "Besoins",
        content: [
          { label: "Besoins Matériels", value: data.besoins_materiels || "Non renseigné" }
        ]
      },
      {
        title: "Négociations",
        content: [
          { label: "Demande de consignation", value: data.demande || "Non renseigné" },
          { label: "Infos concurrents", value: data.infos_concurrents || "Non renseigné" },
          { label: "Avis & Commentaires", value: data.commentaires || "Non renseigné" }
        ]
      }
    ];

    sections.forEach(section => {
      doc
        .fillColor("#5916af")
        .fontSize(16)
        .text(section.title, { underline: true, align: "left" })
        .moveDown(0.3);

      section.content.forEach(item => {
        doc
          .fillColor("#333")
          .fontSize(12)
          .text(`${item.label}: `, { continued: true, underline: false, bold: true })
          .fillColor("#555")
          .text(item.value)
          .moveDown(0.1);
      });

      doc.moveDown(1);
    });

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

// Route pour formulaire
app.post("/submit-form", async (req, res) => {
  try {
    const formData = req.body;
    const pdfPath = path.join(pdfDir, `${formData.nom || "formulaire"}.pdf`);
    await generatePDFWithPDFKit(formData, pdfPath);
    res.json({ message: "Formulaire enregistré, PDF prêt." });
  } catch (error) {
    console.error("Erreur PDF:", error);
    res.status(500).json({ message: "Erreur serveur : " + error.message });
  }
});

// Route pour email
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
      attachments: [{ filename: "formulaire.pdf", path: pdfPath }]
    });

    res.json({ message: "PDF envoyé avec succès." });
  } catch (error) {
    console.error("Erreur Email:", error);
    res.status(500).json({ message: "Échec de l'envoi : " + error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API TONY App !");
});

// Démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});
