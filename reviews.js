// Reviews par défaut
let reviews = [
    "Best cheat I've ever used. Smooth, clean and undetected.",
    "Support is fast and friendly. 10/10 experience.",
    "BlackHole External is insanely stable. Worth every cent.",
    "The UI is beautiful and the features are powerful.",
    "Updated daily. Never had a single detection.",
    "Executor is god-tier. Legit feels like magic."
];

// Charger les avis utilisateur depuis localStorage
if (localStorage.getItem("userReviews")) {
    const stored = JSON.parse(localStorage.getItem("userReviews"));
    reviews = [...stored, ...reviews];
}

let index = 0;
const reviewText = document.getElementById("review-text");

function showNextReview() {
    reviewText.style.opacity = 0;

    setTimeout(() => {
        reviewText.textContent = reviews[index];
        reviewText.style.opacity = 1;

        index = (index + 1) % reviews.length;
    }, 1000);
}

showNextReview();
setInterval(showNextReview, 4000);

// ------------------------------
// AJOUT D'UN AVIS UTILISATEUR
// ------------------------------

const input = document.getElementById("user-review");
const submit = document.getElementById("submit-review");

submit.addEventListener("click", () => {
    const text = input.value.trim();

    if (text.length < 5) return; // anti spam simple

    // Ajouter en haut de la liste
    reviews.unshift(text);

    // Sauvegarder dans localStorage
    let stored = [];
    if (localStorage.getItem("userReviews")) {
        stored = JSON.parse(localStorage.getItem("userReviews"));
    }
    stored.unshift(text);
    localStorage.setItem("userReviews", JSON.stringify(stored));

    // Reset input
    input.value = "";

    // Afficher immédiatement
    index = 0;
    showNextReview();
});
