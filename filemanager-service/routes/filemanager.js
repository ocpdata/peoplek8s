import { Router } from "express";
import axios from "axios";
import multer from "multer";
import * as constantes from "../config/constants.js";

const fileManagerRouter = Router();

const upload = multer();
const multerConfig = {
  storage: multer.memoryStorage(),
};

let numero_propuesta = null;

//============ Para la autenticacion interna ==========
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
// Si tienes una API key de servicio, agrégala aquí
console.log("API_KEY_VALIDACION_LOCAL", process.env.API_KEY_VALIDACION_LOCAL);
if (process.env.API_KEY_VALIDACION_LOCAL) {
  headers["x-api-key"] = process.env.API_KEY_VALIDACION_LOCAL;
}
//=======================================================

// ✅ Ruta específica para downloads (antes de las rutas generales)
fileManagerRouter.post("/Download", async (req, res) => {
  try {
    console.log("🔽 Call POST Download to filemanager API");

    const accessToken = req.user?.accessToken;

    const ruta = `${constantes.URL_FM_BD_GW}${req.url}`;
    console.log("ruta download:", ruta);

    if (!accessToken) {
      console.log("No hay access token");
      //=========== USO DE API KEY ==================
      if (req.user) {
        console.log("🎟️ Usando header API Key:");

        const resultado = await fetch(ruta, {
          method: "POST",
          headers,
          body: JSON.stringify(req.body),
        });

        console.log("resultado download status:", resultado.status);

        if (resultado.status !== 200) {
          return res.status(resultado.status).json({
            success: false,
            message: `Error ${resultado.status}: ${resultado.statusText}`,
          });
        }

        // ✅ SOLUCIÓN PARA EL PIPE

        // 1. Copiar headers importantes del fileManagerService
        const contentDisposition = resultado.headers.get("content-disposition");
        if (contentDisposition) {
          res.setHeader("Content-Disposition", contentDisposition);
        }

        const contentType = resultado.headers.get("content-type");
        if (contentType) {
          res.setHeader("Content-Type", contentType);
        }

        const contentLength = resultado.headers.get("content-length");
        if (contentLength) {
          res.setHeader("Content-Length", contentLength);
        }

        // 2. Usar pipeline

        // Usando pipeline (recomendado)
        const { pipeline } = await import("stream/promises");
        await pipeline(resultado.body, res);

        console.log("✅ Download stream enviado al cliente");
      }
      return res.status(400).json({
        success: false,
        message: "No se encontró token de acceso",
      });
    }

    const resultado = await fetch(ruta, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/octet-stream", // ✅ Para archivos binarios
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    console.log("resultado download status:", resultado.status);

    if (resultado.status !== 200) {
      return res.status(resultado.status).json({
        success: false,
        message: `Error ${resultado.status}: ${resultado.statusText}`,
      });
    }

    // ✅ SOLUCIÓN PARA EL PIPE

    // 1. Copiar headers importantes del fileManagerService
    const contentDisposition = resultado.headers.get("content-disposition");
    if (contentDisposition) {
      res.setHeader("Content-Disposition", contentDisposition);
    }

    const contentType = resultado.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    const contentLength = resultado.headers.get("content-length");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    // 2. Usar pipeline

    // Usando pipeline
    const { pipeline } = await import("stream/promises");
    await pipeline(resultado.body, res);

    console.log("✅ Download stream enviado al cliente");
  } catch (error) {
    console.error("❌ Error en download:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
});

fileManagerRouter.post(
  "/Upload",
  upload.any("uploadFiles"),
  async (req, res) => {
    try {
      console.log("🔐 Call POST Upload to filemanager API");

      // ========== URLs COMPLETAS ==========
      console.log("📍 req.url:", req.url); // /usuarios/test@email.com?param=value (después del router)
      const ruta = `${constantes.URL_FM_BD_GW}${req.url}`;
      console.log("ruta", ruta);

      // El accessToken está disponible en req.user después de la autenticación
      const accessToken = req.user?.accessToken;

      if (!accessToken) {
        console.log("No hay access token");
        //=========== USO DE API KEY ==================
        if (req.user) {
          console.log("🎟️ Usando header API Key:");

          // Enviar como multipart/form-data a /Upload
          const FormData = (await import("form-data")).default;
          const form = new FormData();
          req.files.forEach((file) => {
            form.append("uploadFiles", file.buffer, file.originalname);
          });
          // Agregar los campos extra del body (ejemplo: data, rutaCompleta)
          if (req.body && typeof req.body === "object") {
            Object.entries(req.body).forEach(([key, value]) => {
              form.append(key, value);
            });
          }

          const headersFiles = form.getHeaders();
          const headersAEnviar = {
            ...headers,
            ...headersFiles,
          };

          const resultado = await axios.post(ruta, form, {
            headers: headersAEnviar,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          });

          console.log("resultado", resultado);
          if (resultado.status != 200) {
            return res.json({
              success: false,
              message: resultado.status,
            });
          }

          return res.json(resultado.data);
        }
        return res.status(400).json({
          success: false,
          message: "No se encontró token de acceso",
        });
      }

      console.log(
        "🎟️ Usando access token:",
        accessToken.substring(0, 20) + "..."
      );

      // Enviar como multipart/form-data a /Upload
      const FormData = (await import("form-data")).default;
      const form = new FormData();
      req.files.forEach((file) => {
        form.append("uploadFiles", file.buffer, file.originalname);
      });
      // Agregar los campos extra del body (ejemplo: data, rutaCompleta)
      if (req.body && typeof req.body === "object") {
        Object.entries(req.body).forEach(([key, value]) => {
          form.append(key, value);
        });
      }

      const headersFiles = form.getHeaders();
      const headersAEnviar = {
        Authorization: `Bearer ${accessToken}`,
        ...headersFiles,
      };
      console.log("headersAEnviar", headersAEnviar);
      const resultado = await axios.post(ruta, form, {
        headers: headersAEnviar,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      console.log("resultado", resultado);
      if (resultado.status != 200) {
        return res.json({
          success: false,
          message: resultado.status,
        });
      }

      return res.json(resultado.data);
    } catch (error) {
      console.error("❌ Error en login:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
);

fileManagerRouter.post("*", async (req, res) => {
  try {
    console.log("🔐 Call POST * Proxy filemanager API");

    // ========== URLs COMPLETAS ==========
    console.log("📍 req.url:", req.url);
    const ruta = `${constantes.URL_FM_BD_GW}${req.url}`;
    console.log("ruta", ruta);

    // El accessToken está disponible en req.user después de la autenticación
    const accessToken = req.user?.accessToken;

    if (!accessToken) {
      console.log("No hay access token");
      console.log("req.user", req.user);
      //=========== USO DE API KEY ==================
      if (req.user) {
        console.log("🎟️ Usando header API Key:");

        console.log("req.body", req.body);
        numero_propuesta = req.body.rutaBase;
        console.log("numero_propuesta set to:", numero_propuesta);

        const resultado = await fetch(ruta, {
          method: "POST",
          headers,
          body: JSON.stringify(req.body),
        });

        console.log("resultado", resultado);
        if (resultado.status != 200) {
          return res.json({
            success: false,
            message: `Error ${resultado.status}: ${resultado.statusText}`,
            error: {
              code: resultado.status,
              message: resultado.statusText
            }
          });
        }

        const jsonResultado = await resultado.json();

        return res.json(jsonResultado);
      }
      console.log("No hay req.user",req.user)
      return res.status(400).json({
        success: false,
        message: "No se encontró token de acceso",
      });
    }

    console.log(
      "🎟️ Usando access token:",
      accessToken.substring(0, 20) + "..."
    );

    // Enviar como JSON normal
    const resultado = await fetch(ruta, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    console.log("resultado", resultado);
    if (resultado.status != 200) {
      return res.json({
        success: false,
        message: `Error ${resultado.status}: ${resultado.statusText}`,
        error: {
          code: resultado.status,
          message: resultado.statusText
        }
      });
    }

    const jsonResultado = await resultado.json();
    console.log("Resultado API Gateway:", jsonResultado);

    return res.json(jsonResultado);
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

fileManagerRouter.get("*", async (req, res) => {
  try {
    console.log("🔐 Call GET * to file manager API");

    /*console.log("🔍 === DEBUG USUARIO ===");
    console.log("req.user existe:", !!req.user);
    console.log("req.isAuthenticated():", req.isAuthenticated?.());
    console.log("========================");*/

    // ========== URLs COMPLETAS ==========
    console.log("📍 req.url:", req.url); // /usuarios/test@email.com?param=value (después del router)
   
    let ruta = `${constantes.URL_FM_BD_GW}${req.url}`;
    if (numero_propuesta && req.url.includes('?path=')) {
      const [base, pathPart] = req.url.split('?path=');
      ruta = `${constantes.URL_FM_BD_GW}${base}?path=${numero_propuesta}${pathPart}`;
    }

    console.log("numero_propuesta", numero_propuesta);
    console.log("ruta", ruta);

    // El accessToken está disponible en req.user después de la autenticación
    const accessToken = req.user?.accessToken;

    if (!accessToken) {
      console.log("No hay access token");
      console.log("req.user", req.user);
      //=========== USO DE API KEY ==================
      if (req.user) {
        console.log("🎟️ Usando header API Key:");

        const resultado = await fetch(ruta, {
          method: "GET",
          headers,
        });

        //console.log("resultado", resultado);
        if (resultado.status != 200) {
          return res.json({
            success: false,
            message: resultado.status,
          });
        }

        const jsonResultado = await resultado.json();

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
      accessToken.substring(0, 20) + "..."
    );

    const resultado = await fetch(ruta, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    //console.log("resultado", resultado);
    if (resultado.status != 200) {
      return res.json({
        success: false,
        message: resultado.status,
      });
    }

    console.log("Lee el resultado de get de filemanager", resultado);
    const jsonResultado = await resultado.json();
    //console.log("Resultado API Gateway:", jsonResultado);

    return res.json({
      success: true,
      data: jsonResultado,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

export { fileManagerRouter };
