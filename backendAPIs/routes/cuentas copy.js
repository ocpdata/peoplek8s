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

//Obtiene la lista de todas las cuentas
cuentasRouter.get("/", (req, res) => {
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

/*//Obtiene la lista de cuentas de un usuario
cuentasRouter.get("/usuarios/:userId/cuentas", (req, res) => {
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

cuentasRouter.get("/pendientesAprobacion", (req, res) => {
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

//Obtiene los datos de una cuenta
cuentasRouter.get("/:cuentaId", (req, res) => {
  console.log("Obtiene los datos de una cuenta");

  const idCuenta = req.params.cuentaId;
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

cuentasRouter.post("/grabar", (req, res) => {
  console.log("Entró a grabar una cuenta");
  console.log(req.body);

  let idCuentaNueva = 0;
  let datosAGrabar = {};
  //Si el id de la cuenta es mayor a cero se debe hacer un update, sino un insert
  const idCuenta = req.body.idCuenta;

  if (idCuenta > 0) {
    //========= UPDATE ======================
    datosAGrabar = prepararDatosParaGrabar(req.body, idCuenta);
    sequelize
      .query(ensamblarQueryActualizarCuenta(datosAGrabar), {
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
  } else {
    //========= INSERT =================
    sequelize
      .query(queryGetCantidadCuentas, {
        type: sequelize.QueryTypes.SELECT,
      })
      //Obtiene el total de las cuentas en la BD
      .then((totalCuentas) => {
        console.log("total cuentas", totalCuentas[0].maximo);
        idCuentaNueva = totalCuentas[0].maximo + 1;
        datosAGrabar = prepararDatosParaGrabar(req.body, idCuentaNueva);
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
  }
});

export { cuentasRouter };
