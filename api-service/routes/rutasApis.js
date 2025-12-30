import { Router } from "express";
import * as constantes from "../config/constants.js";

//============ Configuración de headers para autenticación interna ==========
/**
 * Headers base para peticiones fetch internas
 * - Accept: Especifica que esperamos respuestas en formato JSON
 * - Content-Type: Indica que enviamos datos en formato JSON
 * - x-api-key: (Condicional) API key para autenticación de servicio a servicio
 */
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

/**
 * Si existe la variable de entorno API_KEY_VALIDACION_LOCAL, se agrega
 * como header x-api-key para autenticar las peticiones internas entre microservicios
 * Esta API key se almacena en el Secret app-secrets de Kubernetes
 */
console.log("API_KEY_VALIDACION_LOCAL", process.env.API_KEY_VALIDACION_LOCAL);
if (process.env.API_KEY_VALIDACION_LOCAL) {
  headers["x-api-key"] = process.env.API_KEY_VALIDACION_LOCAL;
}
//===========================================================================

const apiRouter = Router();

/**
 * Ruta GET comodín (*) que actúa como proxy para todas las peticiones GET
 *
 * Flujo de autenticación dual:
 * 1. Intenta usar OAuth access token si está disponible (req.user.accessToken)
 * 2. Si no hay access token, usa API key para autenticación interna
 *
 * Casos de uso:
 * - Con access token: Usuario externo autenticado vía Google/GitHub OAuth
 * - Sin access token: Llamada interna entre microservicios con API key
 */
apiRouter.get("*", async (req, res) => {
  try {
    console.log("🔐 Call to GET Proxy API");
    console.log("📍 req.url:", req.url);

    /**
     * Extrae el access token OAuth del objeto req.user
     * Este token es inyectado por Passport.js después de autenticación exitosa
     * Solo está disponible para usuarios autenticados vía OAuth (Google/GitHub)
     */
    const accessToken = req.user?.accessToken;
    console.log("api-service get req.user:", req.user);

    /**
     * Construye la URL completa del API Gateway de base de datos
     * URL_API_BD_GW viene de constants.js y apunta al servicio de API Gateway
     */
    const ruta = `${constantes.URL_API_BD_GW}${req.url}`;
    console.log("ruta", ruta);

    /**
     * RUTA 1: Autenticación con API Key (Sin access token OAuth)
     * Usado para comunicación interna entre microservicios
     */
    if (!accessToken) {
      console.log("No hay access token");
      console.log("🎟️ Usando header API Key:");

      /**
       * Realiza petición GET con API key en headers
       * El header x-api-key fue agregado previamente si existe API_KEY_VALIDACION_LOCAL
       */
      const customHeaders = {
        ...headers,
        "x-user-info": JSON.stringify(req.user),
      };

      const resultado = await fetch(ruta, {
        method: "GET",
        headers: customHeaders,
      });
      /*const resultado = await fetch(ruta, {
        method: "GET",
        headers,
      });*/

      /**
       * Valida el código de estado HTTP
       * Si no es 200 (OK), retorna error al cliente
       */
      if (resultado.status != 200) {
        return res.json({
          success: false,
          message: resultado.status,
        });
      }

      /**
       * Parsea la respuesta JSON y la retorna al cliente
       */
      const jsonResultado = await resultado.json();

      return res.json({
        success: true,
        data: jsonResultado,
      });
    }

    /**
     * RUTA 2: Autenticación con OAuth Access Token
     * Usado para usuarios externos autenticados vía Google o GitHub
     */
    console.log("🎟️ Access token:", accessToken.substring(0, 20) + "...");

    /**
     * Realiza petición GET con Bearer token en header Authorization
     * Este token es validado por el API Gateway de base de datos
     */


      const resultado = await fetch(ruta, {
        method: "GET",
        headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-user-info": JSON.stringify(req.user),
      },
      });
    /*const resultado = await fetch(ruta, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });*/

    /**
     * Valida el código de estado HTTP
     */
    if (resultado.status != 200) {
      return res.json({
        success: false,
        message: resultado.status,
      });
    }

    /**
     * Parsea y retorna la respuesta exitosa
     */
    const jsonResultado = await resultado.json();

    return res.json({
      success: true,
      data: jsonResultado,
    });
  } catch (error) {
    /**
     * Manejo de errores global
     * Captura excepciones de red, parsing JSON, o errores inesperados
     */
    console.error("❌ Error en login:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

apiRouter.post("*", async (req, res) => {
  try {
    console.log("🔐 Call to Post Proxy API");
    console.log("📍 req.url:", req.url);

    // El accessToken está disponible en req.user después de la autenticación
    const accessToken = req.user?.accessToken;
    //console.log("access token:", accessToken);

    if (!accessToken) {
      console.log("No hay access token");
      //=========== USO DE API KEY ==================
      console.log("req.user:", req.user);
      if (req.user) {
        console.log("🎟️ Usando header API Key:");
        console.log("url:", req.url);
        const ruta = `${constantes.URL_API_BD_GW}${req.url}`;

        console.log("ruta", ruta);
        const resultado = await fetch(ruta, {
          method: "POST",
          headers,
          body: JSON.stringify(req.body),
        });

        //console.log("resultado", resultado);
        if (resultado.status != 200) {
          res.json({
            success: false,
            message: resultado.status,
          });
        }

        const jsonResultado = await resultado.json();
        //console.log("Resultado API Gateway:", jsonResultado);

        return res.json({
          success: true,
          data: jsonResultado,
        });
      }
      return res.status(400).json({
        success: false,
        message: "No se encontró token de acceso",
      });
    }

    console.log(
      "🎟️ Usando access token:",
      accessToken.substring(0, 20) + "...",
    );

    const ruta = `${constantes.URL_API_BD_GW}${req.url}`;

    console.log("ruta", ruta);
    const resultado = await fetch(ruta, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    console.log("resultado post", resultado);
    if (resultado.status != 200) {
      res.json({
        success: false,
        message: resultado.status,
      });
    }

    const jsonResultado = await resultado.json();
    console.log("Resultado API Gateway:", jsonResultado);

    res.json({
      success: true,
      data: jsonResultado,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

apiRouter.put("*", async (req, res) => {
  try {
    console.log("🔐 Call to PUT Proxy API");
    console.log("📍 req.url:", req.url);

    // El accessToken está disponible en req.user después de la autenticación
    const accessToken = req.user?.accessToken;
    //console.log("access token:", accessToken);

    if (!accessToken) {
      console.log("No hay access token");
      //=========== USO DE API KEY ==================
      if (req.user) {
        console.log("🎟️ Usando header API Key:");
        console.log("url:", req.url);
        const ruta = `${constantes.URL_API_BD_GW}${req.url}`;

        console.log("ruta", ruta);
        const resultado = await fetch(ruta, {
          method: "PUT",
          headers,
          body: JSON.stringify(req.body),
        });

        //console.log("resultado", resultado);
        if (resultado.status != 200) {
          return res.json({
            success: false,
            message: resultado.status,
          });
        }

        const jsonResultado = await resultado.json();
        //console.log("Resultado API Gateway:", jsonResultado);

        return res.json({
          success: true,
          data: jsonResultado,
        });
      }
      return res.status(400).json({
        success: false,
        message: "No se encontró token de acceso",
      });
    }

    console.log(
      "🎟️ Usando access token:",
      accessToken.substring(0, 20) + "...",
    );

    const ruta = `${constantes.URL_API_BD_GW}${req.url}`;

    console.log("ruta", ruta);
    const resultado = await fetch(ruta, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    console.log("resultado post", resultado);
    if (resultado.status != 200) {
      res.json({
        success: false,
        message: resultado.status,
      });
    }

    const jsonResultado = await resultado.json();
    console.log("Resultado API Gateway:", jsonResultado);

    res.json({
      success: true,
      data: jsonResultado,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

export { apiRouter };
