import { Router } from "express";
import sequelize from "../database/database.js";
import { queryRegistrosFabricantes } from "../database/queries.js";

const registrosFabricantesRouter = Router();

//========== REGISTROS DE FABRICANTES ================
registrosFabricantesRouter.get("/", (req, res) => {
  /*  #swagger.tags = ['Registros de Fabricantes']
      #swagger.summary = 'Lista todos los registros de fabricantes'
      #swagger.description = 'Obtiene una lista completa de todos los registros de fabricantes en el sistema. Incluye información de auditoría y seguimiento de las operaciones realizadas con los fabricantes.'
      #swagger.responses[200] = {
        description: 'Lista de registros de fabricantes obtenida exitosamente',
        schema: { 
          type: 'array',
          items: { 
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'ID del registro' },
              idFabricante: { type: 'integer', description: 'ID del fabricante' },
              nombreFabricante: { type: 'string', description: 'Nombre del fabricante' },
              accion: { type: 'string', description: 'Acción realizada' },
              fecha: { type: 'string', description: 'Fecha del registro' },
              usuario: { type: 'string', description: 'Usuario que realizó la acción' },
              detalles: { type: 'string', description: 'Detalles adicionales del registro' },
              estado: { type: 'string', description: 'Estado del registro' }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
  */
  console.log("Entró a registros de fabricantes");

  sequelize
    .query(queryRegistrosFabricantes, {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((registros) => {
      //console.log("cuentas: ", cuentas);
      res.status(200).send(registros);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send;
    });
});

export { registrosFabricantesRouter };
