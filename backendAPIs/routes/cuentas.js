/**
 * Rutas relacionadas con cuentas
 * @module rutas/cuentas
 */

import e, { Router } from "express";
import sequelize from "../database/database.js";
import {
  getListaCuentas,
  queryGetCantidadCuentas,
  ensamblarQueryGrabarCuenta,
  ensamblarQueryGetIdCuentaConIdCuenta,
  ensamblarQueryGetCuenta,
  ensamblarQueryActualizarCuenta,
  getListaCuentasPorUsuario,
  getListaCuentasPendientesAprobacion,
} from "../database/queries.js";

const cuentasRouter = Router();

//Estandariza los datos para que se cree adecuadamente la cuenta en la base de datos
function prepararDatosParaGrabar(enviado, numCuentas) {
  console.log("funcion prepararDatosParaGrabar", enviado, numCuentas);

  const datos = {
    id: enviado.id,
    idCuenta: numCuentas,
    nombreCuenta: enviado.nombreCuenta,
    idTipoCuenta: enviado.idTipoCuenta,
    idPropietarioCuenta: enviado.idPropietarioCuenta,
    copropietarioCuenta: enviado.copropietarioCuenta.toString(),
    //copropietarioCuenta: enviado.copropietarioCuenta,
    idSectorCuenta: enviado.idSectorCuenta,
    idCreadoPorCuenta: enviado.idCreadoPorCuenta,
    idModificadoPorCuenta: enviado.idModificadoPorCuenta,
    fechaCreacionCuenta:
      enviado.idCuenta === 0
        ? new Date()
            .toISOString()
            .replace(/T.*/, "")
            .split("-")
            .reverse()
            .join("-")
        : enviado.fechaCreacionCuenta,
    fechaModificacionCuenta: new Date()
      .toISOString()
      .replace(/T.*/, "")
      .split("-")
      .reverse()
      .join("-"),
    telefonoCuenta: enviado.telefonoCuenta,
    registroCuenta: enviado.registroCuenta,
    webCuenta: enviado.webCuenta,
    direccionCuenta: enviado.direccionCuenta,
    ciudadCuenta: enviado.ciudadCuenta,
    estadoCuenta: enviado.estadoCuenta,
    idPaisCuenta: enviado.idPaisCuenta,
    descripcionCuenta: enviado.descripcionCuenta,
    statusCuenta: enviado.statusCuenta,
  };
  console.log("datosPreparadosParaGrabar", datos);
  return datos;
}

cuentasRouter.get("/", (req, res) => {
  /*  #swagger.tags = ['Cuentas']
      #swagger.summary = 'Lista todas las cuentas'
      #swagger.description = 'Obtiene una lista completa de todas las cuentas en el sistema. Incluye información básica como nombre, tipo, propietario y datos de contacto.'
      #swagger.responses[200] = {
        description: 'Lista de cuentas obtenida exitosamente',
        schema: { $ref: '#/definitions/Cuenta' }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Obtiene la lista de todas las cuentas");

  sequelize
    .query(getListaCuentas, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((cuentas) => {
      res.status(200).send(cuentas);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

cuentasRouter.get("/:id", (req, res) => {
  /*  #swagger.tags = ['Cuentas']
      #swagger.summary = 'Obtiene una cuenta específica'
      #swagger.description = 'Obtiene todos los detalles de una cuenta específica utilizando su ID único. Incluye información completa como datos de contacto, dirección y configuración.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID único de la cuenta a obtener',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Cuenta encontrada y devuelta exitosamente',
        schema: { $ref: '#/definitions/Cuenta' }
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
  console.log("Obtiene los datos de una cuenta");

  const idCuenta = req.params.id;
  console.log("idCuenta", idCuenta);

  sequelize
    .query(ensamblarQueryGetCuenta(idCuenta), {
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

cuentasRouter.post("/", (req, res) => {
  /*  #swagger.tags = ['Cuentas']
      #swagger.summary = 'Crea una nueva cuenta'
      #swagger.description = 'Crea una nueva cuenta en el sistema. Requiere información básica como nombre, tipo y propietario.'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la nueva cuenta',
        required: true,
        schema: { $ref: '#/definitions/Cuenta.request' }
      }
      #swagger.responses[200] = {
        description: 'Cuenta creada exitosamente',
        schema: { $ref: '#/definitions/Cuenta' }
      }
      #swagger.responses[400] = {
        description: 'Datos de entrada inválidos'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a crear una cuenta");
  console.log("Datos recibidos:", req.body);

  let idCuentaNueva = 0;
  let datosAGrabar = {};
  const {
    ciudadCuenta,
    copropietarioCuenta,
    descripcionCuenta,
    direccionCuenta,
    estadoCuenta,
    fechaCreacionCuenta,
    fechaModificacionCuenta,
    id,
    idCreadoPorCuenta,
    //idCuenta,
    idModificadoPorCuenta,
    idPaisCuenta,
    idPropietarioCuenta,
    idSectorCuenta,
    idTipoCuenta,
    nombreCuenta,
    registroCuenta,
    statusCuenta,
    telefonoCuenta,
    webCuenta,
  } = req.body;

  //========= INSERT =================
  sequelize
    .query(queryGetCantidadCuentas, {
      type: sequelize.QueryTypes.SELECT,
    })
    //Obtiene el total de las cuentas en la BD
    .then((totalCuentas) => {
      console.log("total cuentas", totalCuentas[0].maximo);
      idCuentaNueva = totalCuentas[0].maximo + 1;
      datosAGrabar = prepararDatosParaGrabar(
        {
          ...{
            ciudadCuenta,
            copropietarioCuenta,
            descripcionCuenta,
            direccionCuenta,
            estadoCuenta,
            fechaCreacionCuenta,
            fechaModificacionCuenta,
            id,
            idCreadoPorCuenta,
            //idCuenta,
            idModificadoPorCuenta,
            idPaisCuenta,
            idPropietarioCuenta,
            idSectorCuenta,
            idTipoCuenta,
            nombreCuenta,
            registroCuenta,
            statusCuenta,
            telefonoCuenta,
            webCuenta,
          },
          idCuenta: idCuentaNueva,
        },
        idCuentaNueva
      );
      console.log(datosAGrabar);
      return sequelize.query(ensamblarQueryGrabarCuenta(datosAGrabar), {
        type: sequelize.QueryTypes.INSERT,
      });
    })
    .then((result) => {
      console.log(result);
      return sequelize.query(
        ensamblarQueryGetIdCuentaConIdCuenta(idCuentaNueva),
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

cuentasRouter.put("/:id", (req, res) => {
  /*  #swagger.tags = ['Cuentas']
      #swagger.summary = 'Actualiza una cuenta existente'
      #swagger.description = 'Actualiza los datos de una cuenta existente. Permite modificar cualquier campo excepto el ID.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID único de la cuenta a actualizar',
        required: true,
        type: 'string'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos actualizados de la cuenta',
        required: true,
        schema: { $ref: '#/definitions/Cuenta.request' }
      }
      #swagger.responses[200] = {
        description: 'Cuenta actualizada exitosamente',
        schema: { $ref: '#/definitions/Cuenta' }
      }
      #swagger.responses[400] = {
        description: 'ID inválido o datos de entrada erróneos'
      }
      #swagger.responses[404] = {
        description: 'Cuenta no encontrada'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a actualizar cuenta con PUT");
  console.log("ID de cuenta a actualizar:", req.params.id);
  console.log("Datos recibidos:", req.body);

  const {
    ciudadCuenta,
    copropietarioCuenta,
    descripcionCuenta,
    direccionCuenta,
    estadoCuenta,
    fechaCreacionCuenta,
    fechaModificacionCuenta,
    id,
    idCreadoPorCuenta,
    //idCuenta,
    idModificadoPorCuenta,
    idPaisCuenta,
    idPropietarioCuenta,
    idSectorCuenta,
    idTipoCuenta,
    nombreCuenta,
    registroCuenta,
    statusCuenta,
    telefonoCuenta,
    webCuenta,
  } = req.body;

  const idCuenta = parseInt(req.params.id);

  // Validar que el ID de la cuenta sea válido
  if (!idCuenta || idCuenta <= 0) {
    return res.status(400).json({
      error: "ID de cuenta inválido",
      message: "El ID de la cuenta debe ser un número mayor a cero",
    });
  }

  try {
    // Preparar datos para actualización
    const datosAActualizar = prepararDatosParaGrabar(
      {
        ...{
          ciudadCuenta,
          copropietarioCuenta,
          descripcionCuenta,
          direccionCuenta,
          estadoCuenta,
          fechaCreacionCuenta,
          fechaModificacionCuenta,
          id,
          idCreadoPorCuenta,
          //idCuenta,
          idModificadoPorCuenta,
          idPaisCuenta,
          idPropietarioCuenta,
          idSectorCuenta,
          idTipoCuenta,
          nombreCuenta,
          registroCuenta,
          statusCuenta,
          telefonoCuenta,
          webCuenta,
        },
        idCuenta: idCuenta,
      },
      idCuenta
    );

    console.log("Datos preparados para actualización:", datosAActualizar);

    // Ejecutar la actualización
    sequelize
      .query(ensamblarQueryActualizarCuenta(datosAActualizar), {
        type: sequelize.QueryTypes.UPDATE,
      })
      .then((result) => {
        console.log(result);
        return sequelize.query(ensamblarQueryGetIdCuentaConIdCuenta(idCuenta), {
          type: sequelize.QueryTypes.SELECT,
        });
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
      message: "Error al procesar los datos de la cuenta",
      details: error.message,
    });
  }
});

cuentasRouter.get("/usuario/:id", (req, res) => {
  /*  #swagger.tags = ['Cuentas']
      #swagger.summary = 'Lista cuentas por usuario'
      #swagger.description = 'Obtiene todas las cuentas asociadas a un usuario específico como propietario o copropietario. Útil para mostrar cuentas filtradas por responsable.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del usuario para obtener sus cuentas',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de cuentas del usuario obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Cuenta' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[404] = {
        description: 'Usuario no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Obtiene la lista de cuentas de un usuario");

  const idUsuario = req.params.id;
  console.log("idUsuario", idUsuario);

  sequelize
    .query(getListaCuentasPorUsuario(idUsuario), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((cuentas) => {
      res.status(200).send(cuentas);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

cuentasRouter.get("/pendientesAprobacion", (req, res) => {
  /*  #swagger.tags = ['Cuentas']
      #swagger.summary = 'Lista cuentas pendientes de aprobación'
      #swagger.description = 'Obtiene todas las cuentas que están pendientes de aprobación en el sistema. Útil para workflows de aprobación de nuevas cuentas.'
      #swagger.responses[200] = {
        description: 'Lista de cuentas pendientes obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Cuenta' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a cuentas pendientes de aprobación");

  sequelize
    .query(getListaCuentasPendientesAprobacion, {
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
});

export { cuentasRouter };
