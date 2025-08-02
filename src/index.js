require("dotenv").config();
const server = require('./app');
const { port, environment } = require("./config");

async function main() {
  console.log(environment);
  server.listen(port, ()=> console.log(`server listening on port ${port}`));
};

main();