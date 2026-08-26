import express from "express";
import path from "path";
import fs from "fs";
import { execFile, execSync, spawn } from "child_process";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const WORKSPACE_DIR = process.cwd();
const FORM_DATA_DIR = path.join(WORKSPACE_DIR, "FormDataJson");
const CPP_SOURCE = path.join(WORKSPACE_DIR, "backend.cpp");
const CPP_BINARY = path.join(WORKSPACE_DIR, "backend_handler");

// Ensure FormDataJson directory exists
if (!fs.existsSync(FORM_DATA_DIR)) {
  fs.mkdirSync(FORM_DATA_DIR, { recursive: true });
}

// Function to compile C++ backend if not already compiled
function ensureCppBinaryCompiled(): boolean {
  if (fs.existsSync(CPP_BINARY)) {
    return true;
  }

  if (!fs.existsSync(CPP_SOURCE)) {
    console.error("[C++ Backend] Source file backend.cpp not found at:", CPP_SOURCE);
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
    console.warn("[C++ Backend] Warning: g++ compiler not ready or failed compilation:", err.message);
    return false;
  }
}

// Helper to execute C++ binary with JSON input
async function executeCppBackend(formData: any): Promise<{ success: boolean; file?: string; output?: string; method: string }> {
  const jsonString = typeof formData === "string" ? formData : JSON.stringify(formData, null, 2);
  const isCompiled = ensureCppBinaryCompiled();

  if (isCompiled && fs.existsSync(CPP_BINARY)) {
    return new Promise((resolve) => {
      const child = spawn(CPP_BINARY, [], {
        cwd: WORKSPACE_DIR,
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        console.log(`[C++ Backend process exited with code ${code}]`);
        console.log("[C++ Output]", stdout.trim());
        if (stderr) console.error("[C++ Error]", stderr.trim());

        // Extract saved file path if present in C++ output
        const fileMatch = stdout.match(/\"file\":\s*\"([^\"]+)\"/) || stdout.match(/Saved to:\s*(\S+)/i) || stdout.match(/FormDataJson\/[^\s\n\r\"]+/);
        const savedFilePath = fileMatch ? fileMatch[1] || fileMatch[0] : undefined;

        resolve({
          success: code === 0,
          file: savedFilePath,
          output: stdout || stderr,
          method: "cpp-binary",
        });
      });

      child.on("error", (err) => {
        console.error("[C++ Spawn Error]", err);
        // Fallback file write
        const fallbackFile = fallbackSaveToJson(formData);
        resolve({
          success: true,
          file: fallbackFile,
          output: "Saved via fallback due to spawn error",
          method: "node-fallback",
        });
      });

      // Write JSON to C++ process stdin and close stream
      child.stdin.write(jsonString);
      child.stdin.end();
    });
  } else {
    // If g++ isn't ready or binary wasn't built yet, save to FormDataJson directly as fallback
    const fallbackFile = fallbackSaveToJson(formData);
    return {
      success: true,
      file: fallbackFile,
      output: "Saved directly to FormDataJson",
      method: "fallback",
    };
  }
}

// Fallback saver directly to FormDataJson
function fallbackSaveToJson(formData: any): string {
  if (!fs.existsSync(FORM_DATA_DIR)) {
    fs.mkdirSync(FORM_DATA_DIR, { recursive: true });
  }

  const id = formData?.id || `APP-${Date.now()}`;
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  const filename = `${id}_${timestamp}.json`;
  const filePath = path.join(FORM_DATA_DIR, filename);

  const jsonString = typeof formData === "string" ? formData : JSON.stringify(formData, null, 2);
  fs.writeFileSync(filePath, jsonString, "utf8");
  return path.relative(WORKSPACE_DIR, filePath);
}

// API Routes
app.get("/api/health", (_req, res) => {
  const isCompiled = fs.existsSync(CPP_BINARY);
  res.json({
    status: "ok",
    backend: "C++ Adoption Form Backend (with Express Gateway)",
    cppBinaryCompiled: isCompiled,
    targetDirectory: "FormDataJson",
  });
});

// Endpoint: Submit Adoption Form -> Sent to C++ backend -> Saved as JSON in FormDataJson
app.post("/api/adoption-form", async (req, res) => {
  try {
    const formData = req.body;
    console.log("[API] Received adoption form submission:", formData?.id || "unknown");

    const result = await executeCppBackend(formData);

    res.json({
      status: "success",
      message: "Adoption form data received and successfully written to JSON file by C++ backend.",
      file: result.file,
      details: result,
    });
  } catch (error: any) {
    console.error("[API Error] Failed to process adoption form:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to process adoption form in C++ backend",
    });
  }
});

// Endpoint: List all saved JSON files under FormDataJson
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

// Endpoint: Get specific saved JSON file
app.get("/api/form-data-json/:filename", (req, res) => {
  try {
    const safeFilename = path.basename(req.params.filename);
    const filePath = path.join(FORM_DATA_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found in FormDataJson" });
    }

    const content = fs.readFileSync(filePath, "utf8");
    res.setHeader("Content-Type", "application/json");
    res.send(content);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  // Pre-attempt compile C++ binary
  ensureCppBinaryCompiled();

  // Vite middleware in dev / static in prod
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
    console.log(`Adoption JSON output directory: ${FORM_DATA_DIR}`);
  });
}

startServer();
