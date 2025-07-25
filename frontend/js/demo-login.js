/**
 * Demo login functionality for development
 * This helps test UI elements that require authentication
 * without needing a working backend
 */

document.addEventListener('DOMContentLoaded', function () {
    // Check if we already have demo controls
    if (document.getElementById('demo-controls')) return;

    // Only show in development environments
    const isDev = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';

    if (!isDev) return;

    // Create demo login controls
    const demoControls = document.createElement('div');
    demoControls.id = 'demo-controls';
    demoControls.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    padding: 10px;
    border-radius: 5px;
    z-index: 9999;
    font-size: 12px;
    color: white;
  `;

    const isLoggedIn = localStorage.getItem('demo_logged_in') === 'true';

    demoControls.innerHTML = `
    <p style="margin:0 0 5px 0;font-weight:bold;">Development Controls</p>
    ${isLoggedIn ?
            `<button id="demo-logout" style="background:#f55;color:white;border:0;padding:5px 10px;border-radius:3px;cursor:pointer;">Demo Logout</button>` :
            `<button id="demo-login" style="background:#7fd0ff;color:black;border:0;padding:5px 10px;border-radius:3px;cursor:pointer;">Demo Login</button>`
        }
  `;

    document.body.appendChild(demoControls);

    // Add event listeners
    if (isLoggedIn) {
        document.getElementById('demo-logout').addEventListener('click', function () {
            localStorage.removeItem('demo_logged_in');
            localStorage.removeItem('demo_email');
            window.location.reload();
        });
    } else {
        document.getElementById('demo-login').addEventListener('click', function () {
            localStorage.setItem('demo_logged_in', 'true');
            localStorage.setItem('demo_email', 'demo@example.com');
            window.location.reload();
        });
    }
});
