// src/components/WorldMap.tsx
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { EventData, EventLink } from "../types";

interface Props {
  events: EventData[];
  onSelectEvent: (event: EventData) => void;
  links?: EventLink[]; // ✅ 선택적 props (마커만 찍을 때는 필요 없음)
}

// 심각도 색상
function getSeverityColor(severity: number) {
  if (severity >= 4) return "red";
  if (severity === 3) return "orange";
  if (severity === 2) return "yellow";
  return "green";
}

export default function WorldMap({ events, onSelectEvent }: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <CircleMarker
          key={event.id}
          center={[event.lat, event.lng]}
          radius={10}
          pathOptions={{
            color: getSeverityColor(event.severity),
            fillColor: getSeverityColor(event.severity),
            fillOpacity: 0.9,
          }}
          eventHandlers={{
            click: () => {
              console.log("🟢 클릭된 이벤트:", event.title);
              onSelectEvent(event);
            },
          }}
        >
          <Tooltip>{event.title}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
