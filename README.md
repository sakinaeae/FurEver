# FurEver Friends — Pet Adoption Platform

A full-stack pet adoption application featuring a **React + Tailwind CSS** frontend, a **Node.js/Express.js** backend, and a **JSON-based** data layer for prototype persistence.

---

## 🌟 Architecture Overview

1.  **Frontend (React 18 + Vite + Tailwind CSS)**:
    -   Interactive pet catalog with category filtering, search, and detailed pet profile modals.
    -   Multi-step adoption application with real-time field validation.
    -   Applications tracker with browser `localStorage` persistence.

2.  **API Gateway (`server.ts` - Express + TypeScript)**:
    -   Serves the frontend single-page application.
    -   Handles API routes for pet catalog, user authentication, application submissions, and managing likes.
    -   Interacts directly with the `/database/` JSON files for data persistence.

3.  **Data Layer (`/database/`)**:
    -   JSON files (`pets.json`, `users.json`, `applications.json`, `likes.json`) serve as the initial data source and prototype storage.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

```bash
npm run dev
```

The application will start on:
👉 **`http://localhost:3000`**

---

## 📂 Project Structure

```
├── server.ts                  # Express API gateway & Vite dev middleware
├── package.json               # Node.js dependencies and scripts
├── database/                  # JSON data files for persistence
│   ├── pets.json
│   ├── users.json
│   ├── applications.json
│   └── likes.json
├── src/
│   ├── App.tsx                # Main React layout
│   ├── components/            # Reusable UI components
│   ├── backend/
│   │   ├── types.ts           # Shared TypeScript interfaces
│   │   ├── db.ts              # Database helper functions
│   │   └── eligibility.ts     # Eligibility logic
│   └── main.tsx               # Frontend entry point
```

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the full-stack development server on port 3000 |
| `npm run build` | Builds the React frontend and bundles the Express server |
| `npm run start` | Runs the compiled production server (`dist/server.cjs`) |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
