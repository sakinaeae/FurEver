// NOTE: This prototype uses the local filesystem for data storage. 
// Deployed environments like Vercel have ephemeral filesystems, so JSON file updates will not persist across deployments.
// User-generated data should be handled via browser LocalStorage for demonstration.

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { loadUsers, saveUsers, loadPets, savePets, loadApplications, saveApplications, loadLikes, saveLikes } from "./src/backend/db";
import { checkEligibility } from "./src/backend/eligibility";
import { Pet, AdoptionApplication } from "./src/backend/types";
import { INITIAL_PETS } from "./src/data/petsData";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const WORKSPACE_DIR = process.cwd();
const FORM_DATA_DIR = path.join(WORKSPACE_DIR, "FormDataJson");
const DATABASE_DIR = path.join(WORKSPACE_DIR, "database");

// Ensure directories exist
if (!fs.existsSync(FORM_DATA_DIR)) {
  fs.mkdirSync(FORM_DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATABASE_DIR)) {
  fs.mkdirSync(DATABASE_DIR, { recursive: true });
}

// Helper to save legacy application copy in FormDataJson
function saveLegacyFormDataJson(formData: any): string {
  try {
    const id = formData?.id || `APP-${Date.now()}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${id}_${timestamp}.json`;
    const filePath = path.join(FORM_DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), "utf8");
    return path.relative(process.cwd(), filePath);
  } catch (e) {
    return "";
  }
}

// ==================== API ROUTES ====================

// GET /api/health - Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    backend: "FurEver Node.js Engine",
  });
});

// GET /api/pets - Get all pets
app.get("/api/pets", async (_req, res) => {
  res.json(loadPets());
});

// POST /api/pets - List a pet
app.post("/api/pets", async (req, res) => {
  const petData = req.body;
  const pets = loadPets();
  const newPet: Pet = {
    ...petData,
    id: petData.id || `pet-${Date.now()}`,
    status: "AVAILABLE",
    dateAdded: new Date().toISOString().split("T")[0],
    personality: petData.personality || ["Loving"],
    goodWith: petData.goodWith || ["Families"],
    medicalInfo: petData.medicalInfo || { vaccinated: true, spayedNeutered: true, microchipped: true, healthNotes: "Health verified by foster parent" }
  };
  pets.push(newPet);
  savePets(pets);
  res.json(newPet);
});

// DELETE /api/pets/:id - Remove a pet listing
app.delete("/api/pets/:id", async (req, res) => {
  const { id } = req.params;
  const pets = loadPets();
  const filtered = pets.filter(p => p.id !== id);
  if (pets.length === filtered.length) {
    return res.status(404).json({ error: "Pet not found" });
  }
  savePets(filtered);
  res.json({ status: "success", message: `Pet ${id} deleted` });
});

// POST /api/signup - Register new user in cloud database
app.post("/api/signup", async (req, res) => {
  const { name, email, password, phone, role, housingType, petExperience } = req.body;
  const users = loadUsers() as any[];
  const emailTrim = (email || "").trim().toLowerCase();
  
  if (users.find(u => u.email === emailTrim)) {
    return res.status(400).json({ error: "An account with this email already exists." });
  }

  const newUser = {
    userId: `usr-${Date.now()}`,
    name: name.trim(),
    email: emailTrim,
    password,
    phone: phone.trim(),
    role: role || "adopter",
    address: "",
    housingType: housingType || "",
    petExperience: petExperience || ""
  };

  users.push(newUser);
  saveUsers(users);

  const { password: _, ...userProfile } = newUser;
  res.json(userProfile);
});

// POST /api/login - Authenticate user against cloud database
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers() as any[];
  const emailTrim = (email || "").trim().toLowerCase();

  const user = users.find(u => u.email === emailTrim);
  if (!user) {
    return res.status(404).json({ error: "No account found with this email. Please sign up first." });
  }

  if (user.password && user.password !== password) {
    return res.status(401).json({ error: "Incorrect password. Please try again." });
  }

  const { password: _, ...userProfile } = user;
  res.json(userProfile);
});

// PUT /api/profile - Update user profile in cloud database
app.put("/api/profile", async (req, res) => {
  const { email, name, phone, housingType, petExperience, role } = req.body;
  const users = loadUsers() as any[];
  const emailTrim = (email || "").trim().toLowerCase();

  const index = users.findIndex(u => u.email === emailTrim);
  if (index === -1) {
    return res.status(404).json({ error: "User not found." });
  }

  users[index] = {
    ...users[index],
    name: name !== undefined ? name.trim() : users[index].name,
    phone: phone !== undefined ? phone.trim() : users[index].phone,
    housingType: housingType !== undefined ? housingType : users[index].housingType,
    petExperience: petExperience !== undefined ? petExperience : users[index].petExperience,
    role: role !== undefined ? role : users[index].role,
  };

  saveUsers(users);

  const { password: _, ...userProfile } = users[index];
  res.json(userProfile);
});

// POST /api/applications - Submit adoption form
app.post(["/api/applications", "/api/adoption-form"], async (req, res) => {
  const body = req.body;
  const pets = loadPets();
  let targetPet = pets.find(p => p.id === body.petId);
  
  if (!targetPet) {
    // Try to find the pet in our master INITIAL_PETS list
    const initialPet = INITIAL_PETS.find(p => p.id === body.petId);
    if (initialPet) {
      // Auto-save the master pet to pets.json so it exists in our JSON database
      pets.push(initialPet);
      savePets(pets);
      targetPet = initialPet;
    }
  }
  
  if (!targetPet) return res.status(404).json({ error: "Pet not found" });

  const eligibility = checkEligibility(body.fitReason, body.housingType, body.petExperience, targetPet);

  const newApp: AdoptionApplication = {
    ...body,
    id: `FUR-${Date.now()}`,
    petName: targetPet.name,
    petBreed: targetPet.breed,
    petImage: targetPet.image,
    petType: targetPet.animalType,
    petLocation: targetPet.location,
    dateApplied: new Date().toISOString().split("T")[0],
    eligibilityResult: eligibility.result,
    ineligibilityReason: eligibility.reason
  };

  const applications = loadApplications();
  const existingApp = applications.find(a => a.applicantEmail === body.applicantEmail && a.petId === body.petId);
  if (existingApp) return res.status(400).json({ error: "You have already applied for this pet." });
  
  applications.push(newApp);
  saveApplications(applications);

  res.json({
    status: "success",
    message: "Application processed",
    application: newApp,
    eligibilityResult: eligibility.result,
    ineligibilityReason: eligibility.reason,
  });
});

// PUT /api/applications/:id/status - Update application status (Approved, Rejected, etc.)
app.put("/api/applications/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const applications = loadApplications();
  const index = applications.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  applications[index].currentStatus = status;
  saveApplications(applications);

  res.json({ status: "success", application: applications[index] });
});

// GET /api/likes - Get liked pet IDs
app.get("/api/likes", async (req, res) => {
  const userId = (req.query.userId as string) || "default";
  const likes = loadLikes();
  res.json(likes.filter(l => l.userId === userId).map(l => l.petId));
});

// POST /api/likes - Save liked pet ID
app.post("/api/likes", async (req, res) => {
  const { userId, petId } = req.body;
  const likes = loadLikes();
  if (!likes.find(l => l.userId === userId && l.petId === petId)) {
    likes.push({ likeId: `like-${Date.now()}`, userId, petId, timestamp: new Date().toISOString() });
    saveLikes(likes);
  }
  res.json(likes.filter(l => l.userId === userId).map(l => l.petId));
});

// DELETE /api/likes - Remove liked pet ID
app.delete("/api/likes", async (req, res) => {
  const { userId, petId } = req.body;
  let likes = loadLikes();
  likes = likes.filter(l => !(l.userId === userId && l.petId === petId));
  saveLikes(likes);
  res.json(likes.filter(l => l.userId === userId).map(l => l.petId));
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FUREVER App running on http://localhost:${PORT}`);
  });
}

startServer();
