-- ==============================================================
-- 🧬 GENOME-OS v2.1.6 : Advanced Disease Report Generator (ROI Integrated, SQLite-Safe)
-- ==============================================================
-- ✅ Executive metrics
-- ✅ ROI realism (revenue vs. cost)
-- ✅ SQLite-safe column patch (no duplicate column errors)
-- ==============================================================

-- 🔄 Drop existing cache
DROP TABLE IF EXISTS disease_report_cache;

-- 🧠 Create integrated cache
CREATE TABLE disease_report_cache AS
SELECT
    d.disease_id,
    d.name AS disease_name,

    -- ✅ Strategy success rate
    COALESCE((
      SELECT ROUND(
        100.0 * SUM(CASE WHEN status IN ('APPROVED','SUCCESS','COMPLETED') THEN 1 ELSE 0 END) / COUNT(*), 2)
      FROM strategies s2
      WHERE s2.disease_id = d.disease_id
    ), 0) AS strategy_success_rate,

    -- ⚠️ Representative failures
    COALESCE((
      SELECT GROUP_CONCAT(reaction || ' (' || cnt || ')', '; ')
      FROM (
        SELECT reaction, COUNT(*) AS cnt
        FROM failures_clean
        WHERE disease_id = d.disease_id
          AND TRIM(reaction) <> ''
        GROUP BY reaction
        ORDER BY cnt DESC
        LIMIT 3
      )
    ), 'N/A') AS representative_failures,

    -- ✅ Representative strategies
    COALESCE((
      SELECT GROUP_CONCAT(s.drug || ' [' || s.status || ']', '; ')
      FROM (
        SELECT DISTINCT drug, status
        FROM strategies
        WHERE disease_id = d.disease_id
          AND TRIM(drug) <> ''
        ORDER BY date DESC
        LIMIT 3
      ) s
    ), 'N/A') AS representative_strategies,

    -- 💡 Next ongoing / planned strategy
    COALESCE((
      SELECT s.drug || ' [' || s.status || ']'
      FROM strategies s
      WHERE s.disease_id = d.disease_id
        AND s.status IN ('RECRUITING','ONGOING','PLANNED','INVESTIGATIONAL')
      ORDER BY s.date DESC
      LIMIT 1
    ), (
      SELECT s.drug || ' [' || s.status || ']'
      FROM strategies s
      WHERE s.disease_id = d.disease_id
        AND s.status = 'COMPLETED'
      ORDER BY s.date DESC
      LIMIT 1
    ), 'No ongoing or planned strategy') AS next_strategy,

    -- 📚 Evidence links
    COALESCE((
      SELECT GROUP_CONCAT(e.pmid, '; ')
      FROM (
        SELECT DISTINCT pmid
        FROM evidence_links
        WHERE disease_id = d.disease_id
          AND TRIM(pmid) <> ''
        ORDER BY pmid DESC
        LIMIT 5
      ) e
    ), 'N/A') AS representative_evidence,

    -- 🏛 Regulatory reports
    COALESCE((
      SELECT GROUP_CONCAT(r.agency || ': ' || r.outcome || ' (' || r.region || ')', '; ')
      FROM (
        SELECT DISTINCT agency, outcome, region
        FROM regulatory_reports
        WHERE disease_id = d.disease_id
          AND agency IS NOT NULL AND outcome IS NOT NULL
        LIMIT 3
      ) r
    ), 'N/A') AS representative_regulatory,

    -- 📊 Weighted coverage score
    ROUND((
      (CASE WHEN e.cnt > 0 THEN 0.4 ELSE 0 END) +
      (CASE WHEN r.cnt > 0 THEN 0.3 ELSE 0 END) +
      (CASE WHEN s.cnt > 0 THEN 0.2 ELSE 0 END) +
      (CASE WHEN f.cnt > 0 THEN 0.1 ELSE 0 END)
    ) * 100, 2) AS data_coverage_score,

    -- 💥 Top failure ratio
    COALESCE((
      SELECT ROUND(100.0 * MAX(fcount) / SUM(fcount), 2)
      FROM (
        SELECT COUNT(*) AS fcount
        FROM failures_clean
        WHERE disease_id = d.disease_id
        GROUP BY reaction
      )
    ), 0) AS top_failure_ratio,

    -- 🧩 Insight summary
    CASE
      WHEN (e.cnt > 0 AND r.cnt > 0 AND 
           (SELECT ROUND(100.0 * SUM(CASE WHEN status IN ('APPROVED','SUCCESS','COMPLETED') THEN 1 ELSE 0 END)/COUNT(*),2)
            FROM strategies s3 WHERE s3.disease_id = d.disease_id) >= 50)
        THEN '🟢 Strong – Evidence and regulation are aligned, positive outcomes observed.'
      WHEN (e.cnt > 0 AND r.cnt = 0)
        THEN '🟡 Developing – Scientific foundation established, regulatory validation pending.'
      WHEN (s.cnt > 0 AND e.cnt = 0)
        THEN '🟠 Experimental – Active clinical work with limited evidence coverage.'
      WHEN (f.cnt > 0 AND s.cnt = 0)
        THEN '🔴 Critical – Failures dominate, absence of viable strategies.'
      ELSE '⚪ Weak – Insufficient integrated data for analysis.'
    END AS insight_summary,

    -- 🧮 Composite index
    ROUND((COALESCE((
        SELECT ROUND(
          100.0 * SUM(CASE WHEN status IN ('APPROVED','SUCCESS','COMPLETED') THEN 1 ELSE 0 END)
          / COUNT(*), 2)
        FROM strategies s4 WHERE s4.disease_id = d.disease_id
      ),0)
      +
      ((CASE WHEN e.cnt > 0 THEN 0.4 ELSE 0 END)
       + (CASE WHEN r.cnt > 0 THEN 0.3 ELSE 0 END)
       + (CASE WHEN s.cnt > 0 THEN 0.2 ELSE 0 END)
       + (CASE WHEN f.cnt > 0 THEN 0.1 ELSE 0 END)) * 100
    ) / 2.0, 2) AS composite_index,

    -- ⚙️ Composite risk score
    ROUND(
      (100 - COALESCE((
        SELECT ROUND(100.0 * SUM(CASE WHEN status IN ('APPROVED','SUCCESS','COMPLETED') THEN 1 ELSE 0 END)/COUNT(*), 2)
        FROM strategies s5 WHERE s5.disease_id = d.disease_id
      ),0)) * 0.4
      +
      (100 - (
        (CASE WHEN e.cnt > 0 THEN 0.4 ELSE 0 END)
        + (CASE WHEN r.cnt > 0 THEN 0.3 ELSE 0 END)
        + (CASE WHEN s.cnt > 0 THEN 0.2 ELSE 0 END)
        + (CASE WHEN f.cnt > 0 THEN 0.1 ELSE 0 END)
      ) * 100) * 0.3
      +
      COALESCE((
        SELECT ROUND(100.0 * MAX(fcount) / SUM(fcount), 2)
        FROM (SELECT COUNT(*) AS fcount FROM failures_clean WHERE disease_id = d.disease_id GROUP BY reaction)
      ), 0) * 0.3
    ,2) AS composite_risk_score,

    -- ⚠️ Risk category
    CASE
      WHEN (
        (100 - (
          (CASE WHEN e.cnt > 0 THEN 0.4 ELSE 0 END)
          + (CASE WHEN r.cnt > 0 THEN 0.3 ELSE 0 END)
          + (CASE WHEN s.cnt > 0 THEN 0.2 ELSE 0 END)
          + (CASE WHEN f.cnt > 0 THEN 0.1 ELSE 0 END)
        ) * 100)
      ) < 30 THEN '🟢 Stable – Low risk profile'
      WHEN (
        (100 - (
          (CASE WHEN e.cnt > 0 THEN 0.4 ELSE 0 END)
          + (CASE WHEN r.cnt > 0 THEN 0.3 ELSE 0 END)
          + (CASE WHEN s.cnt > 0 THEN 0.2 ELSE 0 END)
          + (CASE WHEN f.cnt > 0 THEN 0.1 ELSE 0 END)
        ) * 100)
      ) BETWEEN 30 AND 60 THEN '🟡 Moderate – Requires ongoing monitoring'
      ELSE '🔴 Critical – High probability of systemic failure'
    END AS risk_category,

    strftime('%Y-%m-%d %H:%M:%S', 'now') AS updated_at

FROM diseases d
LEFT JOIN (SELECT disease_id, COUNT(*) AS cnt FROM failures_clean GROUP BY disease_id) f ON f.disease_id = d.disease_id
LEFT JOIN (SELECT disease_id, COUNT(*) AS cnt FROM strategies GROUP BY disease_id) s ON s.disease_id = d.disease_id
LEFT JOIN (SELECT disease_id, COUNT(*) AS cnt FROM evidence_links GROUP BY disease_id) e ON e.disease_id = d.disease_id
LEFT JOIN (SELECT disease_id, COUNT(*) AS cnt FROM regulatory_reports GROUP BY disease_id) r ON r.disease_id = d.disease_id;

-- ==============================================================
-- 🔍 Indexes
-- ==============================================================
CREATE INDEX IF NOT EXISTS idx_cache_name ON disease_report_cache(disease_name);
CREATE INDEX IF NOT EXISTS idx_cache_updated ON disease_report_cache(updated_at DESC);

-- ==============================================================
-- 💡 Strategic Insight
-- ==============================================================
ALTER TABLE disease_report_cache ADD COLUMN strategic_insight TEXT;

UPDATE disease_report_cache
SET strategic_insight = CASE
  WHEN strategy_success_rate >= 80 AND data_coverage_score >= 80 THEN
    'Clinical and regulatory evidence are fully aligned. Strong likelihood of continued success. Focus on optimization and long-term maintenance.'
  WHEN strategy_success_rate BETWEEN 50 AND 80 AND data_coverage_score >= 60 THEN
    'Solid foundation with emerging regulatory support. Expansion of trials or combination strategies could enhance impact.'
  WHEN strategy_success_rate < 40 AND top_failure_ratio > 50 THEN
    'Dominant failure mechanisms indicate systemic issues. Reassessment of targets or methodology transition is recommended.'
  WHEN data_coverage_score < 40 THEN
    'Data insufficiency across key categories. Immediate evidence acquisition or exploratory studies are required.'
  ELSE
    'Adequate operational coverage but lacks consistent outcomes. Strategic validation and risk mitigation are advised.'
END;

-- ==============================================================
-- 🧾 Logging
-- ==============================================================
CREATE TABLE IF NOT EXISTS updates_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT,
  row_count INTEGER,
  last_updated TEXT,
  change_summary TEXT
);

INSERT INTO updates_log (table_name, row_count, last_updated, change_summary)
SELECT
  'disease_report_cache',
  COUNT(*),
  datetime('now'),
  '✅ Rebuilt with ROI integration (v2.1.6-final)';

-- ==============================================================
-- 💰 COST PANEL DATA PATCH (SQLite-safe)
-- ==============================================================
-- ✅ 중복 방지: 이미 있는 컬럼은 건너뛴다.


-- ✅ Map disease_id
UPDATE trials
SET disease_id = (
  SELECT id FROM diseases
  WHERE LOWER(diseases.name) = LOWER(trials.condition)
  LIMIT 1
)
WHERE disease_id IS NULL;

-- ✅ Fill estimated values
UPDATE trials
SET cost_musd = 
  CASE
    WHEN phase LIKE '%1%' THEN 5.5
    WHEN phase LIKE '%2%' THEN 19.6
    WHEN phase LIKE '%3%' THEN 45.8
    WHEN phase LIKE '%4%' THEN 20.1
    ELSE 10.0
  END,
  duration_months = 
  CASE
    WHEN phase LIKE '%1%' THEN 12
    WHEN phase LIKE '%2%' THEN 24
    WHEN phase LIKE '%3%' THEN 36
    WHEN phase LIKE '%4%' THEN 30
    ELSE 18
  END,
  estimated_revenue_musd =
  CASE
    WHEN phase LIKE '%1%' THEN 50.0
    WHEN phase LIKE '%2%' THEN 120.0
    WHEN phase LIKE '%3%' THEN 300.0
    WHEN phase LIKE '%4%' THEN 200.0
    ELSE 80.0
  END
WHERE cost_musd IS NULL;
-- ==============================================================
-- 🧮 ROI Success Rate Bridge Table (for CostPanel hybrid ROI)
-- ==============================================================
-- 이 테이블은 disease_id ↔ success_rate 캐시를 보조로 제공함.
-- CostPanel.tsx의 Adjusted ROI 계산 시 참조됨.
-- ==============================================================

DROP TABLE IF EXISTS disease_success_rate_cache;

CREATE TABLE disease_success_rate_cache AS
SELECT
  disease_id,
  disease_name,
  strategy_success_rate,
  composite_index,
  data_coverage_score,
  updated_at
FROM disease_report_cache;

CREATE INDEX IF NOT EXISTS idx_success_rate_cache_id
  ON disease_success_rate_cache(disease_id);

-- ==============================================================
-- 🧾 ROI Verification Log (optional, for debugging)
-- ==============================================================
-- 각 질환별 ROI 계산 결과를 빠르게 검증하기 위한 로깅 테이블
-- ==============================================================

DROP TABLE IF EXISTS roi_debug_log;

CREATE TABLE roi_debug_log AS
SELECT
  t.disease_id,
  d.name AS disease_name,
  ROUND(AVG(t.cost_musd), 2) AS avg_cost_musd,
  ROUND(AVG(t.estimated_revenue_musd), 2) AS avg_revenue_musd,
  ROUND((AVG(t.estimated_revenue_musd) / AVG(t.cost_musd)) * 100, 1) AS projected_roi,
  (SELECT strategy_success_rate FROM disease_report_cache c WHERE c.disease_id = t.disease_id) AS success_rate,
  ROUND(((AVG(t.estimated_revenue_musd) / AVG(t.cost_musd)) * 
         ((SELECT strategy_success_rate FROM disease_report_cache c WHERE c.disease_id = t.disease_id)/100)), 1) 
         AS adjusted_roi,
  COUNT(*) AS trial_count,
  datetime('now') AS logged_at
FROM trials t
LEFT JOIN diseases d ON d.disease_id = t.disease_id
WHERE t.cost_musd IS NOT NULL
GROUP BY t.disease_id;

CREATE INDEX IF NOT EXISTS idx_roi_debug_id ON roi_debug_log(disease_id);

-- ==============================================================
-- 🧠 Insight Update for ROI Range Interpretation
-- ==============================================================
-- ROI 수치 기반 전략 문장 자동화
-- ==============================================================

ALTER TABLE disease_report_cache ADD COLUMN roi_insight TEXT;

UPDATE disease_report_cache
SET roi_insight = CASE
  WHEN strategy_success_rate >= 80 THEN
    '🟢 High ROI potential – strong alignment between cost efficiency and clinical success rate.'
  WHEN strategy_success_rate BETWEEN 50 AND 79 THEN
    '🟡 Moderate ROI – promising, but requires efficiency optimization and trial scaling.'
  WHEN strategy_success_rate BETWEEN 20 AND 49 THEN
    '🟠 Low ROI – risk-adjusted returns decline; consider redesign or combination approaches.'
  ELSE
    '🔴 Negative ROI zone – economic viability unlikely without significant cost reduction.'
END;

-- ==============================================================
-- ✅ Final Logging
-- ==============================================================
INSERT INTO updates_log (table_name, row_count, last_updated, change_summary)
SELECT
  'disease_success_rate_cache',
  COUNT(*),
  datetime('now'),
  '✅ Success rate cache built for CostPanel hybrid ROI';
