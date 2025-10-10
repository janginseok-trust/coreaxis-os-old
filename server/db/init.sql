-- 기존 테이블 제거
DROP TABLE IF EXISTS strategies;
DROP TABLE IF EXISTS evidence_links;
DROP TABLE IF EXISTS failure_reasons;
DROP TABLE IF EXISTS disease_profiles;

DROP TABLE IF EXISTS gene_variants;
DROP TABLE IF EXISTS disease_gene_reference;
DROP TABLE IF EXISTS drugs;
DROP TABLE IF EXISTS drug_synonyms;
DROP TABLE IF EXISTS trials;
DROP TABLE IF EXISTS pubmed;
DROP TABLE IF EXISTS failures;

------------------------------------------------------
-- 🔹 전략/콘솔용 테이블
------------------------------------------------------

CREATE TABLE strategies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gene TEXT,
    disease TEXT,
    drug TEXT,
    delivery TEXT,
    status TEXT,
    success_rate REAL,
    failure_reasons TEXT,
    evidence_summary TEXT,
    date TEXT,
    notes TEXT
);

CREATE TABLE evidence_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strategy_id INTEGER NOT NULL,
    url TEXT,
    quote TEXT,
    source_type TEXT,
    FOREIGN KEY (strategy_id) REFERENCES strategies (id)
);

CREATE TABLE failure_reasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strategy_id INTEGER NOT NULL,
    reason_code TEXT,
    reason_desc TEXT,
    FOREIGN KEY (strategy_id) REFERENCES strategies (id)
);

CREATE TABLE disease_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease_name TEXT,
    gene TEXT,
    known_target TEXT,
    strategy_attempted INTEGER,
    success_rate REAL,
    total_trials INTEGER
);

------------------------------------------------------
-- 🔹 ETL 원본 데이터 테이블
------------------------------------------------------

-- Gene variants (ClinVar, MedGen, Orphanet 등)
CREATE TABLE gene_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gene TEXT,
    gene_symbol TEXT, -- ETL 스크립트에서 요구
    variant TEXT,
    disease TEXT,
    clinical_significance TEXT,
    source TEXT
);

CREATE INDEX idx_gene_variants_gene ON gene_variants(gene);
CREATE INDEX idx_gene_variants_disease ON gene_variants(disease);
CREATE INDEX idx_gene_variants_clinsig ON gene_variants(clinical_significance);

-- Disease ↔ Gene reference
CREATE TABLE disease_gene_reference (
    disease TEXT,
    gene TEXT
);

-- Drugs (ChEMBL, DrugBank)
CREATE TABLE drugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drug_name TEXT,          -- 대표 이름
    synonyms TEXT,           -- comma-separated synonyms
    smiles TEXT,             -- 화학식 구조 (canonical SMILES)
    mechanism TEXT,          -- 기전
    approval_status TEXT,    -- 승인 단계 / 임상 단계
    toxicity TEXT,           -- 독성 정보
    target TEXT,             -- 타겟
    source TEXT              -- 데이터 출처
);

-- Drug Synonyms (ChEMBL, DrugBank alias 반영)
CREATE TABLE drug_synonyms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drug_id INTEGER NOT NULL,           -- FK → drugs.id
    synonym TEXT NOT NULL,              -- synonym, trade name, alias
    source TEXT,                        -- "ChEMBL", "DrugBank", ...
    FOREIGN KEY (drug_id) REFERENCES drugs (id)
);

CREATE INDEX idx_drug_synonyms_drug_id ON drug_synonyms(drug_id);
CREATE INDEX idx_drug_synonyms_synonym ON drug_synonyms(synonym);

-- Clinical Trials (ClinicalTrials.gov)
CREATE TABLE trials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nct_id TEXT,
    title TEXT,
    status TEXT,
    phase TEXT,
    condition TEXT,
    intervention TEXT,
    start_date TEXT,
    completion_date TEXT,
    source TEXT
);

-- PubMed papers
CREATE TABLE pubmed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pmid TEXT,
    title TEXT,
    abstract TEXT,
    url TEXT,
    disease TEXT,
    gene TEXT,
    source TEXT
);

-- Failures (임상 실패/부작용/중단)
CREATE TABLE failures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drug_name TEXT,
    disease TEXT,
    reason TEXT,
    phase TEXT,
    year TEXT,
    source TEXT
);
