import { Router } from "express";
import sequelize from "../database/database.js";
//Usuarios
import { getListaCuentasPorUsuario } from "../database/queries.js";
//Cuentas
import {
  ensamblarQueryGetCuenta,
  getListaCuentasPendientesAprobacion,
  queryGetCantidadCuentas,
  ensamblarQueryGrabarCuenta,
  ensamblarQueryGetIdCuentaConIdCuenta,
  ensamblarQueryActualizarCuenta,
  obtenerCuentaPorNombre,
  ensamblarQueryContactosPorCuenta,
  queryGetOportunidadesConCuenta,
  ensamblarQueryGetOportunidad,
  queryGetValidacionPVOportunidad,
  queryGetRespuestasPVOportunidad,
} from "../database/queries.js";

const apisRouter = Router();

//Estandariza los datos para que se cree adecuadamente la cuenta en la base de datos
function prepararDatosCuentaParaGrabar(enviado, numCuentas) {
  console.log("funcion prepararDatosCuentaParaGrabar", enviado, numCuentas);

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

//================  USUARIOS =========================

//Obtiene la lista de cuentas de un usuario
apisRouter.get("/usuarios/:id/cuentas", (req, res) => {
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

//===================== CUENTAS ======================

// Obtiene los datos de una cuenta por nombre
apisRouter.get("/cuentas/nombre/:nombreCuenta", (req, res) => {
  const nombreCuenta = req.params.nombreCuenta;
  console.log("Busca cuenta por nombre:", nombreCuenta);

  sequelize
    .query(obtenerCuentaPorNombre(nombreCuenta), {
      type: sequelize.QueryTypes.SELECT,
    })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).send(result[0]);
      } else {
        res.status(404).send({ error: "Cuenta no encontrada" });
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500).send(error);
    });
});

//Obtiene las cuentas pendientes de activación
apisRouter.get("/cuentas/pendientes-activacion", (req, res) => {
  console.log("Obtiene las cuentas pendientes de activación");

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

//Obtiene los datos de una cuenta por id
apisRouter.get("/cuentas/:id", (req, res) => {
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

//Crea una cuenta
apisRouter.post("/", (req, res) => {
  console.log("Crea una cuenta");

  let idCuentaNueva = 0;
  let datosAGrabar = {};

  sequelize
    .query(queryGetCantidadCuentas, {
      type: sequelize.QueryTypes.SELECT,
    })
    //Obtiene el total de las cuentas en la BD
    .then((totalCuentas) => {
      console.log("total cuentas", totalCuentas[0].maximo);
      idCuentaNueva = totalCuentas[0].maximo + 1;
      datosAGrabar = prepararDatosCuentaParaGrabar(req.body, idCuentaNueva);
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

//Actualiza una cuenta
apisRouter.put("/:id", (req, res) => {
  console.log("Actualiza una cuenta");

  let datosAGrabar = {};
  const idCuenta = req.body.id;

  datosAGrabar = prepararDatosCuentaParaGrabar(req.body, idCuenta);
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
});

//================= CONTACTOS =====================

//============ Obtiene los contactos de una cuenta por el id de la cuenta =======
apisRouter.get("/cuentas/:cuentaId/contactos", (req, res) => {
  console.log("Obtiene los contactos de una cuenta");

  const idCuenta = req.params.cuentaId;
  console.log("idCuenta para obtener los contactos de una cuenta", idCuenta);

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

//================= OPORTUNIDADES =====================

//============ Obtiene las oportunidades de una cuenta por el id de la cuenta =======
apisRouter.get("/cuentas/:cuentaId/oportunidades", (req, res) => {
  console.log("Obtiene las oportunidades de una cuenta");

  const idCuenta = req.params.cuentaId;
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

//========== Obtener los datos de una oportunidad ========
apisRouter.get("/oportunidades/:id", (req, res) => {
  console.log("obtiene los datos de una oportunidad");

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
apisRouter.get("/oportunidades/respuestaspv/:id", (req, res) => {
  console.log("Obtiene las respuestas del PV de una oportunidad");

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

//========== Descargar las respuestas y preguntas del PV de una oportunidad ================
apisRouter.get("/oportunidades/respuestaspreguntaspv/:id", (req, res) => {
  console.log("Obtiene las preguntas y respuestas del PV de una oportunidad");

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
});

/*//======================= IA Flowise =======================
apisRouter.post("/flowise", async (req, res) => {
  console.log("redirige a Flowise", req.body.message);
  try {
    const response = await fetch(
      "http://peoplenode.digitalvs.com:4000/api/v1/prediction/06f2bea1-4bce-4103-ae36-35c8df304724", //AccesQ chatbot con filtro
      //"https://flowise-jf1k.onrender.com/api/v1/prediction/0cd3fda8-52ff-43ba-b588-0feea9005e94", //AccesQ chatbot con filtro
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: req.body.message }),
        //body: JSON.stringify(req.body.mensaje),
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log("Error en IA");
    res.status(500).json({ error: "Error en proxy IA" });
  }
});*/

export { apisRouter };
