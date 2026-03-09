export default defineEventHandler(async (event) => {
  //   const { duckdb } = useNitroApp();
  //   console.log("DuckDB: ", duckdb);
  //   // Execute a query
  //   const result = await duckdb.runAndReadAll("SELECT * FROM members");

  // Result is returned as an array of objects
  //   return result.getRowObjectsJson();
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.oracleUrl;
  const baseymd = getRouterParam(event, "baseymd");

  console.log("baseymd: ", baseymd);

  const url = baseUrl + "ytm/" + baseymd;
  const response = await $fetch(url);
  return response;
});
