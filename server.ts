import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { loadUsers, saveUsers, loadPets, savePets, loadApplications, saveApplications, loadLikes, saveLikes } from "./src/backend/db";
import { checkEligibility } from "./src/backend/eligibility";
import { Pet, AdoptionApplication } from "./src/backend/types";

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
    medicalInfo: petData.medicalInfo || { vaccinated: true, spayedNeutered: true, microchipped: true, healthNotes: "Health verified by foster owner" }
  };
  pets.push(newPet);
  savePets(pets);
  res.json(newPet);
});

// POST /api/login - Sign-in user
app.post("/api/login", async (req, res) => {
  const userData = req.body;
  const users = loadUsers();
  let user = users.find(u => u.email === userData.email);
  if (!user) {
    user = {
      ...userData,
      userId: `usr-${Date.now()}`,
      role: userData.role || "adopter"
    };
    users.push(user);
    saveUsers(users);
  }
  res.json(user);
});

// POST /api/applications - Submit adoption form
app.post(["/api/applications", "/api/adoption-form"], async (req, res) => {
  const body = req.body;
  const pets = loadPets();
  const targetPet = pets.find(p => p.id === body.petId);
  
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
