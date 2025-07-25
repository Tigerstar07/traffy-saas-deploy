/**
 * Secure Authentication System
 * 
 * Features:
 * - HTTPS/SSL enforcement
 * - Secure JWT tokens with rotation
 * - CSRF protection
 * - Secure HTTP-only cookies
 * - Rate limiting for security
 * - Password hashing with bcrypt
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const router = express.Router();

// Configuration (move to environment variables in production)
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString('hex');
const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';  // 7 days
const COOKIE_SECURE = process.env.NODE_ENV === 'production'; // Secure in production

// Middleware
router.use(cookieParser());
router.use(express.json());
router.use(helmet()); // Security headers

// Rate limiting to prevent brute force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: 'Too many login attempts, please try again later.'
});

// CSRF protection
const csrfTokens = new Map();

// Generate CSRF token
router.get('/csrf', (req, res) => {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    const sessionId = req.cookies.session_id || crypto.randomBytes(16).toString('hex');

    // Store token with expiry (1 hour)
    csrfTokens.set(sessionId, {
        token: csrfToken,
        expires: Date.now() + (60 * 60 * 1000)
    });

    // Set session cookie if not exists
    if (!req.cookies.session_id) {
        res.cookie('session_id', sessionId, {
            httpOnly: true,
            secure: COOKIE_SECURE,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
    }

    res.json({ csrf_token: csrfToken });
});

// Validate CSRF token
function validateCsrfToken(req, res, next) {
    const sessionId = req.cookies.session_id;
    const csrfToken = req.headers['x-csrf-token'];

    if (!sessionId || !csrfToken) {
        return res.status(403).json({ message: 'CSRF token missing' });
    }

    const storedCsrf = csrfTokens.get(sessionId);

    if (!storedCsrf || storedCsrf.token !== csrfToken || storedCsrf.expires < Date.now()) {
        return res.status(403).json({ message: 'Invalid or expired CSRF token' });
    }

    next();
}

// Generate tokens
function generateTokens(user) {
    // Create payload (don't include sensitive info)
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    // Create tokens
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    return { accessToken, refreshToken };
}

// Set secure cookies
function setTokenCookies(res, accessToken, refreshToken) {
    // Access token - shorter expiry
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Refresh token - longer expiry
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: 'strict',
        path: '/api/auth/refresh', // Only sent to refresh endpoint
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

// Verify access token
function verifyAccessToken(req, res, next) {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired access token' });
    }
}

// Login endpoint
router.post('/login', loginLimiter, validateCsrfToken, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user (implement your database logic)
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Store refresh token in database
        await storeRefreshToken(user.id, refreshToken);

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        // Return user data (excluding sensitive info)
        const userData = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        res.json({
            message: 'Login successful',
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get session info
router.get('/session', async (req, res) => {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return res.json({ authenticated: false });
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);

        // Return user data
        res.json({
            authenticated: true,
            user: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            }
        });
    } catch (error) {
        res.json({ authenticated: false });
    }
});

// Refresh token endpoint
router.post('/refresh', validateCsrfToken, async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        // Verify token is in database and not revoked
        const storedToken = await findRefreshToken(decoded.id, refreshToken);

        if (!storedToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Get user
        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Generate new tokens
        const tokens = generateTokens(user);

        // Update refresh token in database
        await updateRefreshToken(decoded.id, refreshToken, tokens.refreshToken);

        // Set new cookies
        setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

        res.json({ message: 'Token refreshed successfully' });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
});

// Logout endpoint
router.post('/logout', validateCsrfToken, async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (refreshToken) {
            // Revoke refresh token in database
            await revokeRefreshToken(refreshToken);
        }

        // Clear cookies
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.clearCookie('session_id');

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected route example
router.get('/protected', verifyAccessToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Database functions (implement these with your database)
async function findUserByEmail(email) {
    // Replace with actual database query
    return { id: 1, email, password: 'hashed_password', role: 'user' };
}

async function findUserById(id) {
    // Replace with actual database query
    return { id, email: 'user@example.com', role: 'user' };
}

async function storeRefreshToken(userId, token) {
    // Store in database
    console.log(`Storing refresh token for user ${userId}`);
}

async function findRefreshToken(userId, token) {
    // Find in database
    return true; // Return the token if found
}

async function updateRefreshToken(userId, oldToken, newToken) {
    // Update in database
    console.log(`Updating refresh token for user ${userId}`);
}

async function revokeRefreshToken(token) {
    // Remove from database or mark as revoked
    console.log('Revoking refresh token');
}

module.exports = router;
