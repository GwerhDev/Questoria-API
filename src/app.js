const express = require("express");
const server = express();
const routes = require("./routes");

const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const passport = require("passport");
const bodyParser = require("body-parser");
const { privateSecret, environment, clientUrl } = require("./config");

server.use(bodyParser.json({limit: '100mb'}));
server.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
server.use(morgan('dev'));
server.use(cookieParser());

server.use((req, res, next) => {
  const allowedOrigins = environment === 'production' ? ['https://questoria.cl', 'https://www.questoria.cl', 'https://api.questoria.cl'] : ['http://localhost:3000', 'http://localhost:5173', clientUrl];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

server.use(session({
  secret: privateSecret,
  resave: false,
  saveUninitialized: false
}));

server.use(passport.initialize());
server.use(bodyParser.json());
server.use(passport.session());
server.use('/', routes);

module.exports = server;
