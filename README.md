# BuddyEnglish Frontend 🦉

> AI-powered English learning companion for kids — React + Vite SPA

## Tech Stack

- **React 19** + **Vite 8**
- **React Router DOM v7** (client-side routing)
- **Zustand** (global state management)
- **Axios** (HTTP client with interceptors)
- **Vanilla CSS** (custom design system — no Tailwind)

## Features

- 🔐 **JWT Authentication** (HTTP-only cookie, auto-handled by browser)
- 💬 **Chat with Buddy** — real-time AI conversation
- 📊 **Child Dashboard** — Level, XP bar, Coins, Streak stats
- 📖 **Vocabulary Toast** — highlights new words taught by Buddy
- 🎨 **Dark-mode glassmorphism UI** with smooth animations

## Project Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── pages/       # LoginPage, SignupPage
│   │   ├── services/    # authService (API calls)
│   │   └── store/       # authStore (Zustand)
│   └── home/
│       └── pages/       # HomePage (Dashboard + Chat)
├── router/
│   └── AppRouter.jsx    # Route definitions
└── shared/
    └── api/
        └── axiosClient.js  # Axios instance with base URL
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- BuddyEnglish Backend running on `localhost:8080`

### Install & Run

```bash
npm install
npm run dev
```

App runs at: **http://localhost:5173**

### Routes

| Path | Page | Auth Required |
|------|------|---------------|
| `/` | Redirect to `/home` | — |
| `/login` | Login page | No |
| `/register` | Signup page | No |
| `/home` | Dashboard + Chat | Yes (redirect to /login) |

## Backend Connection

The frontend connects to the backend via `axiosClient.js`:

```js
baseURL: 'http://localhost:8080/api'
withCredentials: true  // sends JWT cookie automatically
```

Make sure the backend has CORS configured for `http://localhost:5173`.
