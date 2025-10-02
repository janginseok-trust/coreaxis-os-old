// scripts/etl_common.js (ESM 버전)

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { mapCompaniesAndProducts } from "./mapping.js";
import { calculateImpact } from "./impact.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(process.cwd(), "sqlite/supplychain.db");
const db = new Database(dbPath);

// ✅ events_current (현재 상태)
const insertCurrent = db.prepare(`
  INSERT INTO events_current
    (timestamp, type, title, location, severity, source, lat, lng, impact_score, affected_companies, affected_products)
  VALUES (@timestamp, @type, @title, @location, @severity, @source, @lat, @lng, @impact_score, @affected_companies, @affected_products)
  ON CONFLICT(title) DO UPDATE SET
    timestamp=excluded.timestamp,
    type=excluded.type,
    location=excluded.location,
    severity=excluded.severity,
    source=excluded.source,
    lat=excluded.lat,
    lng=excluded.lng,
    impact_score=excluded.impact_score,
    affected_companies=excluded.affected_companies,
    affected_products=excluded.affected_products
`);

const updateCurrent = db.prepare(`
  UPDATE events_current
  SET impact_score=@impact_score,
      affected_companies=@affected_companies,
      affected_products=@affected_products
  WHERE id=@id
`);

// ✅ events_log (이력)
const insertLog = db.prepare(`
  INSERT INTO events_log
    (timestamp, type, title, location, severity, source, lat, lng, impact_score, affected_companies, affected_products)
  VALUES (@timestamp, @type, @title, @location, @severity, @source, @lat, @lng, @impact_score, @affected_companies, @affected_products)
`);

// ✅ 이벤트 저장
export function saveEvent(row, text) {
  // 1) 먼저 insert/update
  insertCurrent.run(row);

  // 2) Event ID 확보
  const existing = db.prepare("SELECT id FROM events_current WHERE title=?").get(row.title);
  const eventId = existing?.id;

  if (!eventId) {
    console.warn(`⚠️ Event ID 확보 실패: ${row.title}`);
    return false;
  }

  // 3) 기업/제품 매핑 (ID 배열)
  const { companies, products } = mapCompaniesAndProducts(eventId, row);

  // 4) ID → 실제 이름 변환
  const companyNames = companies.map(c =>
    db.prepare("SELECT name FROM companies WHERE id=?").get(c)?.name
  ).filter(Boolean);

  const productNames = products.map(p =>
    db.prepare("SELECT product_name FROM products WHERE id=?").get(p)?.product_name
  ).filter(Boolean);

  // 5) Impact 계산
  row.impact_score = calculateImpact(row.severity, companyNames, productNames, text);
  row.affected_companies = JSON.stringify(companyNames);
  row.affected_products = JSON.stringify(productNames);
  row.id = eventId;

  // 6) 업데이트 + 로그
  updateCurrent.run(row);
  insertLog.run(row);

  console.log(`✅ 저장 완료: ${row.title} (Event ${eventId}) → 기업 ${companyNames.length} / 제품 ${productNames.length}`);
  return true;
}
