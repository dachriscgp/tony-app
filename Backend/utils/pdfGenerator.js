const PDFDocument = require("pdfkit");
const { Buffer } = require("buffer");

function generatePDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(20).text(`Nom : ${data.nom}`, { underline: true });
    doc.moveDown();
    doc.fontSize(16).text(`Localisation : ${data.localisation}`);
    doc.moveDown();
    doc.text(`Statut : ${data.statut}`);

    doc.end();
  });
}

module.exports = generatePDF;
