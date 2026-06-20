# Store Rating Platform

The app lets users sign up, browse stores registered on the platform, and
submit a rating (1–5) for any of them. There are three roles — System
Administrator, Normal User, and Store Owner — and what you can do depends
on which one you're logged in as.

## Tech stack

- Backend: Node.js + Express
- Database: MySQL, accessed through Sequelize
- Frontend: React (Vite) + React Router
- Auth: JWT, passwords hashed with bcrypt

## Features

**System Administrator**
- Dashboard with total users, total stores, total ratings
- Add new users with any role (normal user, store owner, or another admin)
- Add new stores, optionally assigning a store owner to them
- View and search all users and stores, with sorting on every column
- View full details of any user (store owners also show their store's average rating)

**Normal User**
- Sign up and log in
- Browse all stores, search by name or address
- See each store's overall rating and their own rating if they've left one
- Submit a rating, or change one they already submitted
- Update their password

**Store Owner**
- Log in and view their store's average rating
- See a list of everyone who's rated their store, with the rating value
- Update their password

## Project structure

```
backend/
  src/
    config/       Sequelize + MySQL connection
    models/       User, Store, Rating + their relationships
    controllers/  route logic, split by role
    routes/       route definitions
    middleware/    JWT auth check, role check, validation
    validators/   form rules (matches the spec's validation requirements)
    seed.js       creates a starter admin/owner/user account

frontend/
  src/
    pages/        one folder per role (admin, user, owner) plus auth pages
    components/   shared UI pieces (sidebar layout, star rating, etc.)
    context/      auth state
    api/          axios setup with the JWT attached automatically
```

## Running it locally

You'll need Node.js and MySQL installed.

**1. Create the database**

```sql
CREATE DATABASE store_ratings;
```

**2. Backend**

```
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your MySQL password and a JWT
secret, then:

```
npm run dev
```

The first time, also run the seed script in a second terminal to get a
working admin account:

```
npm run seed
```

This prints out a default admin login. Once you're logged in as admin you
can create whatever other users and stores you want through the UI — that's
the intended flow, since the brief specifies only admins can create store
owner and admin accounts (public signup is normal users only).

**3. Frontend**

```
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`, backend at `http://localhost:5000`.

## A few decisions worth explaining

The ratings table has a unique constraint on `(user_id, store_id)`. That's
what makes "submit a rating" and "change a rating" the same code path —
if a row already exists for that pairing it gets updated, otherwise it
gets inserted. No separate "edit rating" endpoint needed.

The brief doesn't say how a Store Owner account actually gets created in
the first place, only that they can log in and manage their store. I went
with: admin creates a user with the Store Owner role (same as any other
user), then optionally links that user to a store as its owner when
creating or editing the store.

## Validation rules

Matches the brief exactly:
- Name: 20–60 characters
- Address: max 400 characters
- Password: 8–16 characters, at least one uppercase letter, at least one special character
- Email: standard format

These are checked on both the frontend (so the user gets instant feedback)
and the backend (so the rules actually hold even if someone bypasses the UI).
