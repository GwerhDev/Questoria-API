require("dotenv").config();
const server = require('./app');
const { port, environment } = require("./config");
const connectMongoDB = require("./integrations/mongodb");

async function main() {
  console.log(environment);
  await connectMongoDB();
  server.listen(port, ()=> console.log(`server listening on port ${port}`));
};

main();