// RETOUR EN ARRIERE
function addGoBackEventToClass(className) {
    const elements = document.querySelectorAll(`.${className}`);

    elements.forEach(elements => {
        elements.addEventListener('click', () => {
            window.history.back();
        });
    });
}

addGoBackEventToClass('fa-chevron-left');












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













// ALLER DANS LES OPTIONS
function linkDivToPage(className, pageUrl) {
    const div = document.querySelector(`.${className}`);
    if (div) {
        div.addEventListener('click', () => {
            window.location.href = pageUrl;
        });
    } else {
        console.error(`Aucun élément avec la class "${className}" trouvé.`);
    }
}

linkDivToPage('presentation', '/Frontend/pages/presentation.html');

linkDivToPage('distribution', '/Frontend/pages/distribution.html');

linkDivToPage('emballage', '/Frontend/pages/emballage.html');






function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}





// // Lien de l'API Google Sheets
// const sheetURL = "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json";

// // Fonction pour récupérer les données de la feuille
// async function fetchSheetData() {
//     try {
//         const response = await fetch(sheetURL);
//         const text = await response.text();

//         // Extraction des données JSON
//         const json = JSON.parse(text.substring(47).slice(0, -2));
//         const rows = json.table.rows;

//         // Parcourir les données et remplir les champs
//         const firstRow = rows[0].c; // Par exemple, prendre la première ligne
//         document.getElementById("name").value = firstRow[0].v; // Nom
//         document.getElementById("email").value = firstRow[2].v; // Email
//     } catch (error) {
//         console.error("Erreur lors de la récupération des données :", error);
//     }
// }

// // Exécuter la fonction après le chargement de la page
// document.addEventListener("DOMContentLoaded", fetchSheetData);











// // Gestion du formulaire
// document.getElementById('taxiForm').addEventListener('submit', function (e) {
//     e.preventDefault();

//     const pickup = document.getElementById('pickup').value;
//     const destination = document.getElementById('destination').value;
//     const time = document.getElementById('time').value;

//     if (pickup && destination && time) {
//         document.getElementById('status').innerText =
//             `Taxi commandé ! Départ : ${pickup}, Destination : ${destination}, Heure : ${new Date(time).toLocaleString()}`;
//     } else {
//         alert("Veuillez remplir tous les champs.");
//     }
// });