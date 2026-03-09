export default defineEventHandler(async (event) => {
  const { motherdb } = useNitroApp();
  console.log("MotherDB: ", motherdb);

  const result = await motherdb.runAndReadAll("SELECT * FROM mst_inst limit 2");
  // console.table(result.getRowObjects());

  return result.getRowObjectsJson();
});
