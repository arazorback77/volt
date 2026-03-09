import { DuckDBInstance } from "@duckdb/node-api";

export default defineEventHandler(async (event) => {
  // Create connection to your default database
  // const instance = await DuckDBInstance.create("md:dev");
  // const token = process.env.MOTHERDUCK_TOKEN;

  const instance = await DuckDBInstance.create("md:dev", {
    motherduck_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFyYXpvcmJhY2s3N0BnbWFpbC5jb20iLCJzZXNzaW9uIjoiYXJhem9yYmFjazc3LmdtYWlsLmNvbSIsInBhdCI6IjlMaUg2dW5SSk5pcXNVWWlrSHh5S3U0MGhkVTlFSUdnNURZM0NHeVdaWTgiLCJ1c2VySWQiOiJlOWEwODc2ZC1jYWY3LTQ0OWMtYWNjNi0xZjAyMDYzZjkxZTgiLCJpc3MiOiJtZF9wYXQiLCJyZWFkT25seSI6ZmFsc2UsInRva2VuVHlwZSI6InJlYWRfd3JpdGUiLCJpYXQiOjE3NTU1ODkyNTV9.rvwjIthxsL7a6TkIBn5fO7vRTnUYHpZ6RNIyJXflqQY",
  });
  const conn = await instance.connect();
  // ...

  // Run queries
  // await conn.run(
  //   "CREATE TABLE items (item VARCHAR, value DECIMAL(10, 2), count INTEGER)"
  // );
  // await conn.run(
  //   "INSERT INTO items VALUES ('jeans', 20.0, 1), ('hammer', 42.2, 2)"
  // );
  const result = await conn.runAndReadAll("SELECT * FROM mst_inst");
  console.table(result.getRowObjects());

  return result.getRowObjects();
});
