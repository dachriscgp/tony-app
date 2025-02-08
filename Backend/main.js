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
