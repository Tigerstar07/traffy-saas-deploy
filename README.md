# Traffy SaaS System

## Starting the Server

### Prerequisites
- Python 3.7 or higher
- Virtual environment (venv)

### Backend Server Setup

1. Open a command prompt and navigate to the project directory:
   ```
   cd c:\Users\rober\Desktop\saas-system
   ```

2. Activate the virtual environment:
   ```
   venv\Scripts\activate
   ```

3. Install required dependencies (if not already installed):
   ```
   pip install fastapi uvicorn sqlalchemy pyjwt passlib python-multipart
   ```

4. Navigate to the backend directory:
   ```
   cd backend
   ```

5. Start the server:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. The server should start and display:
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
   ```

7. You can now access:
   - API documentation: http://localhost:8000/docs
   - Frontend: Open the HTML files directly or set up a simple HTTP server

### Troubleshooting

- If you get "module not found" errors, make sure you're in the correct directory and all dependencies are installed
- If port 8000 is in use, change to another port with `--port 8001`
- For network errors, check your firewall settings

### Development Mode

For frontend development without a backend:
1. Open HTML files directly in your browser
2. Use the demo login controls that appear in development mode

## Authentication: Sessions vs JWT

- **Session-based authentication** (current):  
  - Stores session state on the server, sends a session cookie to the client.
  - Allows instant logout and session revocation.
  - Good for small deployments and web clients.
  - Consumes server memory and can add latency when scaling horizontally (multiple servers).
- **JWT-based authentication** (recommended for scaling):  
  - Stores authentication data in a signed token (JWT) sent to the client.
  - Server does not need to store session state (stateless).
  - Scales well for distributed/microservice/mobile architectures.
  - Revocation is more complex (tokens are valid until expiry unless you implement a blacklist).

**If you plan to scale out or support mobile clients, consider switching to JWT authentication.**

### How to switch to JWT authentication

1. **Issue JWTs on login**:  
   On successful login, generate a JWT (using a library like PyJWT) and return it to the client (usually in an HTTP-only cookie or Authorization header).
2. **Stateless authentication**:  
   On each request, the client sends the JWT. The backend verifies the token signature and extracts user info from the payload.
   For example, with HTTP-only cookies, the JWT is sent automatically; with Authorization headers, use:
   ```sh
   curl -H "Authorization: Bearer <your-jwt-token>" http://localhost:8000/me
   ```
   The backend should decode and validate the JWT on every protected endpoint.
3. **Revocation**:  
   JWTs are valid until expiry. To revoke early, you must implement a token blacklist or use short-lived tokens with refresh tokens.
4. **Scaling**:  
   No server-side session storage is needed, so you can scale horizontally without session replication.

> For small projects or where instant logout is required, sessions are fine.  
> For distributed, mobile, or large-scale deployments, JWTs are recommended.

## Testing the Auth Flow

### Signup

```sh
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"yourlongpassphrase"}' \
  http://localhost:8000/signup
```
Should return:
```json
{"id": "...", "message": "Signup successful"}
```

### Login

```sh
curl -i -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"yourlongpassphrase"}' \
  http://localhost:8000/login
```
On success, the response includes a `Set-Cookie` header with the session token (for session-based) or a JWT (for JWT-based).

### Check User

```sh
curl -b "session=...cookie value..." http://localhost:8000/me
```
Should return:
```json
{"logged_in": true, "email": "test@example.com"}
```
Or, for JWT:
```sh
curl -H "Authorization: Bearer <your-jwt-token>" http://localhost:8000/me
```

### Logout

```sh
curl -b "session=...cookie value..." -X POST http://localhost:8000/logout
```
After logout, `/me` should return:
```json
{"logged_in": false}
```

## Security Recommendations

- Use strong passphrases.
- Always serve over HTTPS in production.
- Implement rate limiting.
- Consider JWT or passkeys for distributed/mobile support.
- Use secure, HTTP-only cookies for tokens.
- Rotate secrets regularly.
