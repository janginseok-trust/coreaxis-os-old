import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../sqlite/events.db");
const db = new Database(dbPath);

export function getEvents() {
  return db.prepare("SELECT * FROM events").all();
}
