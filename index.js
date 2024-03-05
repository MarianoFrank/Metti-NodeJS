import express from "express";
import "dotenv/config";
import expressEjsLayouts from "express-ejs-layouts";
import bodyParser from "body-parser";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import session from "express-session";

import db from "./config/db.js";

import indexRoutes from "./routes/indexRoutes.js";
import userRoutes from "./routes/userRoutes.js";

db.sync(
  //{ force: true }
  )
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//Body parser, leer forms
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("views", "./views");
app.use(express.static("public"));

//habilitar cookie parser
app.use(cookieParser());

//Crear session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    key: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

//flash messages
app.use(flash());

app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  next();
});

app.use("/", indexRoutes);
app.use("/", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`El seridor esta funcionando en el puerto ${process.env.PORT}`);
});
