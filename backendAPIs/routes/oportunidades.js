import { Router } from "express";
import dayjs from "dayjs";
import sequelize from "../database/database.js";
import {
  queryOportunidades,
  queryGetcantidadOportunidades,
  ensamblarQueryGrabarOportunidad,
  ensamblarQueryGetIdOportunidadConIdOportunidad,
  ensamblarQueryActualizarOportunidad,
  ensamblarQueryGetOportunidad,
  queryGetOportunidadesConCuenta,
  queryGetRespuestasPVOportunidad,
  queryGetValidacionPVOportunidad,
  ensamblarQueryActualizarRespuestasPV,
  ensamblarQueryGetOportunidadesPorUsuario,
  ensamblarQueryGetOportunidadByCotizacion,
  getListaOportunidadesByCuentaByUsuario,
  getListaOportunidadesAbiertasByCuentaByUsuario,
  getListaOportunidadesPendientesAprobacion,
  getListaOportunidadesByAno,
  getOportunidadesByAnoByUsuario,
} from "../database/queries.js";

const oportunidadesRouter = Router();

let datos = {};

//Estandariza los datos para que se cree adecuadamente la cuenta en la base de datos
function prepararDatosParaGrabar(enviado, numOportunidad) {
  console.log("funcion prepararDatosParaGrabar", enviado, numOportunidad);

  datos = {
    id: enviado.id,
    idOportunidad: numOportunidad,
    nombreOportunidad: enviado.nombreOportunidad,
    importeOportunidad: enviado.importeOportunidad,
    idCuentaOportunidad: enviado.idCuentaOportunidad,
    fechaCierreOportunidad: enviado.fechaCierreOportunidad,
    idContactoOportunidad: enviado.idContactoOportunidad,
    idEtapaVentaOportunidad: enviado.idEtapaVentaOportunidad,
    idEtapaCompraOportunidad: enviado.idEtapaCompraOportunidad,
    idPropietarioOportunidad: enviado.idPropietarioOportunidad,
    copropietarioOportunidad: enviado.copropietarioOportunidad.toString(),
    idLineaNegocioOportunidad: enviado.idLineaNegocioOportunidad,
    idPreventaOportunidad: enviado.idPreventaOportunidad,
    idEstadoOportunidad: enviado.idEstadoOportunidad,
    idCreadoPorOportunidad: 1,
    idModificadoPorOportunidad: 1,
    fechaCreacionOportunidad:
      enviado.idOportunidad === 0
        ? new Date()
            .toISOString()
            .replace(/T.*/, "")
            .split("-")
            .reverse()
            .join("-")
        : enviado.fechaCreacionOportunidad,
    fechaModificacionOportunidad: new Date()
      .toISOString()
      .replace(/T.*/, "")
      .split("-")
      .reverse()
      .join("-"),
    idProcesoOportunidad: enviado.idProcesoOportunidad,
  };
  console.log("datos preparados", datos);
  return datos;
}

function prepararRespuestasParaGrabar(respuestas, idOportunidad) {
  //console.log("funcion prepararDatosParaGrabar", respuestas, idOportunidad);

  //Obtener el string de validacion de las respuestas
  const validacion = respuestas.map((respuesta) => {
    return respuesta.validacion;
  });

  const datos = {
    idOportunidad: idOportunidad,
    interes: respuestas[0].respuesta,
    requerimientoTecnico: respuestas[1].respuesta,
    motivacion: respuestas[2].respuesta,
    presupuesto: respuestas[3].respuesta,
    cuandoPorque: respuestas[4].respuesta,
    decision: respuestas[5].respuesta,
    ventajas: respuestas[6].respuesta,
    estrategia: respuestas[7].respuesta,
    informacionTecnicaAdicional: respuestas[8].respuesta,
    presentacionTecnica: respuestas[9].respuesta,
    alcancePropuesto: respuestas[10].respuesta,
    puntosTecnicosImportantes: respuestas[11].respuesta,
    aceptacionPropuestaTecnica: respuestas[12].respuesta,
    observacionPropuestaTecnica: respuestas[13].respuesta,
    riesgosPropuestaTecnica: respuestas[14].respuesta,
    presupuestoEsperado: respuestas[15].respuesta,
    condicionesComerciales: respuestas[16].respuesta,
    porqueDemostracion: respuestas[17].respuesta,
    criteriosExito: respuestas[18].respuesta,
    siguientesPasosDemostracion: respuestas[19].respuesta,
    resultadoDemostracion: respuestas[20].respuesta,
    zonaBajaNegociacion: respuestas[21].respuesta,
    puntosImportantesClientesNegociacion: respuestas[22].respuesta,
    puntosImportantesNosotrosNegociacion: respuestas[23].respuesta,
    acuerdoCliente: respuestas[24].respuesta,
    riesgoWaiting: respuestas[25].respuesta,
    validacion: validacion.toString(),
  };
  return datos;
}

//========== OPORTUNIDADES ================

//========= Obtiene la lista de las oportunidades =============
oportunidadesRouter.get("/", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Lista todas las oportunidades'
      #swagger.description = 'Obtiene una lista completa de todas las oportunidades en el sistema. Incluye información como nombre, importe, cuenta asociada, fechas y estado.'
      #swagger.responses[200] = {
        description: 'Lista de oportunidades obtenida exitosamente',
        schema: { $ref: '#/definitions/Oportunidad' }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a oportunidades");

  sequelize
    .query(queryOportunidades, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((oportunidades) => {
      //console.log("cuentas: ", oportunidadesRouter);
      res.status(200).send(oportunidades);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========= Obtiene la lista de las oportunidades de un año indicado =============
oportunidadesRouter.get("/ano/:ano", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Lista oportunidades por año'
      #swagger.description = 'Obtiene todas las oportunidades de un año específico. Útil para reportes anuales y análisis históricos.'
      #swagger.parameters['ano'] = {
        in: 'path',
        description: 'Año para filtrar las oportunidades (formato YYYY)',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de oportunidades del año obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Oportunidad' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a listar las oportunidades por año");

  const ano = req.params.ano;
  console.log("año", ano);

  sequelize
    .query(getListaOportunidadesByAno(ano), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((oportunidades) => {
      //console.log("cuentas: ", oportunidadesRouter);
      res.status(200).send(oportunidades);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========= Obtiene la lista de las oportunidades de una cuenta =============
oportunidadesRouter.get("/cuenta/:id", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Lista oportunidades por cuenta'
      #swagger.description = 'Obtiene todas las oportunidades asociadas a una cuenta específica. Incluye oportunidades activas e históricas.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de la cuenta para obtener sus oportunidades',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de oportunidades de la cuenta obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Oportunidad' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[404] = {
        description: 'Cuenta no encontrada'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a oportunidades");

  const idCuenta = req.params.id;
  console.log("idCuenta", idCuenta);

  sequelize
    .query(queryGetOportunidadesConCuenta(idCuenta), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((oportunidades) => {
      //console.log("cuentas: ", oportunidadesRouter);
      res.status(200).send(oportunidades);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

/*//========= Obtiene la lista de las oportunidades de una cuenta en base a un usuario que es propietario o copropietario de la oportunidad =============
oportunidadesRouter.get("/cuenta/:idCuenta/usuario/:idUsuario", (req, res) => {
  //oportunidadesRouter.get("/cuenta/usuario/:idCuenta/:idUsuario", (req, res) => {
  console.log("Entró a oportunidades por cuenta por usuario");

  const idCuenta = req.params.idCuenta;
  console.log("idCuenta", idCuenta);
  const idUsuario = req.params.idUsuario;
  console.log("idUsuario", idUsuario);

  sequelize
    .query(getListaOportunidadesByCuentaByUsuario(idCuenta, idUsuario), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((oportunidades) => {
      //console.log("cuentas: ", oportunidadesRouter);
      res.status(200).send(oportunidades);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});*/

//========= Obtiene la lista de oportunidades abiertas de una cuenta en base a un usuario que es propietario o copropietario de la oportunidad =============
// Soporta query param `estado`. Ejemplo: /cuenta/123/usuario/45?estado=abierta
oportunidadesRouter.get("/cuenta/:idCuenta/usuario/:idUsuario", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Lista oportunidades por cuenta y usuario'
      #swagger.description = 'Obtiene oportunidades de una cuenta específica filtradas por usuario (propietario o copropietario). Soporta filtro por estado usando query parameter.'
      #swagger.parameters['idCuenta'] = {
        in: 'path',
        description: 'ID de la cuenta',
        required: true,
        type: 'string'
      }
      #swagger.parameters['idUsuario'] = {
        in: 'path',
        description: 'ID del usuario (propietario o copropietario)',
        required: true,
        type: 'string'
      }
      #swagger.parameters['estado'] = {
        in: 'query',
        description: 'Filtro por estado (ejemplo: abierta para solo oportunidades abiertas)',
        required: false,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de oportunidades filtradas obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Oportunidad' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a oportunidades por cuenta por usuario");

  const idCuenta = req.params.idCuenta;
  console.log("idCuenta", idCuenta);
  const idUsuario = req.params.idUsuario;
  console.log("idUsuario", idUsuario);

  // Si se pasa ?estado=abierta devolvemos sólo oportunidades abiertas
  const estado = (req.query.estado || "").toString().toLowerCase();
  let queryFn = getListaOportunidadesByCuentaByUsuario;
  if (estado === "abierta") {
    queryFn = getListaOportunidadesAbiertasByCuentaByUsuario;
  }

  sequelize
    .query(queryFn(idCuenta, idUsuario), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((oportunidades) => {
      res.status(200).send(oportunidades);
    })
    .catch((error) => {
      console.error("Error: ", error);
      // enviar el error también en el body para ayudar al debugging remoto
      res.status(500).send({
        success: false,
        message: "Error interno",
        details: error?.message || error,
      });
    });
});

//========== Obtiene la lista de las oportunidades de un usuario ========
oportunidadesRouter.get("/usuario/:id", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Lista oportunidades por usuario'
      #swagger.description = 'Obtiene todas las oportunidades asociadas a un usuario específico como propietario o copropietario.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del usuario para obtener sus oportunidades',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de oportunidades del usuario obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Oportunidad' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a oportunidades por usuario");

  const idOportunidad = req.params.id;
  console.log("idOportunidad", idOportunidad);

  sequelize
    .query(ensamblarQueryGetOportunidadesPorUsuario(idOportunidad), {
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

//========== Obtiene la lista de las oportunidades de un usuario de un año indicado ========
oportunidadesRouter.get("/usuario/:id/ano/:ano", (req, res) => {
  //oportunidadesRouter.get("/ano/:ano/usuario/:id", (req, res) => {
  //oportunidadesRouter.get("/ano/usuario/:ano/:usuario", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Lista oportunidades por usuario y año'
      #swagger.description = 'Obtiene oportunidades de un usuario específico filtradas por año. Útil para reportes de desempeño anual por vendedor.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del usuario',
        required: true,
        type: 'string'
      }
      #swagger.parameters['ano'] = {
        in: 'path',
        description: 'Año para filtrar (formato YYYY)',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de oportunidades del usuario por año obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Oportunidad' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a listar las oportunidades por año por usuario");

  const ano = req.params.ano;
  const idUsuario = req.params.id;
  console.log("año, usuario", ano, idUsuario);

  sequelize
    .query(getOportunidadesByAnoByUsuario(ano, idUsuario), {
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

//========== Obtiene la lista de las oportunidades pendientes de aprobar ========
oportunidadesRouter.get("/pendientesAprobacion", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Lista oportunidades pendientes de aprobación'
      #swagger.description = 'Obtiene todas las oportunidades que están pendientes de aprobación en el sistema. Útil para workflows de aprobación.'
      #swagger.responses[200] = {
        description: 'Lista de oportunidades pendientes obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Oportunidad' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a oportunidades pendientes de aprobación");

  sequelize
    .query(getListaOportunidadesPendientesAprobacion, {
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

//========== Descargar los datos de una oportunidad en base a una cotizacion ========
oportunidadesRouter.get("/cotizacion/:id", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Obtiene oportunidad por cotización'
      #swagger.description = 'Obtiene los datos de una oportunidad basándose en el ID de una cotización asociada. Útil para relacionar cotizaciones con oportunidades.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de la cotización para obtener la oportunidad asociada',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Oportunidad asociada a la cotización obtenida exitosamente',
        schema: { $ref: '#/definitions/Oportunidad' }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[404] = {
        description: 'Cotización u oportunidad no encontrada'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log(
    "Entro a descargar los datos de una oportunidad en base a una cotizacion"
  );

  const idCotizacion = req.params.id;
  console.log("idCotizacion", idCotizacion);

  sequelize
    .query(ensamblarQueryGetOportunidadByCotizacion(idCotizacion), {
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

//========== Grabar una oportunidad ================
/*oportunidadesRouter.post("/grabar", (req, res) => {
  console.log("Entró a grabar una oportunidad");
  console.log(req.body);

  let idOportunidadNueva = 0;
  let datosAGrabar = {};
  //Si el id de la oportunidad es mayor a cero se debe hacer un update, sino un insert
  const idOportunidad = req.body.idOportunidad;

  if (idOportunidad > 0) {
    //========= UPDATE ======================
    datosAGrabar = prepararDatosParaGrabar(req.body, idOportunidad);
    sequelize
      .query(ensamblarQueryActualizarOportunidad(datosAGrabar), {
        type: sequelize.QueryTypes.UPDATE,
      })
      .then((result) => {
        console.log(result);
        return sequelize.query(
          ensamblarQueryGetIdOportunidadConIdOportunidad(idOportunidad),
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
    //========= INSERT =================
    sequelize
      .query(queryGetcantidadOportunidades, {
        type: sequelize.QueryTypes.SELECT,
      })
      //Obtiene la cantidad total de las oportunidades en la BD
      .then((totalOportunidades) => {
        console.log("total oportunidades", totalOportunidades[0].maximo);
        idOportunidadNueva = totalOportunidades[0].maximo + 1;
        datosAGrabar = prepararDatosParaGrabar(req.body, idOportunidadNueva);
        console.log(datosAGrabar);
        return sequelize.query(ensamblarQueryGrabarOportunidad(datosAGrabar), {
          type: sequelize.QueryTypes.INSERT,
        });
      })
      .then((result) => {
        console.log(result);
        return sequelize.query(
          ensamblarQueryGetIdOportunidadConIdOportunidad(idOportunidadNueva),
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

//========== Obtener los datos de una oportunidad ========
oportunidadesRouter.get("/:id", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Obtiene una oportunidad específica'
      #swagger.description = 'Obtiene todos los detalles de una oportunidad específica utilizando su ID único. Incluye información completa como importe, fechas, etapas y responsables.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID único de la oportunidad a obtener',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Oportunidad encontrada y devuelta exitosamente',
        schema: { $ref: '#/definitions/Oportunidad' }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[404] = {
        description: 'Oportunidad no encontrada'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entro a descargar los datos de una oportunidad");

  const idOportunidad = req.params.id;
  console.log("idOportunidad", idOportunidad);

  sequelize
    .query(ensamblarQueryGetOportunidad(idOportunidad), {
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

//========== Descargar las respuests del PV de una oportunidad ========
oportunidadesRouter.get("/:id/respuestaspv", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Obtiene respuestas de preventa de una oportunidad'
      #swagger.description = 'Obtiene todas las respuestas del proceso de preventa (PV) asociadas a una oportunidad específica. Incluye validaciones y análisis técnicos.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de la oportunidad para obtener sus respuestas PV',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Respuestas de preventa obtenidas exitosamente',
        schema: { type: 'object', description: 'Objeto con las respuestas del proceso de preventa' }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[404] = {
        description: 'Oportunidad no encontrada'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entro a descargar las respuestas del PV de una oportunidad");

  const idOportunidad = req.params.id;
  console.log("idOportunidad", idOportunidad);

  sequelize
    .query(queryGetRespuestasPVOportunidad(idOportunidad), {
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

oportunidadesRouter.post("/", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Crea una nueva oportunidad'
      #swagger.description = 'Crea una nueva oportunidad en el sistema. Requiere información básica como nombre, importe, cuenta asociada y propietario.'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la nueva oportunidad',
        required: true,
        schema: { $ref: '#/definitions/Oportunidad.request' }
      }
      #swagger.responses[200] = {
        description: 'Oportunidad creada exitosamente',
        schema: { $ref: '#/definitions/Oportunidad' }
      }
      #swagger.responses[400] = {
        description: 'Datos de entrada inválidos'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a crear una oportunidad");
  console.log("Datos recibidos:", req.body);

  let idOportunidadNueva = 0;
  let datosAGrabar = {};
  const {
    copropietarioOportunidad,
    fechaCierreOportunidad,
    fechaCreacionOportunidad,
    fechaModificacionOportunidad,
    id,
    idContactoOportunidad,
    idCreadoPorOportunidad,
    idCuentaOportunidad,
    idEstadoOportunidad,
    idEtapaCompraOportunidad,
    idEtapaVentaOportunidad,
    idLineaNegocioOportunidad,
    idModificadoPorOportunidad,
    //idOportunidad,
    idPreventaOportunidad,
    idProcesoOportunidad,
    idPropietarioOportunidad,
    importeOportunidad,
    nombreOportunidad,
    stepperEtapaOportunidad,
  } = req.body;

  sequelize
    .query(queryGetcantidadOportunidades, {
      type: sequelize.QueryTypes.SELECT,
    })
    //Obtiene la cantidad total de las oportunidades en la BD
    .then((totalOportunidades) => {
      console.log("total oportunidades", totalOportunidades[0].maximo);
      idOportunidadNueva = totalOportunidades[0].maximo + 1;
      datosAGrabar = prepararDatosParaGrabar(
        {
          copropietarioOportunidad,
          fechaCierreOportunidad,
          fechaCreacionOportunidad,
          fechaModificacionOportunidad,
          id,
          idContactoOportunidad,
          idCreadoPorOportunidad,
          idCuentaOportunidad,
          idEstadoOportunidad,
          idEtapaCompraOportunidad,
          idEtapaVentaOportunidad,
          idLineaNegocioOportunidad,
          idModificadoPorOportunidad,
          //idOportunidad,
          idPreventaOportunidad,
          idProcesoOportunidad,
          idPropietarioOportunidad,
          importeOportunidad,
          nombreOportunidad,
          stepperEtapaOportunidad,
        },
        idOportunidadNueva
      );
      console.log(datosAGrabar);
      return sequelize.query(ensamblarQueryGrabarOportunidad(datosAGrabar), {
        type: sequelize.QueryTypes.INSERT,
      });
    })
    .then((result) => {
      console.log(result);
      return sequelize.query(
        ensamblarQueryGetIdOportunidadConIdOportunidad(idOportunidadNueva),
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

oportunidadesRouter.put("/:id", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Actualiza una oportunidad existente'
      #swagger.description = 'Actualiza los datos de una oportunidad existente. Permite modificar cualquier campo excepto el ID.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID único de la oportunidad a actualizar',
        required: true,
        type: 'string'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos actualizados de la oportunidad',
        required: true,
        schema: { $ref: '#/definitions/Oportunidad.request' }
      }
      #swagger.responses[200] = {
        description: 'Oportunidad actualizada exitosamente',
        schema: { $ref: '#/definitions/Oportunidad' }
      }
      #swagger.responses[400] = {
        description: 'ID inválido o datos de entrada erróneos'
      }
      #swagger.responses[404] = {
        description: 'Oportunidad no encontrada'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a actualizar oportunidad con PUT");
  console.log("ID de oportunidad a actualizar:", req.params.id);
  console.log("Datos recibidos:", req.body);

  const {
    copropietarioOportunidad,
    fechaCierreOportunidad,
    fechaCreacionOportunidad,
    fechaModificacionOportunidad,
    id,
    idContactoOportunidad,
    idCreadoPorOportunidad,
    idCuentaOportunidad,
    idEstadoOportunidad,
    idEtapaCompraOportunidad,
    idEtapaVentaOportunidad,
    idLineaNegocioOportunidad,
    idModificadoPorOportunidad,
    idOportunidad,
    idPreventaOportunidad,
    idProcesoOportunidad,
    idPropietarioOportunidad,
    importeOportunidad,
    nombreOportunidad,
    stepperEtapaOportunidad,
  } = req.body;

  const idOpportunity = parseInt(req.params.id);

  // Validar que el ID de la cuenta sea válido
  if (!idOpportunity || idOpportunity <= 0) {
    return res.status(400).json({
      error: "ID de oportunidad inválido",
      message: "El ID de la oportunidad debe ser un número mayor a cero",
    });
  }

  try {
    // Preparar datos para actualización
    const datosAActualizar = prepararDatosParaGrabar(
      {
        copropietarioOportunidad,
        fechaCierreOportunidad,
        fechaCreacionOportunidad,
        fechaModificacionOportunidad,
        id,
        idContactoOportunidad,
        idCreadoPorOportunidad,
        idCuentaOportunidad,
        idEstadoOportunidad,
        idEtapaCompraOportunidad,
        idEtapaVentaOportunidad,
        idLineaNegocioOportunidad,
        idModificadoPorOportunidad,
        idOportunidad: idOpportunity,
        idPreventaOportunidad,
        idProcesoOportunidad,
        idPropietarioOportunidad,
        importeOportunidad,
        nombreOportunidad,
        stepperEtapaOportunidad,
      },
      idOpportunity
    );
    sequelize
      .query(ensamblarQueryActualizarOportunidad(datosAActualizar), {
        type: sequelize.QueryTypes.UPDATE,
      })
      .then((result) => {
        console.log(result);
        return sequelize.query(
          ensamblarQueryGetIdOportunidadConIdOportunidad(idOpportunity),
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
  } catch (error) {
    console.error("Error en preparación de datos:", error);
    res.status(400).json({
      error: "Error en los datos",
      message: "Error al procesar los datos de la oportunidad",
      details: error.message,
    });
  }
});

/*oportunidadesRouter.get(
  "/abiertas/cuenta/usuario/:idCuenta/:idUsuario",
  (req, res) => {
    console.log("Entró a oportunidades abiertas por cuenta por usuario");

    const idCuenta = req.params.idCuenta;
    console.log("idCuenta", idCuenta);
    const idUsuario = req.params.idUsuario;
    console.log("idCuenta", idUsuario);

    sequelize
      .query(
        getListaOportunidadesAbiertasByCuentaByUsuario(idCuenta, idUsuario),
        {
          type: sequelize.QueryTypes.SELECT,
        }
      )
      .then((oportunidades) => {
        //console.log("cuentas: ", oportunidadesRouter);
        res.status(200).send(oportunidades);
      })
      .catch((error) => {
        console.error("Error: ", error);
        res.status(500).send;
      });
  }
);*/

/*//Descargar las respuestas y preguntas del PV de una oportunidad
oportunidadesRouter.get("/respuestaspreguntaspv/:id", (req, res) => {
  console.log("Entro a descargar las respuestas del PV de una oportunidad");

  const idOportunidad = req.params.id;
  console.log("idOportunidad", idOportunidad);

  sequelize
    .query(queryGetValidacionPVOportunidad(idOportunidad), {
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
});*/

//========== Grabar las respuestas de una oportunidad ================
/*oportunidadesRouter.post("/grabarrespuestas", (req, res) => {
  console.log("Entró a grabar las respuestas de una oportunidad");
  console.log(req.body);

  let idOportunidadNueva = 0;
  let datosAGrabar = {};
  //Si el id de la oportunidad es mayor a cero se debe hacer un update, sino un insert
  const idOportunidad = req.body.idOportunidad;

  if (idOportunidad > 0) {
    //========= UPDATE ======================
    datosAGrabar = prepararRespuestasParaGrabar(
      req.body.respuestas,
      idOportunidad
    );
    sequelize
      .query(ensamblarQueryActualizarRespuestasPV(datosAGrabar), {
        type: sequelize.QueryTypes.UPDATE,
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

oportunidadesRouter.put("/:id/respuestaspv", (req, res) => {
  /*  #swagger.tags = ['Oportunidades']
      #swagger.summary = 'Actualiza respuestas de preventa de una oportunidad'
      #swagger.description = 'Actualiza las respuestas del proceso de preventa (PV) de una oportunidad. Incluye validaciones técnicas, comerciales y de riesgo.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de la oportunidad para actualizar sus respuestas PV',
        required: true,
        type: 'string'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Objeto con las respuestas de preventa a actualizar',
        required: true,
        schema: {
          type: 'object',
          properties: {
            respuestas: {
              type: 'array',
              description: 'Array de respuestas del proceso de preventa',
              items: {
                type: 'object',
                properties: {
                  respuesta: { type: 'string', description: 'Contenido de la respuesta' },
                  validacion: { type: 'boolean', description: 'Estado de validación' }
                }
              }
            }
          }
        }
      }
      #swagger.responses[200] = {
        description: 'Respuestas de preventa actualizadas exitosamente'
      }
      #swagger.responses[400] = {
        description: 'ID inválido o datos de entrada erróneos'
      }
      #swagger.responses[404] = {
        description: 'Oportunidad no encontrada'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a actualizar las respuestas del pv con PUT");
  console.log("ID de oportunidad a actualizar:", req.params.id);
  //console.log("Datos recibidos:", req.body);

  const idOportunidad = parseInt(req.params.id);

  let datosAGrabar = {};

  if (idOportunidad > 0) {
    //========= UPDATE ======================
    datosAGrabar = prepararRespuestasParaGrabar(
      req.body.respuestas,
      idOportunidad
    );
    sequelize
      .query(ensamblarQueryActualizarRespuestasPV(datosAGrabar), {
        type: sequelize.QueryTypes.UPDATE,
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
});

export { oportunidadesRouter };
