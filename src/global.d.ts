import type { EventData } from "./types";

export {};

declare global {
  interface Window {
    api: {
      getEvents: () => Promise<EventData[]>;
    };
  }
}
