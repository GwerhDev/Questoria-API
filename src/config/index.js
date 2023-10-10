const { production } = require("../misc/consts");

module.exports = {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  apiUrl: process.env.NODE_ENV === production ? process.env.API_URL_PROD : process.env.API_URL,
  clientUrl: process.env.NODE_ENV === production ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL,
  privateSecret: process.env.PRIVATE_SECRET,

  mongodbString: process.env.MONGODB_STRING,

  authClientId: process.env.AUTH_CLIENT_ID, 
  authClientSecret: process.env.AUTH_CLIENT_SECRET,
}