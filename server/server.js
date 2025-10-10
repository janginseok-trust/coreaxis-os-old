const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

let Database;
try {
  Database = require("better-sqlite3");
} catch (err) {
  console.warn("⚠️ better-sqlite3 not found, switching to mock mode.");
}

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DB 연결
const dbDir = path.join(__dirname, "db");
const dbPath = path.join(dbDir, "genome-os.sqlite");

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
let db = null;

if (Database && fs.existsSync(dbPath)) {
  db = new Database(dbPath);
  console.log(`✅ Connected to SQLite: ${dbPath}`);
} else {
  console.warn("⚠️ No DB file found. Mock mode active.");
}

// ✅ 라우트
app.get("/", (_, res) => res.send("🧬 Genome-API is alive! (mock or real mode)"));

app.get("/api/search", (req, res) => {
  if (!db)
    return res.json([{ disease_id: 0, name: "Mock Disease", summary: "No DB file found." }]);
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

app.get("/api/detail/:id", (req, res) => {
  if (!db)
    return res.json({ name: "Mock Disease", description: "Mock mode active." });
  const stmt = db.prepare("SELECT * FROM diseases WHERE disease_id = ?");
  const result = stmt.get(req.params.id);
  res.json(result || { error: "Not found" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
