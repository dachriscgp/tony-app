// CACHER LA LISTE DU MENU PROFIL
(function () {
    const profilView = document.querySelector('.profil-view');
    const listMenu = document.querySelector('.list-menu');

    const toggleMenu = () => {
        listMenu.classList.toggle('hidden');
    };

    const hideMenu = (event) => {

        if (!profilView.contains(event.target) && !
            listMenu.contains(event.tager)) {
            listMenu.classList.add('hidden');
        }
    };

    if (profilView && listMenu) {
        profilView.addEventListener('click', toggleMenu);

        document.addEventListener('click', hideMenu);
    }
})();




// DARK & LIGHT MODE
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}





function linkPlusToPage(className, pageUrl) {
    const div = document.querySelector(`.${className}`);
    if (div) {
        div.addEventListener('click', () => {
            window.location.href = pageUrl;
        });
    } else {
        console.error(`Aucun élément avec la class "${className}" trouvé.`);
    }
}

linkPlusToPage('plustogo', '/Frontend/index.html');












// LIST SHEETS
const currentDateElem = document.getElementById("currentDate");
const prevDateBtn = document.getElementById("prevDate");
const nextDateBtn = document.getElementById("nextDate");
const formListElem = document.getElementById("formList");


const formsData = {
    "2025-02-09": [
        { name: "Junior M.", location: "Goma, DRC", status: "Delivered" },
        { name: "Alice K.", location: "Kinshasa, DRC", status: "Pending" }
    ],
    "2025-02-10": [
        { name: "John D.", location: "Lubumbashi, DRC", status: "Shipped" }
    ],
    "2025-02-11": [
        { name: "Sarah P.", location: "Bukavu, DRC", status: "Processing" }
    ]
};

let currentDate = new Date(2025, 1, 9); // Date initiale: 9 février 2025

function formatDate(date) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options);
}

function updateDateDisplay() {
    currentDateElem.textContent = formatDate(currentDate);
    updateFormList();
}

function updateFormList() {
    const dateKey = currentDate.toISOString().split("T")[0];
    formListElem.innerHTML = "";
    
    if (formsData[dateKey]) {
        formsData[dateKey].forEach(form => {
            const item = document.createElement("div");
            item.classList.add("form-item");
            item.innerHTML = `<span>${form.name}</span> <span>${form.location}</span> <span>${form.status}</span>`;
            formListElem.appendChild(item);
        });
    } else {
        formListElem.innerHTML = "<p>Aucun formulaire disponible pour cette date.</p>";
    }
}

prevDateBtn.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
});

nextDateBtn.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
});

// Initialisation
updateDateDisplay();












// Calculer la liste des sheets
document.addEventListener("DOMContentLoaded", function() {
    const countSheet = document.querySelector(".countSheet");
    const formList = document.querySelector(".form-list");
        const prevDate = document.getElementById("prevDate");
        const prevNext = document.getElementById("prevNext");

        function updateCount() {
            if (countSheet && formList) {
                const count = formList.querySelectorAll(".form-item").length;
                countSheet.textContent = count;
            }
        }

    // Initialisation
    updateCount();

    if (prevDate) prevDate.addEventListener("click", updateCount);
    if (nextDate) nextDate.addEventListener("click", updateCount);
});
















const express = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Endpoint pour générer un PDF
app.post("/generate-pdf", (req, res) => {
    const { pickup, categories, ownerName, ownerPhone, commune, quartier, rue, managerName, managerPhone } = req.body;
    
    const doc = new PDFDocument();
    const fileName = `PDV_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "public", fileName);
    
    doc.pipe(fs.createWriteStream(filePath));
    
    doc.fontSize(20).text("Fiche Point de Vente", { align: "center" });
    doc.moveDown();
    
    doc.fontSize(14).text(`Nom PDV : ${pickup}`);
    doc.text(`Type de point de vente : ${categories}`);
    doc.text(`Propriétaire : ${ownerName}`);
    doc.text(`Téléphone (Propriétaire) : ${ownerPhone}`);
    doc.text(`Commune : ${commune}`);
    doc.text(`Quartier : ${quartier}`);
    doc.text(`Rue : ${rue}`);
    doc.text(`Gérant : ${managerName}`);
    doc.text(`Téléphone (Gérant) : ${managerPhone}`);
    
    doc.end();
    
    res.json({ success: true, url: `http://localhost:${PORT}/${fileName}` });
});

app.listen(PORT, () => {
    console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});

