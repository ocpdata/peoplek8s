import { Router } from "express";
import sequelize from "../database/database.js";
import {
  getListaFabricantes,
  getProductosByFabricante,
  getCodigoByFabricante,
  crearCodigoFabricante,
  getNombreTablaFabricanteById,
} from "../database/queries.js";

const fabricantesRouter = Router();

//========= Obtiene la lista de los fabricantes =============
fabricantesRouter.get("/", (req, res) => {
  /*  #swagger.tags = ['Fabricantes']
      #swagger.summary = 'Lista todos los fabricantes'
      #swagger.description = 'Obtiene una lista completa de todos los fabricantes registrados en el sistema. Incluye información básica como ID, nombre y base de datos asociada.'
      #swagger.responses[200] = {
        description: 'Lista de fabricantes obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del fabricante' },
              nombre: { type: 'string', description: 'Nombre del fabricante' },
              bd_fabricante: { type: 'string', description: 'Nombre de la base de datos del fabricante' },
              activo: { type: 'boolean', description: 'Indica si el fabricante está activo' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a fabricantes");

  sequelize
    .query(getListaFabricantes, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((fabricantes) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(fabricantes);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//======== Verifica si ya existe un codigo en la base de datos del fabricante ======
fabricantesRouter.get("/:id/codigo/:idcodigo", (req, res) => {
  /*  #swagger.tags = ['Fabricantes']
      #swagger.summary = 'Verifica existencia de código de fabricante'
      #swagger.description = 'Verifica si ya existe un código específico en la base de datos del fabricante. Requiere el parámetro query accion=validarexistencia para ejecutar la validación.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del fabricante',
        required: true,
        type: 'string'
      }
      #swagger.parameters['idcodigo'] = {
        in: 'path',
        description: 'Código del producto a verificar',
        required: true,
        type: 'string'
      }
      #swagger.parameters['accion'] = {
        in: 'query',
        description: 'Acción a realizar (usar validarexistencia para verificar el código)',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Verificación completada - retorna datos del código si existe',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              codigo: { type: 'string', description: 'Código del producto' },
              descripcion: { type: 'string', description: 'Descripción del producto' },
              precio: { type: 'number', description: 'Precio del producto' }
            }
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Parámetros requeridos faltantes'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log(
    "Verifica si ya existe un codigo en la base de datos del fabricante",
    id,
    codigo
  );
  const idFabricante = req.params.id;
  const codigo = req.params.codigo;

  //Encontrar el nombre de la tabla del fabricante

  // Si se pasa ?validarexistencia=true, valida la existencia del código
  const accion = req.query.accion;

  // Lógica para validar existencia del código
  console.log("Validando existencia del código");
  if (accion && accion !== "" && accion !== "null" && accion !== "undefined") {
    if (accion === "validarexistencia") {
      sequelize
        .query(getNombreTablaFabricanteById(idFabricante), {
          type: sequelize.QueryTypes.SELECT,
        })
        .then((nombreTablaFabricante) => {
          console.log("nombreTablaFabricante", nombreTablaFabricante);
          return sequelize.query(
            getCodigoByFabricante(
              nombreTablaFabricante[0].bd_fabricante,
              codigo
            ),
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
        })
        .then((fabricantes) => {
          //console.log("cuentas: ", cuentas);
          res.status(200).send(fabricantes);
        })
        .catch((error) => {
          console.error("Error: ", error);
          res.status(500).send;
        });
    }
  }
});

/*//========= Obtiene la lista de las cuentas =============
fabricantesRouter.get("/validar/:bdfabricante/:codigo", (req, res) => {
  console.log("Verifica si ya existe un codigo en la base del fabricante");
  const codigo = req.params.codigo;
  const bdFabricante = req.params.bdfabricante;
  console.log(codigo, bdFabricante);

  sequelize
    .query(getCodigoByFabricante(bdFabricante, codigo), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((fabricantes) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(fabricantes);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});*/

//========= Crea un codigo =============
fabricantesRouter.post("/", (req, res) => {
  /*  #swagger.tags = ['Fabricantes']
      #swagger.summary = 'Crea un nuevo código de fabricante'
      #swagger.description = 'Crea un nuevo código de producto en la base de datos del fabricante. Permite agregar nuevos productos al catálogo del fabricante.'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del nuevo código de fabricante',
        required: true,
        schema: { 
          type: 'object',
          properties: {
            idFabricante: { type: 'integer', description: 'ID del fabricante' },
            codigo: { type: 'string', description: 'Código del producto' },
            descripcion: { type: 'string', description: 'Descripción del producto' },
            precio: { type: 'number', description: 'Precio del producto' },
            categoria: { type: 'string', description: 'Categoría del producto' }
          },
          required: ['idFabricante', 'codigo', 'descripcion']
        }
      }
      #swagger.responses[200] = {
        description: 'Código creado exitosamente',
        schema: { 
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID del código creado' },
            mensaje: { type: 'string', description: 'Mensaje de confirmación' }
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Datos de entrada inválidos'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Crea un nuevo código de fabricante");
  const datos = req.body;
  //const bdFabricante = req.params.bdfabricante;
  console.log(datos);

  sequelize
    .query(crearCodigoFabricante(datos), {
      type: sequelize.QueryTypes.INSERT,
    })
    .then((codigo) => {
      console.log("codigo: ", codigo);
      res.status(200).send(codigo);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

//Obtiene la lista de productos de un fabricante
fabricantesRouter.get("/:id/productos", (req, res) => {
  /*  #swagger.tags = ['Fabricantes']
      #swagger.summary = 'Lista productos de un fabricante'
      #swagger.description = 'Obtiene todos los productos disponibles de un fabricante específico. Utiliza automáticamente la base de datos asociada al fabricante.'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del fabricante',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de productos obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del producto' },
              codigo: { type: 'string', description: 'Código del producto' },
              descripcion: { type: 'string', description: 'Descripción del producto' },
              precio: { type: 'number', description: 'Precio del producto' },
              categoria: { type: 'string', description: 'Categoría del producto' },
              disponible: { type: 'boolean', description: 'Disponibilidad del producto' }
            }
          }
        }
      }
      #swagger.responses[404] = {
        description: 'Fabricante no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a listar productos de fabricantes");
  const idFabricante = req.params.id;
  console.log(idFabricante);

  sequelize
    .query(getNombreTablaFabricanteById(idFabricante), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((nombreTablaFabricante) => {
      console.log("nombreTablaFabricante", nombreTablaFabricante);
      return sequelize.query(
        getProductosByFabricante(
          idFabricante,
          nombreTablaFabricante[0].bd_fabricante
        ),
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
    })
    .then((fabricantes) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(fabricantes);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

/*//Obtiene la lista de productos de un fabricante
fabricantesRouter.get("/:id/productos", (req, res) => {
  console.log("Entró a listarproductos de fabricantes");
  const idFabricante = req.params.id;
  const bdFabricante = req.params.bdfabricante;
  console.log(idFabricante, bdFabricante);

  sequelize
    .query(getProductosByFabricante(idFabricante, bdFabricante), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((fabricantes) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(fabricantes);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});*/

//========= Obtiene productos por fabricante (método legacy) =============
/*fabricantesRouter.get("/:id/:bdfabricante", (req, res) => {
  /*  #swagger.tags = ['Fabricantes']
      #swagger.summary = 'Lista productos de fabricante (método legacy)'
      #swagger.description = 'Obtiene productos de un fabricante especificando manualmente la base de datos. Este endpoint está obsoleto, se recomienda usar /:id/productos en su lugar.'
      #swagger.deprecated = true
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del fabricante',
        required: true,
        type: 'string'
      }
      #swagger.parameters['bdfabricante'] = {
        in: 'path',
        description: 'Nombre de la base de datos del fabricante',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Lista de productos obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del producto' },
              codigo: { type: 'string', description: 'Código del producto' },
              descripcion: { type: 'string', description: 'Descripción del producto' },
              precio: { type: 'number', description: 'Precio del producto' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
/*console.log("Entró a productos de fabricantes");
  const idFabricante = req.params.id;
  const bdFabricante = req.params.bdfabricante;
  console.log(idFabricante, bdFabricante);

  sequelize
    .query(getProductosByFabricante(idFabricante, bdFabricante), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((fabricantes) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(fabricantes);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});*/

export { fabricantesRouter };
