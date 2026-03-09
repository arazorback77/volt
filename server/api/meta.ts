// server/api/data.get.ts
// import duckdb from "duckdb";
import {
  DuckDBInstance,
  INTEGER,
  LIST,
  listValue,
  VARCHAR,
} from "@duckdb/node-api";

export default defineEventHandler(async (event) => {
  const { duckdb } = useNitroApp();
  const result = (
    await duckdb.runAndReadAll("SELECT * FROM META_ATM limit 10")
  ).getRowObjectsJson();
  // console.log("Result: ", result);

  // return result.getRows();

  // return result.getRowObjectsJson();
  // return result.getColumnsObjectJson();
  return result;
});
