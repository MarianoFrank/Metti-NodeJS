import passport from "passport";
import LocalStrategy from "passport-local";

import User from "../models/User.js";

//Configuro la estrategia local que usará passport

//Por defecto, LocalStrategy espera que el nombre de
//usuario se encuentre en el campo llamado "username" en la solicitud.
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Usar 'email' en lugar de 'username'
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        //intentamos buscar el usuario sin el campo del password
        const usuario = await User.findOne({ where: { email } });

        if (!usuario) {
          return done(null, false, { message: "Email incorrecto" });
        }

        if (usuario && usuario.active === false) {
          return done(null, false, { message: "Debe validar su cuenta" });
        }

        if (!usuario.validatePassword(password)) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        //Si el usuario existe y el password es correcto le pasamos el usuario
        return done(null, usuario);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//Determinamos 'QUE' informacion del usuario se almacena en la sesion (en este caso el id)
passport.serializeUser((usuario, done) => done(null, usuario.id));

//Passport recupera toda la info del usuario con el id guardado en "serializeUser"
//y este la entrega de manera facil en req.user, para si poder comprobar
//en cada solicitud quien es el usuario, ahorrandome el trabajo
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: "password" },
    });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export default passport;
