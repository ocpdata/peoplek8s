import { Router } from "express";
import sequelize from "../database/database.js";
import {
  getListaUsuarios,
  //getListaCuentasPorUsuario,
  getClaveUsuario,
  getIdUsuarioByEmail,
  getListaUsuariosActivos,
  getListaUsuariosActivosCuenta,
  getUsuarioByEmail,
} from "../database/queries.js";

const usuariosRouter = Router();

/*//Obtiene la lista de cuentas de un usuario
usuariosRouter.get("/:userId/cuentas", (req, res) => {
  console.log("Obtiene la lista de cuentas de un usuario");

  const idUsuario = req.params.userId;
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
});*/

//========== Lista todos los usuarios ================
usuariosRouter.get("/", (req, res) => {
  /*  #swagger.tags = ['Usuarios']
      #swagger.summary = 'Lista todos los usuarios'
      #swagger.description = 'Obtiene una lista completa de todos los usuarios registrados en el sistema. Incluye información básica de cada usuario como ID, email, nombre y permisos.'
      #swagger.responses[200] = {
        description: 'Lista de usuarios obtenida exitosamente',
        schema: { $ref: '#/definitions/Usuario' }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
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
});

//========== Lista solo a los usuarios activos================
usuariosRouter.get("/activos", (req, res) => {
  /*  #swagger.tags = ['Usuarios']
      #swagger.summary = 'Lista usuarios activos'
      #swagger.description = 'Obtiene una lista de usuarios activos en el sistema. Opcionalmente puede filtrar por cuenta específica usando el parámetro idcuenta para obtener usuarios activos propietarios o copropietarios de la cuenta indicada.'
      #swagger.parameters['idcuenta'] = {
        in: 'query',
        description: 'ID de cuenta para filtrar usuarios activos asociados a esa cuenta',
        required: false,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de usuarios activos obtenida exitosamente',
        schema: { type: 'array', items: { $ref: '#/definitions/Usuario' } }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a usuarios");

  // Si se pasa ?idcuenta=id de una cuenta, devuelve los usuarios activos propietarios o copropietarios de la cuenta indicada
  const idCuenta = (req.query.idcuenta || "").toString().toLowerCase();

  if (
    idCuenta &&
    idCuenta !== "" &&
    idCuenta !== "null" &&
    idCuenta !== "undefined"
  ) {
    // Código para cuando se proporciona idCuenta válido
    console.log("Obteniendo usuarios activos para la cuenta:", idCuenta);
    // TODO: Implementar lógica específica para filtrar por cuenta
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
  } else {
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
  }
});

//========== Valida si existe el usuario en la base de datos local con su correo ================
usuariosRouter.get("/validar/:email", (req, res) => {
  /*  #swagger.tags = ['Usuarios']
      #swagger.summary = 'Valida existencia de usuario por email'
      #swagger.description = 'Verifica si existe un usuario en la base de datos local utilizando su dirección de correo electrónico. Retorna el ID del usuario si existe.'
      #swagger.parameters['email'] = {
        in: 'path',
        description: 'Dirección de correo electrónico del usuario a validar',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Validación completada - retorna ID si el usuario existe',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del usuario si existe' }
            }
          }
        }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
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
});

//========== Obtiene los datos de un usuario en base a su correo ================
usuariosRouter.get("/:email", (req, res) => {
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
});

//Obtiene la clave de un usuario
usuariosRouter.get("/:id/clave", (req, res) => {
  /*  #swagger.tags = ['Usuarios']
      #swagger.summary = 'Obtiene la clave de un usuario'
      #swagger.description = 'Obtiene la clave/contraseña encriptada de un usuario específico utilizando su ID. Esta información es sensible y requiere permisos especiales.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID único del usuario',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Clave del usuario obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              clave: { type: 'string', description: 'Clave encriptada del usuario' }
            }
          }
        }
      }
      #swagger.responses[401] = {
        description: 'No autorizado - Token de autenticación requerido'
      }
      #swagger.responses[403] = {
        description: 'Prohibido - Permisos insuficientes para acceder a información sensible'
      }
      #swagger.responses[404] = {
        description: 'Usuario no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Obtiene la clave un usuario");

  const idUsuario = req.params.id;
  console.log("idUsuario", idUsuario);

  sequelize
    .query(getClaveUsuario(idUsuario), {
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

export { usuariosRouter };
