const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DB 경로
const dbDir = path.join(__dirname, "db");
const dbPath = path.join(dbDir, "genome-os.sqlite");

// ✅ db 폴더가 없으면 자동 생성
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log("📁 Created missing db directory");
}

let db;
if (fs.existsSync(dbPath)) {
  db = new Database(dbPath);
  console.log(`✅ Connected to SQLite at ${dbPath}`);
} else {
  console.warn("⚠️ No DB file found. Starting in mock data mode.");
  db = null;
}

// ✅ 검색 API
app.get("/api/search", (req, res) => {
  if (!db) {
    return res.json([
      { disease_id: 0, name: "Mock Disease", summary: "No real DB file found on server." },
    ]);
  }
  const q = req.query.q || "";
  const stmt = db.prepare(`
    SELECT disease_id, name, description AS summary
    FROM diseases
    WHERE name LIKE ?
    ORDER BY LENGTH(name) ASC
    LIMIT 50
  `);
  const result = stmt.all(`%${q}%`);
  res.json(result);
});

// ✅ 상세 API
app.get("/api/detail/:id", (req, res) => {
  if (!db) {
    return res.json({
      disease_id: 0,
      name: "Mock Disease",
      description: "This is a mock response (no DB file found).",
    });
  }
  const stmt = db.prepare("SELECT * FROM diseases WHERE disease_id = ?");
  const result = stmt.get(req.params.id);
  if (!result) return res.status(404).json({ error: "Not Found" });
  res.json(result);
});

// ✅ 루트 응답 (Render health check용)
app.get("/", (req, res) => {
  res.send("🧬 Genome-OS API is running successfully (mock or real mode).");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ API running on port ${port}`));
