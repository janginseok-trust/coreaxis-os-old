// scripts/etl_events_strike.js (ESM)

import Parser from "rss-parser";
import { mapLocation } from "./location_mapper.js";
import { calculateSeverity } from "./impact.js";
import { saveEvent } from "./etl_common.js";

async function runStrikeETL() {
  console.log("✊ Strike ETL 시작");
  const parser = new Parser();
  const sources = [
    { url: "https://www.theguardian.com/world/labour/rss", name: "guardian-labour" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", name: "nytimes-world" },
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "bbc-world" },
    { url: "https://www.aljazeera.com/xml/rss/all.xml", name: "aljazeera" },
  ];

  let total = 0;
  for (const src of sources) {
    try {
      const feed = await parser.parseURL(src.url);
      for (const item of feed.items.slice(0, 10)) {
        const text = `${item.title} ${item.contentSnippet || ""}`;
        const { country, coords } = mapLocation(text);

        const row = {
          timestamp: new Date().toISOString(),
          type: "strike",
          title: item.title,
          location: country,
          severity: calculateSeverity(text),
          source: src.name,
          lat: coords[0],
          lng: coords[1],
          impact_score: 0,
          affected_companies: JSON.stringify([]),
          affected_products: JSON.stringify([]),
        };

        // 저장 → saveEvent 내부에서 매핑/impact_score 자동 반영
        saveEvent(row, text);
        total++;
      }
    } catch (err) {
      console.warn(`⚠️ ${src.name} 실패:`, err.message);
    }
  }

  console.log(`✅ Strike ETL 완료: ${total}건`);
  return total;
}

// 단독 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  runStrikeETL();
}

export default runStrikeETL;
