// scripts/etl_events_ports.js (ESM)

import fetch from "node-fetch";
import { calculateSeverity } from "./impact.js";
import { saveEvent } from "./etl_common.js";

const coordMap = {
  "Singapore Port": [1.29, 103.85],
  "Rotterdam Port": [51.92, 4.48],
  "Busan Port": [35.1, 129.04],
};

async function runPortsETL() {
  console.log("⚓ Ports ETL 시작");
  const sources = [
    { name: "Singapore Port", url: "https://api.marinetraffic.com/api/demo/singapore" },
    { name: "Rotterdam Port", url: "https://api.marinetraffic.com/api/demo/rotterdam" },
    { name: "Busan Port", url: "https://api.marinetraffic.com/api/demo/busan" },
  ];

  let inserted = 0;
  for (const port of sources) {
    try {
      const res = await fetch(port.url);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();

      for (const ev of data.events || []) {
        const text = ev.title || "Port Event";
        const row = {
          timestamp: new Date().toISOString(),
          type: "logistics",
          title: text,
          location: port.name,
          severity: calculateSeverity(text),
          source: port.name,
          lat: coordMap[port.name][0],
          lng: coordMap[port.name][1],
          impact_score: 0,
          affected_companies: JSON.stringify([]),
          affected_products: JSON.stringify([]),
        };

        // 저장 → saveEvent 내부에서 매핑/impact_score 자동 처리
        saveEvent(row, text);
        inserted++;
      }
    } catch (err) {
      console.warn(`❌ ${port.name} API 실패:`, err.message);
    }
  }

  console.log(`✅ Ports ETL 완료: ${inserted}건`);
  return inserted;
}

// 단독 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  runPortsETL();
}

export default runPortsETL;
