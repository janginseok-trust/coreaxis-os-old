// scripts/location_mapper.js (ESM)

// 국가/지역 키워드 → 좌표 매핑
const locationMap = {
  Russia: [61, 105],
  Ukraine: [49, 32],
  China: [35, 103],
  Japan: [36, 138],
  UK: [55, -3],
  "United States": [37, -95],
  America: [37, -95],
  Brazil: [-10, -55],
  Argentina: [-34, -64],
  Germany: [51, 10],
  France: [46, 2],
  Netherlands: [52, 5],
  Singapore: [1.3, 103.8],
  SaudiArabia: [24, 45],
  Iraq: [33, 44],
  Iran: [32, 53],
  Angola: [-12, 18],

  // ✅ fallback 지역 키워드
  Global: [20, 0],
  Europe: [50, 10],
  Asia: [30, 100],
  Africa: [0, 20],
  MiddleEast: [25, 45],
};

export function mapLocation(text = "") {
  for (const key of Object.keys(locationMap)) {
    if (text.includes(key)) {
      return { country: key, coords: locationMap[key] };
    }
  }

  // ✅ 기본 fallback (못 찾으면 Global 처리)
  return { country: "Global", coords: locationMap["Global"] };
}
