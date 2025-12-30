import { useEffect, useState, useContext } from "react";
import { Box, Grid, Modal } from "@mui/material";
import { AppBarBusqueda } from "./AppBarBusqueda";
import { GridBusqueda } from "./GridBusqueda";
import { AuthContext } from "../../pages/Login";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as permisos from "../../config/permisos.js";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

import * as constantes from "../../config/constantes.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1,
  maxWidth: "lg",
  height: 1,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function createData(
  tipoRegistro,
  param1,
  param2,
  param3,
  param4,
  param5,
  param6,
  param7,
  param8,
  param9
) {
  console.log("createdata", tipoRegistro);
  dayjs.extend(customParseFormat);
  switch (tipoRegistro) {
    case "cuentas":
    case "cuentasPendientesAprobacion":
      return {
        id: param1,
        idCuenta: param2,
        nombreCuenta: param3,
        tipoCuenta: param4,
        sectorCuenta: param5,
        propietarioCuenta: param6,
      };
    case "contactos":
    case "contactosPendientesAprobacion":
      return {
        id: param1,
        idContacto: param2,
        nombresContacto: param3,
        apellidosContacto: param4,
        emailContacto: param5,
        cuentaContacto: param6,
        cargoContacto: param7,
        propietarioContacto: param8,
      };
    case "oportunidades":
    case "oportunidadesPendientesAprobacion":
      return {
        id: param1,
        idOportunidad: param2,
        nombreOportunidad: param3,
        etapaOportunidad: param4,
        cuentaOportunidad: param5,
        anoCierreOportunidad: param6,
        propietarioOportunidad: param7,
      };
    case "registrosFabricantes":
      return {
        id: param1,
        idRegistro: param2,
        cuentaRegistro: param3,
        oportunidadRegistro: param4,
        fabricanteRegistro: param5,
        vendedorRegistro: param6,
        numeroRegistro: param7,
        estadoRegistro: param8,
        vencimientoRegistro: param9,
      };
    case "cotizaciones":
      return {
        id: `${param1}-${param3}`, //param1,
        idCotizacion: param2,
        versionCotizacion: param3,
        cuentaOportunidad: param4,
        nombreOportunidad: param5,
        etapaOportunidad: param6,
        importePropuesta: param7,
        fechaCierreCotizacion: new Date(
          dayjs(param8, "DD-MM-YYYY").format("MM-DD-YYYY")
        ), //Para porder ordenar las fechas
        estadoCotizacion: param9,
      };
  }
}

let filas = [];

export function VentanaBusqueda({
  openVentanaBusqueda,
  setOpenVentanaBusqueda,
  tipoRegistro,
  setOpenVentanaBusquedaConRegistro,
  ano = 0,
}) {
  const [list, setList] = useState([]);
  const { user } = useContext(AuthContext);
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  const [mensajeError, setMensajeError] = useState("");
  console.log("funcion VentanaBusqueda", openVentanaBusqueda, tipoRegistro);

  //========== Obtiene la lista de cuentas ==========
  useEffect(() => {
    console.log("Obteniendo lista de registros", tipoRegistro);
    const controller = new AbortController();

    let cadCuentas = "";
    let cadContactos = "";
    const mensajeError = `Error desconocido`;
    switch (tipoRegistro) {
      case "cuentas":
        if (user?.permisos?.includes(permisos.ALCANCE__TODAS_LAS_CUENTAS)) {
          cadCuentas = `${constantes.PREFIJO_URL_API}/cuentas/`;
        } else {
          cadCuentas = `${constantes.PREFIJO_URL_API}/usuarios/${user.id}/cuentas/`;
        }
        console.log("cadCuentas", cadCuentas, user.id);
        tipoRegistro === "cuentas" &&
          fetch(cadCuentas, {
            ...constantes.HEADER_COOKIE,
            signal: controller.signal,
          })
            .then((resp) => resp.json())
            .then((json) => {
              //console.log(JSON.stringify(json));
              console.log("Respuesta del servidor:", json);
              console.log("Tipo de respuesta:", typeof json.data);
              console.log("Es array:", Array.isArray(json.data));

              if (!json.success) {
                console.log(json.message);
                json.data = [];
                setMensajeError(json.message);
                setOpenAlert("error");
              }
              if (!Array.isArray(json.data)) {
                // Verificar que json sea un array. Si no es una matriz es un error
                console.error("La respuesta no es un array:", json);
                //Como lo que retorna el servidor no es una matriz, crea una matriz vacia para no mostrar nada
                json.data = [];
                setMensajeError(mensajeError);
                setOpenAlert("error");
              }

              filas = [];

              json.data.map((item) =>
                filas.push(
                  createData(
                    tipoRegistro,
                    item.idCuenta,
                    item.idCuenta,
                    item.nombreCuenta,
                    item.tipoCuenta,
                    item.sectorCuenta,
                    item.propietarioCuenta
                  )
                )
              );
              console.log(filas);
              setList(filas);
            })
            .catch((error) => {
              if (error.name === "AbortError") {
                // La petición fue cancelada
                console.log("Fetch cancelado");
              } else {
                // Otro error
                console.error("Error completo:", error);
                console.error("Mensaje del error:", error.message);
              }
              setMensajeError(error.message);
              setOpenAlert("error");
            });
        break;

      case "cuentasPendientesAprobacion":
        const cadCuentasPendientes = `${constantes.PREFIJO_URL_API}/cuentas/pendientesAprobacion`;

        tipoRegistro === "cuentasPendientesAprobacion" &&
          fetch(cadCuentasPendientes, {
            ...constantes.HEADER_COOKIE,
            signal: controller.signal,
          })
            .then((resp) => resp.json())
            .then((json) => {
              //console.log(JSON.stringify(json));
              console.log("Respuesta del servidor:", json);
              console.log("Tipo de respuesta:", typeof json.data);
              console.log("Es array:", Array.isArray(json.data));

              if (!json.success) {
                console.log(json.message);
                json.data = [];
                setMensajeError(json.message);
                setOpenAlert("error");
              }
              // Verificar que json sea un array. Si no es una matriz es un error
              if (!Array.isArray(json.data)) {
                console.error("La respuesta no es un array:", json.data);

                //Como lo que retorna el servidor no es una matriz, crea una matriz vacia para no mostrar nada
                json = [];
                setMensajeError(mensajeError);
                setOpenAlert("error");
              }

              filas = [];

              json.data.map((item) =>
                filas.push(
                  createData(
                    tipoRegistro,
                    item.idCuenta,
                    item.idCuenta,
                    item.nombreCuenta,
                    item.tipoCuenta,
                    item.sectorCuenta,
                    item.propietarioCuenta
                  )
                )
              );
              console.log(filas);
              setList(filas);
            })
            .catch((error) => {
              if (error.name === "AbortError") {
                // La petición fue cancelada
                console.log("Fetch cancelado");
              } else {
                // Otro error
                console.error("Error completo:", error);
                console.error("Mensaje del error:", error.message);
              }
              setMensajeError(error.message);
              setOpenAlert("error");
            });
        break;

      case "contactos":
        if (user?.permisos?.includes(permisos.ALCANCE__TODOS_LOS_CONTACTOS)) {
          cadContactos = `${constantes.PREFIJO_URL_API}/contactos/`;
        } else {
          cadContactos = `${constantes.PREFIJO_URL_API}/contactos/usuario/${user.id}`;
        }

        tipoRegistro === "contactos" &&
          fetch(cadContactos, {
            ...constantes.HEADER_COOKIE,
            signal: controller.signal,
          })
            .then((resp) => resp.json())
            .then((json) => {
              //console.log(JSON.stringify(json));
              console.log("Respuesta del servidor:", json);
              console.log("Tipo de respuesta:", typeof json.data);
              console.log("Es array:", Array.isArray(json.data));

              //json.success = false;
              if (!json.success) {
                console.log(json.message);
                json.data = [];
                setMensajeError(json.message);
                setOpenAlert("error");
              }
              // Verificar que json sea un array. Si no es una matriz es un error
              if (!Array.isArray(json.data)) {
                console.error("La respuesta no es un array:", json.data);

                //Como lo que retorna el servidor no es una matriz, crea una matriz vacia para no mostrar nada
                json.data = [];
                setMensajeError(mensajeError);
                setOpenAlert("error");
              }

              filas = [];

              json.data.map((item) =>
                filas.push(
                  createData(
                    tipoRegistro,
                    item.idContacto,
                    item.idContacto,
                    item.nombresContacto,
                    item.apellidosContacto,
                    item.emailContacto,
                    item.cuentaContacto,
                    item.cargoContacto,
                    item.propietarioContacto
                  )
                )
              );
              console.log(filas);
              setList(filas);
            })
            .catch((error) => {
              if (error.name === "AbortError") {
                // La petición fue cancelada
                console.log("Fetch cancelado");
              } else {
                // Otro error
                console.error("Error completo:", error);
                console.error("Mensaje del error:", error.message);
              }
              setMensajeError(error.message);
              setOpenAlert("error");
            });
        break;

      case "contactosPendientesAprobacion":
        const cadContactosPendientes = `${constantes.PREFIJO_URL_API}/contactos/pendientesAprobacion`;

        tipoRegistro === "contactosPendientesAprobacion" &&
          fetch(cadContactosPendientes, {
            ...constantes.HEADER_COOKIE,
            signal: controller.signal,
          })
            .then((resp) => resp.json())
            .then((json) => {
              console.log("Respuesta del servidor:", json);
              console.log("Tipo de respuesta:", typeof json.data);
              console.log("Es array:", Array.isArray(json.data));

              if (!json.success) {
                console.log(json.message);
                json.data = [];
                setMensajeError(json.message);
                setOpenAlert("error");
              }
              // Verificar que json sea un array. Si no es una matriz es un error
              if (!Array.isArray(json.data)) {
                console.error("La respuesta no es un array:", json);

                //Como lo que retorna el servidor no es una matriz, crea una matriz vacia para no mostrar nada
                json.data = [];
                setMensajeError(mensajeError);
                setOpenAlert("error");
              }

              filas = [];

              json.data.map((item) =>
                filas.push(
                  createData(
                    tipoRegistro,
                    item.idContacto,
                    item.idContacto,
                    item.nombresContacto,
                    item.apellidosContacto,
                    item.emailContacto,
                    item.cuentaContacto,
                    item.cargoContacto,
                    item.propietarioContacto
                  )
                )
              );
              console.log(filas);
              setList(filas);
            })
            .catch((error) => {
              if (error.name === "AbortError") {
                // La petición fue cancelada
                console.log("Fetch cancelado");
              } else {
                // Otro error
                console.error("Error completo:", error);
                console.error("Mensaje del error:", error.message);
              }
              setMensajeError(error.message);
              setOpenAlert("error");
            });
        break;

      case "oportunidades":
        let cadOportunidades = "";
        if (
          user?.permisos?.includes(permisos.ALCANCE__TODAS_LAS_OPORTUNIDADES)
        ) {
          cadOportunidades = `${constantes.PREFIJO_URL_API}/oportunidades/ano/${ano}`;
        } else {
          cadOportunidades = `${constantes.PREFIJO_URL_API}/oportunidades/ano/usuario/${ano}/${user.id}`;
        }

        tipoRegistro === "oportunidades" &&
          fetch(cadOportunidades, {
            ...constantes.HEADER_COOKIE,
            signal: controller.signal,
          })
            .then((resp) => resp.json())
            .then((json) => {
              console.log("Respuesta del servidor:", json);
              console.log("Tipo de respuesta:", typeof json.data);
              console.log("Es array:", Array.isArray(json.data));

              if (!json.success) {
                console.log(json.message);
                json.data = [];
                setMensajeError(json.message);
                setOpenAlert("error");
              }
              // Verificar que json sea un array. Si no es una matriz es un error
              if (!Array.isArray(json.data)) {
                console.error("La respuesta no es un array:", json.data);

                //Como lo que retorna el servidor no es una matriz, crea una matriz vacia para no mostrar nada
                json.data = [];
                setMensajeError(mensajeError);
                setOpenAlert("error");
              }

              filas = [];

              json.data.map((item) =>
                filas.push(
                  createData(
                    tipoRegistro,
                    item.idOportunidad,
                    item.idOportunidad,
                    item.nombreOportunidad,
                    item.etapaOportunidad,
                    item.cuentaOportunidad,
                    item.anoCierreOportunidad,
                    item.propietarioOportunidad
                  )
                )
              );
              console.log(filas);
              setList(filas);
            })
            .catch((error) => {
              if (error.name === "AbortError") {
                // La petición fue cancelada
                console.log("Fetch cancelado");
              } else {
                // Otro error
                console.error("Error completo:", error);
                console.error("Mensaje del error:", error.message);
              }
              setMensajeError(error.message);
              setOpenAlert("error");
            });
        break;

      case "oportunidadesPendientesAprobacion":
        const cadOportunidadesPendientes = `${constantes.PREFIJO_URL_API}/oportunidades/pendientesAprobacion`;

        tipoRegistro === "oportunidadesPendientesAprobacion" &&
          fetch(cadOportunidadesPendientes, {
            ...constantes.HEADER_COOKIE,
            signal: controller.signal,
          })
            .then((resp) => resp.json())
            .then((json) => {
              console.log("Respuesta del servidor:", json);
              console.log("Tipo de respuesta:", typeof json.data);
              console.log("Es array:", Array.isArray(json.data));

              if (!json.success) {
                console.log(json.message);
                json.data = [];
                setMensajeError(json.message);
                setOpenAlert("error");
              }
              // Verificar que json sea un array. Si no es una matriz es un error
              if (!Array.isArray(json.data)) {
                console.error("La respuesta no es un array:", json.data);

                //Como lo que retorna el servidor no es una matriz, crea una matriz vacia para no mostrar nada
                json.data = [];
                setMensajeError(mensajeError);
                setOpenAlert("error");
              }
              filas = [];

              json.data.map((item) =>
                filas.push(
                  createData(
                    tipoRegistro,
                    item.idOportunidad,
                    item.idOportunidad,
                    item.nombreOportunidad,
                    item.etapaOportunidad,
                    item.cuentaOportunidad,
                    item.anoCierreOportunidad,
                    item.propietarioOportunidad
                  )
                )
              );
              console.log(filas);
              setList(filas);
            })
            .catch((error) => {
              if (error.name === "AbortError") {
                // La petición fue cancelada
                console.log("Fetch cancelado");
              } else {
                // Otro error
                console.error("Error completo:", error);
                console.error("Mensaje del error:", error.message);
              }
              setMensajeError(error.message);
              setOpenAlert("error");
            });
        break;

      case "registrosFabricantes":
        tipoRegistro === "registrosFabricantes" &&
          fetch(`${constantes.PREFIJO_URL_API}/registrosFabricantes`, {
            ...constantes.HEADER_COOKIE,
            signal: controller.signal,
          })
            .then((resp) => resp.json())
            .then((json) => {
              console.log("Respuesta del servidor:", json);
              console.log("Tipo de respuesta:", typeof json.data);
              console.log("Es array:", Array.isArray(json.data));

              if (!json.success) {
                console.log(json.message);
                json.data = [];
                setMensajeError(json.message);
                setOpenAlert("error");
              }
              // Verificar que json sea un array. Si no es una matriz es un error
              if (!Array.isArray(json.data)) {
                console.error("La respuesta no es un array:", json.data);

                //Como lo que retorna el servidor no es una matriz, crea una matriz vacia para no mostrar nada
                json.data = [];
                setMensajeError(mensajeError);
                setOpenAlert("error");
              }
              filas = [];

              json.data.map((item) =>
                filas.push(
                  createData(
                    tipoRegistro,
                    item.idRegistro,
                    item.idRegistro,
                    item.cuentaRegistro,
                    item.oportunidadRegistro,
                    item.fabricanteRegistro,
                    item.vendedorRegistro,
                    item.numeroRegistro,
                    item.estadoRegistro,
                    item.vencimientoRegistro
                  )
                )
              );
              console.log(filas);
              setList(filas);
            })
            .catch((error) => {
              if (error.name === "AbortError") {
                // La petición fue cancelada
                console.log("Fetch cancelado");
              } else {
                // Otro error
                console.error("Error completo:", error);
                console.error("Mensaje del error:", error.message);
              }
              setMensajeError(error.message);
              setOpenAlert("error");
            });
        break;

      case "cotizaciones":
        //Lista las cotizaciones en base a un usuario que es el propietario. El vendedor seleccionado solo sirve para mostrarlo en la propuesta impresa
        let cadCotizaciones = "";
        if (user?.permisos?.includes(permisos.ALCANCE__TODAS_LAS_PROPUESTAS)) {
          cadCotizaciones = `${constantes.PREFIJO_URL_API}/cotizaciones/ano/${ano}`;
        } else {
          cadCotizaciones = `${constantes.PREFIJO_URL_API}/cotizaciones/ano/usuario/${ano}/${user.id}`;
        }
        console.log(cadCotizaciones);

        fetch(cadCotizaciones, {
          ...constantes.HEADER_COOKIE,
          signal: controller.signal,
        })
          .then((resp) => resp.json())
          .then((json) => {
            console.log(JSON.stringify(json));
            console.log("Respuesta del servidor:", json);
            console.log("Tipo de respuesta:", typeof json.data);
            console.log("Es array:", Array.isArray(json.data));

            if (!json.success) {
              console.log(json.message);
              json.data = [];
              setMensajeError(json.message);
              setOpenAlert("error");
            }
            // Verificar que json sea un array. Si no es una matriz es un error
            if (!Array.isArray(json.data)) {
              console.error("La respuesta no es un array:", json.data);

              //Como lo que retorna el servidor no es una matriz, crea una matriz vacia para no mostrar nada
              json.data = [];
              setMensajeError(mensajeError);
              setOpenAlert("error");
            }
            filas = [];

            json.data.map((item) =>
              filas.push(
                createData(
                  tipoRegistro,
                  item.idCotizacion,
                  item.idCotizacion,
                  item.versionCotizacion,
                  item.cuentaOportunidad,
                  item.nombreOportunidad,
                  item.etapaVentaOportunidad,
                  item.importe,
                  item.fechaCierreCotizacion,
                  item.estadoCotizacion
                )
              )
            );
            console.log(filas);
            setList(filas);
          })
          .catch((error) => {
            if (error.name === "AbortError") {
              // La petición fue cancelada
              console.log("Fetch cancelado");
            } else {
              // Otro error
              console.error("Error completo:", error);
              console.error("Mensaje del error:", error.message);
            }
            setMensajeError(error.message);
            setOpenAlert("error");
          });
        break;
    }

    // Cleanup: cancelar el fetch si el componente se desmonta o cambia tipoRegistro
    return () => {
      console.log("Cleanup");
      controller.abort();
    };
  }, [tipoRegistro]);

  function handleAlert(resultado) {
    console.log("funcion handleAlert", resultado);
    switch (resultado) {
      case 100:
        setOpenAlert("sinAlerta");
        break;
      case 200:
        setOpenAlert("success");
        break;
      default:
        setOpenAlert("error");
        break;
    }
  }

  return (
    <Modal open={openVentanaBusqueda}>
      <Box sx={style}>
        <AppBarBusqueda
          setOpenVentanaBusqueda={setOpenVentanaBusqueda}
          tipoRegistro={tipoRegistro}
        />
        {openAlert === "error" && (
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="error"
            onClose={() => handleAlert(100)}
          >
            {mensajeError}
          </Alert>
        )}
        <GridBusqueda
          list={list}
          tipoRegistro={tipoRegistro}
          setOpenVentanaBusquedaConRegistro={setOpenVentanaBusquedaConRegistro}
        />
      </Box>
    </Modal>
  );
}
