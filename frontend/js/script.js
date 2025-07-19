const card = document.getElementById("traffyCard");

card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * 15;
    const rotateY = (x - 0.5) * 15;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
});

card.addEventListener("mouseleave", () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
});
