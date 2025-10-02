// scripts/mapping.js (ESM)

import Database from "better-sqlite3";

/**
 * 이벤트 ↔ 기업/제품 매핑
 * @param {number} eventId - 이벤트 ID
 * @param {object} event - 이벤트 객체 (title/description 포함 가능)
 * @returns {object} { companies: [], products: [] }
 */
export function mapCompaniesAndProducts(eventId, event) {
  const db = new Database("sqlite/supplychain.db");

  // 키워드 로딩
  const companyKeywords = db.prepare("SELECT company_id, keyword FROM company_keywords").all();
  const productKeywords = db.prepare("SELECT product_id, keyword FROM product_keywords").all();

  const matchedCompanies = new Set();
  const matchedProducts = new Set();

  const text = ((event.title || "") + " " + (event.description || "")).toLowerCase();

  // ✅ 기업 키워드 매칭 (부분 포함 허용)
  for (const { company_id, keyword } of companyKeywords) {
    if (!keyword) continue;
    if (text.includes(keyword.toLowerCase())) {
      matchedCompanies.add(company_id);
    }
  }

  // ✅ 제품 키워드 매칭 (기존 정규식 그대로, 정확도 유지)
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  for (const { product_id, keyword } of productKeywords) {
    if (!keyword) continue;
    const pattern = new RegExp(`\\b${escapeRegex(keyword)}\\b`, "i");
    if (pattern.test(text)) {
      matchedProducts.add(product_id);
    }
  }

  // DB 업데이트
  db.prepare(`
    UPDATE events_current 
    SET affected_companies = ?, affected_products = ? 
    WHERE id = ?
  `).run(
    JSON.stringify([...matchedCompanies]),
    JSON.stringify([...matchedProducts]),
    eventId
  );

  db.close();

  // ✅ 결과 리턴
  return {
    companies: [...matchedCompanies],
    products: [...matchedProducts]
  };
}
