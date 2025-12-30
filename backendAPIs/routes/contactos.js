import { Router } from "express";
import sequelize from "../database/database.js";
import {
  queryContactos,
  queryGetCantidadContactos,
  ensamblarQueryGrabarContacto,
  ensamblarQueryContactosPorCuenta,
  ensamblarQueryGetContacto,
  ensamblarQueryActualizarContacto,
  ensamblarQueryGetIdContactoConIdContacto,
  ensamblarQueryGetContactosPorUsuario,
  getListaContactosPendientesAprobacion,
} from "../database/queries.js";

const contactosRouter = Router();

let datos = {};

//Estandariza los datos para que se cree adecuadamente la cuenta en la base de datos
function prepararDatosParaGrabar(enviado, numContactos) {
  console.log("funcion prepararDatosParaGrabar", enviado, numContactos);

  datos = {
    id: enviado.id,
    idContacto: numContactos,
    nombresContacto: enviado.nombresContacto,
    apellidosContacto: enviado.apellidosContacto,
    idCuentaContacto: enviado.idCuentaContacto,
    cargoContacto: enviado.cargoContacto,
    telefonoContacto: enviado.telefonoContacto,
    extensionContacto: enviado.extensionContacto,
    movilContacto: enviado.movilContacto,
    emailContacto: enviado.emailContacto,
    departamentoContacto: enviado.departamentoContacto,
    idPaisContacto: enviado.idPaisContacto,
    estadoContacto: enviado.estadoContacto,
    ciudadContacto: enviado.ciudadContacto,
    direccionContacto: enviado.direccionContacto,
    codigoPostalContacto: enviado.codigoPostalContacto,
    idInfluyeEnContacto: enviado.idInfluyeEnContacto,
    idJefeContacto: enviado.idJefeContacto,
    idParticipacionContacto: enviado.idParticipacionContacto,
    idRelacionContacto: enviado.idRelacionContacto,
    idPropietarioContacto: enviado.idPropietarioContacto,
    saludoContacto: enviado.saludoContacto,
    idSituacionLaboralContacto: enviado.idSituacionLaboralContacto,
    descripcionContacto: enviado.descripcionContacto,
    idCreadoPorContacto: enviado.idCreadoPorContacto,
    idModificadoPorContacto: enviado.idModificadoPorContacto,
    fechaCreacionContacto:
      enviado.idContacto === 0
        ? new Date()
            .toISOString()
            .replace(/T.*/, "")
            .split("-")
            .reverse()
            .join("-")
        : enviado.fechaCreacionContacto,
    //fechaCreacionContacto: enviado.fechaCreacionCContacto,
    fechaModificacionContacto: new Date()
      .toISOString()
      .replace(/T.*/, "")
      .split("-")
      .reverse()
      .join("-"),
    //fechaModificacionContacto: enviado.fechaModificacionContacto,
    statusContacto: enviado.statusContacto,
  };

  console.log("datosPreparadosParaGrabar", datos);
  return datos;
}

//========== CONTACTOS ================
//=====================================

//========= Obtiene la lista de los contactos =============
contactosRouter.get("/", (req, res) => {
  /*  #swagger.tags = ['Contactos']
      #swagger.summary = 'Lista todos los contactos'
      #swagger.description = 'Obtiene una lista completa de todos los contactos en el sistema. Incluye información básica de cada contacto como nombre, email, teléfono y cuenta asociada.'
      #swagger.responses[200] = {
        description: 'Lista de contactos obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Contacto' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a contactos");

  sequelize
    .query(queryContactos, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((contactos) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(contactos);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//========== Descargar los datos de un contacto ========
contactosRouter.get("/:id", (req, res) => {
  /*  #swagger.tags = ['Contactos']
      #swagger.summary = 'Obtiene un contacto específico'
      #swagger.description = 'Obtiene todos los detalles de un contacto específico utilizando su ID único. Incluye información completa como datos personales, de contacto y relaciones.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID único del contacto a obtener',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Contacto encontrado y devuelto exitosamente',
        schema: { $ref: '#/definitions/Contacto' }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[404] = {
        description: 'Contacto no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entro a descargar los datos de un contacto");

  const idContacto = req.params.id;
  console.log("idContacto", idContacto);

  sequelize
    .query(ensamblarQueryGetContacto(idContacto), {
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

/*//========== Grabar un contacto ================
contactosRouter.post("/grabar", (req, res) => {
  console.log("Entró a grabar un contacto");
  console.log(req.body);

  let idContactoNuevo = 0;
  let datosAGrabar = {};
  //Si el id del contacto es mayor a cero se debe hacer un update, sino un insert
  const idContacto = req.body.idContacto;

  if (idContacto > 0) {
    //========= UPDATE ======================
    datosAGrabar = prepararDatosParaGrabar(req.body, idContacto);
    sequelize
      .query(ensamblarQueryActualizarContacto(datosAGrabar), {
        type: sequelize.QueryTypes.UPDATE,
      })
      .then((result) => {
        console.log(result);
        return sequelize.query(
          ensamblarQueryGetIdContactoConIdContacto(idContacto),
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
      .query(queryGetCantidadContactos, {
        type: sequelize.QueryTypes.SELECT,
      })
      //Obtiene la cantidad total de los contactos en la BD
      .then((totalContactos) => {
        console.log("total contactos", totalContactos[0].maximo);
        idContactoNuevo = totalContactos[0].maximo + 1;
        datosAGrabar = prepararDatosParaGrabar(req.body, idContactoNuevo);
        console.log(datosAGrabar);
        return sequelize.query(ensamblarQueryGrabarContacto(datosAGrabar), {
          type: sequelize.QueryTypes.INSERT,
        });
      })
      .then((result) => {
        console.log(result);
        return sequelize.query(
          ensamblarQueryGetIdContactoConIdContacto(idContactoNuevo),
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

//============ Obtener los contactos de una cuenta =======
contactosRouter.get("/cuenta/:id", (req, res) => {
  /*  #swagger.tags = ['Contactos']
      #swagger.summary = 'Lista contactos por cuenta'
      #swagger.description = 'Obtiene todos los contactos asociados a una cuenta específica. Útil para mostrar el directorio de contactos de una empresa o cliente.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de la cuenta para obtener sus contactos',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de contactos de la cuenta obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Contacto' } }
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
  console.log("Entró a obtener los contactos de una cuenta");

  const idCuenta = req.params.id;
  console.log("idCuenta de obtener los contactos de una cuenta", idCuenta);

  sequelize
    .query(ensamblarQueryContactosPorCuenta(idCuenta), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((contactos) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(contactos);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

contactosRouter.put("/:id", (req, res) => {
  /*  #swagger.tags = ['Contactos']
      #swagger.summary = 'Actualiza un contacto existente'
      #swagger.description = 'Actualiza los datos de un contacto existente. Permite modificar cualquier campo excepto el ID.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID único del contacto a actualizar',
        required: true,
        type: 'string'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos actualizados del contacto',
        required: true,
        schema: { $ref: '#/definitions/Contacto.request' }
      }
      #swagger.responses[200] = {
        description: 'Contacto actualizado exitosamente',
        schema: { $ref: '#/definitions/Contacto' }
      }
      #swagger.responses[400] = {
        description: 'ID inválido o datos de entrada erróneos'
      }
      #swagger.responses[404] = {
        description: 'Contacto no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a actualizar un contacto con PUT");
  console.log("ID de contacto a actualizar:", req.params.id);
  console.log("Datos recibidos:", req.body);

  const {
    apellidosContacto,
    cargoContacto,
    ciudadContacto,
    codigoPostalContacto,
    departamentoContacto,
    descripcionContacto,
    direccionContacto,
    emailContacto,
    estadoContacto,
    extensionContacto,
    fechaCreacionContacto,
    fechaModificacionContacto,
    id,
    //idContacto,
    idCreadoPorContacto,
    idCuentaContacto,
    idInfluyeEnContacto,
    idJefeContacto,
    idModificadoPorContacto,
    idPaisContacto,
    idParticipacionContacto,
    idPropietarioContacto,
    idRelacionContacto,
    idSituacionLaboralContacto,
    movilContacto,
    nombresContacto,
    saludoContacto,
    statusContacto,
    telefonoContacto,
  } = req.body;

  const idContactoActual = parseInt(req.params.id);

  // Validar que el ID de la cuenta sea válido
  if (!idContactoActual || idContactoActual <= 0) {
    return res.status(400).json({
      error: "ID de contacto inválido",
      message: "El ID del contacto debe ser un número mayor a cero",
    });
  }

  try {
    // Preparar datos para actualización
    const datosAActualizar = prepararDatosParaGrabar(
      {
        apellidosContacto,
        cargoContacto,
        ciudadContacto,
        codigoPostalContacto,
        departamentoContacto,
        descripcionContacto,
        direccionContacto,
        emailContacto,
        estadoContacto,
        extensionContacto,
        fechaCreacionContacto,
        fechaModificacionContacto,
        id,
        idContacto: idContactoActual,
        idCreadoPorContacto,
        idCuentaContacto,
        idInfluyeEnContacto,
        idJefeContacto,
        idModificadoPorContacto,
        idPaisContacto,
        idParticipacionContacto,
        idPropietarioContacto,
        idRelacionContacto,
        idSituacionLaboralContacto,
        movilContacto,
        nombresContacto,
        saludoContacto,
        statusContacto,
        telefonoContacto,
      },
      idContactoActual
    );

    console.log("Datos preparados para actualización:", datosAActualizar);

    sequelize
      .query(ensamblarQueryActualizarContacto(datosAActualizar), {
        type: sequelize.QueryTypes.UPDATE,
      })
      .then((result) => {
        console.log(result);
        return sequelize.query(
          ensamblarQueryGetIdContactoConIdContacto(idContactoActual),
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
      message: "Error al procesar los datos de la cuenta",
      details: error.message,
    });
  }
});

contactosRouter.post("/", (req, res) => {
  /*  #swagger.tags = ['Contactos']
      #swagger.summary = 'Crea un nuevo contacto'
      #swagger.description = 'Crea un nuevo contacto en el sistema. Requiere información básica como nombre, apellido y al menos un método de contacto (email o teléfono).'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del nuevo contacto',
        required: true,
        schema: { $ref: '#/definitions/Contacto.request' }
      }
      #swagger.responses[200] = {
        description: 'Contacto creado exitosamente',
        schema: { $ref: '#/definitions/Contacto' }
      }
      #swagger.responses[400] = {
        description: 'Datos de entrada inválidos'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a crear un contacto");
  console.log("Datos recibidos:", req.body);

  let idContactoNuevo = 0;
  let datosAGrabar = {};
  const {
    apellidosContacto,
    cargoContacto,
    ciudadContacto,
    codigoPostalContacto,
    departamentoContacto,
    descripcionContacto,
    direccionContacto,
    emailContacto,
    estadoContacto,
    extensionContacto,
    fechaCreacionContacto,
    fechaModificacionContacto,
    id,
    //idContacto,
    idCreadoPorContacto,
    idCuentaContacto,
    idInfluyeEnContacto,
    idJefeContacto,
    idModificadoPorContacto,
    idPaisContacto,
    idParticipacionContacto,
    idPropietarioContacto,
    idRelacionContacto,
    idSituacionLaboralContacto,
    movilContacto,
    nombresContacto,
    saludoContacto,
    statusContacto,
    telefonoContacto,
  } = req.body;

  sequelize
    .query(queryGetCantidadContactos, {
      type: sequelize.QueryTypes.SELECT,
    })
    //Obtiene la cantidad total de los contactos en la BD
    .then((totalContactos) => {
      console.log("total contactos", totalContactos[0].maximo);
      idContactoNuevo = totalContactos[0].maximo + 1;
      datosAGrabar = prepararDatosParaGrabar(
        {
          apellidosContacto,
          cargoContacto,
          ciudadContacto,
          codigoPostalContacto,
          departamentoContacto,
          descripcionContacto,
          direccionContacto,
          emailContacto,
          estadoContacto,
          extensionContacto,
          fechaCreacionContacto,
          fechaModificacionContacto,
          id,
          idContacto: idContactoNuevo,
          idCreadoPorContacto,
          idCuentaContacto,
          idInfluyeEnContacto,
          idJefeContacto,
          idModificadoPorContacto,
          idPaisContacto,
          idParticipacionContacto,
          idPropietarioContacto,
          idRelacionContacto,
          idSituacionLaboralContacto,
          movilContacto,
          nombresContacto,
          saludoContacto,
          statusContacto,
          telefonoContacto,
        },
        idContactoNuevo
      );
      console.log(datosAGrabar);
      return sequelize.query(ensamblarQueryGrabarContacto(datosAGrabar), {
        type: sequelize.QueryTypes.INSERT,
      });
    })
    .then((result) => {
      console.log(result);
      return sequelize.query(
        ensamblarQueryGetIdContactoConIdContacto(idContactoNuevo),
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

//========== Obtiene la lista de los contactos por usuario ========
contactosRouter.get("/usuario/:id", (req, res) => {
  /*  #swagger.tags = ['Contactos']
      #swagger.summary = 'Lista contactos por usuario'
      #swagger.description = 'Obtiene todos los contactos asociados a un usuario específico. Útil para mostrar contactos filtrados por propietario o responsable.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del usuario para filtrar contactos',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de contactos del usuario obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Contacto' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entro a contactos por usuario");

  const idContacto = req.params.id;
  console.log("idContacto", idContacto);

  sequelize
    .query(ensamblarQueryGetContactosPorUsuario(idContacto), {
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

//========== Obtiene la lista de los contactos pendientes de aprobar ========
contactosRouter.get("/pendientesAprobacion", (req, res) => {
  /*  #swagger.tags = ['Contactos']
      #swagger.summary = 'Lista contactos pendientes de aprobación'
      #swagger.description = 'Obtiene todos los contactos que están pendientes de aprobación en el sistema. Útil para workflows de aprobación de nuevos contactos.'
      #swagger.responses[200] = {
        description: 'Lista de contactos pendientes obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Contacto' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a contactos pendientes de aprobación");

  sequelize
    .query(getListaContactosPendientesAprobacion, {
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

export { contactosRouter };
