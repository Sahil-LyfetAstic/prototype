var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require("express-handlebars");
const TLD_DB = require("./config/connection1");
const DOM_DB = require("./config/connection2");
const ADMIN_DB = require("./config/connection3");
const USER_DB = require('./config/userDb')
const SERVICE_DB = require('./config/serviceConnection')
const KEYWORD_DB = require('./config/keywordDb')
var session = require("express-session");
const busboy = require('busboy')


var subadminRouter = require("./routes/adminUsers");
var sysRouter = require("./routes/sys");
var usersRouter = require('./routes/users')

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//data base connections
TLD_DB.connect((err) => {
  err ? console.log(err) : console.log("TLD_DB connected successfully");
});
DOM_DB.connect((err) => {
  err ? console.log(err) : console.log("DOM_DB connected successfully");
});
ADMIN_DB.connect((err) => {
  err ? console.log(err) : console.log("ADMIN_DB connected successfully");
});
USER_DB.connect((err)=>{
  err? console.log(err): console.log('USER_DB connected successfully' )
})
SERVICE_DB.connect((err)=>{
  err? console.log(err) : console.log('SERVICE_DB connection succesfully')
 })
 KEYWORD_DB.connect((err)=>{
   err? console.log(err) : console.log('KEYWORD_DB connected sucessfully')
 })

app.use(
  session({
    secret: "keyboard cat",
    httpOnly: false,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000000 },
  })
);


app.use("/", usersRouter);
app.use("/", sysRouter);
app.use('/',subadminRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
