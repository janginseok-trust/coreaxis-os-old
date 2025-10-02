// scripts/mapping_event_companies.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

(async () => {
  const db = await open({
    filename: "sqlite/supplychain.db",
    driver: sqlite3.Database,
  });

  console.log("🔍 기업 키워드 로딩 중...");
  let companyKeywords = await db.all("SELECT company_id, keyword FROM company_keywords");
  console.log(`🏢 DB 기반 기업 키워드: ${companyKeywords.length}개`);

  // ✅ company_aliases.json 로드
  const aliasPath = "data/company_aliases.json";
  if (fs.existsSync(aliasPath)) {
    const aliasData = JSON.parse(fs.readFileSync(aliasPath, "utf-8"));

    for (const [companyId, aliases] of Object.entries(aliasData)) {
      if (Array.isArray(aliases)) {
        for (const alias of aliases) {
          companyKeywords.push({
            company_id: parseInt(companyId, 10),
            keyword: alias,
          });
        }
      }
    }
    console.log(`➕ alias 키워드 합산 후 총 ${companyKeywords.length}개`);
  }

  const events = await db.all("SELECT id, title, description FROM events_raw");
  console.log(`📄 이벤트 총 ${events.length}개 로드 완료`);

  let totalInserted = 0;
  await db.exec("BEGIN TRANSACTION");

  for (const event of events) {
    const text = `${event.title} ${event.description}`.toLowerCase();
    const matches = [];

    for (const { company_id, keyword } of companyKeywords) {
      const kw = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape
      const regex = new RegExp(`\\b${kw}\\b`, "i");
      if (regex.test(text)) {
        matches.push({ company_id, keyword });
      }
    }

    if (matches.length > 0) {
      const topMatches = matches.slice(0, 5);
      for (const m of topMatches) {
        await db.run(
          "INSERT OR IGNORE INTO event_companies (event_id, company_id) VALUES (?, ?)",
          [event.id, m.company_id]
        );
        totalInserted++;
      }
    }
  }

  await db.exec("COMMIT");

  console.log(
    `🎉 총 ${totalInserted}개 이벤트-기업 매핑 삽입 완료 (정규식 매칭 + alias 포함, 상위 5개 제한)`
  );

  await db.close();
})();
