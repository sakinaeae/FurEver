# FurEver Friends — Pet Adoption Platform

A full-stack pet adoption application featuring a **React 18 + Vite + Tailwind CSS** frontend, a **Node.js/Express.js** backend, and local data persistence.

---

## 🚀 Git & Vercel Deployment Guide

This project is configured and ready to be pushed to GitHub/Git and deployed seamlessly on **Vercel**.

### Pushing to GitHub / Git

```bash
# 1. Initialize Git (if not already initialized)
git init

# 2. Stage all files (respecting .gitignore)
git add .

# 3. Commit
git commit -m "feat: complete pet adoption platform with validation & vercel config"

# 4. Link your remote repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git branch -M main
git push -u origin main
```

### Deploying on Vercel

1. Log into [vercel.com](https://vercel.com) and click **"Add New..."** > **"Project"**.
2. Import your GitHub repository.
3. Vercel automatically detects the project using `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**. SPA client routing is pre-configured via `vercel.json` rewrites to prevent 404s on page refresh.

---

## 🛠️ Local Development & Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the full development server with Vite middleware on `http://localhost:3000` |
| `npm run build` | Builds the React frontend for production (`dist/`) and bundles the backend |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run preview` | Previews the compiled production build locally |

---

# 📋 Comprehensive Database & Business Validation Specification

Use this section as the **source of truth** when connecting or migrating to an external database (PostgreSQL, Supabase, MySQL, MongoDB, Firebase, etc.).

---

## 1. User Entity & Profile Constraints (`users`)

### Table / Document Schema:
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `VARCHAR(64)` | `PRIMARY KEY` | Unique user identifier (e.g. `user-1725580000000`) |
| `name` | `VARCHAR(100)` | `NOT NULL` | Applicant/Lister full name |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Normalized lowercase email |
| `password` | `VARCHAR(255)` | `NOT NULL` | User password (hash in database) |
| `phone` | `VARCHAR(10)` | `NOT NULL` | 10-digit phone number |
| `role` | `ENUM('adopter', 'Pet Lister')` | `NOT NULL` | Immutable account type |
| `housingType` | `ENUM(...)` | `NOT NULL` | Current housing situation |
| `petExperience` | `ENUM(...)` | `NOT NULL` | Animal care experience level |
| `createdAt` | `TIMESTAMP` | `DEFAULT NOW()` | Record creation timestamp |

### Important User Validations:
1. **Name**:
   - Minimum 2 characters, maximum 100 characters.
   - **Letters, spaces, hyphens, and apostrophes only** (Regex: `/^[a-zA-Z\s'-]+$/`).
   - **Strictly NO digits allowed** (`/\d/` must be rejected).
2. **Email**:
   - Must be valid standard email format (Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
   - Must be trimmed and stored in lowercase.
   - **Must be globally unique** in the database.
3. **Password**:
   - Minimum length: **4 characters**.
4. **Phone**:
   - Must be **exactly 10 digits** (Regex: `/^\d{10}$/`).
   - Non-digit characters must be stripped before validation.
5. **Role**:
   - Allowed values: `'adopter'` or `'Pet Lister'`.
   - **Role is immutable once created**: Users cannot switch their account role after registration.
6. **Housing Type**:
   - Allowed values:
     - `'Apartment'`
     - `'Townhouse'`
     - `'House with a Yard'`
     - `'Farm / Acreage'`
7. **Pet Experience**:
   - Allowed values:
     - `'Current pet owner'`
     - `'Previous pet owner'`
     - `'No experience'`
8. **Profile Edit Constraints (STRICT)**:
   - **In the user profile, users are ONLY permitted to edit `housingType` and `petExperience`.**
   - Personal credentials (`userId`, `name`, `email`, `phone`, `password`, `role`) are locked and **read-only** to protect the integrity of submitted applications, ownership records, and listing histories.

---

## 2. Role-Based Access Control (RBAC)

| Role | Allowed Actions | Strictly Prohibited Actions |
| :--- | :--- | :--- |
| **`adopter`** | • Browse & filter pets<br>• Like/save pets to favorites<br>• Submit adoption applications<br>• View application status tracker (`Status` tab)<br>• Withdraw/cancel own applications<br>• Edit housing type & pet experience in profile | 🚫 **CANNOT list pets** (List Pet buttons and modals are blocked)<br>🚫 Cannot re-apply to the same pet |
| **`Pet Lister`** | • Create & publish pet listings (`List Pet` modal)<br>• View own listed pets (`My Listed Pets` tab)<br>• Review incoming applications for own pets<br>• Update application statuses (Pending, Under Review, Approved, Adopted, Rejected)<br>• Delete/remove own pet listings<br>• Edit housing type & pet experience in profile | 🚫 **CANNOT fill or submit adoption applications** (Adoption buttons and forms are blocked) |
| **Visitor / Unauthenticated** | • Browse pet catalog & read pet profiles | 🚫 Cannot apply, list pets, save favorites, or view status without signing in |

---

## 3. Pet Entity Constraints (`pets`)

### Table / Document Schema:
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique pet ID (e.g. `pet-1725580000000`) |
| `petListerId` | `VARCHAR(64)` | `FOREIGN KEY (users.userId)` | ID of the lister who posted the pet |
| `name` | `VARCHAR(50)` | `NOT NULL` | Pet's name (letters only) |
| `animalType` | `ENUM(...)` | `NOT NULL` | `'Dog' \| 'Cat' \| 'Rabbit' \| 'Bird' \| 'Other'` |
| `breed` | `VARCHAR(100)` | `NOT NULL` | Specific breed name |
| `age` | `VARCHAR(20)` | `NOT NULL` | Age display (e.g. `"2 Years"`) |
| `ageCategory` | `ENUM(...)` | `NOT NULL` | `'Young' \| 'Adult' \| 'Senior'` |
| `gender` | `ENUM('Male', 'Female')` | `NOT NULL` | Pet biological gender |
| `weight` | `VARCHAR(20)` | `NOT NULL` | Pet weight (e.g. `"15 kg"`) |
| `location` | `VARCHAR(150)` | `NOT NULL` | Locality and city (e.g. `"Indiranagar, Bengaluru"`) |
| `description` | `TEXT` | `NOT NULL` | Story & behavior notes (**min 40 characters**) |
| `image` | `TEXT` | `NOT NULL` | Image URL or base64 data |
| `personality` | `TEXT[] / JSON` | `NOT NULL` | Up to 5 personality traits (e.g. `["Friendly", "Playful"]`) |
| `goodWith` | `TEXT[] / JSON` | `NOT NULL` | Compatibility tags (e.g. `["Families", "Kids"]`) |
| `medicalInfo` | `JSON` | `NOT NULL` | `{ vaccinated: boolean, spayedNeutered: boolean, microchipped: boolean, healthNotes: string }` |
| `activityLevel` | `VARCHAR(20)` | `DEFAULT 'Medium'` | `'Low' \| 'Medium' \| 'High'` |
| `adoptionFee` | `VARCHAR(20)` | `DEFAULT 'Free Adoption'` | Fee indicator |
| `shelterName` | `VARCHAR(100)` | `NOT NULL` | Shelter or foster caregiver name |
| `status` | `ENUM(...)` | `DEFAULT 'AVAILABLE'` | `'AVAILABLE' \| 'PENDING' \| 'ADOPTED' \| 'CURRENTLY UNAVAILABLE'` |
| `dateAdded` | `DATE` | `DEFAULT CURRENT_DATE` | Date listed |

### Important Pet Listing Validations:
1. **Pet Name**: Letters and spaces only. **No digits allowed**.
2. **Animal Type**: Must be one of `'Dog'`, `'Cat'`, `'Rabbit'`, `'Bird'`, `'Other'`.
3. **Breed**: Required. If `'Other'` is selected, a non-empty custom breed string is mandatory.
4. **Age**: Valid integer between `0` and `100`.
   - Age Category is automatically computed:
     - Age `< 2 years`: `'Young'`
     - Age `2 to 7 years`: `'Adult'`
     - Age `>= 8 years`: `'Senior'`
5. **Weight**: Valid 1 or 2-digit integer between `1` and `99` kg.
6. **Description**: **Must be at least 40 characters long**.
7. **Image**: Valid image file (PNG, JPG, WEBP), max size **10MB**.
8. **Personality Traits**: Array of 1 to 5 personality strings.
9. **Lister Contact Info**:
   - Lister Name: Letters only, no numbers allowed.
   - Lister Phone: Exactly 10 digits.
   - Lister Email: Valid email format.

---

## 4. Adoption Application & Eligibility Engine (`applications`)

### Table / Document Schema:
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Tracking ID (e.g. `FUR-2026-4821`) |
| `petId` | `VARCHAR(64)` | `FOREIGN KEY (pets.id)` | Pet being applied for |
| `userId` | `VARCHAR(64)` | `FOREIGN KEY (users.userId)` | Applicant user ID |
| `petListerId` | `VARCHAR(64)` | `FOREIGN KEY (users.userId)` | Pet lister user ID |
| `petName` | `VARCHAR(50)` | `NOT NULL` | Snapshot of pet name |
| `petBreed` | `VARCHAR(100)` | `NOT NULL` | Snapshot of pet breed |
| `petImage` | `TEXT` | `NOT NULL` | Snapshot of pet image |
| `petType` | `VARCHAR(20)` | `NOT NULL` | Snapshot of pet type |
| `petLocation` | `VARCHAR(150)` | `NOT NULL` | Snapshot of pet location |
| `applicantName` | `VARCHAR(100)` | `NOT NULL` | Full name of applicant |
| `applicantEmail` | `VARCHAR(255)` | `NOT NULL` | Contact email |
| `applicantPhone` | `VARCHAR(10)` | `NOT NULL` | 10-digit phone |
| `applicantAddress` | `TEXT` | `NOT NULL` | Residential address |
| `housingType` | `VARCHAR(50)` | `NOT NULL` | Applicant's current housing type |
| `petExperience` | `VARCHAR(50)` | `NOT NULL` | Applicant's pet experience |
| `hasOtherPets` | `BOOLEAN` | `DEFAULT FALSE` | Whether applicant has other pets |
| `fitReason` | `TEXT` | `NOT NULL` | Statement of why they are a good fit |
| `eligibilityResult` | `VARCHAR(20)` | `NOT NULL` | `'APPLICABLE'` or `'NOT_APPLICABLE'` |
| `ineligibilityReason` | `TEXT` | `DEFAULT ''` | Detailed reason if not applicable |
| `currentStatus` | `ENUM(...)` | `DEFAULT 'Pending'` | `'Pending' \| 'Under Review' \| 'Approved' \| 'Adopted' \| 'Rejected'` |
| `dateApplied` | `DATE` | `DEFAULT CURRENT_DATE` | Submission date |

### Important Application Validations:
1. **Single Active Application Rule**:
   - A pet cannot have multiple active applications. If `applications` contains an active application for `petId`, new applications must be rejected.
2. **Applicant Name**: Letters only, no numbers allowed.
3. **Applicant Phone**: Exactly 10 numeric digits.
4. **Applicant Email**: Valid email format.

### Eligibility Engine Rules (`checkEligibility`):
Before an application is saved, it must be evaluated by the eligibility engine:

- **Rule 1: Fit Reason Word Count**:
  - The `fitReason` text must contain **at least 40 words** (`fitReason.split(/\s+/).length >= 40`).
  - *Failing Reason*: `"Please provide a more detailed response about why you would be a good fit for this pet. A minimum of 40 words is required."*

- **Rule 2: Living Space / Housing Compatibility**:
  - If the pet has high activity level (`pet.activityLevel === 'High'`) **OR** the pet requires a yard (`pet.goodWith` includes any of `["Yard Homes", "Fenced Yard", "Farm Life", "Spacious Homes", "Active Runners"]`):
    - The applicant's `housingType` **CANNOT be `'Apartment'`**.
  - *Failing Reason*: `"This pet requires a larger living space or a house with a yard suitable for their size and energy level."*

- **Rule 3: Pet Experience Level Compatibility**:
  - If the pet requires experienced handling (`pet.goodWith` includes `["Experienced Owners", "Experienced Handlers", "Experienced"]` **OR** `pet.personality` includes `["Protective", "Genius", "Focused", "Athletic"]`):
    - The applicant's `petExperience` **CANNOT be `'No experience'` or `'First-time adopter'`**.
  - *Failing Reason*: `"This pet requires an adopter with more experience caring for animals."*

- **Outcome**:
  - If all 3 rules pass: `eligibilityResult = 'APPLICABLE'`.
  - If any rule fails: `eligibilityResult = 'NOT_APPLICABLE'`. Application submission is halted until criteria are resolved.

### Application Status Lifecycle:
```
[Application Submitted] -> 'Pending' (Pet status transitions to 'PENDING')
         │
         ▼
  'Under Review' (Pet Lister reviewing applicant details)
    ├──► 'Approved' -> Finalizes adoption interview & verification
    │         └──► 'Adopted' (Pet status transitions to 'ADOPTED')
    └──► 'Rejected' (Pet status reverts to 'AVAILABLE')
```

---

## 5. Favorites / Likes Entity (`likes`)

### Table / Document Schema:
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `likeId` | `VARCHAR(64)` | `PRIMARY KEY` | Unique like record ID |
| `userId` | `VARCHAR(64)` | `FOREIGN KEY (users.userId)` | User who liked the pet |
| `petId` | `VARCHAR(64)` | `FOREIGN KEY (pets.id)` | Liked pet ID |
| `timestamp` | `TIMESTAMP` | `DEFAULT NOW()` | When the pet was favorited |

- **Unique Constraint**: `UNIQUE(userId, petId)` to prevent duplicate likes.

---

## 6. Database Migration Checklist

When creating your new database schema:
- [x] Create the `users` table with `role`, `housingType`, and `petExperience` enums.
- [x] Enforce that `housingType` and `petExperience` are the only editable user fields via API endpoints (`PATCH /api/users/:id/living-profile`).
- [x] Create `pets` table with foreign key `petListerId REFERENCES users(userId)`.
- [x] Create `applications` table with foreign keys to `pets(id)` and `users(userId)`.
- [x] Create `likes` table with unique constraint on `(userId, petId)`.
- [x] Port the 3-step eligibility function to your backend API route (`POST /api/applications`).
- [x] Add status synchronization triggers: Updating application to `'Adopted'` sets the pet's status to `'ADOPTED'`.
