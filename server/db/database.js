import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, "business.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS bmw_inventory (
    model        TEXT,
    year         INTEGER,
    price        REAL,
    transmission TEXT,
    mileage      INTEGER,
    fuelType     TEXT,
    tax          REAL,
    mpg          REAL,
    engineSize   REAL
  )
`);

export default db;
