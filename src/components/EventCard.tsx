import type { EventData } from "../types";

interface Props {
  event: EventData;
  onClose: () => void;
}

function getSeverityColor(severity: number) {
  if (severity >= 4) return "bg-red-600";
  if (severity === 3) return "bg-orange-500";
  if (severity === 2) return "bg-yellow-400 text-black";
  return "bg-green-600";
}

export default function EventCard({ event, onClose }: Props) {
  const parseField = (field: string | string[] | null | undefined) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return field.split(",").map((x) => x.trim()).filter(Boolean);
    }
    return [];
  };

  const companies = parseField(event.affected_companies);
  const products = parseField(event.affected_products);

  return (
    <div className="w-full h-[70vh] bg-white shadow-2xl rounded-t-2xl p-8 border-t border-gray-300 overflow-y-auto">
      {/* 제목 */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
        {event.title}
      </h2>

      {/* 메타 정보 */}
      <div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
        <span className="px-3 py-1 bg-gray-100 rounded-md">{event.type}</span>
        <span
          className={`px-3 py-1 rounded-md text-white text-xs ${getSeverityColor(
            event.severity
          )}`}
        >
          심각도 {event.severity}
        </span>
        <span className="ml-auto italic">{event.source}</span>
      </div>

      {/* 설명 */}
      {event.description && (
        <p className="text-gray-800 mb-6 leading-relaxed">
          {event.description}
        </p>
      )}

      {/* 영향 점수 */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-1">영향 점수</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-gray-200 rounded">
            <div
              className="h-3 rounded bg-blue-600"
              style={{ width: `${event.impact_score ?? 0}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-blue-600">
            {event.impact_score ?? 0}%
          </span>
        </div>
      </div>

      {/* 관련 기업 */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-2">관련 기업</p>
        <div className="flex flex-wrap gap-2">
          {companies.length > 0 ? (
            companies.map((c, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
              >
                {c}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">없음</span>
          )}
        </div>
      </div>

      {/* 관련 제품 */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 mb-2">관련 제품</p>
        <div className="flex flex-wrap gap-2">
          {products.length > 0 ? (
            products.map((p, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
              >
                {p}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">없음</span>
          )}
        </div>
      </div>

      {/* 닫기 버튼 */}
      <div className="mt-8">
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
