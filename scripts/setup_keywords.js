// scripts/setup_keywords.js
import Database from "better-sqlite3";
import fs from "fs";

// --------------------
// DB 연결
// --------------------
const db = new Database("sqlite/supplychain.db");

// --------------------
// Stopwords & Whitelist
// --------------------
const COMPANY_STOPWORDS = [
  "buy", "sell", "supply", "products", "energy", "data", "live", "markets",
  "global", "investment", "line", "third", "one", "mobile", "payments"
];

const COMPANY_WHITELIST = [
  "pfizer", "berkshire", "hathaway", "bp", "jpmorgan",
  "real madrid", "bayer", "exxon", "chevron", "occidental", "shell", "ao", "spotify"
];

const PRODUCT_STOPWORDS = [
  "day", "week", "year", "hat", "saw", "live", "but", "when", "its",
  "strength", "rare", "pre", "aid", "end", "man"
];

const PRODUCT_WHITELIST = [
  "oil", "crude", "gas", "coal", "iron ore", "gold", "silver", "food",
  "grain", "wheat", "drugs", "medicine", "supply chain", "semiconductor",
  "chips", "battery", "sunscreen", "steel", "tubular goods", "index"
];

// --------------------
// Alias 파일 로딩
// --------------------
let COMPANY_ALIASES = {};
try {
  const aliasRaw = fs.readFileSync("data/company_aliases.json", "utf-8");
  COMPANY_ALIASES = JSON.parse(aliasRaw);
  console.log("✅ COMPANY_ALIASES loaded");
} catch (err) {
  console.warn("⚠️ No alias file found or invalid JSON");
}

// --------------------
// Normalize 함수
// --------------------
function normalize(text) {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

// --------------------
// Company Keywords
// --------------------
function generateCompanyKeywords() {
  console.log("🔄 Company Keywords 생성 시작...");
  db.prepare("DELETE FROM company_keywords").run();

  const companies = db.prepare("SELECT id, name FROM companies").all();
  const insert = db.prepare("INSERT INTO company_keywords (company_id, keyword) VALUES (?, ?)");

  let count = 0;
  for (const c of companies) {
    const base = normalize(c.name);
    const aliases = COMPANY_ALIASES?.[c.id] || [];
    const keywords = [base, ...aliases.map(normalize)].filter(Boolean);

    for (const kw of keywords) {
      if (COMPANY_STOPWORDS.includes(kw)) continue;
      if (!COMPANY_WHITELIST.includes(kw) && kw.split(" ").length === 1) continue;

      insert.run(c.id, kw);
      count++;
    }
  }

  console.log(`✅ company_keywords ${count}건 삽입 완료`);
}

// --------------------
// Product Keywords
// --------------------
function generateProductKeywords() {
  console.log("🔄 Product Keywords 생성 시작...");
  db.prepare("DELETE FROM product_keywords").run();

  const products = db.prepare("SELECT id, product_name FROM products").all();
  const insert = db.prepare("INSERT INTO product_keywords (product_id, keyword) VALUES (?, ?)");

  let count = 0;
  for (const p of products) {
    const name = normalize(p.product_name);
    if (!name) continue;

    if (PRODUCT_STOPWORDS.includes(name)) continue;
    if (!PRODUCT_WHITELIST.includes(name) && name.split(" ").length === 1) continue;

    insert.run(p.id, name);
    count++;
  }

  console.log(`✅ product_keywords ${count}건 삽입 완료`);
}

// --------------------
// 실행
// --------------------
generateCompanyKeywords();
generateProductKeywords();
