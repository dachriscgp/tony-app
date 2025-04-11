const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASS, EMAIL_TO } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

function sendEmail(pdfBuffer, nom) {
  return transporter.sendMail({
    from: `"Formulaire App" <${EMAIL_USER}>`,
    to: EMAIL_TO,
    subject: `📄 Nouveau PDF - ${nom}`,
    text: `Voici le PDF généré à partir des données de formulaire.`,
    attachments: [
      {
        filename: `${nom}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}

module.exports = sendEmail;
