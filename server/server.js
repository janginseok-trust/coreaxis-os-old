const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// SQLite 연결
const dbPath = path.join(__dirname, "db", "genome-os.sqlite");
const db = new Database(dbPath);
console.log(`✅ Connected to SQLite at ${dbPath}`);

// 검색 API
app.get("/api/search", (req, res) => {
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

// 상세 보기 API
app.get("/api/detail/:id", (req, res) => {
  const stmt = db.prepare("SELECT * FROM diseases WHERE disease_id = ?");
  const result = stmt.get(req.params.id);
  res.json(result);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ API running on http://localhost:${port}`));
