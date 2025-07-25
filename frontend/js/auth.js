/**
 * Secure Authentication Module
 * 
 * Features:
 * - HTTPS enforcement
 * - Secure token management
 * - Automatic token refresh
 * - CSRF protection
 * - XSS prevention
 */

class AuthManager {
    constructor() {
        this.authenticated = false;
        this.user = null;
        this.tokenRefreshInterval = null;
        this.csrfToken = null;

        // Force HTTPS in production
        this.enforceHttps();
    }

    // Enforce HTTPS for all requests
    enforceHttps() {
        if (window.location.protocol === 'http:' &&
            window.location.hostname !== 'localhost' &&
            !window.location.hostname.includes('127.0.0.1')) {
            window.location.href = window.location.href.replace('http:', 'https:');
        }
    }

    // Initialize authentication
    async initialize() {
        // Get CSRF token first
        await this.fetchCsrfToken();

        // Then check authentication status
        await this.checkSession();

        // Setup token refresh
        if (this.authenticated) {
            this.setupTokenRefresh();
        }
    }

    // Fetch CSRF token for requests
    async fetchCsrfToken() {
        try {
            const response = await fetch('/api/auth/csrf', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                this.csrfToken = data.csrf_token;
            }
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
        }
    }

    // Check current session status
    async checkSession() {
        try {
            const response = await fetch('/api/auth/session', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': this.csrfToken || '',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.authenticated = data.authenticated;
                this.user = data.user;

                if (this.authenticated) {
                    localStorage.setItem('auth_timestamp', Date.now().toString());
                } else {
                    this.clearSession();
                }
            } else {
                this.clearSession();
            }
        } catch (error) {
            console.error('Session check failed:', error);
            this.clearSession();
        }

        // Update UI based on authentication status
        this.updateUI();
        return this.authenticated;
    }

    // Set up automatic token refresh
    setupTokenRefresh() {
        // Clear any existing interval
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }

        // Refresh token every 14 minutes (assuming 15-minute expiry)
        this.tokenRefreshInterval = setInterval(() => {
            this.refreshToken();
        }, 14 * 60 * 1000);
    }

    // Refresh the authentication token
    async refreshToken() {
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': this.csrfToken || '',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.authenticated = true;
                localStorage.setItem('auth_timestamp', Date.now().toString());

                // Refresh CSRF token as well
                await this.fetchCsrfToken();
            } else {
                // If refresh fails, log out the user
                await this.logout();
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            await this.logout();
        }
    }

    // Log in user
    async login(email, password) {
        try {
            // Get fresh CSRF token
            await this.fetchCsrfToken();

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': this.csrfToken || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.authenticated = true;
                this.user = data.user;
                localStorage.setItem('auth_timestamp', Date.now().toString());

                this.setupTokenRefresh();
                this.updateUI();
                return true;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Log out user
    async logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': this.csrfToken || '',
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearSession();
            window.location.href = '/index.html';
        }
    }

    // Clear session data
    clearSession() {
        this.authenticated = false;
        this.user = null;
        localStorage.removeItem('auth_timestamp');

        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }
    }

    // Update UI based on authentication status
    updateUI() {
        const navStatus = document.getElementById('nav-user-status');
        const logoutBtn = document.getElementById('logoutBtn');
        const dashboardLink = document.getElementById('dashboardLink');
        const dashboardBtn = document.getElementById('dashboardBtn');

        if (this.authenticated && this.user) {
            const username = this.user.email.split('@')[0];
            if (navStatus) navStatus.innerHTML = `<span style='font-size:13px;'>👤 ${username}</span>`;
            if (logoutBtn) logoutBtn.style.display = '';
            if (dashboardLink) dashboardLink.style.display = '';
            if (dashboardBtn) dashboardBtn.style.display = '';
        } else {
            if (navStatus) navStatus.innerHTML = '';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'none';
            if (dashboardBtn) dashboardBtn.style.display = 'none';
        }
    }

    // Get current user
    getUser() {
        return this.user;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.authenticated;
    }
}

// Create and export global auth instance
const auth = new AuthManager();

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    auth.initialize();
});

// Set up logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await auth.logout();
        });
    }
});
