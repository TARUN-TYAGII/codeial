const express = require("express");
const env = require("./config/environment");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const expressEjsLayouts = require("express-ejs-layouts");
const app = express();
require("./config/view-helpers")(app);
const port = 7000;
const db = require("./config/mongoose");

//used for session-cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth-strategy");
const MongoStore = require("connect-mongo");
const saaSMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

//setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSocket = require("./config/chat_socket").chatSocket(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");
const path = require("path");

if ((env.name = "development")) {
  app.use(
    saaSMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: true,
      outputStyle: "expanded",
      prefix: "/css",
    })
  );
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(env.asset_path));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressEjsLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: env.session_cookie_key,
    secret: "shiva",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://localhost:27017",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the app ${err}`);
    return;
  }

  console.log(`App is running on ${port} port`);
});
