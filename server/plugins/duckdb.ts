import type { DuckDBConnection } from "@duckdb/node-api";
import { DuckDBInstance } from "@duckdb/node-api";

export default defineNitroPlugin(async (nitroApp) => {
  // Initialize in-memory database
  // Use ':memory:' or a filename for persistent storage
  //   const instance = await DuckDBInstance.create(":memory:");
  //   const instance = await DuckDBInstance.create("./server/api/asset.duckdb");
  const instance = await DuckDBInstance.create("./server/db.duckdb");
  //   const instance = await DuckDBInstance.create("./.data/db.duckdb");
  const connection = await instance.connect();

  // Initialize data (optional)
  //   await connection.run(`
  //     CREATE TABLE members (id INTEGER, name VARCHAR, age INTEGER);
  //     INSERT INTO members VALUES (1, 'Alice', 30), (2, 'Bob', 25);
  //   `);

  console.log("DuckDB initialized in duckdb.ts");

  // Make the connection available in server routes
  nitroApp.duckdb = connection;
});

// TypeScript declaration
declare module "nitropack" {
  interface NitroApp {
    duckdb: DuckDBConnection;
  }
}
