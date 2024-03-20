import express from "express";
import "dotenv/config";
import expressEjsLayouts from "express-ejs-layouts";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import session from "express-session";
import SequelizeStoreContructor from "connect-session-sequelize";

//Le pasamos la estrucutra de la sesion
const SequelizeStore = SequelizeStoreContructor(session.Store);

import db from "./config/db.js";

import indexRoutes from "./routes/indexRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mettiRoutes from "./routes/meetiRoutes.js";
import passport from "./config/passport.js";

db.sync({
  //force: true
})
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//Pasea los datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    store: new SequelizeStore({ db, tableName: "sessions" }),
  })
);

//inicilizar passport
app.use(passport.initialize());
app.use(passport.session());

//flash messages
app.use(flash());

app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  next();
});

app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/", mettiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`El seridor esta funcionando en el puerto ${process.env.PORT}`);
});
