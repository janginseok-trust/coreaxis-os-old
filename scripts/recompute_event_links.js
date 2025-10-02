// scripts/recompute_event_links.js (ESM)

import Database from "better-sqlite3";

const db = new Database("sqlite/supplychain.db");

// 기존 링크 테이블 비우기
db.prepare("DELETE FROM event_links").run();

// 이벤트 ↔ 기업/제품 → 링크 재계산
const events = db.prepare("SELECT id FROM events_current").all();
const insertLink = db.prepare(
  "INSERT INTO event_links (event_id, company_id, product_id) VALUES (?, ?, ?)"
);

for (const e of events) {
  const companies = db
    .prepare("SELECT company_id FROM event_companies WHERE event_id = ?")
    .all(e.id);
  const products = db
    .prepare("SELECT product_id FROM event_products WHERE event_id = ?")
    .all(e.id);

  for (const c of companies) {
    for (const p of products) {
      insertLink.run(e.id, c.company_id, p.product_id);
      console.log(`🔗 Link 저장: event ${e.id} → company ${c.company_id}, product ${p.product_id}`);
    }
  }
}

console.log("✅ 이벤트 링크 재계산 완료");
