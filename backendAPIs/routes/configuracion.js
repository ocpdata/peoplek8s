import { Router } from "express";
import sequelize from "../database/database.js";
import { queryConfiguracionTipoCuenta } from "../database/queries.js";
import { queryConfiguracionSectorCuenta } from "../database/queries.js";
//import { queryConfiguracionUsuario } from "../database/queries.js";
import {
  queryConfiguracionPais,
  queryConfiguracionParticipacion,
  queryConfiguracionRelacion,
  queryConfiguracionSituacionLaboral,
  queryConfiguracionEtapaVenta,
  queryConfiguracionEtapaCompra,
  queryConfiguracionLineaNegocio,
  queryConfiguracionEstadoOportunidad,
  queryGetConfiguracionPreguntasPV,
  getListaUsuarios,
  getListaUsuariosActivos,
  getListaUsuariosActivosCuenta,
  getListaEstadosCotizacion,
  getListaTiemposEntregaCotizacion,
  getListaValidezCotizacion,
  getListaGarantiaCotizacion,
  getListaFormaPagoCotizacion,
  getListaMonedaCotizacion,
  getUsuarioByEmail,
  getIdUsuarioByEmail,
} from "../database/queries.js";

const configuracionRouter = Router();

/*//Obtiene la lista de cuentas de un usuario
configuracionRouter.get("/usuarios/:userId/cuentas", (req, res) => {
  console.log("Entró a cuentas por usuario");

  const idUsuario = req.params.userId;
  console.log("idUsuario", idUsuario);

  sequelize
    .query(getListaCuentasPorUsuario(idUsuario), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((cuentas) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(cuentas);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});*/

//========== Tipo de cuenta ================
configuracionRouter.get("/tipoCuenta", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista tipos de cuenta disponibles'
      #swagger.description = 'Obtiene todos los tipos de cuenta configurados en el sistema. Útil para formularios de creación y edición de cuentas.'
      #swagger.responses[200] = {
        description: 'Lista de tipos de cuenta obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del tipo de cuenta' },
              nombre: { type: 'string', description: 'Nombre del tipo de cuenta' },
              descripcion: { type: 'string', description: 'Descripción del tipo' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a tipo de cuentas");

  sequelize
    .query(queryConfiguracionTipoCuenta, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Sector de cuenta ================
configuracionRouter.get("/sectorCuenta", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista sectores de cuenta disponibles'
      #swagger.description = 'Obtiene todos los sectores empresariales configurados en el sistema. Permite categorizar las cuentas por industria o sector económico.'
      #swagger.responses[200] = {
        description: 'Lista de sectores obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del sector' },
              nombre: { type: 'string', description: 'Nombre del sector' },
              descripcion: { type: 'string', description: 'Descripción del sector' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a sector de cuentas");

  sequelize
    .query(queryConfiguracionSectorCuenta, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

/*//========== Lista solo a los usuarios activos de una cuenta ================
configuracionRouter.get("/usuariosactivoscuenta/:id", (req, res) => {
  console.log("Entró a usuarios activos de una cuenta");

  const idCuenta = req.params.id;
  console.log("idCuenta", idCuenta);

  sequelize
    .query(getListaUsuariosActivosCuenta(idCuenta), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});*/

/*//========== Lista solo a los usuarios activos================
configuracionRouter.get("/usuariosactivos", (req, res) => {
  console.log("Entró a usuarios");

  sequelize
    .query(getListaUsuariosActivos, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});*/

/*//========== Lista todos los usuarios ================
configuracionRouter.get("/usuarios", (req, res) => {
  console.log("Entró a usuarios");

  sequelize
    .query(getListaUsuarios, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});*/

//========== Paises ================
configuracionRouter.get("/paises", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista países disponibles'
      #swagger.description = 'Obtiene la lista completa de países configurados en el sistema. Utilizado para formularios de direcciones y localización geográfica.'
      #swagger.responses[200] = {
        description: 'Lista de países obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del país' },
              nombre: { type: 'string', description: 'Nombre del país' },
              codigo: { type: 'string', description: 'Código ISO del país' },
              codigoTelefono: { type: 'string', description: 'Código telefónico internacional' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a paises");

  sequelize
    .query(queryConfiguracionPais, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Participación ================
configuracionRouter.get("/participacion", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista tipos de participación'
      #swagger.description = 'Obtiene los tipos de participación disponibles para contactos. Define el nivel de influencia o participación de un contacto en los procesos de decisión.'
      #swagger.responses[200] = {
        description: 'Lista de tipos de participación obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del tipo de participación' },
              nombre: { type: 'string', description: 'Nombre del tipo de participación' },
              descripcion: { type: 'string', description: 'Descripción del tipo' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a participacion");

  sequelize
    .query(queryConfiguracionParticipacion, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Relación ================
configuracionRouter.get("/relacion", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista tipos de relación'
      #swagger.description = 'Obtiene los tipos de relación disponibles para contactos. Define el tipo de relación comercial o personal entre el contacto y la empresa.'
      #swagger.responses[200] = {
        description: 'Lista de tipos de relación obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del tipo de relación' },
              nombre: { type: 'string', description: 'Nombre del tipo de relación' },
              descripcion: { type: 'string', description: 'Descripción del tipo' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a relacion");

  sequelize
    .query(queryConfiguracionRelacion, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Situacion laboral ================
configuracionRouter.get("/situacionlaboral", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista situaciones laborales'
      #swagger.description = 'Obtiene las situaciones laborales disponibles para contactos. Permite categorizar el estado de empleo actual de los contactos.'
      #swagger.responses[200] = {
        description: 'Lista de situaciones laborales obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID de la situación laboral' },
              nombre: { type: 'string', description: 'Nombre de la situación laboral' },
              descripcion: { type: 'string', description: 'Descripción de la situación' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a situacion laboral");

  sequelize
    .query(queryConfiguracionSituacionLaboral, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Etapas de venta ================
configuracionRouter.get("/etapaventa", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista etapas del proceso de venta'
      #swagger.description = 'Obtiene las etapas configuradas para el proceso de ventas. Utilizado para el seguimiento y gestión del pipeline de oportunidades.'
      #swagger.responses[200] = {
        description: 'Lista de etapas de venta obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID de la etapa de venta' },
              nombre: { type: 'string', description: 'Nombre de la etapa' },
              orden: { type: 'integer', description: 'Orden secuencial de la etapa' },
              probabilidad: { type: 'number', description: 'Probabilidad de cierre en esta etapa' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a etapas de venta");

  sequelize
    .query(queryConfiguracionEtapaVenta, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Etapas de compra ================
configuracionRouter.get("/etapacompra", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista etapas del proceso de compra'
      #swagger.description = 'Obtiene las etapas del proceso de compra desde la perspectiva del cliente. Ayuda a entender en qué fase del proceso de decisión se encuentra el prospecto.'
      #swagger.responses[200] = {
        description: 'Lista de etapas de compra obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID de la etapa de compra' },
              nombre: { type: 'string', description: 'Nombre de la etapa' },
              descripcion: { type: 'string', description: 'Descripción de la etapa' },
              orden: { type: 'integer', description: 'Orden secuencial de la etapa' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a etapas de compra");

  sequelize
    .query(queryConfiguracionEtapaCompra, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Lineas de negocio ================
configuracionRouter.get("/lineanegocio", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista líneas de negocio disponibles'
      #swagger.description = 'Obtiene las líneas de negocio configuradas en el sistema. Permite categorizar oportunidades y productos por área de negocio específica.'
      #swagger.responses[200] = {
        description: 'Lista de líneas de negocio obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID de la línea de negocio' },
              nombre: { type: 'string', description: 'Nombre de la línea de negocio' },
              descripcion: { type: 'string', description: 'Descripción de la línea' },
              activo: { type: 'boolean', description: 'Indica si está activa' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a lineas de negocio");

  sequelize
    .query(queryConfiguracionLineaNegocio, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Estados de la oportunidad ================
configuracionRouter.get("/estadooportunidad", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista estados de oportunidad'
      #swagger.description = 'Obtiene los estados disponibles para las oportunidades de negocio. Define el estado actual del proceso de venta (activa, ganada, perdida, etc.).'
      #swagger.responses[200] = {
        description: 'Lista de estados de oportunidad obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del estado' },
              nombre: { type: 'string', description: 'Nombre del estado' },
              descripcion: { type: 'string', description: 'Descripción del estado' },
              esFinal: { type: 'boolean', description: 'Indica si es un estado final' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a estados de la oportunidad");

  sequelize
    .query(queryConfiguracionEstadoOportunidad, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Preguntas del proceso de ventas ================
configuracionRouter.get("/preguntaspv", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista preguntas del proceso de ventas'
      #swagger.description = 'Obtiene las preguntas configuradas para el proceso de ventas. Utilizado para guiar las conversaciones y recopilar información clave durante el proceso comercial.'
      #swagger.responses[200] = {
        description: 'Lista de preguntas del proceso de ventas obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID de la pregunta' },
              pregunta: { type: 'string', description: 'Texto de la pregunta' },
              categoria: { type: 'string', description: 'Categoría de la pregunta' },
              orden: { type: 'integer', description: 'Orden de presentación' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a preguntas del proceso de ventas");

  sequelize
    .query(queryGetConfiguracionPreguntasPV, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Estados de cotización ================
configuracionRouter.get("/estadocotizacion", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista estados de cotización'
      #swagger.description = 'Obtiene los estados disponibles para las cotizaciones. Define el estado actual del documento de cotización (borrador, enviada, aprobada, rechazada, etc.).'
      #swagger.responses[200] = {
        description: 'Lista de estados de cotización obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del estado' },
              nombre: { type: 'string', description: 'Nombre del estado' },
              descripcion: { type: 'string', description: 'Descripción del estado' },
              color: { type: 'string', description: 'Color asociado al estado' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Obtiene la lista de los estados de una cotizacion");

  sequelize
    .query(getListaEstadosCotizacion, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Lista los tiempos de entrega ================
configuracionRouter.get("/tiemposentrega", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista tiempos de entrega disponibles'
      #swagger.description = 'Obtiene los tiempos de entrega configurados para cotizaciones. Utilizado para especificar plazos de entrega estándar en las propuestas comerciales.'
      #swagger.responses[200] = {
        description: 'Lista de tiempos de entrega obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del tiempo de entrega' },
              descripcion: { type: 'string', description: 'Descripción del tiempo de entrega' },
              dias: { type: 'integer', description: 'Número de días' },
              activo: { type: 'boolean', description: 'Indica si está activo' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Obtiene la lista de los tiempos de entrega de una cotizacion");

  sequelize
    .query(getListaTiemposEntregaCotizacion, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Lista las opciones de validez ================
configuracionRouter.get("/validez", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista opciones de validez para cotizaciones'
      #swagger.description = 'Obtiene las opciones de validez configuradas para cotizaciones. Define por cuánto tiempo es válida la oferta comercial presentada al cliente.'
      #swagger.responses[200] = {
        description: 'Lista de opciones de validez obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID de la opción de validez' },
              descripcion: { type: 'string', description: 'Descripción del período de validez' },
              dias: { type: 'integer', description: 'Número de días de validez' },
              activo: { type: 'boolean', description: 'Indica si está activo' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Obtiene la lista de las opciones de validez de una cotizacion");

  sequelize
    .query(getListaValidezCotizacion, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Lista las opciones de garantia ================
configuracionRouter.get("/garantia", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista opciones de garantía para cotizaciones'
      #swagger.description = 'Obtiene las opciones de garantía configuradas para cotizaciones. Define los diferentes tipos y períodos de garantía que se pueden ofrecer en las propuestas.'
      #swagger.responses[200] = {
        description: 'Lista de opciones de garantía obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID de la opción de garantía' },
              descripcion: { type: 'string', description: 'Descripción de la garantía' },
              meses: { type: 'integer', description: 'Número de meses de garantía' },
              tipo: { type: 'string', description: 'Tipo de garantía' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Obtiene la lista de las opciones de garantia de una cotizacion");

  sequelize
    .query(getListaGarantiaCotizacion, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Lista las opciones de forma de pago ================
configuracionRouter.get("/formapago", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista formas de pago disponibles'
      #swagger.description = 'Obtiene las formas de pago configuradas para cotizaciones. Define los métodos de pago aceptados y las condiciones comerciales disponibles.'
      #swagger.responses[200] = {
        description: 'Lista de formas de pago obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID de la forma de pago' },
              descripcion: { type: 'string', description: 'Descripción de la forma de pago' },
              tipo: { type: 'string', description: 'Tipo de pago (contado, crédito, etc.)' },
              activo: { type: 'boolean', description: 'Indica si está activa' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log(
    "Obtiene la lista de las opciones de forma de pago de una cotizacion"
  );

  sequelize
    .query(getListaFormaPagoCotizacion, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Lista las opciones de monedas ================
configuracionRouter.get("/moneda", (req, res) => {
  /*  #swagger.tags = ['Configuración']
      #swagger.summary = 'Lista monedas disponibles'
      #swagger.description = 'Obtiene las monedas configuradas para cotizaciones y transacciones. Permite manejar múltiples divisas en las propuestas comerciales y reportes financieros.'
      #swagger.responses[200] = {
        description: 'Lista de monedas obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID de la moneda' },
              nombre: { type: 'string', description: 'Nombre de la moneda' },
              codigo: { type: 'string', description: 'Código ISO de la moneda' },
              simbolo: { type: 'string', description: 'Símbolo de la moneda' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Obtiene la lista de las opciones de monedas de una cotizacion");

  sequelize
    .query(getListaMonedaCotizacion, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Obtiene los datos de un usuario en base a su correo ================
/*configuracionRouter.get("/usuarios/:email", (req, res) => {
  console.log(
    "Obtiene los datos de un usuario en base a su correo:",
    req.params.email
  );

  const email = req.params.email;

  sequelize
    .query(getUsuarioByEmail(email), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      return res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});*/

/*//========== Valida si existe el usuario en la base de datos local con su correo ================
configuracionRouter.get("/idusuario/:email", (req, res) => {
  console.log(
    "valida si existe un usuario en base a su correo:",
    req.params.email
  );

  const email = req.params.email;

  sequelize
    .query(getIdUsuarioByEmail(email), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((resultado) => {
      console.log("resulatdo: ", resultado);
      res.status(200).send(resultado);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});*/

export { configuracionRouter };
