# SecureBank

A full-stack secure banking application with an Employee International Payments Portal, built using React, TypeScript, and Vite for the frontend, with Express, MongoDB, and TypeScript powering the backend. This project demonstrates enterprise-level security practices and serves as a Portfolio of Evidence (POE) for secure application development.

## Implementation Requirements

### Security Implementation
- ✅ All traffic served over SSL/HTTPS
- ✅ Strict password security with bcrypt hashing and salting
- ✅ Comprehensive input validation using RegEx patterns
- ✅ Protection against common web attacks:
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Cross-Site Request Forgery (CSRF)
  - Man-in-the-Middle (MITM)
  - Brute Force Attacks
  - Session Hijacking

### Quality Assurance
- ✅ SonarQube integration via Circle CI pipeline
  - Code smell detection
  - Security hotspot analysis
  - Continuous code quality monitoring

### Access Control
- ✅ Role-Based Access Control (RBAC)
- ✅ Administrative user management (no self-registration)
- ✅ Secure employee portal for international payments

## Features

### User Features
- **User Registration & Login:** 
  - Secure authentication with bcrypt password hashing
  - JWT-based authentication with refresh tokens
  - CSRF protection using double-submit cookie pattern
  
- **Beneficiary Management:**
  - Add and manage local bank beneficiaries
  - Support for international SWIFT beneficiaries
  - Real-time beneficiary validation
  
- **Transaction Processing:**
  - Create and process SWIFT transactions
  - Real-time transaction status tracking
  - Transaction history and reporting
  
- **Dashboard Interface:**
  - User account summary and balance
  - Recent transaction history
  - Quick transfer options
  - Analytics and spending patterns

### Staff Features
- **Employee Portal:**
  - International transaction review queue
  - Transaction approval workflow
  - Staff activity logging

### Security Features
- **Network Security:**
  - HTTPS-only communication
  - Strict CORS policy
  - Rate limiting on sensitive endpoints
  
- **Application Security:**
  - Helmet security headers
  - Input validation and sanitization
  - CSRF protection
  - JWT with short-lived access tokens
  - Secure password policies
  - Request throttling
  
- **Infrastructure:**
  - MongoDB with secure connection
  - Environment-based configuration
  - Secure session management

## Project Structure

```
SecureBank/
  backend/      # Express + MongoDB API
    src/
      models/       # Database models (User, Beneficiary, Transaction)
      routes/       # API route handlers
      services/     # Business logic and auth services
      schemas/      # Request validation schemas
      utils/        # Helper functions and utilities
      config/       # Configuration and environment setup
      middlewares/  # Express middlewares (auth, CSRF, rate limiting)
    certs/         # SSL certificates for HTTPS
    .env           # Environment variables
  frontend/        # React + Vite client
    src/
      components/   # React components organized by feature
        AddBeneficiary/
        Dashboard/
        Login/
        Register/
        Staff/
        Transaction/
        Welcome/
      pages/        # Page components
      routes/       # Routing configuration
      css/         # Modular CSS styles
      lib/         # API client and utilities
    public/
    index.html
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB Atlas or local MongoDB instance

### Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/SecureBank-main.git
   cd SecureBank-main
   ```

2. **Install dependencies:**
   ```sh
   npm run install:all
   ```

3. **Configure environment variables:**
   - Copy and edit [`backend/.env`](backend/.env) with your MongoDB URI and secrets
   - Required environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Secret for JWT token signing
     - `REFRESH_TOKEN_SECRET`: Secret for refresh token signing
     - `CSRF_SECRET`: Secret for CSRF token generation
     - `NODE_ENV`: Set to 'development' or 'production'

4. **SSL Certificates:**
   - Place your SSL cert and key in [`backend/certs/`](backend/certs/) as `certificate.pem` and `privatekey.pem`
   - For development, you can generate self-signed certificates using OpenSSL:
     ```sh
     openssl req -x509 -newkey rsa:4096 -keyout backend/certs/privatekey.pem -out backend/certs/certificate.pem -days 365 -nodes
     ```

### Running in Development

Start both frontend and backend servers:

```sh
npm run dev
```

- Frontend: [https://localhost:5173](https://localhost:5173)
- Backend: [https://localhost:8443](https://localhost:8443)

### Building for Production

```sh
cd backend
npm run build
cd ../frontend
npm run build
```

## API Overview

### Authentication Routes (Admin Only)
- POST `/api/auth/create-user` - Create new user account (no self-registration)
- POST `/api/auth/login` - User login with secure password validation
- GET `/api/auth/csrf` - Get CSRF token for secure form submission
- POST `/api/auth/refresh` - Secure token refresh with rotation
- POST `/api/auth/logout` - User logout with token invalidation

### Beneficiary Management
- GET `/api/beneficiaries` - List user's beneficiaries
- POST `/api/beneficiaries` - Add new beneficiary
- DELETE `/api/beneficiaries/:id` - Remove beneficiary

### Transactions
- GET `/api/tx` - List user's transactions
- POST `/api/tx` - Create new transaction
- GET `/api/tx/:id` - Get transaction details

### User Management
- GET `/api/user/me` - Get current user info
- PUT `/api/user/me` - Update user profile

### Staff Portal
- GET `/api/admin/employees` - List employees (admin only)
- GET `/api/employee/portal` - Access employee portal
- GET `/api/employee/portal/intl-queue` - View international transactions queue

See backend route files in `backend/src/routes/` for complete API documentation.

## Security Implementation Details

### Authentication & Authorization
- Administrative control over user creation (no self-registration)
- Argon2id password hashing with configurable parameters (preferred for enhanced security)
- JWT-based authentication with secure refresh token rotation (access + refresh flow)
- Role-Based Access Control (RBAC) implementation
- Session management with secure cookie configuration

### Input Validation & Sanitization
- Comprehensive RegEx pattern validation for all inputs
- Zod schema validation integrated with RegEx whitelists for strict request validation and sanitization
- Strict type checking with TypeScript
- Input sanitization to prevent XSS attacks
- Validation schemas for all API requests

### Network Security
- HTTPS-only communication enforced
- SSL/TLS configuration with secure ciphers
- Strict CORS policy implementation
- Rate limiting and request throttling
- Secure headers configuration using Helmet

### CSRF Protection
- Double-submit cookie pattern implementation
- CSRF token validation for all state-changing requests
- Secure cookie attributes (HttpOnly, Secure, SameSite)

### Database Security
- MongoDB connection with TLS
- Parameterized queries to prevent injection
- Schema-level validation
- Secure credential storage

### CI/CD Security
- SonarQube integration for code analysis
- Security hotspot detection
- Code smell identification
- Continuous security monitoring via Circle CI pipeline

### Additional Security Measures

- Authentication
  - JWT access tokens with a secure refresh-token rotation flow to prevent unauthorized access and replay attacks.

- Role-Based Access Control (RBAC)
  - Routes and actions restricted by user role (e.g., user, staff, admin) to enforce least privilege.

- Password Storage
  - Argon2id hashing for secure password storage with configurable memory, iterations and parallelism parameters (preferred over bcrypt where available).

- CSRF Protection
  - Double-submit cookie pattern implemented, plus server-side CSRF middleware that validates tokens for all state-changing endpoints.

- Validation
  - Zod schema validation combined with reinforced RegEx whitelists to strictly validate and sanitize all incoming data.

- CORS
  - Strict CORS policy with whitelisted origins only; allowed methods and headers explicitly configured to block malicious external sites.

- Cookies
  - Session and token cookies set with HttpOnly, Secure and SameSite attributes to prevent JavaScript access and mitigate CSRF.

- Rate Limiting
  - `authLimiter` applied to authentication endpoints to throttle repeated attempts and reduce brute-force risk.

- Session Control
  - DB-backed sessions with a `disabled`/revoked flag for each account allowing immediate deactivation and server-side session invalidation.

- Error Handling
  - Sanitized error responses returned to clients; full error details and stack traces are logged server-side only to avoid leaking internals.

- Audit Logging
  - Security-relevant events (logins, role changes, transaction approvals, session revocations) are logged for audit and review.

## Development and Testing

### Quality Assurance
- SonarQube analysis integrated into CI/CD pipeline
- Code quality metrics monitoring
- Security vulnerability scanning
- Code smell detection and elimination

### Video Documentation
- Project demonstration video available
- Showcases working functionality
- Demonstrates security features
- Recorded using OBS Studio
- Available as unlisted YouTube video

## References

Anthropic. (2023) 'Claude AI', Anthropic [Online]. Available at: https://claude.ai (Accessed: 7 November 2025).

GeeksforGeeks. (2023) 'TypeScript Tutorial', GeeksforGeeks [Online]. Available at: https://www.geeksforgeeks.org/typescript/typescript-tutorial (Accessed: 7 November 2025).

GitHub. (2023) 'GitHub Copilot', GitHub [Online]. Available at: https://github.com/features/copilot (Accessed: 7 November 2025).

Microsoft. (2023) 'TypeScript Documentation', TypeScript [Online]. Available at: https://www.typescriptlang.org (Accessed: 7 November 2025).

OpenAI. (2023) 'ChatGPT', OpenAI [Online]. Available at: https://chat.openai.com (Accessed: 7 November 2025).

Programming with Mosh. (2023) 'TypeScript Tutorial for Beginners' [Video], YouTube. Available at: https://www.youtube.com/watch?v=d56mG7DezGs (Accessed: 7 November 2025).

W3Schools. (2023) 'TypeScript Tutorial', W3Schools [Online]. Available at: https://www.w3schools.com/typescript (Accessed: 7 November 2025).

## License

MIT

---

**Note: This project was developed as a Portfolio of Evidence (POE) demonstrating secure application development practices and enterprise-level security implementations.**

---

**For more details, see the source code in [`backend/`](backend) and [`frontend/`](frontend).**
