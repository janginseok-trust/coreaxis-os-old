// scripts/etl_events_oil.js (ESM)

import Parser from "rss-parser";
import { mapLocation } from "./location_mapper.js";
import { calculateSeverity } from "./impact.js";
import { saveEvent } from "./etl_common.js";

async function runOilETL() {
  console.log("🛢️ Oil ETL 시작");
  const parser = new Parser();
  const feed = await parser.parseURL("https://oilprice.com/rss/main");

  let inserted = 0;
  for (const item of feed.items.slice(0, 20)) {
    const text = `${item.title} ${item.contentSnippet || ""}`;
    const { country, coords } = mapLocation(text);

    const row = {
      timestamp: new Date().toISOString(),
      type: "resource",
      title: item.title,
      location: country,
      severity: calculateSeverity(text),
      source: "oilprice",
      lat: coords[0],
      lng: coords[1],
      impact_score: 0,
      affected_companies: JSON.stringify([]),
      affected_products: JSON.stringify([]),
    };

    saveEvent(row, text);
    inserted++;
  }

  console.log(`✅ Oil ETL 완료: ${inserted}건`);
  return inserted;
}

// 단독 실행 시 (Windows 경로 호환)
if (process.argv[1] && process.argv[1].endsWith("etl_events_oil.js")) {
  runOilETL();
}

export default runOilETL;
