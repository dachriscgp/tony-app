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

















document.getElementById("form-id").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
        pickup: document.getElementById("pickup").value,
        categories: document.getElementById("categories").value,
        destination: document.getElementById("destination").value,
        phone: document.getElementById("phone").value,
        commune: document.querySelector("input[name='commune']:checked")?.value,
        quartier: document.getElementById("quartier").value,
        reference: document.getElementById("destination").value
    };

    const response = await fetch("http://localhost:3000/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        const result = await response.json();
        addToList(result);
    }
});

function addToList(data) {
    const formList = document.getElementById("formList");
    const div = document.createElement("div");
    div.classList.add("form-item");

    div.innerHTML = `
        <span>${data.name}</span> 
        <span>${data.pdv}</span> 
        <span>${data.status}</span>
        <button onclick="openPdf('${data.pdfUrl}')">Ouvrir PDF</button>
    `;

    formList.appendChild(div);
}

function openPdf(url) {
    window.open(url, "_blank");
}











document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-id");
    const formList = document.getElementById("formList");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Récupérer les valeurs du formulaire
        const formData = {
            proprietaire: document.getElementById("destination").value,
            nomPDV: document.getElementById("pickup").value,
            typePDV: document.getElementById("categories").value,
            telephone: document.getElementById("phone").value,
            commune: document.querySelector('input[name="commune"]:checked')?.value || "",
            quartier: document.getElementById("quartier").value,
            rue: document.getElementById("destination").value,
            gerant: document.getElementById("destination").value,
            telephoneGerant: document.getElementById("phone").value
        };

        // Envoyer les données au serveur
        try {
            const response = await fetch("http://localhost:5000/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Ajouter l'élément au formList
                const newItem = document.createElement("div");
                newItem.classList.add("form-item");
                newItem.innerHTML = `
                    <span>${formData.proprietaire}</span>
                    <span>${formData.nomPDV}</span>
                    <span><a href="${data.pdfUrl}" target="_blank">Voir PDF</a></span>
                `;
                formList.appendChild(newItem);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    });
});
