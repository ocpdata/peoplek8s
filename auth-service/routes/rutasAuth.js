import { Router } from "express";
import passport from "passport";
import Redis from "ioredis";

// Configurar Redis para compartir datos de usuario entre microservicios
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis-service',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error in auth-service:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis connected in auth-service');
});

//=========== Constantes ================
import * as constantes from "../config/constants.js";

const loginRouter = Router();

/**
 * Ruta POST /login - Autenticación local con usuario y contraseña
 * Utiliza Passport con estrategia local para validar credenciales
 * Si la autenticación es exitosa, crea una sesión y establece un token JWT en cookie
 */
loginRouter.post("/login", (req, res, next) => {
  console.log("=== Acceso a /login ===");
  console.log("req.body:", req.body);

  // Ejecuta la estrategia de autenticación local (valida usuario/contraseña)
  console.log("Iniciando passport.authenticate para estrategia local");
  passport.authenticate(constantes.ESTRATEGIA_LOCAL, (resultadoEstrategia) => {
    console.log("Retorna de la estrategia local:", resultadoEstrategia);

    // Si hubo un error interno durante la autenticación
    if (resultadoEstrategia.error) {
      return res.status(500).json({
        error: resultadoEstrategia.error,
        success: resultadoEstrategia.success,
        user: resultadoEstrategia.user,
        mensaje: resultadoEstrategia.mensaje,
      });
    }

    // Si las credenciales son inválidas (usuario no encontrado o contraseña incorrecta)
    if (!resultadoEstrategia.success) {
      return res.status(401).json({
        error: resultadoEstrategia.error,
        success: resultadoEstrategia.success,
        user: resultadoEstrategia.user,
        mensaje: resultadoEstrategia.mensaje,
      });
    }

    console.log("Registra en req.login:", resultadoEstrategia.user);
    // req.login() registra el usuario en la sesión y serializa los datos
    // Esto establece req.session.passport.user con los datos del usuario
    req.login(resultadoEstrategia.user, async (error) => {
      console.log("=== Dentro de req.login ===");
      if (error) {
        console.log("Error en req.login:", error);
        return res.status(500).json({
          error: true,
          success: false,
          user: null,
          mensaje: error,
        });
      }

      console.log("--- req.isAuthenticated():", req.isAuthenticated());

      // Obtener datos serializados del usuario desde la sesión
      // req.user mantiene la estructura original, los datos serializados están en req.session.passport.user
      const serializedUser = req.session.passport.user;
      console.log("--- serializedUser desde session:", serializedUser);

      // Preparar respuesta con datos básicos del usuario
      const data = {
        error: false,
        success: true,
        user: {
          id: serializedUser?.id || user.profile.id,
          email: serializedUser?.email || user.profile.emails[0].value,
          displayName: serializedUser?.displayName || user.profile.displayName,
        },
        mensaje: "Usuario validado",
      };

      const jwtToken = resultadoEstrategia.user?.jwtToken;
      if (jwtToken) {
        const cookieOptions = {
          httpOnly: true, // No accesible desde JavaScript del cliente (protección XSS)
          secure: true, // Solo se envía sobre HTTPS
          sameSite: "lax", // Permite cookies en navegación normal (balance seguridad/usabilidad)
          domain: ".digitalvs.com", // Compartir entre subdominios (api.digitalvs.com, app.digitalvs.com)
          maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
          path: "/", // Disponible en todas las rutas del dominio
        };
        res.cookie("jwt", jwtToken, cookieOptions);
        console.log("🍪 Cookie JWT establecida:", jwtToken);

        // Guardar datos del usuario en Redis al momento de autenticar
        console.log("🔍 Guardando datos del usuario en Redis con key:", `user:${jwtToken}`);
        try {
          await redis.setex(
            `user:${jwtToken}`,
            86400, // 24 horas en segundos
            JSON.stringify(serializedUser)
          );
          console.log('✅ Datos de usuario guardados en Redis desde auth-service');
        } catch (redisError) {
          console.error('⚠️ Error guardando en Redis:', redisError);
        }
      }

      // Enviar respuesta exitosa con datos del usuario
      console.log("Envia datos basicos del usuario al cliente");
      return res.status(200).json(data);
    });
  })(req, res, next);
});

//=========== GITHUB ================
//========== LOGIN AUTH ================
loginRouter.get(
  "/github",
  passport.authenticate(constantes.ESTRATEGIA_GITHUB, {
    scope: ["profile"],
  })
);

//=========== LOGIN CALLBACK ===========
loginRouter.get(
  "/github/callback",
  passport.authenticate(constantes.ESTRATEGIA_GITHUB, {
    failureRedirect: "/login/failed",
  }),
  async function (req, res, next) {
    // Autenticación exitosa
    console.log("Validación GitHub exitosa");
    console.log("Usuario", req.user.profile?.displayName);

    // Establecer JWT en cookie
    const token = req.user?.token;
    if (token) {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        domain: ".digitalvs.com",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      };
      res.cookie("jwt", token, cookieOptions);
      console.log("🍪 Cookie JWT establecida para GitHub auth");

      // Guardar datos del usuario en Redis al momento de autenticar
      try {
        await redis.setex(
          `user:${token}`,
          86400,
          JSON.stringify({
            id: req.user.id,
            displayName: req.user.displayName,
            email: req.user.email,
            emails: req.user.emails,
            photos: req.user.photos,
            strategy: req.user.strategy || 'github'
          })
        );
        console.log('✅ Datos de usuario guardados en Redis desde GitHub auth');
      } catch (redisError) {
        console.error('⚠️ Error guardando en Redis:', redisError);
      }
    }

    res.redirect(constantes.URL_FRONT_END);
  }
);

//=========== GOOGLE ================
//========== LOGIN AUTH ================
loginRouter.get(
  "/google",
  (req, res, next) => {
    console.log("Iniciando autenticación Google...");
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("Callback URL esperado:", constantes.PASSPORT_GOOGLE_CONFIG?.callbackURL);
    next();
  },
  passport.authenticate(constantes.ESTRATEGIA_GOOGLE, {
    scope: ["openid", "profile", "email"],
  })
);

//=========== LOGIN CALLBACK ===========
loginRouter.get(
  "/google/callback",
  (req, res, next) => {
    console.log("=== Acceso a /google/callback ===");
    console.log("Iniciando passport.authenticate para estrategia google");
    next();
  },
  passport.authenticate(constantes.ESTRATEGIA_GOOGLE, {
    failureRedirect: `${constantes.URL_FRONT_END}/auth/login/failed`,
  }),
  async function (req, res, next) {
    // Autenticación exitosa
    console.log("Validación Google exitosa");
    console.log("Usuario", req.user.profile);
    
    const jwtToken = req.user?.profile.jwtToken;
    console.log("🍪 Cookie JWT establecida:", jwtToken);
    
    if (jwtToken) {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        domain: ".digitalvs.com",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      };
      res.cookie("jwt", jwtToken, cookieOptions);
      console.log("🍪 Cookie JWT establecida:", jwtToken);

      // Guardar datos del usuario en Redis al momento de autenticar
      try {
        await redis.setex(
          `user:${jwtToken}`,
          86400,
          JSON.stringify({
            id: req.user.id,
            email: req.user.email,
            emails: req.user.emails,
            displayName: req.user.displayName,
            photos: req.user.photos,
            strategy: req.user.profile.strategy || 'google',
            jwtToken: jwtToken,
            token: req.user.profile.token // Guardar token de acceso a APIs de Google
          })
        );
        console.log('✅ Datos de usuario guardados en Redis desde Google auth');
      } catch (redisError) {
        console.error('⚠️ Error guardando en Redis:', redisError);
      }
    }

    // Enviar respuesta exitosa con datos del usuario
    console.log("Envia datos basicos del usuario al cliente");
    res.redirect(constantes.URL_FRONT_END);
  }
);

//=========== FACEBOOK ================
//========== LOGIN AUTH ================
loginRouter.get(
  "/facebook",
  passport.authenticate(constantes.ESTRATEGIA_FACEBOOK, { scope: ["profile"] })
);

//=========== LOGIN CALLBACK ===========
loginRouter.get(
  "/facebook/callback",
  passport.authenticate(constantes.ESTRATEGIA_FACEBOOK, {
    failureRedirect: "/login/failed",
  }),
  async function (req, res, next) {
    // Autenticación exitosa
    console.log("Validación Facebook exitosa");
    console.log("Usuario", req.user.profile?.displayName);

    // Establecer JWT en cookie
    const token = req.user?.token;
    if (token) {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        domain: ".digitalvs.com",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      };
      res.cookie("jwt", token, cookieOptions);
      console.log("🍪 Cookie JWT establecida para Facebook auth");

      // Guardar datos del usuario en Redis al momento de autenticar
      try {
        await redis.setex(
          `user:${token}`,
          86400,
          JSON.stringify({
            id: req.user.id,
            displayName: req.user.displayName,
            email: req.user.email,
            emails: req.user.emails,
            photos: req.user.photos,
            strategy: req.user.strategy || 'facebook'
          })
        );
        console.log('✅ Datos de usuario guardados en Redis desde Facebook auth');
      } catch (redisError) {
        console.error('⚠️ Error guardando en Redis:', redisError);
      }
    }

    res.redirect(constantes.URL_FRONT_END);
  }
);

//============= GENERAL ===============
//============ LOGIN SUCCESS ===========
loginRouter.get("/login/success", (req, res, next) => {
  console.log("/login/success -- Consulta de validación de usuario");
  console.log("req.user:", req.user);
  console.log("req.cookies:", req.cookies);

  if (req.user) {
    console.log("Usuario encontrado:", req.user.displayName);

    // Normalizar la estructura de respuesta para ambos tipos de auth
    const userResponse = {
      id: req.user.id,
      displayName: req.user.displayName,
      emails: req.user.email
        ? [{ value: req.user.email }]
        : req.user.emails || [],
      photos: req.user.photos || [],
      strategy: req.user.strategy || "unknown",
      token: req.user.token, // Incluir token en respuesta
    };

    return res.status(200).json({
      success: true,
      message: "successfull",
      user: userResponse,
    });
  } else {
    console.log("No ha sido validado el usuario");

    return res.status(200).json({
      success: false,
      message: "no_successfull",
      user: null,
    });
  }
});

//============ LOGIN FAILED ============
loginRouter.get("/login/failed", (req, res, next) => {
  console.log("Login fallido");
  res.redirect(constantes.URL_FRONT_END);
});

//=============== LOGOUT ================
loginRouter.get("/logout", async (req, res, next) => {
  console.log("logout");
  
  // Eliminar datos de Redis si existe token
  const token = req.cookies.jwt;
  if (token) {
    try {
      await redis.del(`user:${token}`);
      console.log('✅ Datos de usuario eliminados de Redis');
    } catch (redisError) {
      console.error('⚠️ Error eliminando de Redis:', redisError);
    }
  }
  
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error during logout." });
    }
    console.log("Usuario desconectado");
    // Eliminar la cookie JWT al cerrar sesión
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: ".digitalvs.com",
      path: "/"
    });
    console.log("🍪 Cookie JWT eliminada al hacer logout");
    
    // Retornar JSON en lugar de redirect para que el frontend lo maneje
    return res.status(200).json({ 
      success: true, 
      message: "Logout successful",
      redirectUrl: constantes.URL_FRONT_END
    });
  });
});

export { loginRouter };
