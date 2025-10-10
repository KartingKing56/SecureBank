# SecureBank

A full-stack secure banking demo application built with React, TypeScript, Vite (frontend), and Express, MongoDB, TypeScript (backend). Features include user registration, login, beneficiary management, and SWIFT transaction processing with strong security practices.

## Features

- **User Registration & Login:** Secure authentication with password hashing, JWT, and CSRF protection.
- **Beneficiary Management:** Add local and foreign beneficiaries with validation.
- **Transactions:** Create and review SWIFT transactions.
- **Dashboard:** View user info, recent transactions, and analytics.
- **Security:** HTTPS, CORS, helmet, rate limiting, input sanitization, and CSRF double-submit cookie protection.

## Project Structure

```
SecureBank-main/
  backend/      # Express + MongoDB API
    src/
      models/
      routes/
      services/
      schemas/
      utils/
      config/
      middlewares/
    certs/      # SSL certificates for HTTPS
    .env        # Environment variables
  frontend/     # React + Vite client
    src/
      components/
      pages/
      routes/
      css/
      lib/
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
   - Copy and edit [`backend/.env`](backend/.env) with your MongoDB URI and secrets.

4. **SSL Certificates:**
   - Place your SSL cert and key in [`backend/certs/`](backend/certs/) as `certificate.pem` and `privatekey.pem`.

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

- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/csrf`, `/api/auth/refresh`, `/api/auth/logout`
- **Beneficiaries:** `/api/beneficiaries`
- **Transactions:** `/api/tx`
- **User Info:** `/api/user/me`

See backend route files for details.

## Security Notes

- Uses HTTPS by default.
- JWT for authentication, refresh tokens in HTTP-only cookies.
- CSRF protection via double-submit cookie.
- Input validation and sanitization throughout.
- Rate limiting on sensitive endpoints.

## License

MIT

---

**For more details, see the source code in [`backend/`](backend) and [`frontend/`](frontend).**
