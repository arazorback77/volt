import type { DuckDBConnection } from "@duckdb/node-api";
import { DuckDBInstance } from "@duckdb/node-api";

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig();

  const token = runtimeConfig.motherduckToken;
  // console.log("MotherDuckDB token: ", token);

  const instance = await DuckDBInstance.create("md:dev", {
    motherduck_token: token,
  });

  const connection = await instance.connect();

  console.log("MotherDuckDB initialized in motherdb.ts");

  // Make the connection available in server routes
  nitroApp.motherdb = connection;
});

// TypeScript declaration
declare module "nitropack" {
  interface NitroApp {
    motherdb: DuckDBConnection;
  }
}
