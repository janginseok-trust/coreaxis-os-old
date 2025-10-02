import { useEffect, useState } from "react";
import WorldMap from "./components/WorldMap";
import EventCard from "./components/EventCard";
import type { EventData } from "./types";
import { AnimatePresence, motion } from "framer-motion";

export default function App() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  useEffect(() => {
    window.api.getEvents().then((rows: EventData[]) => {
      console.log("✅ DB에서 불러온 이벤트 개수:", rows.length);
      console.table(rows);
      setEvents(rows);
    });
  }, []);

  return (
    <div
      id="root-app"
      style={{ width: "100%", height: "100vh", position: "relative" }}
    >
      <WorldMap events={events} onSelectEvent={setSelectedEvent} />

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="absolute bottom-0 left-0 w-full z-50"
          >
            <EventCard
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
