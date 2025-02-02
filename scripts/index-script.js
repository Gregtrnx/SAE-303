
const backToTopButton = document.getElementById("backToTop");

// Affiche le bouton lorsque l'utilisateur descend
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) { // Seuil d'affichage
        backToTopButton.style.display = "flex";
    } else {
        backToTopButton.style.display = "none";
    }
});

// Action de remontée en haut
backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

