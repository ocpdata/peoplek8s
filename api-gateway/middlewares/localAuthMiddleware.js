import jwt from "jsonwebtoken";

// Middleware para validar el token JWT y obtener datos de usuario desde Redis
// Si no hay jwtToken, solo puede acceder a rutas /auth/*
// Si no se encuentra el usuario en Redis, solo puede acceder a rutas /auth/*
export async function validarJWT(req, res, next) {
  // Logs para depuración de rutas
  console.log("validarJWT");
  console.log("req.baseUrl:", req.baseUrl, req.cookies.jwt, req.headers.authorization);

  try {
    // Obtiene el JWT desde cookies
    console.log("Obtiene el JWT desde cookies");
    const jwtToken =
      req.cookies?.jwt
    console.log("jwtToken", jwtToken);

    // Si no hay token, solo permitir acceso a rutas /auth/*
    if (!jwtToken) {
      if (req.baseUrl.startsWith('/auth/')) {
        console.log("No hay token, pero es ruta /auth/*, permite acceso");
        return next();
      } else {
        console.log("No hay token y no es ruta /auth/*, rechaza");
        return res.status(401).json({ message: "No token provided" });
      }
    }

    console.log("Como si hay JWT, procede a verificarlo");
    // Verifica y decodifica el JWT usando la clave secreta
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ message: "JWT inválido" });
    }
    console.log("JWT validado. payload decoded", payload);
    console.log("Continua con las rutas protegidas");

    // Continúa al siguiente middleware o handler de ruta
    next();
  } catch (err) {
    // Si hay error en la verificación, rechaza con 401 y detalles del error
    return res.status(401).json({ message: "JWT inválido", details: err.message });
  }
}
