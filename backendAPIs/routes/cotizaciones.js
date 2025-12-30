//const fs = require("fs");
import fs from "node:fs";
import { Router } from "express";
import dayjs from "dayjs";
import sequelize from "../database/database.js";
import {
  GetCotizacionVersion,
  getListaCotizaciones,
  getListaCotizacionesByUsuario,
  GetSeccionCotizacionVersion,
  GetItemCotizacionVersion,
  actualizarVersionCotizacion,
  desactivarSeccionCotizacion,
  actualizarSeccionCotizacion,
  crearSeccionCotizacion,
  desactivarItemCotizacion,
  actualizarItemCotizacion,
  crearItemCotizacion,
  getTotalCotizaciones,
  crearPropuestaCotizacion,
  getIdCotizacionConId,
  actualizarPropuestaCotizacion,
  crearVersionCotizacion,
  getListaCotizacionesByOportunidad,
  actualizarRelacionOportunidadesPropuestas,
  crearRelacionOportunidadesPropuestas,
  getTotalRelacionesOportunidadCotizacion,
  getListaCotizacionesByAno,
  getListaCotizacionesByAnoByUsuario,
  replacementActualizarItemCotizacion,
} from "../database/queries.js";

const cotizacionesRouter = Router();

//========== Listar todas las cotizaciones ========
cotizacionesRouter.get("/", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Lista todas las cotizaciones'
    #swagger.description = 'Obtiene la lista completa de cotizaciones del sistema.'
    #swagger.responses[200] = {
      description: 'Lista de cotizaciones obtenida',
      schema: { type: 'array', items: { $ref: '#/definitions/Cotizacion' } }
    }
    #swagger.responses[500] = {
      description: 'Error interno del servidor'
    }
*/
  console.log("Entro a descargar la lista de todas las cotizaciones");

  sequelize
    .query(getListaCotizaciones(), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      //console.log(result);
      console.log("Envio lista de cotizacione");
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

//========== Listar las cotizaciones en base a una oportunidad ========
cotizacionesRouter.get("/oportunidad/:id", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Lista cotizaciones por oportunidad'
    #swagger.description = 'Obtiene todas las cotizaciones relacionadas con una oportunidad concreta.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la oportunidad', required: true, type: 'string' }
    #swagger.responses[200] = {
      description: 'Lista de cotizaciones para la oportunidad',
      schema: { type: 'array', items: { $ref: '#/definitions/Cotizacion' } }
    }
    #swagger.responses[500] = { description: 'Error interno del servidor' }
*/
  console.log(
    "Entro a descargar la lista de cotizaciones en base a una oportunidad"
  );

  const idOportunidad = req.params.id;
  console.log("idOportunidad", idOportunidad);

  sequelize
    .query(getListaCotizacionesByOportunidad(idOportunidad), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

//========== Listar todas las cotizaciones ========
cotizacionesRouter.get("/ano/:ano", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Lista cotizaciones por año'
    #swagger.description = 'Obtiene las cotizaciones del año indicado.'
    #swagger.parameters['ano'] = {
      in: 'path',
      description: 'Año (ej. 2025)',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Lista de cotizaciones por año',
      schema: { type: 'array', items: { $ref: '#/definitions/Cotizacion' } }
    }
    #swagger.responses[500] = { description: 'Error interno del servidor' }
*/
  console.log("Entro a descargar la lista de todas las cotizaciones por año");

  const ano = req.params.ano;
  console.log("año", ano);

  sequelize
    .query(getListaCotizacionesByAno(ano), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      //console.log(result);
      console.log("Envio lista de cotizacione");
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

//========== Listar las cotizaciones por año por usuario que es el propietario o copropietario========
cotizacionesRouter.get("/ano/:ano/usuario/:id", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Lista cotizaciones por año y usuario'
    #swagger.description = 'Obtiene las cotizaciones del año indicado donde el usuario es propietario o copropietario.'
    #swagger.parameters['ano'] = { in: 'path', description: 'Año', required: true, type: 'string' }
    #swagger.parameters['id'] = { in: 'path', description: 'ID del usuario', required: true, type: 'string' }
    #swagger.responses[200] = {
      description: 'Lista de cotizaciones filtrada',
      schema: { type: 'array', items: { $ref: '#/definitions/Cotizacion' } }
    }
    #swagger.responses[500] = { description: 'Error interno del servidor' }
*/
  console.log("Entro a descargar la lista de cotizaciones por año por usuario");

  const ano = req.params.ano;
  const idUsuario = req.params.id;
  console.log("ano, idUsuario", ano, idUsuario);

  sequelize
    .query(getListaCotizacionesByAnoByUsuario(ano, idUsuario), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      //console.log(result);
      console.log("Envio lista de cotizacione");
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

//========== Listar las cotizaciones en base a un usuario que es el propietario o copropietario========
cotizacionesRouter.get("/usuario/:id", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Lista cotizaciones por usuario'
    #swagger.description = 'Obtiene las cotizaciones asociadas a un usuario (propietario o copropietario).'
    #swagger.parameters['id'] = { in: 'path', description: 'ID del usuario', required: true, type: 'string' }
    #swagger.responses[200] = {
      description: 'Lista de cotizaciones del usuario',
      schema: { type: 'array', items: { $ref: '#/definitions/Cotizacion' } }
    }
    #swagger.responses[500] = { description: 'Error interno del servidor' }
*/
  console.log(
    "Entro a descargar la lista de cotizaciones en base a un usuario"
  );

  const idUsuario = req.params.id;
  console.log("idUsuario", idUsuario);

  sequelize
    .query(getListaCotizacionesByUsuario(idUsuario), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      //console.log(result);
      console.log("Envio lista de cotizacione");
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

//========== Descargar los datos de las secciones de una cotizacion ========
cotizacionesRouter.get("/:id/:version/secciones", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Secciones de una cotización (por versión)'
    #swagger.description = 'Devuelve las secciones asociadas a una versión específica de una cotización.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la cotización', required: true, type: 'string' }
    #swagger.parameters['version'] = { in: 'path', description: 'Versión de la cotización', required: true, type: 'string' }
    #swagger.responses[200] = {
      description: 'Secciones de la versión',
      schema: { type: 'array', items: { $ref: '#/definitions/Seccion' } }
    }
    #swagger.responses[500] = { description: 'Error interno del servidor' }
*/
  console.log(
    "Entro a descargar las secciones de una cotizacion",
    req.params.id
  );

  const idCotizacion = req.params.id;
  const versionCotizacion = req.params.version;
  console.log("idCotizacion", idCotizacion);
  console.log("version", versionCotizacion);

  sequelize
    .query(GetSeccionCotizacionVersion(idCotizacion, versionCotizacion), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

//========== Descargar los datos de los items de una cotizacion ========
cotizacionesRouter.get("/:id/:version/items", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Items de una cotización (por versión)'
    #swagger.description = 'Devuelve los items de una versión específica de una cotización.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la cotización', required: true, type: 'string' }
    #swagger.parameters['version'] = { in: 'path', description: 'Versión de la cotización', required: true, type: 'string' }
    #swagger.responses[200] = {
      description: 'Items de la versión',
      schema: { type: 'array', items: { $ref: '#/definitions/Item' } }
    }
    #swagger.responses[500] = { description: 'Error interno del servidor' }
*/
  console.log(
    "Entro a descargar los items de una cotizacion",
    req.params.idCotizacion
  );

  const idCotizacion = req.params.id;
  const versionCotizacion = req.params.version;
  console.log("idCotizacion", idCotizacion);
  console.log("version", versionCotizacion);

  sequelize
    .query(GetItemCotizacionVersion(idCotizacion, versionCotizacion), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      console.log("Leyó los items");
      //console.log(result);
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

//========== Descargar los datos de una cotizacion ========
cotizacionesRouter.get("/:id/:version", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Datos de una cotización por versión'
    #swagger.description = 'Obtiene los datos de la cotización para la versión indicada.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la cotización', required: true, type: 'string' }
    #swagger.parameters['version'] = { in: 'path', description: 'Versión de la cotización', required: true, type: 'string' }
    #swagger.responses[200] = {
      description: 'Datos de la cotización',
      schema: { $ref: '#/definitions/Cotizacion' }
    }
    #swagger.responses[500] = { description: 'Error interno del servidor' }
*/
  console.log("Entro a descargar los datos de una cotizacion", req.params.id);

  const idCotizacion = req.params.id;
  const versionCotizacion = req.params.version;
  console.log("idCotizacion", idCotizacion);
  console.log("version", versionCotizacion);

  sequelize
    .query(GetCotizacionVersion(idCotizacion, versionCotizacion), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

cotizacionesRouter.post("/", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Crear cotización con versión'
    #swagger.description = 'Crea una nueva cotización, su versión inicial y relaciones asociadas (propuesta, version, items, secciones).'
    #swagger.consumes = ['application/json']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Objeto con estructura { propuesta: {...}, version: {...}, secciones: [...], items: [...] }',
      required: true,
      schema: { $ref: '#/definitions/Cotizacion.request' }
    }
    #swagger.responses[200] = {
      description: 'Cotización creada correctamente',
      schema: { $ref: '#/definitions/Cotizacion' }
    }
    #swagger.responses[400] = { description: 'Datos inválidos' }
    #swagger.responses[500] = { description: 'Error interno del servidor' }
*/
  console.log("Entró a crear una cotizacion");
  console.log("Datos recibidos:", req.body);

  const idCotizacion = req.body.propuesta.idCotizacion;
  const versionCotizacion = req.body.version.versionCotizacion;
  console.log("idCotizacion:", idCotizacion);
  let idCotizacionNueva = 0;
  let versionNueva = 1;
  let idRelacionOpCotNueva = 0;

  //Obtener el numero de la siguiente cotizacion disponible
  sequelize
    .query(getTotalCotizaciones(), {
      type: sequelize.QueryTypes.SELECT,
    })
    //Obtiene el total de las cuentas en la BD
    .then((totalCotizaciones) => {
      console.log("total cotizaciones", totalCotizaciones[0].maximo);
      idCotizacionNueva = totalCotizaciones[0].maximo + 1;
      const totalVersiones = 1;
      console.log(req.body.propuesta, idCotizacionNueva);
      return sequelize.query(
        crearPropuestaCotizacion(
          req.body.propuesta,
          idCotizacionNueva,
          totalVersiones
        ),
        {
          type: sequelize.QueryTypes.INSERT,
        }
      );
    })
    .then((result) => {
      return sequelize.query(
        crearVersionCotizacion(
          req.body.version,
          idCotizacionNueva,
          versionNueva
        ),
        {
          type: sequelize.QueryTypes.INSERT,
        }
      );
    })
    .then((result) => {
      return sequelize.query(getTotalRelacionesOportunidadCotizacion(), {
        type: sequelize.QueryTypes.SELECT,
      });
    })
    .then((result) => {
      console.log("resultado ======", result);
      idRelacionOpCotNueva = result[0].maximo + 1;
      return sequelize.query(
        crearRelacionOportunidadesPropuestas(
          idRelacionOpCotNueva,
          req.body.propuesta.idOportunidad,
          req.body.propuesta.idCotizacion,
          req.body.version.versionCotizacion,
          req.body.version.precioTotal
        ),
        {
          type: sequelize.QueryTypes.INSERT,
        }
      );
    })
    .then((result) => {
      console.log(result);
      return sequelize.query(
        getIdCotizacionConId(idCotizacionNueva, versionNueva),
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
    })
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

cotizacionesRouter.put("/:id/:version", (req, res) => {
  /*  #swagger.tags = ['Cotizaciones']
    #swagger.summary = 'Actualizar cotización y crear versión'
    #swagger.description = 'Actualiza la propuesta, crea una nueva versión y maneja secciones/items en transacción.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID de la cotización', required: true, type: 'string' }
    #swagger.parameters['version'] = { in: 'path', description: 'Versión de la cotización (parámetro de ruta)', required: false, type: 'string' }
    #swagger.consumes = ['application/json']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Objeto con estructura { propuesta: {...}, version: {...}, secciones: [...], items: [...] }',
      required: true,
      schema: { $ref: '#/definitions/Cotizacion.request' }
    }
    #swagger.responses[200] = {
      description: 'Cotización actualizada y nueva versión creada',
      schema: { $ref: '#/definitions/Cotizacion' }
    }
    #swagger.responses[400] = { description: 'ID inválido o datos erróneos' }
    #swagger.responses[500] = { description: 'Error interno del servidor' }
*/
  console.log("Entró a actualizar una cotizacion");

  const idCotizacion = parseInt(req.params.id);
  //const versionCotizacion = parseInt(req.params.version);
  const versionCotizacion = req.body.version.versionCotizacion;
  console.log("idCotizacion y version:", idCotizacion, versionCotizacion);
  let idRelacionOpCotNueva = 0;

  sequelize
    .query(actualizarPropuestaCotizacion(req.body.propuesta), {
      type: sequelize.QueryTypes.UPDATE,
    })
    .then((result) => {
      return sequelize.query(actualizarVersionCotizacion(req.body.version), {
        type: sequelize.QueryTypes.UPDATE,
      });
    })
    .then((result) => {
      return sequelize.query(
        crearVersionCotizacion(
          req.body.version,
          req.body.version.idCotizacion,
          req.body.version.versionCotizacion
        ),
        {
          type: sequelize.QueryTypes.INSERT,
        }
      );
    })
    //Colocar todas las secciones en status 0
    .then((result) => {
      return sequelize.query(desactivarSeccionCotizacion(req.body.version), {
        type: sequelize.QueryTypes.UPDATE,
      });
    })
    //Actualizar las secciones
    .then((result) => {
      console.log("Actualizar seccion", result);
      /*
          To avoid deadlocks, you should avoid running multiple concurrent updates/inserts on the same rows.
          Here, you can process secciones sequentially, or use transactions to ensure atomicity.
          Example: Use a transaction for all DB operations in this route.
        */
      return sequelize.transaction(async (t) => {
        // Actualizar secciones
        for (const seccion of req.body.secciones) {
          await sequelize.query(actualizarSeccionCotizacion(seccion), {
            type: sequelize.QueryTypes.UPDATE,
            transaction: t,
          });
        }
        // Insertar secciones
        for (const seccion of req.body.secciones) {
          await sequelize.query(crearSeccionCotizacion(seccion), {
            type: sequelize.QueryTypes.INSERT,
            transaction: t,
          });
        }
        // Desactivar items
        await sequelize.query(desactivarItemCotizacion(req.body.version), {
          type: sequelize.QueryTypes.UPDATE,
          transaction: t,
        });
        // Actualizar items
        for (const item of req.body.items) {
          await sequelize.query(actualizarItemCotizacion(item), {
            type: sequelize.QueryTypes.UPDATE,
            transaction: t,
          });
        }
        // Insertar items
        for (const item of req.body.items) {
          await sequelize.query(crearItemCotizacion(item), {
            type: sequelize.QueryTypes.INSERT,
            transaction: t,
          });
        }
      });
    })
    .then((result) => {
      return sequelize.query(getTotalRelacionesOportunidadCotizacion(), {
        type: sequelize.QueryTypes.SELECT,
      });
    })
    .then((result) => {
      console.log("resultado ======", result);
      idRelacionOpCotNueva = result[0].maximo + 1;
      return sequelize.query(
        actualizarRelacionOportunidadesPropuestas(
          req.body.propuesta.idOportunidad,
          req.body.propuesta.idCotizacion,
          req.body.version.versionCotizacion,
          req.body.version.precioTotal
        ),
        {
          type: sequelize.QueryTypes.UPDATE,
        }
      );
    })
    .then((result) => {
      return sequelize.query(
        crearRelacionOportunidadesPropuestas(
          idRelacionOpCotNueva,
          req.body.propuesta.idOportunidad,
          req.body.propuesta.idCotizacion,
          req.body.version.versionCotizacion,
          req.body.version.precioTotal
        ),
        {
          type: sequelize.QueryTypes.INSERT,
        }
      );
    })
    .then((result) => {
      console.log(result);
      return sequelize.query(
        getIdCotizacionConId(idCotizacion, versionCotizacion),
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
    })
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

//========== Grabar una cotizacion ===============
/*cotizacionesRouter.post("/grabar", (req, res) => {
  console.log("Entró a grabar una cotizacion");
  //console.log(req.body);

  //Si el id de la cotizacion es 0, debe crearse una nueva cotizacion
  //Si el id no es 0, se actualiza la cotizacion
  const idCotizacion = req.body.propuesta.idCotizacion;
  const versionCotizacion = req.body.version.versionCotizacion;
  console.log("idCotizacion:", idCotizacion);
  let idCotizacionNueva = 0;
  let versionNueva = 1;
  let idRelacionOpCotNueva = 0;

  if (idCotizacion > 0) {
    //Actualizar la cotizacion
    //Propuesta
    sequelize
      .query(actualizarPropuestaCotizacion(req.body.propuesta), {
        type: sequelize.QueryTypes.UPDATE,
      })
      .then((result) => {
        return sequelize.query(actualizarVersionCotizacion(req.body.version), {
          type: sequelize.QueryTypes.UPDATE,
        });
      })
      .then((result) => {
        return sequelize.query(
          crearVersionCotizacion(
            req.body.version,
            req.body.version.idCotizacion,
            req.body.version.versionCotizacion
          ),
          {
            type: sequelize.QueryTypes.INSERT,
          }
        );
      })

      //Colocar todas las secciones en status 0
      .then((result) => {
        return sequelize.query(desactivarSeccionCotizacion(req.body.version), {
          type: sequelize.QueryTypes.UPDATE,
        });
      })
      //Actualizar las secciones
      .then((result) => {
        console.log("Actualizar seccion", result);

        return sequelize.transaction(async (t) => {
          // Actualizar secciones
          for (const seccion of req.body.secciones) {
            await sequelize.query(actualizarSeccionCotizacion(seccion), {
              type: sequelize.QueryTypes.UPDATE,
              transaction: t,
            });
          }
          // Insertar secciones
          for (const seccion of req.body.secciones) {
            await sequelize.query(crearSeccionCotizacion(seccion), {
              type: sequelize.QueryTypes.INSERT,
              transaction: t,
            });
          }
          // Desactivar items
          await sequelize.query(desactivarItemCotizacion(req.body.version), {
            type: sequelize.QueryTypes.UPDATE,
            transaction: t,
          });
          // Actualizar items
          for (const item of req.body.items) {
            await sequelize.query(actualizarItemCotizacion(item), {
              type: sequelize.QueryTypes.UPDATE,
              transaction: t,
            });
          }

          // Insertar items
          for (const item of req.body.items) {
            await sequelize.query(crearItemCotizacion(item), {
              type: sequelize.QueryTypes.INSERT,
              transaction: t,
            });
          }
        });
      })
      .then((result) => {
        return sequelize.query(getTotalRelacionesOportunidadCotizacion(), {
          type: sequelize.QueryTypes.SELECT,
        });
      })
      .then((result) => {
        console.log("reaultado ======", result);
        idRelacionOpCotNueva = result[0].maximo + 1;
        return sequelize.query(
          actualizarRelacionOportunidadesPropuestas(
            req.body.propuesta.idOportunidad,
            req.body.propuesta.idCotizacion,
            req.body.version.versionCotizacion,
            req.body.version.precioTotal
          ),
          {
            type: sequelize.QueryTypes.UPDATE,
          }
        );
      })
      .then((result) => {
        return sequelize.query(
          crearRelacionOportunidadesPropuestas(
            idRelacionOpCotNueva,
            req.body.propuesta.idOportunidad,
            req.body.propuesta.idCotizacion,
            req.body.version.versionCotizacion,
            req.body.version.precioTotal
          ),
          {
            type: sequelize.QueryTypes.INSERT,
          }
        );
      })
      .then((result) => {
        console.log(result);
        return sequelize.query(
          getIdCotizacionConId(idCotizacion, versionCotizacion),
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
      })
      .then((result) => {
        console.log(result);
        res.status(200).send(result);
      })

      .catch((error) => {
        console.error("Error: ", error);
        res.status(500).send(error);
      });
  } else {
    //Obtener el numero de la siguiente cotizacion disponible
    sequelize
      .query(getTotalCotizaciones(), {
        type: sequelize.QueryTypes.SELECT,
      })
      //Obtiene el total de las cuentas en la BD
      .then((totalCotizaciones) => {
        console.log("total cotizaciones", totalCotizaciones[0].maximo);
        idCotizacionNueva = totalCotizaciones[0].maximo + 1;
        const totalVersiones = 1;
        console.log(req.body.propuesta, idCotizacionNueva);
        return sequelize.query(
          crearPropuestaCotizacion(
            req.body.propuesta,
            idCotizacionNueva,
            totalVersiones
          ),
          {
            type: sequelize.QueryTypes.INSERT,
          }
        );
      })
      .then((result) => {
        return sequelize.query(
          crearVersionCotizacion(
            req.body.version,
            idCotizacionNueva,
            versionNueva
          ),
          {
            type: sequelize.QueryTypes.INSERT,
          }
        );
      })
      .then((result) => {
        return sequelize.query(getTotalRelacionesOportunidadCotizacion(), {
          type: sequelize.QueryTypes.SELECT,
        });
      })
      .then((result) => {
        console.log("resultado ======", result);
        idRelacionOpCotNueva = result[0].maximo + 1;
        return sequelize.query(
          crearRelacionOportunidadesPropuestas(
            idRelacionOpCotNueva,
            req.body.propuesta.idOportunidad,
            req.body.propuesta.idCotizacion,
            req.body.version.versionCotizacion,
            req.body.version.precioTotal
          ),
          {
            type: sequelize.QueryTypes.INSERT,
          }
        );
      })
      .then((result) => {
        console.log(result);
        return sequelize.query(
          getIdCotizacionConId(idCotizacionNueva, versionNueva),
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
      })
      .then((result) => {
        console.log(result);
        res.status(200).send(result);
      })
      .catch((error) => {
        console.error("Error: ", error);
        res.status(500).send(error);
      });
  }
});*/

/*//=========Crea el directorio donde se guardaran los docuemntos de una cotizacion =============
cotizacionesRouter.post("/creardirectoriocotizacion/", (req, res) => {
  console.log(
    "Crea el directorio para guardar la informacion de una cotizacion"
  );
  const datos = req.body;
  console.log(datos);

  const directorio = `/home/ubuntu/datos/${datos.archivo}`;
  console.log(directorio);

  if (!fs.existsSync(directorio)) {
    console.log("Creará el directorio");
    fs.mkdirSync(directorio, { recursive: true });
    console.log(`Directorio ${directorio} creado`);
  } else {
    console.log(`Directorio ${directorio} ya existe`);
  }
  //Se debe responder la solicitud para cerrar la conexión.
  //Si no se cierra, el navegador puede evitar conexiones adicionales
  res.status(200).json({ datos: directorio });
  //res.status(200).send(directorio);
});*/

export { cotizacionesRouter };
