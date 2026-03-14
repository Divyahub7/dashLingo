import Database from "better-sqlite3";
import fs from "fs";
import Papa from "papaparse";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, "../db/business.db"));

db.exec(`DROP TABLE IF EXISTS bmw_inventory`);
db.exec(`
  CREATE TABLE bmw_inventory (
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

const file = fs.readFileSync(
  join(__dirname, "BMW Vehicle Inventory.csv"),
  "utf8",
);

const csvStart = file.indexOf("model");
const csvContent = file.slice(csvStart);

const { data } = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (h) => h.trim(),
});

const insert = db.prepare(`
  INSERT INTO bmw_inventory
  (model, year, price, transmission, mileage, fuelType, tax, mpg, engineSize)
  VALUES (@model, @year, @price, @transmission, @mileage, @fuelType, @tax, @mpg, @engineSize)
`);

let count = 0;
for (const row of data) {
  if (!row.model) continue;
  try {
    insert.run({
      model: row.model.trim(),
      year: parseInt(row.year),
      price: parseFloat(row.price),
      transmission: row.transmission?.trim(),
      mileage: parseInt(row.mileage),
      fuelType: row.fuelType?.trim(),
      tax: parseFloat(row.tax),
      mpg: parseFloat(row.mpg),
      engineSize: parseFloat(row.engineSize),
    });
    count++;
  } catch (e) {
    console.error("Skipped row:", row, e.message);
  }
}

console.log(`Seeded ${count} rows into bmw_inventory`);
db.close();
