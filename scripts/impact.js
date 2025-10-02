// scripts/impact.js (ESM)

// 🔹 이벤트 심각도 계산
export function calculateSeverity(content) {
  const text = (content || "").toLowerCase();

  if (text.includes("war") || text.includes("crisis") || text.includes("embargo") || text.includes("blockade")) {
    return 5;
  }
  if (text.includes("sanction") || text.includes("ban") || text.includes("shutdown") || text.includes("strike")) {
    return 4;
  }
  if (text.includes("russia") || text.includes("china") || text.includes("pipeline") || text.includes("gas") || text.includes("oil")) {
    return 4;
  }
  if (text.includes("conflict") || text.includes("shortage") || text.includes("tariff") || text.includes("export")) {
    return 3;
  }
  if (text.includes("deal") || text.includes("agreement") || text.includes("production")) {
    return 2;
  }
  return 1;
}

// 🔹 영향 점수 계산
export function calculateImpact(severity, companies, products, content) {
  let weight = 0;
  const text = (content || "").toLowerCase();

  if (text.includes("opec") || text.includes("sanctions") || text.includes("embargo")) weight += 2;
  if (text.includes("strike") || text.includes("labor") || text.includes("union")) weight += 2;
  if (text.includes("port") || text.includes("shipping") || text.includes("logistics")) weight += 1;

  if (text.includes("crude") || text.includes("oil") || text.includes("gas") || text.includes("pipeline")) weight += 1;
  if (text.includes("russia") || text.includes("china") || text.includes("middle east") || text.includes("saudi")) weight += 1;
  if (text.includes("production") || text.includes("export") || text.includes("supply")) weight += 1;

  // 기업/제품 가중치 반영
  const base = severity * (companies.length * 10 + products.length * 5 + weight);

  // 0~100 정규화
  return Math.min(100, base);
}
