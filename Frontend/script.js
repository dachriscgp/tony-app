// RETOUR EN ARRIÈRE
function addGoBackEventToClass(className) {
    document.querySelectorAll(`.${className}`).forEach(element => {
        element.addEventListener("click", () => window.history.back());
    });
}
addGoBackEventToClass('fa-chevron-left');

// CACHER LE MENU PROFIL
(function () {
    const profilView = document.querySelector('.profil-view');
    const listMenu = document.querySelector('.list-menu');

    profilView?.addEventListener('click', () => {
        listMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!profilView.contains(e.target) && !listMenu.contains(e.target)) {
            listMenu.classList.add('hidden');
        }
    });
})();


// LIENS RAPIDES VERS LES PAGES
function linkDivToPage(className, pageUrl) {
    const div = document.querySelector(`.${className}`);
    div?.addEventListener("click", () => window.location.href = pageUrl);
}
linkDivToPage('presentation', '/Frontend/pages/presentation.html');


// DARK MODE
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark-mode");
});
function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}


// BOUTON SUIVANT
document.addEventListener("DOMContentLoaded", () => {
    const nextButton = document.getElementById("nextButton");
    const form = document.getElementById("form-id");

    if (nextButton && form) {
        nextButton.addEventListener("click", () => {
            if (!form.checkValidity()) {
                form.reportValidity(); // Affiche erreurs si formulaire incomplet
                return;
            }

            let formData = JSON.parse(localStorage.getItem("formData")) || {};
            document.querySelectorAll("input, select, textarea").forEach(input => {
                if (input.type === "checkbox") {
                    formData[input.name || input.id] = input.checked;
                } else if (input.type === "radio" && input.checked) {
                    formData[input.name] = input.value;
                } else {
                    formData[input.name || input.id] = input.value;
                }
            });

            localStorage.setItem("formData", JSON.stringify(formData));

            const nextPage = nextButton.getAttribute("data-next");
            if (nextPage) window.location.href = nextPage;
        });
    }



    // Si on est sur la page NÉGOCIATIONS (dernière page)
    const endButton = document.getElementById("nextButton");
    if (endButton && endButton.textContent.toLowerCase().includes("terminer")) {
        endButton.addEventListener("click", async () => {
            const form = document.getElementById("form-id");
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            let formData = JSON.parse(localStorage.getItem("formData")) || {};
            document.querySelectorAll("input, select, textarea").forEach(input => {
                if (input.type === "checkbox") {
                    formData[input.name || input.id] = input.checked;
                } else if (input.type === "radio" && input.checked) {
                    formData[input.name] = input.value;
                } else {
                    formData[input.name || input.id] = input.value;
                }
            });

            localStorage.setItem("formData", JSON.stringify(formData));

            // Aperçu (optionnel) dans la console
            console.table(formData);

            // Envoi au backend pour PDF + email
            try {
                const response = await fetch("https://tony-app.onrender.com/api/submit-form", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                alert(result.message || "Formulaire envoyé avec succès !");
                localStorage.removeItem("formData");

                // Afficher un aperçu sur une page locale (à créer)
                const params = new URLSearchParams(formData).toString();
                window.location.href = `/Frontend/pages/apercu.html?${params}`;
            } catch (error) {
                console.error("Erreur lors de l'envoi du formulaire :", error);
                alert("Erreur lors de l'envoi. Veuillez réessayer.");
            }
        });
    }
});
