# FurEver Friends — Pet Adoption Platform

A full-stack pet adoption application featuring a **React + Tailwind CSS** frontend, an **Express.js** gateway server, and a high-performance **C++ backend** that logs and persists adoption applications as JSON files in the `FormDataJson/` directory.

---

## 🌟 Architecture Overview

1. **Frontend (React 18 + Vite + Tailwind CSS)**:
   - Interactive pet catalog with category filtering, personality tags, search, and detailed pet profile modals.
   - Multi-step adoption application with real-time field validation.
   - Applications tracker / Status screen with client-side persistence (`localStorage`).

2. **API Gateway (`server.ts` - Express + TypeScript)**:
   - Serves the frontend single-page application.
   - Handles `POST /api/adoption-form` and pipes incoming submission payloads to the compiled C++ binary.
   - Provides `GET /api/form-data-json` to inspect and query stored JSON adoption records.

3. **Backend Service (`backend.cpp`)**:
   - Native C++17 binary (`backend_handler`) handling form ingestion and validation.
   - Creates the `FormDataJson/` directory if it does not exist.
   - Writes timestamped JSON documents (e.g. `FormDataJson/FUR-2026-XXXX_<timestamp>.json`).

---

## 📋 Prerequisites

Before running the application, make sure you have installed:

- **Node.js** (v18.0.0 or higher) & **npm** — [Download Node.js](https://nodejs.org/)
- **C++ Compiler** (supporting C++17 or later):
  - **Linux (Ubuntu/Debian)**: `sudo apt update && sudo apt install build-essential g++`
  - **macOS**: `xcode-select --install` (Apple Clang / g++)
  - **Windows**: [MinGW-w64](https://www.mingw-w64.org/), MSVC (Visual Studio C++ Build Tools), or WSL2

---

## 🚀 Quick Start Guide

### 1. Clone or Extract the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Compile the C++ Backend

Compile `backend.cpp` into an executable binary:

- **macOS / Linux / WSL**:
  ```bash
  npm run build:cpp
  # or manually:
  g++ -O2 -std=c++17 backend.cpp -o backend_handler
  ```

- **Windows (Command Prompt / PowerShell with MinGW `g++`)**:
  ```bash
  g++ -O2 -std=c++17 backend.cpp -o backend_handler.exe
  ```

*(Note: If you run without compiling first, the Node.js server includes an automated fallback that will still write to `FormDataJson/`, but compiling the binary enables direct native C++ execution).*

### 4. Start the Application

```bash
npm run dev
```

The application will start on:
👉 **`http://localhost:3000`**

---

## 📂 Project Structure

```
├── backend.cpp                # Native C++ adoption form persistence handler
├── server.ts                  # Express API gateway & Vite dev middleware
├── package.json               # Node.js dependencies and scripts
├── FormDataJson/              # Target folder for stored adoption JSON files
│   └── .gitkeep               # Preserves the folder in version control
├── src/
│   ├── App.tsx                # Main React layout and application shell
│   ├── components/
│   │   ├── AdoptionFormModal.tsx  # Multi-step adoption application form
│   │   ├── MyApplicationsView.tsx # Application status tracker
│   │   ├── PetCard.tsx            # Pet preview cards
│   │   ├── PetDetailModal.tsx     # Detailed pet view modal
│   │   ├── FilterBar.tsx          # Search & category filters
│   │   └── ...
│   ├── data/
│   │   └── petsData.ts        # Initial shelter pets data catalog
│   ├── types.ts               # Shared TypeScript interfaces & models
│   └── main.tsx               # Frontend entry point
└── dist/                      # Production build output
```

---

## 🧪 Testing Adoption Submissions

1. Open `http://localhost:3000` in your browser.
2. Select any pet and click **"Adopt Me"** to open the adoption modal.
3. Fill in the required applicant details and submit the application.
4. Check the **`FormDataJson/`** folder in your project root — a new `.json` file will be generated with all applicant details and timestamp metadata.
5. You can also view all submitted JSON files via the API:
   - `http://localhost:3000/api/form-data-json`

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the full-stack development server on port 3000 |
| `npm run build:cpp` | Compiles `backend.cpp` into `backend_handler` |
| `npm run build` | Builds the React frontend and bundles the Express server |
| `npm run start` | Runs the compiled production server (`dist/server.cjs`) |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Cleans build artifacts and compiled binaries |

---

## 🔒 Git & Version Control Note

- **Never commit compiled binaries** (`backend_handler`, `backend_handler.exe`, `*.o`) to Git.
- **Never commit user submission files** (`FormDataJson/*.json`) to protect applicant privacy.
- These rules are pre-configured in the project's `.gitignore`.
