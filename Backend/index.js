require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pdfRoutes = require("./routes/pdfRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/pdfs", express.static("pdfs"));
app.use("/", pdfRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en ligne sur http://localhost:${PORT}`));
