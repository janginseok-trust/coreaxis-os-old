// 이벤트 데이터 타입
export interface EventData {
  id: number;
  timestamp: string;
  title: string;
  type: "trade" | "logistics" | "resource" | "strike" | "policy";
  severity: number;
  source: string;
  location: string;
  lat: number;
  lng: number;
  description?: string;              // 옵셔널 (DB에서 없을 수 있음)
  impact_score?: number;             // 숫자
  affected_companies?: string | string[]; // TEXT(JSON) or 배열
  affected_products?: string | string[];  // TEXT(JSON) or 배열
}

// 이벤트 간 링크 (관계) 타입
export interface EventLink {
  id: number;
  source_event_id: number;
  target_event_id: number;
  relation_type: string; // 예: "same_product", "same_company", "location_related"
}
