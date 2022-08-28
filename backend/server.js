// Declarations and Imports
var express = require("express");
require("dotenv").config();
var session = require("express-session");
var uuid = require("uuid/v4");
var cors = require("cors");
var app = express();
var cookieParser = require("cookie-parser");
var dbConnection = require("./dbConnection");
var runAPIS = require("./API/index");
const jwt = require("jsonwebtoken");

const methodOverride = require('method-override');

app.set('view engine', 'ejs');
//// MiddleWare
app.use(cors());

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  next();
});
app.options("*", cors(),
  // app.use(Authenticate)
);

app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.json());
app.use(
  session({
    genid: uuid,
    secret: "LMS Project",
    resave: false,
    saveUninitialized: true
  })
);



function Authenticate(req, resp, next) {
  if (
    req.url === "/signup" ||
    req.url === "/signin" ||
    req.url === "/" ||
    req.url === "/dashboard/signin"
  ) {
    next();
  } else {
    var token = req.header("x-auth-token");
    if (!token) return resp.status(401).send("Access Denied");
    try {
      const verified = jwt.verify(token, process.env.jwtPrivateKey);
      req.user = verified;
      next();
    } catch (err) {
      resp.status(400).send("Invalid Token");
    }
  }
}

dbConnection();
runAPIS(app);

app.get("/", (req, resp) => {
  // resp.send("LMS IS CREATED .............");

  resp.render('index');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
