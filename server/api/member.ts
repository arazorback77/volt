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
  // const db = new duckdb.Database("./asset.duckdb");

  // return new Promise((resolve, reject) => {
  //   db.all("SELECT * FROM db.main.META_ATM LIMIT 10", (err, res) => {
  //     if (err) reject(err);
  //     resolve(res);
  //   });
  // });

  // const dbPath = resolve("./data/my_database.duckdb");
  // const db = new duckdb.Database("./asset.duckdb");
  //   const con = db.connect();
  // console.log("Con: ", con);
  // // Execute query
  // const result = await new Promise((resolve, reject) => {
  //   con.all("SELECT * FROM META_ATM LIMIT 10", (err, res) => {
  //     if (err) reject(err);
  //     resolve(res);
  //   });
  // });

  // return result;

  // const instance = await DuckDBInstance.create("./server/asset.duckdb");
  // console.log("Instance: ", instance);
  // const connection = await instance.connect();
  // console.log("Connection: ", connection);

  // const instance = await DuckDBInstance.create(":memory:");
  // const connection = await instance.connect();
  // console.log("Instance: ", instance);
  // console.log("Connection: ", connection);

  // const db = Database.open("./server/api/asset.duckdb"); // Use a file path for persistent data
  // const connection = db.connect();
  // await connection.run(`
  //   CREATE TABLE users (id INTEGER, name VARCHAR, age INTEGER);
  //   INSERT INTO users VALUES (1, 'Alice', 30), (2, 'Bob', 25);
  // `);

  // const { duckdb } = useNitroApp();
  // const result = (
  //   await duckdb.runAndReadAll("SELECT * FROM members where id=1")
  // ).getColumnsObjectJson();
  // console.log("Result: ", result);

  // return result.getRows();

  // return result.getRowObjectsJson();
  // return result.getColumnsObjectJson();
  return "members";
});
