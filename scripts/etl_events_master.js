// scripts/etl_events_master.js

import runOilETL from "./etl_events_oil.js";
import runTradeETL from "./etl_events_trade.js";
import runLogisticsETL from "./etl_events_logistics.js";
import runPortsETL from "./etl_events_ports.js";
import runStrikeETL from "./etl_events_strike.js";
import runPolicyETL from "./etl_events_policy.js";
import { mapCompaniesAndProducts } from "./mapping.js";
import Database from "better-sqlite3";

const db = new Database("sqlite/supplychain.db");

export async function runETL() {
  console.log("🚀 ETL Master 시작");

  try {
    // 1. 이벤트 수집
    await runOilETL();
    await runTradeETL();
    await runLogisticsETL();
    await runPortsETL();
    await runStrikeETL();
    await runPolicyETL();

    // 2. 매핑
    console.log("🔄 이벤트 ↔ 기업/제품 매핑 실행");
    const events = db.prepare("SELECT id, title FROM events_current").all();
    const tx = db.transaction(() => {
      for (const e of events) {
        mapCompaniesAndProducts(e.id, e);
      }
    });
    tx();

    // 3. 프론트용 JSON 생성
    const rows = db.prepare(`
      SELECT 
        e.id, e.title, e.type, e.severity, e.source, e.impact_score,
        e.lat, e.lng,
        GROUP_CONCAT(DISTINCT c.name) AS companies,
        GROUP_CONCAT(DISTINCT p.product_name) AS products
      FROM events_current e
      LEFT JOIN event_companies ec ON e.id = ec.event_id
      LEFT JOIN companies c ON ec.company_id = c.id
      LEFT JOIN event_products ep ON e.id = ep.event_id
      LEFT JOIN products p ON ep.product_id = p.id
      GROUP BY e.id
    `).all();

    const output = rows.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      severity: r.severity,
      source: r.source,
      impact_score: r.impact_score,
      lat: r.lat,
      lng: r.lng,
      affected_companies: r.companies ? r.companies.split(",") : [],
      affected_products: r.products ? r.products.split(",") : [],
    }));

    console.log("✅ 모든 처리 완료");
    console.log(JSON.stringify(output, null, 2));

    return output;
  } catch (err) {
    console.error("❌ ETL Master 에러:", err);
  }
}

// 단독 실행 시 (Windows/Unix 모두 호환)
if (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("etl_events_master.js")) {
  runETL();
}
