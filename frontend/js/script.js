const words = ["Build", "awesome", "apps", "with", "Traffy."];
const typewriter = document.getElementById("typewriter");
const hero = document.getElementById("traffy");

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const current = words[wordIndex];
    let display = current.substring(0, charIndex);

    typewriter.textContent = display;

    if (!isDeleting) {
        if (charIndex < current.length) {
            charIndex++;
            setTimeout(type, 120);
        } else {
            isDeleting = true;
            setTimeout(type, 1200);
        }
    } else {
        if (charIndex > 0) {
            charIndex--;
            setTimeout(type, 50);
        } else {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 400);
        }
    }
}

type();

// Hover 3D effect on the logo
hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * 50;
    const rotateY = (x - 0.5) * 50;

    hero.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

hero.addEventListener("mouseleave", () => {
    hero.style.transform = `rotateX(0deg) rotateY(0deg)`;
});
