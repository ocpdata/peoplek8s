import { Router } from "express";
import sequelize from "../database/database.js";
import {
  getListaOrdenesRecibidasByCotizacion,
  desactivarOrdenesRecibidasByCotizacion,
  getTotalOrdenesRecibidas,
  actualizarOrdenesRecibidasByCotizacion,
  crearOrdenesRecibidasByCotizacion,
} from "../database/queries.js";

const postventaRouter = Router();

//========== Lista las ordenes recibidas de una cotizacion ================
postventaRouter.get(
  "/ordenesrecibidas/cotizacion/:id/:version/",
  //"/cotizaciones/:idCotizacion/:numeroVersion/ordenesrecibidas",
  (req, res) => {
    /*  #swagger.tags = ['Postventa']
        #swagger.summary = 'Lista órdenes recibidas de una cotización'
        #swagger.description = 'Obtiene todas las órdenes recibidas asociadas a una cotización específica y su versión. Utilizado para el seguimiento post-venta de cotizaciones ganadas.'
        #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID de la cotización',
          required: true,
          type: 'string'
        }
        #swagger.parameters['version'] = {
          in: 'path',
          description: 'Número de versión de la cotización',
          required: true,
          type: 'string'
        }
        #swagger.responses[200] = {
          description: 'Lista de órdenes recibidas obtenida exitosamente',
          schema: { 
            type: 'array',
            items: { 
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'ID de la orden recibida' },
                idCotizacion: { type: 'integer', description: 'ID de la cotización' },
                numeroVersion: { type: 'integer', description: 'Versión de la cotización' },
                numeroOrden: { type: 'string', description: 'Número de la orden' },
                fechaOrden: { type: 'string', description: 'Fecha de la orden' },
                monto: { type: 'number', description: 'Monto de la orden' },
                estado: { type: 'string', description: 'Estado de la orden' },
                activo: { type: 'boolean', description: 'Indica si la orden está activa' }
              }
            }
          }
        }
        #swagger.responses[404] = {
          description: 'Cotización no encontrada'
        }
        #swagger.responses[500] = {
          description: 'Error interno del servidor'
        }
    */
    console.log("Obtiene las ordenes recibidas de una cotización");

    const idCotizacion = req.params.id;
    const numeroVersion = req.params.version;
    console.log("idCotizacion", idCotizacion);
    console.log("numeroVersion", numeroVersion);

    sequelize
      .query(
        getListaOrdenesRecibidasByCotizacion(idCotizacion, numeroVersion),
        {
          type: sequelize.QueryTypes.SELECT,
        }
      )
      .then((resultado) => {
        //console.log("cuentas: ", cuentas);
        res.status(200).send(resultado);
      })
      .catch((error) => {
        console.error("Error: ", error);
        res.status(500).send;
      });
  }
);

postventaRouter.post(
  "/ordenesrecibidas/cotizacion/:idCotizacion/:numeroVersion",
  //"/cotizaciones/:idCotizacion/:numeroVersion/ordenesrecibidas/grabar",
  (req, res) => {
    /*  #swagger.tags = ['Postventa']
        #swagger.summary = 'Crea y actualiza órdenes recibidas de cotización'
        #swagger.description = 'Registra las órdenes recibidas de una cotización ganada. Desactiva las órdenes existentes, actualiza las que corresponden y crea nuevas órdenes en una transacción atómica.'
        #swagger.parameters['idCotizacion'] = {
          in: 'path',
          description: 'ID de la cotización',
          required: true,
          type: 'string'
        }
        #swagger.parameters['numeroVersion'] = {
          in: 'path',
          description: 'Número de versión de la cotización',
          required: true,
          type: 'string'
        }
        #swagger.parameters['body'] = {
          in: 'body',
          description: 'Datos de las órdenes recibidas',
          required: true,
          schema: { 
            type: 'object',
            properties: {
              ordenes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    numeroOrden: { type: 'string', description: 'Número de la orden' },
                    fechaOrden: { type: 'string', description: 'Fecha de la orden' },
                    monto: { type: 'number', description: 'Monto de la orden' },
                    estado: { type: 'string', description: 'Estado de la orden' },
                    observaciones: { type: 'string', description: 'Observaciones adicionales' }
                  },
                  required: ['numeroOrden', 'fechaOrden', 'monto']
                }
              }
            },
            required: ['ordenes']
          }
        }
        #swagger.responses[200] = {
          description: 'Órdenes procesadas exitosamente',
          schema: { 
            type: 'array',
            items: { 
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'ID de la orden recibida' },
                idCotizacion: { type: 'integer', description: 'ID de la cotización' },
                numeroVersion: { type: 'integer', description: 'Versión de la cotización' },
                numeroOrden: { type: 'string', description: 'Número de la orden' },
                fechaOrden: { type: 'string', description: 'Fecha de la orden' },
                monto: { type: 'number', description: 'Monto de la orden' }
              }
            }
          }
        }
        #swagger.responses[400] = {
          description: 'Datos de entrada inválidos'
        }
        #swagger.responses[404] = {
          description: 'Cotización no encontrada'
        }
        #swagger.responses[500] = {
          description: 'Error interno del servidor'
        }
    */
    console.log("Graba las ordenes recibidas de una cotizacion ganada");
    const idCotizacion = req.params.idCotizacion;
    const numeroVersion = req.params.numeroVersion;
    console.log("idCotizacion", idCotizacion);
    console.log("numeroVersion", numeroVersion);

    //Desactivar todas las ordenes recibidas de la cotizacion
    //Actualizar las ordenes que ya estaban registradas
    //Crear las nuevas ordenes recibidas
    sequelize
      .query(
        desactivarOrdenesRecibidasByCotizacion(idCotizacion, numeroVersion),
        {
          type: sequelize.QueryTypes.UPDATE,
        }
      )
      .then((result) => {
        return sequelize.query(getTotalOrdenesRecibidas(), {
          type: sequelize.QueryTypes.SELECT,
        });
      })
      .then((totalOrdenes) => {
        let idOrdenRecibidaNueva = totalOrdenes[0].maximo + 1;
        return sequelize.transaction(async (t) => {
          // Actualizar ordenes
          for (const orden of req.body.ordenes) {
            await sequelize.query(
              actualizarOrdenesRecibidasByCotizacion(
                idCotizacion,
                numeroVersion,
                orden
              ),
              {
                type: sequelize.QueryTypes.UPDATE,
                transaction: t,
              }
            );
          }
          // Insertar ordenes
          for (const orden of req.body.ordenes) {
            let [insertResult] = await sequelize.query(
              crearOrdenesRecibidasByCotizacion(
                idCotizacion,
                numeroVersion,
                idOrdenRecibidaNueva,
                orden
              ),
              {
                type: sequelize.QueryTypes.INSERT,
                transaction: t,
              }
            );
            console.log("Reultado insert", insertResult);
            if (insertResult && insertResult.affectedRows > 0) {
              console.log("Fila insertada correctamente");
              idOrdenRecibidaNueva++;
            } else {
              console.log("No se insertó ninguna fila");
            }
          }
        });
      })
      .then(() => {
        return sequelize.query(
          getListaOrdenesRecibidasByCotizacion(idCotizacion, numeroVersion),
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
);

//========== Graba las ordenes recibidas de una cotizacion ============
/*postventaRouter.post(
  "/cotizaciones/:idCotizacion/:numeroVersion/ordenesrecibidas/grabar",
  (req, res) => {
    console.log("Graba las ordenes recibidas de una cotizacion ganada");
    const idCotizacion = req.params.idCotizacion;
    const numeroVersion = req.params.numeroVersion;
    console.log("idCotizacion", idCotizacion);
    console.log("numeroVersion", numeroVersion);

    //Desactivar todas las ordenes recibidas de la cotizacion
    //Actualizar las ordenes que ya estaban registradas
    //Crear las nuevas ordenes recibidas
    sequelize
      .query(
        desactivarOrdenesRecibidasByCotizacion(idCotizacion, numeroVersion),
        {
          type: sequelize.QueryTypes.UPDATE,
        }
      )
      .then((result) => {
        return sequelize.query(getTotalOrdenesRecibidas(), {
          type: sequelize.QueryTypes.SELECT,
        });
      })
      .then((totalOrdenes) => {
        let idOrdenRecibidaNueva = totalOrdenes[0].maximo + 1;
        return sequelize.transaction(async (t) => {
          // Actualizar ordenes
          for (const orden of req.body.ordenes) {
            await sequelize.query(
              actualizarOrdenesRecibidasByCotizacion(
                idCotizacion,
                numeroVersion,
                orden
              ),
              {
                type: sequelize.QueryTypes.UPDATE,
                transaction: t,
              }
            );
          }
          // Insertar ordenes
          for (const orden of req.body.ordenes) {
            let [insertResult] = await sequelize.query(
              crearOrdenesRecibidasByCotizacion(
                idCotizacion,
                numeroVersion,
                idOrdenRecibidaNueva,
                orden
              ),
              {
                type: sequelize.QueryTypes.INSERT,
                transaction: t,
              }
            );
            console.log("Reultado insert", insertResult);
            if (insertResult && insertResult.affectedRows > 0) {
              console.log("Fila insertada correctamente");
              idOrdenRecibidaNueva++;
            } else {
              console.log("No se insertó ninguna fila");
            }
          }
        });
      })
      .then(() => {
        return sequelize.query(
          getListaOrdenesRecibidasByCotizacion(idCotizacion, numeroVersion),
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
);*/

export { postventaRouter };
