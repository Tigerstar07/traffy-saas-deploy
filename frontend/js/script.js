const words = ["Build", "awesome", "apps", "with", "Traffy."];
const typewriter = document.getElementById("typewriter");
const hero = document.getElementById("traffy");

// --- Typewriter effect ---
if (typewriter) {
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
}

// --- 3D hover effect ---
if (hero) {
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
}

// --- Meteor generator ---
function createMeteor() {
    const meteor = document.createElement("div");
    meteor.classList.add("meteor");
    meteor.style.left = `${Math.random() * 100}vw`;
    meteor.style.top = `${Math.random() * -20}vh`;
    const duration = 2 + Math.random() * 3;
    meteor.style.animationDuration = `${duration}s`;
    meteor.style.animationDelay = `${Math.random() * 1}s`;
    document.getElementById("meteor-container")?.appendChild(meteor);
    setTimeout(() => meteor.remove(), duration * 1000 + 500);
}

setInterval(() => {
    if (Math.random() < 0.6) {
        createMeteor();
    }
}, 2200);

// --- Stars background ---
const canvas = document.getElementById("stars-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let shootingStars = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function createStars(count = 150) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.1 + 0.2,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.05 + 0.01,
                twinkleOffset: Math.random() * 100,
                angle: Math.random() * Math.PI * 2,
            });
        }
    }

    function createShootingStar() {
        shootingStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.5,
            length: Math.random() * 80 + 100,
            speed: Math.random() * 8 + 16,
            angle: Math.PI / 4,
            life: 0,
            maxLife: 90,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Stars
        stars.forEach((star) => {
            star.opacity += (Math.random() - 0.5) * 0.02;
            star.opacity = Math.min(Math.max(star.opacity, 0.2), 0.9);
            star.x += Math.cos(star.angle) * 0.02;
            star.y += Math.sin(star.angle) * 0.02;
            if (star.x > canvas.width) star.x = 0;
            if (star.x < 0) star.x = canvas.width;
            if (star.y > canvas.height) star.y = 0;
            if (star.y < 0) star.y = canvas.height;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });

        // Shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            const dx = Math.cos(s.angle) * s.length;
            const dy = Math.sin(s.angle) * s.length;

            const grad = ctx.createLinearGradient(s.x, s.y, s.x + dx, s.y + dy);
            grad.addColorStop(0, "rgba(255,255,255,1)");
            grad.addColorStop(1, "rgba(255,255,255,0)");

            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x + dx, s.y + dy);
            ctx.stroke();

            // glow
            ctx.beginPath();
            const glowRadius = 20;
            const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
            glow.addColorStop(0, "rgba(67, 139, 255, 0.2)");
            glow.addColorStop(1, "rgba(67, 139, 255, 0)");
            ctx.fillStyle = glow;
            ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.life++;

            if (s.life > s.maxLife) {
                shootingStars.splice(i, 1);
            }
        }

        if (Math.random() < 0.005) {
            createShootingStar();
        }

        requestAnimationFrame(draw);
    }

    createStars();
    draw();
}

// --- Signup form demo submission ---
// --- Real signup submission ---
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Signup successful! ID: " + (result.id || ''));
                window.location.href = "dashboard.html"; // change path if needed
            } else {
                alert("❌ Error: " + (result.detail || 'Signup failed'));
            }
        } catch (err) {
            console.error("Signup error", err);
            alert("⚠️ Could not reach server.");
        }
    });
}

// --- Login form ---
document.getElementById('loginForm').onsubmit = async function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('loginError').innerText = '';
        await checkUserStatus();
    } else {
        const data = await res.json();
        document.getElementById('loginError').innerText = data.detail || 'Login failed.';
    }
};

// Login logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) throw new Error('Login failed');
            // Optionally hide modal here if using one
            await checkUserStatus();
        } catch (err) {
            alert('Login error: ' + err.message);
        }
    });
}

// --- Logout button ---
document.getElementById('logoutBtn').onclick = async function (e) {
    e.preventDefault();
    await fetch('http://127.0.0.1:8000/logout', { method: 'POST' });
    window.location.reload();
};

// Logout logic
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = async function (e) {
        e.preventDefault();
        await fetch('/logout', { method: 'POST' });
        window.location.reload();
    };
}

// --- Check if user is logged in ---
async function checkUserStatus() {
    try {
        const res = await fetch('/me');
        if (!res.ok) throw new Error('Not logged in');
        const data = await res.json();

        const navStatus = document.getElementById('nav-user-status');
        const logoutBtn = document.getElementById('logoutBtn');

        if (data.logged_in) {
            const username = data.email.split('@')[0];
            if (navStatus) navStatus.innerHTML = `<span style='font-size:13px;'>👤 ${username}</span>`;
            if (logoutBtn) logoutBtn.style.display = '';
        } else {
            if (navStatus) navStatus.innerHTML = '';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    } catch {
        const navStatus = document.getElementById('nav-user-status');
        const logoutBtn = document.getElementById('logoutBtn');
        if (navStatus) navStatus.innerHTML = '';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}
checkUserStatus();
// Session status and navbar update
async function checkUserStatus() {
    try {
        const res = await fetch('/me');
        if (!res.ok) throw new Error('Not logged in');
        const data = await res.json();
        const navStatus = document.getElementById('nav-user-status');
        const logoutBtn = document.getElementById('logoutBtn');
        if (data.logged_in) {
            let username = data.email.split('@')[0];
            if (navStatus) navStatus.innerHTML = `<span style='font-size:13px;'>👤 ${username}</span>`;
            if (logoutBtn) logoutBtn.style.display = '';
        } else {
            if (navStatus) navStatus.innerHTML = '';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    } catch {
        // Not logged in
        const navStatus = document.getElementById('nav-user-status');
        const logoutBtn = document.getElementById('logoutBtn');
        if (navStatus) navStatus.innerHTML = '';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// --- Login modal open/close ---
document.getElementById('showLogin').onclick = function (e) {
    e.preventDefault();
    document.getElementById('loginModal').style.display = 'flex';
};
document.getElementById('closeLogin').onclick = function () {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginError').innerText = '';
};

// --- Google OAuth login ---
function handleCredentialResponse(response) {
    const token = response.credential;

    fetch('/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Welcome, " + data.email + "!");
                window.location.href = "/dashboard.html";
            } else {
                alert("Login failed: " + data.detail);
            }
        })
        .catch(error => {
            console.error("Login error", error);
            alert("Something went wrong!");
        });
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "780355441104-q8518j7nhs6buliivjitgn7jk67t9jalc.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    const googleBtn = document.getElementById("google-signin-btn");
    if (googleBtn) {
        google.accounts.id.renderButton(googleBtn, {
            theme: "filled_black",
            size: "large",
            shape: "pill",
            logo_alignment: "left",
            width: 360
        });
    }
};

