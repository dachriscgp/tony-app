const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dossier pour stocker les PDF
const pdfDir = path.join(__dirname, "pdfs");
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
}

// Endpoint pour recevoir les données du formulaire et générer un PDF
app.post("/generate-pdf", (req, res) => {
    const formData = req.body;
    const { proprietaire, nomPDV, typePDV, telephone, commune, quartier, rue, gerant, telephoneGerant } = formData;

    if (!proprietaire || !nomPDV) {
        return res.status(400).json({ message: "Données incomplètes" });
    }

    const pdfName = `PDV_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, pdfName);
    const doc = new PDFDocument();

    // Créer le fichier PDF
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(16).text("Fiche du Point de Vente", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Nom du Propriétaire : ${proprietaire}`);
    doc.text(`Nom du PDV : ${nomPDV}`);
    doc.text(`Type de PDV : ${typePDV}`);
    doc.text(`Téléphone : ${telephone}`);
    doc.text(`Adresse : ${commune}, ${quartier}, ${rue}`);
    doc.text(`Gérant : ${gerant}`);
    doc.text(`Téléphone Gérant : ${telephoneGerant}`);
    doc.end();

    // Répondre avec l'URL du PDF
    res.json({ pdfUrl: `http://localhost:${PORT}/pdfs/${pdfName}` });
});

// Servir les fichiers PDF
app.use("/pdfs", express.static(pdfDir));

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
