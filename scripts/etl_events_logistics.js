// scripts/etl_events_logistics.js (ESM 방식)

import Parser from "rss-parser";
import { mapLocation } from "./location_mapper.js";
import { calculateSeverity } from "./impact.js";
import { saveEvent } from "./etl_common.js";

async function runLogisticsETL() {
  console.log("🚢 Logistics ETL 시작");
  const parser = new Parser();
  const feed = await parser.parseURL("https://www.hellenicshippingnews.com/feed/");

  let inserted = 0;
  for (const item of feed.items.slice(0, 10)) {
    const text = `${item.title} ${item.contentSnippet || ""}`;
    const { country, coords } = mapLocation(text);

    const row = {
      timestamp: new Date().toISOString(),
      type: "logistics",
      title: item.title,
      location: country,
      severity: calculateSeverity(text),
      source: "hellenicshipping",
      lat: coords[0],
      lng: coords[1],
      impact_score: 0,
      affected_companies: JSON.stringify([]),
      affected_products: JSON.stringify([]),
    };

    // 저장 시 → saveEvent 내부에서 매핑 + impact_score 업데이트 자동 반영
    saveEvent(row, text);
    inserted++;
  }

  console.log(`✅ Logistics ETL 완료: ${inserted}건`);
  return inserted;
}

// 단독 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  runLogisticsETL();
}

export default runLogisticsETL;
