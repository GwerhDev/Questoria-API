const { production } = require("../misc/consts");

module.exports = {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  apiUrl: process.env.NODE_ENV === production ? process.env.API_URL_PROD : process.env.API_URL,
  clientUrl: process.env.NODE_ENV === production ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL,

  adminEmailList: process.env.ADMIN_EMAIL_LIST,

  privateSecret: process.env.PRIVATE_SECRET,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  defaultUsername: process.env.DEFAULT_USERNAME,

  mongodbString: process.env.MONGODB_STRING,

  authClientId: process.env.AUTH_CLIENT_ID, 
  authClientSecret: process.env.AUTH_CLIENT_SECRET,
}