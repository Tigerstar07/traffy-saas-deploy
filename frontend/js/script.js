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
            setTimeout(type, 110);
        } else {
            isDeleting = true;
            setTimeout(type, 1300);
        }
    } else {
        if (charIndex > 0) {
            charIndex--;
            setTimeout(type, 45);
        } else {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 400);
        }
    }
}

type();

// 3D hover effect
hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * 60;
    const rotateY = (x - 0.5) * 60;

    hero.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

hero.addEventListener("mouseleave", () => {
    hero.style.transform = `rotateX(0deg) rotateY(0deg)`;
});
