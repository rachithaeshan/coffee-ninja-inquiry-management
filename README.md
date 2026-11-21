# Coffee Ninja — Customer Inquiry Management System

A full-stack web application that helps Coffee Ninja staff manage customer inquiries in one place instead of tracking them through chat messages and spreadsheets.

## Features

- Staff login using email and password.
- Secure password storage using bcrypt hashing.
- JWT-based authentication for protected API endpoints.
- Create new customer inquiries.
- View all customer inquiries.
- Search inquiries by customer name or subject.
- Filter inquiries by status.
- View individual inquiry details.
- Update inquiry status.
- Store inquiry information in PostgreSQL.

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT
- bcryptjs

### Database
- PostgreSQL

### Testing
- Vitest
- Supertest
- React Testing Library
- Testing Library User Event

## Project Structure

```text
CoffeeNinja/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   └── lib/
│   ├── .env.local
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   ├── .env
│   └── package.json
│
├── README.md
└── DECISIONS.md
```

## Requirements

Install the following before running the project:

- Node.js 22 or later
- npm
- PostgreSQL
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CoffeeNinja
```

### 2. Configure the database

Create a PostgreSQL database named:

```text
coffee_ninja
```

### 3. Configure the backend

Open the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/coffee_ninja?schema=public"
JWT_SECRET="YOUR_SECRET_KEY"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

Replace `YOUR_SECRET_KEY` with a long, randomly generated secret.

### 4. Run database migrations

Inside the backend folder, execute:

```bash
npx prisma migrate deploy
```

For a fresh development database where migrations have not yet been applied, you can instead use:

```bash
npx prisma migrate dev
```

### 5. Start the backend

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### 6. Configure the frontend

Open a second terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 7. Start the frontend

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

## Creating a Staff Account

The application provides an account registration API for creating an account.

Send a POST request to:

```text
http://localhost:5000/api/users
```

Example JSON body:

```json
{
  "name": "Staff Member",
  "email": "staff@example.com",
  "password": "Password123"
}
```

After creating the account, use the email and password on the login page.

## API Endpoints

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/users` | Create a staff account | No |
| POST | `/api/auth/login` | Staff login | No |
| GET | `/api/health` | Check backend status | No |
| GET | `/api/db-health` | Check database connection | No |
| POST | `/api/inquiries` | Create an inquiry | Required |
| GET | `/api/inquiries` | Retrieve inquiries | Required |
| GET | `/api/inquiries/:id` | Retrieve one inquiry | Required |
| PATCH | `/api/inquiries/:id/status` | Update inquiry status | Required |

### Inquiry Statuses

- `NEW`
- `IN_PROGRESS`
- `RESOLVED`

## Running Automated Tests

### Backend tests

```bash
cd backend
npm test
```

The backend test checks that an unauthenticated request to the inquiry API is rejected with HTTP 401.

### Frontend tests

```bash
cd frontend
npm test
```

The frontend test checks that a login error is displayed when authentication fails and that the login button becomes enabled again.

## Security

- Passwords are hashed using bcrypt before being stored.
- JWT tokens are used to protect inquiry endpoints.
- Inquiry creation uses the authenticated employee's ID as the creator.
- Invalid inquiry IDs and invalid status transitions are rejected by the backend.

**Note:** The account registration endpoint is currently public for assessment setup. It should be restricted to an authorized administrator or replaced with a controlled account-creation process before production use.

## AI Usage Disclosure

AI assistance was used during development to understand technical concepts, troubleshoot errors, review code, and help configure testing and documentation.

The submitted implementation was tested locally, and the developer reviewed and worked through the implementation.
