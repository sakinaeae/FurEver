import express from "express";
import path from "path";
import fs from "fs";
import { execSync, spawn } from "child_process";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const WORKSPACE_DIR = process.cwd();
const FORM_DATA_DIR = path.join(WORKSPACE_DIR, "FormDataJson");
const DATABASE_DIR = path.join(WORKSPACE_DIR, "database");
const CPP_SOURCE = path.join(WORKSPACE_DIR, "backend.cpp");
const CPP_BINARY = path.join(WORKSPACE_DIR, "backend_handler");

// Ensure directories exist
if (!fs.existsSync(FORM_DATA_DIR)) {
  fs.mkdirSync(FORM_DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATABASE_DIR)) {
  fs.mkdirSync(DATABASE_DIR, { recursive: true });
}

// Ensure C++ binary is compiled
function ensureCppBinaryCompiled(): boolean {
  if (fs.existsSync(CPP_BINARY)) {
    return true;
  }
  if (!fs.existsSync(CPP_SOURCE)) {
    console.error("[C++ Backend] backend.cpp not found at:", CPP_SOURCE);
    return false;
  }

  try {
    console.log("[C++ Backend] Compiling backend.cpp -> backend_handler...");
    execSync(`g++ -O2 -std=c++17 "${CPP_SOURCE}" -o "${CPP_BINARY}"`, {
      cwd: WORKSPACE_DIR,
      stdio: "pipe",
      timeout: 30000,
    });
    console.log("[C++ Backend] Compilation successful!");
    return true;
  } catch (err: any) {
    console.warn("[C++ Backend] Warning: g++ compilation issue:", err.message);
    return false;
  }
}

// Execute C++ executable with action and optional payload argument
function runCppAction(action: string, payload: any = null): Promise<string> {
  return new Promise((resolve, reject) => {
    ensureCppBinaryCompiled();
    const payloadStr = payload ? JSON.stringify(payload) : "";
    const args = payload ? [action, payloadStr] : [action];

    const child = spawn(CPP_BINARY, args, { cwd: WORKSPACE_DIR });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        console.error(`[C++ Action Error] Code ${code}, stderr: ${stderr}`);
        resolve(stdout.trim() || `{"error": "C++ execution failed"}`);
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

// Helper to save legacy application copy in FormDataJson
function saveLegacyFormDataJson(formData: any): string {
  try {
    const id = formData?.id || `APP-${Date.now()}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${id}_${timestamp}.json`;
    const filePath = path.join(FORM_DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), "utf8");
    return path.relative(WORKSPACE_DIR, filePath);
  } catch (e) {
    return "";
  }
}

// ==================== API ROUTES ====================

// GET /api/health - C++ Backend Health Check
app.get("/api/health", (_req, res) => {
  const isCompiled = fs.existsSync(CPP_BINARY);
  res.json({
    status: "ok",
    backend: "FurEver C++ Engine & Persistent Storage",
    cppBinaryCompiled: isCompiled,
    databaseDir: "database",
  });
});

// GET /api/pets - Get all pets from C++ backend
app.get("/api/pets", async (_req, res) => {
  try {
    const output = await runCppAction("get_pets");
    const pets = JSON.parse(output);
    res.json(pets);
  } catch (err: any) {
    console.error("[API Error] Failed to fetch pets from C++:", err);
    res.status(500).json({ error: "Failed to load pets from C++ backend" });
  }
});

// POST /api/pets - List a pet in C++ database
app.post("/api/pets", async (req, res) => {
  try {
    const petData = req.body;
    console.log("[API] Listing pet via C++ backend:", petData.name);
    const output = await runCppAction("add_pet", petData);
    const createdPet = JSON.parse(output);
    res.json(createdPet);
  } catch (err: any) {
    console.error("[API Error] Failed to list pet in C++:", err);
    res.status(500).json({ error: "Failed to add pet" });
  }
});

// POST /api/login - Sign-in user via C++ database
app.post("/api/login", async (req, res) => {
  try {
    const userData = req.body;
    const output = await runCppAction("login", userData);
    const user = JSON.parse(output);
    res.json(user);
  } catch (err: any) {
    console.error("[API Error] Failed login in C++:", err);
    res.status(500).json({ error: "User sign-in failed" });
  }
});

// POST /api/applications or /api/adoption-form - Submit adoption form -> C++ Eligibility Check
app.post(["/api/applications", "/api/adoption-form"], async (req, res) => {
  try {
    const body = req.body;

    if (body.type === "PET_LISTING" && body.pet) {
      const output = await runCppAction("add_pet", body.pet);
      const createdPet = JSON.parse(output);
      return res.json({ status: "success", pet: createdPet });
    }

    console.log("[API] Processing adoption application via C++ eligibility engine:", body.id || body.petId);
    
    // Legacy file save
    const legacyFile = saveLegacyFormDataJson(body);

    // C++ Eligibility evaluation & persistence
    const output = await runCppAction("submit_application", body);
    const applicationResult = JSON.parse(output);

    res.json({
      status: "success",
      message: "Application processed by C++ backend",
      file: legacyFile,
      application: applicationResult,
      eligibilityResult: applicationResult.eligibilityResult,
      ineligibilityReason: applicationResult.ineligibilityReason,
    });
  } catch (err: any) {
    console.error("[API Error] Failed application submission in C++:", err);
    res.status(500).json({ error: "Failed to process application" });
  }
});

// GET /api/likes - Get liked pet IDs
app.get("/api/likes", async (req, res) => {
  try {
    const userId = (req.query.userId as string) || "default";
    const output = await runCppAction("get_likes", userId);
    const likedIds = JSON.parse(output);
    res.json(likedIds);
  } catch (err: any) {
    res.json([]);
  }
});

// POST /api/likes - Save liked pet ID in C++ database
app.post("/api/likes", async (req, res) => {
  try {
    const body = req.body;
    const output = await runCppAction("save_like", body);
    const updatedLikes = JSON.parse(output);
    res.json(updatedLikes);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save like" });
  }
});

// DELETE /api/likes - Remove liked pet ID from C++ database
app.delete("/api/likes", async (req, res) => {
  try {
    const body = req.body;
    const output = await runCppAction("remove_like", body);
    const updatedLikes = JSON.parse(output);
    res.json(updatedLikes);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to remove like" });
  }
});

// GET /api/form-data-json - Legacy FormDataJson reader
app.get("/api/form-data-json", (_req, res) => {
  try {
    if (!fs.existsSync(FORM_DATA_DIR)) {
      return res.json({ files: [] });
    }
    const fileNames = fs.readdirSync(FORM_DATA_DIR).filter((f) => f.endsWith(".json"));
    const filesWithStats = fileNames.map((fileName) => {
      const fullPath = path.join(FORM_DATA_DIR, fileName);
      const stat = fs.statSync(fullPath);
      let preview = null;
      try {
        const content = fs.readFileSync(fullPath, "utf8");
        preview = JSON.parse(content);
      } catch (e) {}

      return {
        fileName,
        path: `FormDataJson/${fileName}`,
        sizeBytes: stat.size,
        createdAt: stat.birthtime || stat.mtime,
        data: preview,
      };
    });

    res.json({
      count: filesWithStats.length,
      directory: "FormDataJson",
      files: filesWithStats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  ensureCppBinaryCompiled();

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
    console.log(`C++ Database Directory: ${DATABASE_DIR}`);
  });
}

startServer();
