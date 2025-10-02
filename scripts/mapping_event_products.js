import sqlite3 from "sqlite3";
import { open } from "sqlite";

(async () => {
  const db = await open({
    filename: "sqlite/supplychain.db",
    driver: sqlite3.Database,
  });

  console.log("🔍 제품 키워드 로딩 중...");
  const productKeywords = await db.all("SELECT product_id, keyword FROM product_keywords");
  console.log(`📦 키워드 총 ${productKeywords.length}개 로드 완료`);

  const events = await db.all("SELECT id, title, description FROM events_raw");
  console.log(`📄 이벤트 총 ${events.length}개 로드 완료`);

  let totalInserted = 0;

  await db.exec("BEGIN TRANSACTION");

  for (const event of events) {
    const text = `${event.title} ${event.description}`.toLowerCase();
    const matches = [];

    for (const { product_id, keyword } of productKeywords) {
      if (text.includes(keyword.toLowerCase())) {
        matches.push({ product_id, keyword });
      }
    }

    if (matches.length > 0) {
      // 이벤트당 최대 5개까지만 매핑
      const topMatches = matches.slice(0, 5);
      for (const m of topMatches) {
        await db.run(
          "INSERT OR IGNORE INTO event_products (event_id, product_id) VALUES (?, ?)",
          [event.id, m.product_id]
        );
        totalInserted++;
      }
    }
  }

  await db.exec("COMMIT");

  console.log(`🎉 총 ${totalInserted}개 이벤트-제품 매핑 삽입 완료 (정확도 우선, 상위 5개 제한)`);
  await db.close();
})();
