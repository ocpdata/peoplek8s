import { URL_PEOPLE_IA } from "../config/constants.js";
import { Router } from "express";

const iaRouter = Router();

//======================= IA node =======================
iaRouter.post("/node", async (req, res) => {
  /*  #swagger.tags = ['Inteligencia Artificial']
      #swagger.summary = 'Consulta IA mediante servicio Node.js'
      #swagger.description = 'Redirige consultas a un servicio de inteligencia artificial basado en Node.js. Permite enviar preguntas con diferentes configuraciones de temperatura y contexto.'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la consulta a la IA',
        required: true,
        schema: { 
          type: 'object',
          properties: {
            mensajeRol: { type: 'string', description: 'Contexto o rol para la IA' },
            tipo_pregunta: { type: 'string', description: 'Tipo de pregunta o categoría' },
            indice: { type: 'integer', description: 'Índice de la pregunta en secuencia' },
            pregunta: { type: 'string', description: 'Pregunta o consulta a realizar' },
            temperatura: { type: 'number', description: 'Nivel de creatividad/aleatoriedad (0-1)' }
          },
          required: ['pregunta']
        }
      }
      #swagger.responses[200] = {
        description: 'Respuesta de la IA obtenida exitosamente',
        schema: { 
          type: 'object',
          properties: {
            respuesta: { type: 'string', description: 'Respuesta generada por la IA' },
            modelo: { type: 'string', description: 'Modelo de IA utilizado' },
            tiempo: { type: 'number', description: 'Tiempo de procesamiento en ms' }
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Datos de entrada inválidos'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor o en el servicio de IA'
      }
  */
  console.log("redirige a IA de node", req.body);

  const dataAEnviar = {
    mensajeRol: req.body.mensajeRol,
    tipo_pregunta: req.body.tipo_pregunta,
    indice: req.body.indice,
    pregunta: req.body.pregunta,
    temperatura: req.body.temperatura,
  };

  try {
    const cadena = `${URL_PEOPLE_IA}/people/ia`;
    console.log(cadena);
    const response = await fetch(cadena, {
      //const response = await fetch("https://peoplenode.digitalvs.com/people/ia", {
      method: "POST",
      body: JSON.stringify(dataAEnviar),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log("Error en IA");
    res.status(500).json({ error: "Error en proxy IA" });
  }
});

//======================= IA Flowise =======================
iaRouter.post("/flowise", async (req, res) => {
  /*  #swagger.tags = ['Inteligencia Artificial']
      #swagger.summary = 'Consulta chatbot mediante Flowise'
      #swagger.description = 'Redirige consultas a un chatbot configurado con Flowise. Proporciona respuestas contextuales utilizando un flujo de trabajo predefinido de IA conversacional.'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Mensaje para el chatbot',
        required: true,
        schema: { 
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Mensaje o pregunta para el chatbot' }
          },
          required: ['message']
        }
      }
      #swagger.responses[200] = {
        description: 'Respuesta del chatbot obtenida exitosamente',
        schema: { 
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Respuesta del chatbot' },
            sourceDocuments: { 
              type: 'array', 
              items: { type: 'object' },
              description: 'Documentos fuente utilizados para la respuesta'
            },
            chatId: { type: 'string', description: 'ID de la sesión de chat' }
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Mensaje requerido faltante'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor o en el servicio Flowise'
      }
  */
  console.log("redirige a Flowise", req.body.message);
  try {
    const response = await fetch(
      "http://peoplenode.digitalvs.com:4000/api/v1/prediction/06f2bea1-4bce-4103-ae36-35c8df304724", //AccesQ chatbot con filtro
      //"https://flowise-jf1k.onrender.com/api/v1/prediction/0cd3fda8-52ff-43ba-b588-0feea9005e94", //AccesQ chatbot con filtro
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: req.body.message }),
        //body: JSON.stringify(req.body.mensaje),
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log("Error en IA");
    res.status(500).json({ error: "Error en proxy IA" });
  }
});

export { iaRouter };
