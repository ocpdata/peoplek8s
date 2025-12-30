import { OAuth2Client } from "google-auth-library";

// Cliente OAuth2 de Google
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Función para validar Access Token de Google
const validarAccessTokenGoogle = async (accessToken) => {
  console.log("🔐 funcion validarAccessTokenGoogle");
  try {
    console.log("🔍 Validando Access Token de Google...");

    // Obtener información del usuario con el access token
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error("No se pudo obtener información del usuario");
    }

    console.log("✅ Access Token de Google válido");

    const userInfo = await userResponse.json();

    return {
      valido: true,
      usuario: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        provider: "google",
      },
      //tokenInfo: tokenInfo,
    };
  } catch (error) {
    console.error("❌ Access Token de Google inválido:", error.message);
    return {
      valido: false,
      error: error.message,
    };
  }
};

// Actualizar el middleware
const validarTokenGoogle = async (token) => {
  console.log("🔐 funcion validarTokenGoogle");
  try {
    // Detectar tipo de token por formato
    if (token.startsWith("ya29.") || token.startsWith("1//")) {
      // Es un Access Token
      console.log("Es un access token");
      return await validarAccessTokenGoogle(token);
    } else if (token.split(".").length === 3) {
      // Es un ID Token (JWT)
      console.log("Es un id token");
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return {
        valido: true,
        usuario: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          provider: "google",
        },
      };
    } else {
      throw new Error("Formato de token no reconocido");
    }
  } catch (error) {
    console.error("❌ Token de Google inválido:", error.message);
    return {
      valido: false,
      error: error.message,
    };
  }
};

export async function validacionTokenApiKey(req, res, next) {
  console.log("🔐 validacionTokenApiKeyMiddleware: Verificando autenticación");
  console.log("req.user:", req.user);

  // Extraer apiKey de headers
  console.log("Obtiene apiKey de headers");
  let apiKey = req.headers["x-api-key"];
  if (apiKey && apiKey.startsWith("Bearer ")) {
    apiKey = apiKey.replace("Bearer ", "").trim();
  }
  console.log("apiKey extraida:", apiKey);

  // Obtiene el token desde el header de autorización Bearer
  console.log("Obtiene accessToken de headers");
  let accessToken = null;

  if (req.headers["authorization"]) {
    const authHeader = req.headers["authorization"];
    if (authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.replace("Bearer ", "").trim();
    }
  }
  console.log("accessToken extraido del header Authorization:", accessToken);

  // 1. Si hay apiKey, validarla
  if (apiKey) {
    if (apiKey === process.env.API_KEY_VALIDACION_LOCAL) {
      console.log("✅ API key válida. Continua con la solicitud");
      return next();
    } else {
      return res.status(401).json({ error: "API key inválida o ausente" });
    }
  }

  // 2. Si hay accessToken, validar según el servicio
  if (accessToken) {
    console.log("Hay accessToken, valida según el servicio");

    try {
      const validacionResultado = await validarTokenGoogle(accessToken);
      if (validacionResultado.valido) {
        console.log(
          "✅ token validado con Google:",
          validacionResultado.usuario.email
        );
        return next();
      } else {
        return res.status(401).json({
          error: `Token de Google inválido: ${validacionResultado.error}`,
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error interno validando token de Google" });
    }
  }

  // 3. Si no hay ni apiKey ni accessToken, rechazar
  return res
    .status(401)
    .json({ error: "No se proporcionó apiKey ni accessToken válidos" });
}
