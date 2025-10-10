const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 안전하게 better-sqlite3 import (Render 빌드 실패 방지)
let Database;
try {
  Database = require("better-sqlite3");
  console.log("✅ better-sqlite3 loaded successfully");
} catch (err) {
  console.warn("⚠️ better-sqlite3 not available, running in mock mode");
  Database = null;
}

// ✅ DB 경로 생성
const dbDir = path.join(__dirname, "db");
const dbPath = path.join(dbDir, "genome-os.sqlite");

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
let db = null;

// ✅ DB 연결 시도
if (Database && fs.existsSync(dbPath)) {
  db = new Database(dbPath);
  console.log(`✅ Connected to SQLite DB at ${dbPath}`);
} else {
  console.warn("⚠️ No DB file found, or DB library unavailable. Using mock data mode.");
}

// ✅ 기본 루트
app.get("/", (req, res) => {
  res.send("🧬 Genome-API is alive (mock or real mode).");
});

// ✅ 검색 API
app.get("/api/search", (req, res) => {
  if (!db) {
    return res.json([
      { disease_id: 1, name: "Mock Disease", summary: "Running in mock mode (no DB)." },
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
  res.json(stmt.all(`%${q}%`));
});

// ✅ 상세 API
app.get("/api/detail/:id", (req, res) => {
  if (!db) {
    return res.json({
      disease_id: req.params.id,
      name: "Mock Disease",
      description: "Mock response (no DB file found).",
    });
  }
  const stmt = db.prepare("SELECT * FROM diseases WHERE disease_id = ?");
  const result = stmt.get(req.params.id);
  res.json(result || { error: "Not Found" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
