import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import jwt from "jsonwebtoken";
import * as constantes from "../config/constants.js";

let headers = null;

passport.use(
  constantes.ESTRATEGIA_LOCAL,
  new LocalStrategy(
    {
      usernameField: "email", // Usar email como identificador en lugar de username
      passwordField: "password", // Campo de contraseña en el formulario
    },
    async (email, password, done) => {
      console.log("🔐 Iniciando estrategia local para:", email, password);

      // Configuración de headers para las peticiones HTTP a la API de validación
      headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY_VALIDACION_LOCAL,
      };

      try {
        console.log("🔍 Obtiene los datos del usuario desde la BD");
        // Paso 1: Buscar usuario por email en la base de datos
        const cadUsuario = `${constantes.URL_API_BD_GW}/usuarios/validar/${email}`;
        console.log("🔍 Busca usuario en:", cadUsuario);

        const usuario = await fetch(cadUsuario, {
          method: "GET",
          headers,
        });
        const jsonUsuario = await usuario.json();

        console.log("📋 Respuesta búsqueda usuario:", jsonUsuario);

        // Validar que el usuario existe
        if (!jsonUsuario || jsonUsuario.length === 0) {
          console.log("❌ Usuario no encontrado");
          return done(null, false, { message: "Usuario no encontrado" });
        }

        const user = jsonUsuario[0]; // Obtener el primer usuario del array de resultados

        console.log("🔍 Obtiene el password del usuario desde la BD");
        // Paso 2: Obtener la contraseña del usuario desde la base de datos
        const cadClave = `${constantes.URL_API_BD_GW}/usuarios/${user.id}/clave`;
        console.log("🔍 Busca clave en:", cadClave);

        const clave = await fetch(cadClave, {
          method: "GET",
          headers,
        });

        const jsonClave = await clave.json();
        console.log("📋 Respuesta búsqueda password:", jsonClave[0].clave);

        // Paso 3: Validar que el usuario tiene contraseña configurada
        if (!jsonClave[0].clave) {
          console.log("❌ Usuario no tiene contraseña configurada");
          return done({
            error: null,
            success: false,
            user: null,
            mensaje: "Usuario sin contraseña",
          });
        }

        // Paso 4: Comparar contraseña ingresada con la almacenada
        // IMPORTANTE: En producción debería usar bcrypt.compare() para contraseñas hasheadas
        if (jsonClave[0].clave != password) {
          console.log("❌ Contraseña incorrecta");
          return done({
            error: null,
            success: false,
            user: null,
            mensaje: "Contraseña incorrecta",
          });
        }

        console.log("✅ Usuario validado exitosamente", user);

        // Paso 5: Crear JWT para acceso a las APIs
        const payload = {
          id: user.id,
          email: email,
          name: user.name,
        };

        console.log("🔐 Creando JWT con payload:", payload);
        // Firmar el token con la clave secreta y establecer expiración
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: constantes.expiracionJWT,
        });

        console.log("Devuelve los datos completos del usuario autenticado");
        // Paso 6: Retornar usuario autenticado con token
        done({
          error: null,
          success: true,
          user: {
            id: user.id,
            emails: [{ value: email }],
            displayName: user.name,
            strategy: constantes.ESTRATEGIA_LOCAL,
            jwtToken: jwtToken,
            token: process.env.API_KEY_VALIDACION_LOCAL, // Token JWT para peticiones subsecuentes
          },
          mensaje: "",
        });
      } catch (error) {
        console.error("❌ Error en autenticación local:", error);
        return done({
          error: true,
          success: false,
          user: null,
          mensaje: error,
        });
      }
    }
  )
);

passport.use(
  constantes.ESTRATEGIA_GITHUB,
  new GitHubStrategy(constantes.PASSPORT_GITHUB_CONFIG, function (
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    //console.log(profile);
    done(null, profile);
  })
);

passport.use(
  constantes.ESTRATEGIA_GOOGLE,
  new GoogleStrategy(
    constantes.PASSPORT_GOOGLE_CONFIG,
    async (accessToken, refreshToken, profile, done) => {
      console.log("Retorno del servidor de autorización de Google.");
      console.log("token para acceder a APIs de Google:", accessToken); // Token para acceder a APIs de Google
      console.log("refreshToken:", refreshToken);

      try {
        //Valida si el usuario existe en la base de datos local
        console.log("🔍 Valida si el usuario existe en la base de datos local");
        const cadUsuario = `${constantes.URL_API_BD_GW}/usuarios/validar/${profile.emails[0].value}`;
        console.log("Validar usuario en: ", cadUsuario);

        // Configuración de headers para las peticiones HTTP a la API de validación
        headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        const resultadoBuscarUsuario = await fetch(cadUsuario, {
          method: "GET",
          headers,
        });
        const jsonResultadoBuscarUsuario = await resultadoBuscarUsuario.json();
        console.log(
          "Respuesta validacion id usuario: ",
          jsonResultadoBuscarUsuario
        );

        if (jsonResultadoBuscarUsuario.length === 0) {
          console.log("No existe el usuario");
          done(null, false);
        } else {
          console.log("✅ Usuario validado exitosamente");

          //Crea el JWT para acceso a las APIS
          const payload = {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.name,
          };

          console.log("🔐 Creando JWT con payload:", payload);
          const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: constantes.expiracionJWT,
          });

          // ✅ Agregar tokens al perfil del usuario
          profile.token = accessToken;
          profile.refreshToken = refreshToken;
          profile.jwtToken = jwtToken;
          profile.strategy = constantes.ESTRATEGIA_GOOGLE;

          console.log("Devuelve los datos completos del usuario autenticado");
          done(null, { profile, jwtToken: jwtToken });
        }
      } catch (err) {
        console.log("Problemas con la autenticacion");
        console.log("error", err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  //console.log("=== SERIALIZE USER MIDDLEWARE ===");
  //console.log("user", user);
  let estrategia;

  try {
    // Serializar solo el ID o información mínima necesaria
    if (user.profile && user.profile.strategy) {
      estrategia = user.profile.strategy;
    }
    if (user.strategy) {
      estrategia = user.strategy;
    }

    switch (estrategia) {
      case constantes.ESTRATEGIA_LOCAL:
        {
          const serialized = {
            id: user.id,
            email: user.emails[0].value,
            displayName: user.displayName,
            token: user.token,
            strategy: user.strategy,
          };
          //console.log("Serializando como LOCAL:", serialized);
          done(null, serialized);
        }
        break;
      case constantes.ESTRATEGIA_GOOGLE:
        {
          const serialized = {
            id: user.profile.id,
            email: user.profile.emails[0].value,
            displayName: user.profile.displayName,
            token: user.token,
            strategy: user.strategy,
          };
          console.log("Serializando como GOOGLE:", serialized);
          done(null, serialized);
        }
        break;
      default:
        {
          const serialized = {
            id: user.id,
            email: user.emails[0].value,
            displayName: user.displayName,
            //token: user.token,
            strategy: user.strategy,
          };
          console.log("Serializando como GOOGLE:", serialized);
          done(null, serialized);
        }
        break;
    }

    /*if (user.profile) {
      // Para estrategia local
      const serialized = {
        id: user.profile.id,
        email: user.profile.emails[0].value,
        displayName: user.profile.displayName,
        token: user.token,
        strategy: constantes.ESTRATEGIA_LOCAL,
      };
      console.log("Serializando como LOCAL:", serialized);
      done(null, serialized);
    } else if (user.emails) {
      // Para estrategias OAuth (Google, GitHub)
      const serialized = {
        id: user.id,
        email: user.emails[0].value,
        displayName: user.displayName,
        photos: user.photos || [],
        accessToken: user.accessToken,
        strategy: "oauth",
      };
      console.log("Serializando como OAUTH:", serialized);
      done(null, serialized);
    } else {
      // Fallback
      console.log("Serializando como FALLBACK:", user);
      done(null, user);
    }*/
  } catch (error) {
    console.log("ERROR en serializeUser:", error);
    done(error, null);
  }
});

passport.deserializeUser((serializedUser, done) => {
  /*console.log("=== DESERIALIZE USER ===");
  console.log(
    "serializedUser recibido:",
    JSON.stringify(serializedUser, null, 2)
  );*/

  try {
    // Reconstruir el objeto user desde los datos serializados
    done(null, serializedUser);
  } catch (error) {
    console.log("ERROR en deserializeUser:", error);
    done(error, null);
  }
});
