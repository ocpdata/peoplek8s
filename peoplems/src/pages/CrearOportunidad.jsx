import { useState, useEffect, useContext, useCallback } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { cloneDeep, uniqBy } from "lodash";
import { DatosBasicos } from "../components/oportunidad/DatosBasicos";
import { CicloVida } from "../components/oportunidad/CicloVida";
import { DatosBottom } from "../components/comun/DatosBottom";
import { MenuBottom } from "../components/comun/MenuBottom";
import { VentanaConfirmacion } from "../components/comun/VentanaConfirmacion";
/*import { DatosBottom } from "../components/oportunidad/DatosBottom";
import { MenuBottom } from "../components/oportunidad/MenuBottom";
import { VentanaConfirmacion } from "../components/oportunidad/VentanaConfirmacion";*/
//import { globalOportunidad } from "../constantes/oportunidad.js";
import { globalOportunidad } from "../config/constantes.js";
import * as constantes from "../config/constantes.js";
//import { PREFIJO_URL_API } from "../config/constantes.js";
import { grabarRegistro } from "../controllers/grabarOportunidad.js";
import * as permisosRegistrados from "../config/permisos.js";
import { AuthContext } from "./Login";
import { ListaCotizaciones } from "../components/oportunidad/ListaCotizaciones";
import { RegistroContexto } from "../components/DashboardLayoutBasic";
import { BackdropPantalla } from "../components/comun/BackdropPantalla";

//Retorna la matriz de respuestas de las preguntas de las etapas del proceso de ventas
//Si no existen respuestas, se inicializan las respuestas con las preguntas bloqueadas
function obtenerRespuestas(respuestas, idEtapaVenta) {
  console.log(respuestas);

  //Todas las respuestas que no existan se bloquean(deshabilitan) y su validacion es false
  if (!respuestas) {
    console.log("No existen las respuestas");
    const datos = [];
    for (let cont = 0; cont < 26; cont++) {
      datos.push({
        id: cont + 1,
        respuesta: "",
        idEtapa:
          cont < 1
            ? 102
            : cont < 8
            ? 103
            : cont < 15
            ? 104
            : cont < 17
            ? 105
            : cont < 21
            ? 106
            : cont < 23
            ? 107
            : 108,
        valido: false,
        deshabilitado: false,
      });
    }
    return datos;
  }

  //Se bloquearan si su estado es ganado, Perdido o Anulado
  //Si no estan en alguno de esos estados, no se bloquearan
  if (!respuestas.aprobacion_respuestas) {
    console.log("No existe la validacion");
    const datos = [];
    datos.push({
      id: 1,
      respuesta: respuestas.interes,
      idEtapa: 102,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 1,
      respuesta: respuestas.requerimiento_tecnico,
      idEtapa: 103,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 2,
      respuesta: respuestas.motivacion,
      idEtapa: 103,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 3,
      respuesta: respuestas.presupuesto,
      idEtapa: 103,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 4,
      respuesta: respuestas.cuando_porque,
      idEtapa: 103,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 5,
      respuesta: respuestas.decision,
      idEtapa: 103,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 6,
      respuesta: respuestas.ventajas,
      idEtapa: 103,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 7,
      respuesta: respuestas.estrategia,
      idEtapa: 103,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 1,
      respuesta: respuestas.informacion_tecnica_adicional,
      idEtapa: 104,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 2,
      respuesta: respuestas.presentacion_tecnica,
      idEtapa: 104,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 3,
      respuesta: respuestas.alcance_propuesto,
      idEtapa: 104,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 4,
      respuesta: respuestas.puntos_tecnicos_importantes,
      idEtapa: 104,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 5,
      respuesta: respuestas.aceptacion_propuesta_tecnica,
      idEtapa: 104,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 6,
      respuesta: respuestas.observacion_propuesta_tecnica,
      idEtapa: 104,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 7,
      respuesta: respuestas.riesgos_propuesta_tecnica,
      idEtapa: 104,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 1,
      respuesta: respuestas.presupuesto_esperado,
      idEtapa: 105,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 2,
      respuesta: respuestas.condiciones_comerciales,
      idEtapa: 105,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 1,
      respuesta: respuestas.porque_demostracion,
      idEtapa: 106,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 2,
      respuesta: respuestas.criterios_exito,
      idEtapa: 106,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 3,
      respuesta: respuestas.siguientes_pasos_demostracion,
      idEtapa: 106,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 4,
      respuesta: respuestas.resultado_demostracion,
      idEtapa: 106,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 1,
      respuesta: respuestas.zona_baja_negociacion,
      idEtapa: 107,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 2,
      respuesta: respuestas.puntos_importantes_clientes_negociacion,
      idEtapa: 107,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 3,
      respuesta: respuestas.puntos_importantes_nosotros_negociacion,
      idEtapa: 107,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 4,
      respuesta: respuestas.acuerdo_cliente,
      idEtapa: 107,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    datos.push({
      id: 1,
      respuesta: respuestas.riesgo_waiting,
      idEtapa: 108,
      valido: false,
      deshabilitado: idEtapaVenta > 108 ? true : false,
    });
    return datos;
  }

  //Se bloquearan si su estado es ganado, perdido o anulado
  //El resto se bloqueará de acuerdo a su validacion
  console.log("Existen respuestas y validacion");
  const matrizTextoValidacion = respuestas.aprobacion_respuestas.split(",");
  const validacion = matrizTextoValidacion.map((valor) => {
    return valor === "false" ? false : true;
  });
  console.log(validacion);
  const datos = [];
  datos.push({
    id: 1,
    respuesta: respuestas.interes,
    idEtapa: 102,
    valido: validacion[0],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 1,
    respuesta: respuestas.requerimiento_tecnico,
    idEtapa: 103,
    valido: validacion[1],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 2,
    respuesta: respuestas.motivacion,
    idEtapa: 103,
    valido: validacion[2],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 3,
    respuesta: respuestas.presupuesto,
    idEtapa: 103,
    valido: validacion[3],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 4,
    respuesta: respuestas.cuando_porque,
    idEtapa: 103,
    valido: validacion[4],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 5,
    respuesta: respuestas.decision,
    idEtapa: 103,
    valido: validacion[5],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 6,
    respuesta: respuestas.ventajas,
    idEtapa: 103,
    valido: validacion[6],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 7,
    respuesta: respuestas.estrategia,
    idEtapa: 103,
    valido: validacion[7],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 1,
    respuesta: respuestas.informacion_tecnica_adicional,
    idEtapa: 104,
    valido: validacion[8],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 2,
    respuesta: respuestas.presentacion_tecnica,
    idEtapa: 104,
    valido: validacion[9],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 3,
    respuesta: respuestas.alcance_propuesto,
    idEtapa: 104,
    valido: validacion[10],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 4,
    respuesta: respuestas.puntos_tecnicos_importantes,
    idEtapa: 104,
    valido: validacion[11],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 5,
    respuesta: respuestas.aceptacion_propuesta_tecnica,
    idEtapa: 104,
    valido: validacion[12],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 6,
    respuesta: respuestas.observacion_propuesta_tecnica,
    idEtapa: 104,
    valido: validacion[13],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 7,
    respuesta: respuestas.riesgos_propuesta_tecnica,
    idEtapa: 104,
    valido: validacion[14],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 1,
    respuesta: respuestas.presupuesto_esperado,
    idEtapa: 105,
    valido: validacion[15],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 2,
    respuesta: respuestas.condiciones_comerciales,
    idEtapa: 105,
    valido: validacion[16],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 1,
    respuesta: respuestas.porque_demostracion,
    idEtapa: 106,
    valido: validacion[17],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 2,
    respuesta: respuestas.criterios_exito,
    idEtapa: 106,
    valido: validacion[18],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 3,
    respuesta: respuestas.siguientes_pasos_demostracion,
    idEtapa: 106,
    valido: validacion[19],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 4,
    respuesta: respuestas.resultado_demostracion,
    idEtapa: 106,
    valido: validacion[20],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 1,
    respuesta: respuestas.zona_baja_negociacion,
    idEtapa: 107,
    valido: validacion[21],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 2,
    respuesta: respuestas.puntos_importantes_clientes_negociacion,
    idEtapa: 107,
    valido: validacion[22],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 3,
    respuesta: respuestas.puntos_importantes_nosotros_negociacion,
    idEtapa: 107,
    valido: validacion[23],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 4,
    respuesta: respuestas.acuerdo_cliente,
    idEtapa: 107,
    valido: validacion[24],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  datos.push({
    id: 1,
    respuesta: respuestas.riesgo_waiting,
    idEtapa: 108,
    valido: validacion[25],
    deshabilitado: idEtapaVenta > 108 ? true : false,
  });
  return datos;
}

export function CrearOportunidad({
  idOportunidadSeleccionada,
  setIdOportunidadSeleccionada,
  //routerLayout,
}) {
  const [idOportunidad, setIdOportunidad] = useState("");
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  const [datosDB, setDatosDB] = useState([]);
  const [openConfirmacion, setOpenConfirmacion] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [statusOportunidad, setStatusOportunidad] = useState(0);
  const [respuestaIA, setRespuestaIA] = useState("");
  const { user } = useContext(AuthContext);

  //==== Estados de los errores al momento de grabar
  const [errorDatoIngresado, setErrorDatoIngresado] = useState({
    nombreOportunidad: false,
    cuentaOportunidad: false,
    contactoOportunidad: false,
  });
  const { setOportunidadDashboardLB } = useContext(RegistroContexto);

  console.log("CrearOportunidad componente", idOportunidadSeleccionada);

  //Retorna el objeto de datos ya sea inicializado o con los datos leidos de la BD
  //Si no se leen datos de la BD, se inicializan los datos
  function inicializarDatos(datosLeidos = {}, idOportunidad = 0) {
    console.log("inicializarDatos", datosLeidos, idOportunidad);
    const datos = {
      idOportunidad: 0,
      nombreOportunidad: "",
      importeOportunidad: 0,
      idCuentaOportunidad: 0,
      //La fecha por defecto de cierre es la fecha actual en el formato DD-MM-YYYY
      fechaCierreOportunidad: dayjs().format("DD-MM-YYYY"),
      idContactoOportunidad: 0,
      idEtapaVentaOportunidad: 102,
      idLineaNegocioOportunidad: 1,
      idEtapaCompraOportunidad: 2,
      idPropietarioOportunidad: user.id,
      copropietarioOportunidad: [],
      //idCampanaOportunidad: 2,
      //idCitaOportunidad: "",
      idPreventaOportunidad: 0, //1,
      idEstadoOportunidad: 0,
      id: null,
      idCreadoPorOportunidad: user.id,
      idModificadoPorOportunidad: user.id,
      fechaCreacionOportunidad: dayjs().format("DD-MM-YYYY"),
      fechaModificacionOportunidad: dayjs().format("DD-MM-YYYY"),
      idProcesoOportunidad: 2, //Proceso de venta de Soluciones

      //Items de apoyo
      stepperEtapaOportunidad: 0,
    };
    if (Object.keys(datosLeidos).length > 0) {
      console.log("existen datos", datosLeidos);
      dayjs.extend(customParseFormat);
      datos.idOportunidad = datosLeidos.id_oportunidad_crm;
      datos.nombreOportunidad = datosLeidos.nombre_oportunidad;
      datos.importeOportunidad = Number(datosLeidos.importe);
      datos.idCuentaOportunidad = datosLeidos.id_cuenta_crm;
      //La fecha de cierre leida desde la BD viene en el formato DD-MM-YYYY y hay que ponerla tambien en el mismo formato de DD-MM-YYYY
      datos.fechaCierreOportunidad = dayjs(
        datosLeidos.fecha_cierre,
        "DD-MM-YYYY"
      ).format("DD-MM-YYYY");
      datos.idContactoOportunidad = datosLeidos.id_contacto_crm;
      datos.idEtapaVentaOportunidad = datosLeidos.id_etapa_oportunidad_crm;
      datos.idLineaNegocioOportunidad = datosLeidos.id_linea_negocio_crm;
      datos.idEtapaCompraOportunidad = datosLeidos.id_etapa_compra;
      datos.idPropietarioOportunidad =
        datosLeidos.id_propietario_oportunidad_crm;
      if (datosLeidos.lista_copropietarios == "") {
        datos.copropietarioOportunidad = [];
      } else {
        datos.copropietarioOportunidad = datosLeidos.lista_copropietarios
          .split(/,(?:\s*,)*/)
          .map(Number);
      }
      datos.idEstadoOportunidad = datosLeidos.status;
      if (datosLeidos.id_preventa_crm < 1) {
        datos.idPreventaOportunidad = "";
      }
      //datos.idPreventaOportunidad = "";
      datos.idPreventaOportunidad = datosLeidos.id_preventa_crm;
      datos.id = null;
      datos.idCreadoPorOportunidad = datosLeidos.id_creado_por_crm;
      datos.idModificadoPorOportunidad = datosLeidos.id_modificado_por_crm;
      datos.fechaCreacionOportunidad = dayjs(
        datosLeidos.hora_creacion,
        "DD-MM-YYYY"
      ).format("DD-MM-YYYY");
      datos.fechaModificacionOportunidad = dayjs(
        datosLeidos.hora_modificacion,
        "DD-MM-YYYY"
      ).format("DD-MM-YYYY");
      datos.idProcesoOportunidad = 2; //Proceso de venta de Soluciones

      //Items de apoyo
      datos.stepperEtapaOportunidad =
        datosLeidos.id_etapa_oportunidad_crm - 102;
    }
    console.log("inicializarDatos", datos);
    return datos;
  }

  //Maneja las alertas de exito o error
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

  //Registrar los datos ingresados en el formulario de DatosBasicos y en el ciclo de vida
  //Se ejecuta cuando se graban los datos de la oportunidad y se actualizan los datos de la oportunidad
  function registrarDatos(input, instancia) {
    console.log("registrarDatos", input, instancia);
    const datos = { ...datosDB };
    switch (instancia) {
      case "nombreOportunidad":
        datos.matrizDatosOportunidad.nombreOportunidad = input;
        break;
      case "importeOportunidad":
        datos.matrizDatosOportunidad.importeOportunidad = input;
        break;
      case "cuentaOportunidad":
        datos.matrizDatosOportunidad.idCuentaOportunidad = input;
        break;
      case "fechaCierreOportunidad":
        datos.matrizDatosOportunidad.fechaCierreOportunidad = input;
        break;
      case "contactoOportunidad":
        datos.matrizDatosOportunidad.idContactoOportunidad = input;
        break;
      case "etapaVentaOportunidad":
        datos.matrizDatosOportunidad.idEtapaVentaOportunidad = input;
        break;
      case "lineaNegocioOportunidad":
        datos.matrizDatosOportunidad.idLineaNegocioOportunidad = input;
        break;
      case "etapaCompraOportunidad":
        datos.matrizDatosOportunidad.idEtapaCompraOportunidad = input;
        break;
      case "propietarioOportunidad":
        datos.matrizDatosOportunidad.idPropietarioOportunidad = input;
        break;
      case "copropietarioOportunidad":
        datos.matrizDatosOportunidad.copropietarioOportunidad = input;
        break;
      case "estadoOportunidad":
        datos.matrizDatosOportunidad.idEstadoOportunidad = input;
        break;
      case "preventaOportunidad":
        datos.matrizDatosOportunidad.idPreventaOportunidad = input;
        break;
      case "preguntasOportunidad":
        datos.matrizPregRespOportunidad.splice(input.id - 1, 1, input);
        break;
      case "accionEstadoOportunidad":
        switch (input) {
          case "anular":
            datos.matrizDatosOportunidad.idEtapaVentaOportunidad = 111;
            break;
          case "perder":
            datos.matrizDatosOportunidad.idEtapaVentaOportunidad = 110;
            break;
          case "retroceder":
            //Si la etapa en la que está posicionado es menor que la etapa actual de la oportunidad, la etapa actual cambia a la posicionada
            //Si el estado de la oportunidad es ganado, perdido o anulado, se cambia a activo
            console.log(
              datos.matrizDatosOportunidad.idEtapaVentaOportunidad - 102,
              datos.matrizDatosOportunidad.stepperEtapaOportunidad
            );
            if (
              datos.matrizDatosOportunidad.stepperEtapaOportunidad <
              datos.matrizDatosOportunidad.idEtapaVentaOportunidad - 102
            ) {
              setOpenConfirmacion({
                open: true,
                titulo: "Confirmación",
                contenido:
                  "Confirme la solicitud de retroceder en el Proceso de Ventas",
                accion: input,
                onAceptar: () => {
                  setOpenConfirmacion({ open: false });
                  //Colocar la etapa de venta en la etapa solicitada
                  datos.matrizDatosOportunidad.idEtapaVentaOportunidad =
                    datos.matrizDatosOportunidad.stepperEtapaOportunidad + 102;

                  //Poner como falso todas las respuestas posteriores a esta etapa
                  datos.matrizPregRespOportunidad.forEach((el) => {
                    if (
                      el.idEtapa >
                      datos.matrizDatosOportunidad.idEtapaVentaOportunidad
                    ) {
                      el.validacion = false;
                    }
                  });
                  console.log(datos);
                  setDatosDB(datos);
                },
                onCancelar: () => {
                  console.log("Se canceló grabar cuenta");
                  setOpenConfirmacion({ open: false });
                },
              });
            }
            break;
          case "saltar":
            setOpenConfirmacion({
              open: true,
              titulo: "Confirmación",
              contenido:
                "Confirme la solicitud de saltar la validación de esta etapa",
              accion: input,
              onAceptar: () => {
                setOpenConfirmacion({ open: false });
                if (
                  datos.matrizDatosOportunidad.idEtapaVentaOportunidad ===
                  globalOportunidad.etapasVenta.idEtapaDemostracion
                ) {
                  //Poner como verdaderas todas las respuestas de esta etapa
                  datos.matrizPregRespOportunidad.forEach((el) => {
                    if (
                      el.idEtapa ===
                      datos.matrizDatosOportunidad.idEtapaVentaOportunidad
                    ) {
                      el.validacion = true;
                    }
                  });

                  //Colocar la etapa de venta en la etapa solicitada
                  datos.matrizDatosOportunidad.idEtapaVentaOportunidad++;
                  console.log(datos);
                  setDatosDB(datos);
                  setOpenConfirmacion({ open: false });
                } else {
                  setOpenConfirmacion({ open: false });
                }
              },
              onCancelar: () => {
                console.log("Se canceló grabar cuenta");
                setOpenConfirmacion({ open: false });
              },
            });
            break;
          case "validar":
            setOpenConfirmacion({
              open: true,
              titulo: "Confirmación",
              contenido: "Confirme la solicitud de validar esta etapa",
              accion: input,
              onAceptar: () => {
                setOpenConfirmacion({ open: false });
                setOpenBackdrop(true);
                validarIA(datos);
              },
              onCancelar: () => {
                console.log("Se canceló grabar cuenta");
                setOpenConfirmacion({ open: false });
              },
            });
            break;

          case "grabar":
            setOpenConfirmacion({
              open: true,
              titulo: "Confirmación",
              contenido: "Desea grabar los cambios en la oportunidad",
              accion: input,
              onAceptar: () => {
                setOpenConfirmacion({ open: false });
                grabarOportunidad();
              },
              onCancelar: () => {
                console.log("Se canceló grabar cuenta");
                setOpenConfirmacion({ open: false });
              },
            });
            break;
        }
        break;
      case "stepperEtapaOportunidad":
        datos.matrizDatosOportunidad.stepperEtapaOportunidad = input;
        break;
    }
    console.log(datos);
    setDatosDB(datos);
  }

  const registrarOportunidad = useCallback(async () => {
    console.log("funcion registrarOportunidad");
    let valido = true;
    let preaccion = ""; //Indica a grabarRegistro() si se creará o actualizará una oportunidad

    const error = {
      nombreOportunidad: false,
      cuentaOportunidad: false,
      contactoOportunidad: false,
    };

    //Obtiene los datos a grabar
    const datos = cloneDeep(datosDB);
    console.log(datos);

    if (datos.matrizDatosOportunidad.nombreOportunidad.length < 3) {
      error.nombreOportunidad = true;
      valido = false;
    }
    if (datos.matrizDatosOportunidad.idCuenta === 0) {
      error.cuentaOportunidad = true;
      valido = false;
    }
    if (datos.matrizDatosOportunidad.idContactoOportunidad === 0) {
      error.contactoOportunidad = true;
      valido = false;
    }
    setErrorDatoIngresado(error);

    if (!valido) {
      console.log("error de parametros de oportunidad");
      handleAlert(300);
    } else {
      //handleAlert(200);
      //Si el usuario no tiene permiso de activar un nuevo contacto, el status del contacto es 2 (Pendiente)
      //Si el usuario tiene permiso de activar un nuevo contacto, el status del contacto es 1 (activo)
      if (
        user?.permisos?.includes(
          permisosRegistrados.PERMISO__VENTAS_CRM_OPORTUNIDADES_CREARSELECCIONAR_ACTIVAR
        )
      ) {
        switch (datos.matrizDatosOportunidad.idEstadoOportunidad) {
          case 0:
            preaccion = "crear";
            break;
          case 1:
          case 2:
            preaccion = "actualizar";
            break;
        }
        datos.matrizDatosOportunidad.idEstadoOportunidad = 1;

        /*console.log("tiene permiso para activar oportunidad");
        datos.matrizDatosOportunidad.idEstadoOportunidad = 1;*/
      } else {
        switch (datos.matrizDatosOportunidad.idEstadoOportunidad) {
          case 0:
            preaccion = "crear";
            datos.matrizDatosOportunidad.idEstadoOportunidad = 2;
            break;
          case 1:
            preaccion = "actualizar";
            datos.matrizDatosOportunidad.idEstadoOportunidad = 1;
            break;
        }

        /*console.log("no tiene permiso para activar oportunidad");
        if (idOportunidad === 0) {
          datos.matrizDatosOportunidad.idEstadoOportunidad = 2;
        }*/
      }
      const resultadoGrabacion = await grabarRegistro(
        datos,
        "oportunidad",
        preaccion
      );
      console.log("resultadoGrabacion", resultadoGrabacion);

      //Si la grabación se realizó correctamente, actualizar el id del registro en el formulario
      if (resultadoGrabacion.resultado) {
        actualizarIdOportunidad(
          resultadoGrabacion.idRegistro,
          resultadoGrabacion.statusRegistro
        );
      }
      return resultadoGrabacion.resultado;
    }
  });

  //Regresa la etapa de la oportunidad
  function confimarAccion(accion) {
    console.log("funcion confimarAccion", accion);
    const datos = { ...datosDB };
    switch (accion) {
      case "cancelar":
        setOpenConfirmacion(false);
        break;

      case "retroceder":
        //Colocar la etapa de venta en la etapa solicitada
        datos.matrizDatosOportunidad.idEtapaVentaOportunidad =
          datos.matrizDatosOportunidad.stepperEtapaOportunidad + 102;

        //Poner como falso todas las respuestas posteriores a esta etapa
        datos.matrizPregRespOportunidad.forEach((el) => {
          if (
            el.idEtapa > datos.matrizDatosOportunidad.idEtapaVentaOportunidad
          ) {
            el.validacion = false;
          }
        });
        console.log(datos);
        setDatosDB(datos);
        setOpenConfirmacion(false);
        break;

      case "saltar":
        if (
          datos.matrizDatosOportunidad.idEtapaVentaOportunidad ===
          globalOportunidad.etapasVenta.idEtapaDemostracion
        ) {
          //Poner como verdaderas todas las respuestas de esta etapa
          datos.matrizPregRespOportunidad.forEach((el) => {
            el.validacion = true;
          });

          //Si se quiere saltar cualquier etapa
          /*datos.matrizPregRespOportunidad.forEach((el) => {
            if (
              el.idEtapa ===
              datos.matrizDatosOportunidad.idEtapaVentaOportunidad
            ) {
              el.validacion = true;
            }
          });*/

          //Colocar la etapa de venta en la etapa solicitada
          datos.matrizDatosOportunidad.idEtapaVentaOportunidad++;
          console.log(datos);
          setDatosDB(datos);
          setOpenConfirmacion(false);
        } else {
          setOpenConfirmacion(false);
        }

        break;

      case "validar":
        //Se validaran solo las respuestas de la etapa que su estado sea false
        //Armar la pregunta con toda la informacion anterior
        //Envia cada respuesta a validar

        setOpenConfirmacion(false);
        setOpenBackdrop(true);
        validarIA(datos);

        break;

      case "grabar":
        setOpenConfirmacion(false);
        grabarOportunidad();
        break;
    }
  }

  //Valida las respuestas de la etapa actual con IA
  async function validarIA(datos) {
    //Ensambla la parte inicial de la pregunta con el contexto de la oportunidad
    const inicioPregunta = `La oportunidad tiene el nombre de ${
      datos.matrizDatosOportunidad.nombreOportunidad
    } y está en la etapa de ${
      datos.matrizNombreEtapasVenta[
        datos.matrizDatosOportunidad.idEtapaVentaOportunidad - 102
      ]
    }.`;

    //Ensambla todas las respuestas validas anteriores con sus preguntas(contexto)
    let respuestasAnteriores = "";
    datos.matrizPregRespOportunidad.map((el) => {
      console.log(el.validacion);
      if (el.validacion) {
        respuestasAnteriores += el.contexto;
        respuestasAnteriores += `${el.respuesta}.`;
      }
    });
    console.log(respuestasAnteriores);

    //Identificar las respuestas que faltan validar de la etapa actual
    const respuestasAValidar = datos.matrizPregRespOportunidad.filter(
      (el) =>
        !el.validacion &
        (el.idEtapa === datos.matrizDatosOportunidad.idEtapaVentaOportunidad)
    );
    console.log(respuestasAValidar);

    //Si no hay respuestas a validar, se valida la etapa
    //Colocar la etapa de venta en la etapa solicitada
    if (respuestasAValidar.length === 0) {
      datos.matrizDatosOportunidad.idEtapaVentaOportunidad++;
      setDatosDB(datos);
      setOpenBackdrop(false);
      return;
    }

    //Enviar las respuestas a la IA para que sean validadas
    for (let indice = 0; indice < respuestasAValidar.length; indice++) {
      console.log(indice);

      //Si la  respuesta está vacia sale del bucle
      if (respuestasAValidar[indice].respuesta === "") {
        setOpenBackdrop(false);
        break;
      }

      let pregunta = `${inicioPregunta}${respuestasAnteriores}${globalOportunidad.ia.separacionPregunta}${respuestasAValidar[indice].contexto}${respuestasAValidar[indice].respuesta}${globalOportunidad.ia.preguntaIA}`;
      const dataAEnviar = {
        mensajeRol: globalOportunidad.ia.mensajeRol,
        tipo_pregunta: globalOportunidad.ia.tipoPregunta,
        indice: globalOportunidad.ia.indice,
        pregunta: pregunta,
        temperatura: globalOportunidad.ia.temperatura,
      };

      console.log("pregunta:", dataAEnviar);
      const res = await fetch(globalOportunidad.ia.urlIa, {
        method: "POST",
        body: JSON.stringify(dataAEnviar),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      });
      const data = await res.json();
      console.log(data);

      //Si la respuesta es un Si, se considera aprobada, se pone en true la validacion y se actualiza la matrizPregRespOportunidad
      //Si la pregunta es la ultima de la etapa, la etapa actual se adiciona
      if (data.respuesta[0] === "S") {
        console.log("Aprobada");
        //Colocar como validada la respuesta
        respuestasAValidar[indice].validacion = true;
        datos.matrizPregRespOportunidad.splice(
          respuestasAValidar[indice].id - 1,
          1,
          respuestasAValidar[indice]
        );
        console.log(datos.matrizPregRespOportunidad);

        if (indice == respuestasAValidar.length - 1) {
          datos.matrizDatosOportunidad.idEtapaVentaOportunidad++;
        }
        setRespuestaIA(data.respuesta);
      } else {
        console.log("Rechazada");
        setRespuestaIA(data.respuesta);
        setOpenBackdrop(false);
        return false;
      }
      //setRespuestaIA(data.respuesta);
    }
    setDatosDB(datos);
    setOpenBackdrop(false);
  }

  //Actualiza el id de la oportunidad despues de haber sido grabada
  function actualizarIdOportunidad(idOportunidad, statusOportunidadDB) {
    console.log(
      "funcion actualizarIdOportunidad",
      idOportunidad,
      statusOportunidadDB
    );
    const datos = { ...datosDB };
    datos.matrizDatosOportunidad.idOportunidad = idOportunidad;
    datos.matrizDatosOportunidad.idEstadoOportunidad = statusOportunidadDB;
    setDatosDB(datos);
    setIdOportunidad(idOportunidad);
    setIdOportunidadSeleccionada(idOportunidad);
    //setStatusOportunidad(statusOportunidadDB);
    setStatusOportunidad(datos.matrizDatosOportunidad.idEstadoOportunidad);
    setOportunidadDashboardLB(idOportunidad);
  }

  //Activa y graba la oportunidad seleccionada

  async function grabarOportunidad() {
    console.log("funcion grabarOportunidad");

    let valido = true;
    const error = {
      nombreOportunidad: false,
      cuentaOportunidad: false,
      contactoOportunidad: false,
    };

    //Obtiene los datos a grabar
    const datos = cloneDeep(datosDB);
    console.log(datos);

    if (datos.matrizDatosOportunidad.nombreOportunidad.length < 3) {
      error.nombreOportunidad = true;
      valido = false;
    }
    if (datos.matrizDatosOportunidad.idCuenta === 0) {
      error.cuentaOportunidad = true;
      valido = false;
    }
    if (datos.matrizDatosOportunidad.idContactoOportunidad === 0) {
      error.contactoOportunidad = true;
      valido = false;
    }
    setErrorDatoIngresado(error);

    if (!valido) {
      console.log("error de parametros de oportunidad");
      handleAlert(300);
    } else {
      handleAlert(200);
      //Si el usuario no tiene permiso de activar un nuevo contacto, el status del contacto es 2 (Pendiente)
      //Si el usuario tiene permiso de activar un nuevo contacto, el status del contacto es 1 (activo)
      if (
        user?.permisos?.includes(
          permisosRegistrados.PERMISO__VENTAS_CRM_OPORTUNIDADES_CREARSELECCIONAR_ACTIVAR
        )
      ) {
        datos.matrizDatosOportunidad.idEstadoOportunidad = 1;
      } else {
        if (idOportunidad === 0) {
          datos.matrizDatosOportunidad.idEstadoOportunidad = 2;
        }
      }
      /*//Si es una nueva oportunidad, el status de la oportunidad es 2 (Pendiente)
      if (idOportunidad === 0) {
        datos.matrizDatosOportunidad.idEstadoOportunidad = 2;
      }*/

      if (
        (await grabarRegistro(
          datos,
          "oportunidad",
          handleAlert,
          actualizarIdOportunidad
        )) === "ok"
      ) {
        //Se grabó correctamente la oportunidad
      }
    }
  }

  //Descarga los datos de la oportunidad seleccionada, las preguntas del pv, las respuestas y los nombres de las etapas de venta
  useEffect(() => {
    console.log("useEffect CrearOportunidad");
    let matrizNombreEtapasVenta = []; //Para el componente stepper
    let matrizPreguntasPorEtapa = [];
    let matrizDatosOportunidad = [];
    let matrizRespuestasOportunidad = [];
    let matrizPregRespOportunidad = [];
    let matrizUsuariosActivos = [];
    let matrizEtapasVenta = [];
    let matrizEtapasCompra = [];
    let matrizLineasNegocio = [];
    let matrizEstadoOportunidad = [];
    let matrizCuentasOportunidad = [];
    let matrizUsuarios = [];
    let matrizCotizacionesOportunidad = [];
    //let matrizUsuariosActivosCuenta = [];
    let matrizTemporal = [];

    const obtenerDatosOportunidad = async () => {
      //Agrupa las peticiones a las APIs para que se ejecuten simultaneamente
      //Nombres de las etapas de venta
      const resNombresEtapasPro = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/etapaventa`,
        constantes.HEADER_COOKIE
      );
      //Preguntas del proceso de venta
      const resPreguntasPVPro = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/preguntaspv`,
        constantes.HEADER_COOKIE
      );
      //Datos basicos de la oportunidad
      let cadOportunidad = `${constantes.PREFIJO_URL_API}/oportunidades/${idOportunidadSeleccionada}`;
      const resDatosBasicosPro = fetch(
        cadOportunidad,
        constantes.HEADER_COOKIE
      );
      //Respuestas de la oportunidad
      let cadRespuestasPVOportunidad = `${constantes.PREFIJO_URL_API}/oportunidades/${idOportunidadSeleccionada}/respuestaspv`;
      //let cadRespuestasPVOportunidad = `${constantes.PREFIJO_URL_API}/oportunidades/respuestaspv/${idOportunidadSeleccionada}`;
      const resRespuestasPVPro = fetch(
        cadRespuestasPVOportunidad,
        constantes.HEADER_COOKIE
      );
      //Usuarios
      const resUsuariosActivos = fetch(
        `${constantes.PREFIJO_URL_API}/usuarios/activos`,
        //`${constantes.PREFIJO_URL_API}/configuracion/usuariosactivos`,
        constantes.HEADER_COOKIE
      );
      //Etapas de compra
      const resEtapasCompraPro = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/etapacompra`,
        constantes.HEADER_COOKIE
      );
      //Linea de negocio
      const resLineasNegocioPro = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/lineanegocio`,
        constantes.HEADER_COOKIE
      );
      //Estado de la oportunidad
      const resEstadoOportunidad = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/estadooportunidad`,
        constantes.HEADER_COOKIE
      );
      //Cuentas
      let cadCuentas = "";
      if (
        user?.permisos?.includes(permisosRegistrados.ALCANCE__TODAS_LAS_CUENTAS)
      ) {
        cadCuentas = `${constantes.PREFIJO_URL_API}/cuentas`;
      } else {
        cadCuentas = `${constantes.PREFIJO_URL_API}/cuentas/usuario/${user.id}`;
        //cadCuentas = `${constantes.PREFIJO_URL_API}/usuarios/${user.id}/cuentas/`;
      }
      const resCuentasOportunidad = fetch(cadCuentas, constantes.HEADER_COOKIE);

      //Usuarios
      const resUsuarios = fetch(
        `${constantes.PREFIJO_URL_API}/usuarios`,
        //`${constantes.PREFIJO_URL_API}/configuracion/usuarios`,
        constantes.HEADER_COOKIE
      );

      const resCotizacionesOportunidad = fetch(
        `${constantes.PREFIJO_URL_API}/cotizaciones/oportunidad/${idOportunidadSeleccionada}`,
        constantes.HEADER_COOKIE
      );

      //Ejecuta las peticiones simultaneas
      const resAll = await Promise.all([
        resNombresEtapasPro,
        resPreguntasPVPro,
        resDatosBasicosPro,
        resRespuestasPVPro,
        resUsuariosActivos,
        resEtapasCompraPro,
        resLineasNegocioPro,
        resEstadoOportunidad,
        resCuentasOportunidad,
        resUsuarios,
        resCotizacionesOportunidad,
      ]);

      //Obtiene el json simultaneo de las 4 peticiones a las APIs,
      const resAllJson = resAll.map((el) => el.json());
      const jsonAll = await Promise.all(resAllJson);

      console.log(jsonAll);

      //Arma la matriz para el Stepper
      jsonAll[0].data.map((etapa) => {
        if (
          (etapa.nombre != "Todas") &
          (etapa.nombre != "Perdido Sol.") &
          (etapa.nombre != "Anulado Sol.") &
          (etapa.nombre != "Ganado Sol.")
        )
          matrizNombreEtapasVenta.push(etapa.nombre);
      });
      console.log(matrizNombreEtapasVenta);

      //Arma la matriz de las preguntas
      matrizPreguntasPorEtapa = jsonAll[1].data.map((el) => el);
      console.log(matrizPreguntasPorEtapa);

      //Arma el objeto de los datos basicos de la oportunidad. Si el id de la oportunidad es 0, significa que es una oportunidad nueva
      //Si el id de la oportunidad es mayor a 0, significa que es una oportunidad existente
      if (idOportunidadSeleccionada > 0) {
        //Si existe una oportunidad seleccionada, se leen los datos de la oportunidad
        //y se inicializan los datos con los datos leidos
        matrizDatosOportunidad = inicializarDatos(
          jsonAll[2].data[0],
          idOportunidadSeleccionada
        );
      } else {
        //Si no existe una oportunidad seleccionada, se inicializan los datos con los datos por defecto
        matrizDatosOportunidad = inicializarDatos();
      }
      console.log(matrizDatosOportunidad);

      //Arma el objeto de las respuestas de la oportunidad
      console.log("jsonleido");
      matrizRespuestasOportunidad = obtenerRespuestas(
        jsonAll[3].data[0],
        matrizDatosOportunidad.idEtapaVentaOportunidad
      );
      console.log("matrizRespuestasOportunidad", matrizRespuestasOportunidad);

      //Arma la matriz de usuarios
      matrizTemporal = jsonAll[4].data.filter(
        (usuario) => usuario.id_role === 3 || usuario.id_role === 24
      );
      console.log(matrizTemporal);
      matrizUsuariosActivos = uniqBy(matrizTemporal, "id");
      console.log(matrizUsuariosActivos);

      //Arma la matriz de etapas de venta
      matrizEtapasVenta = jsonAll[0].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      //Arma la matriz de etapas de compra
      matrizEtapasCompra = jsonAll[5].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      //Arma la matriz de lineas de negocio
      matrizLineasNegocio = jsonAll[6].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      //Arma la matriz de estados de la oportunidad
      matrizEstadoOportunidad = jsonAll[7].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      //Arma la matriz completa de preguntas, respuestas y validaciones
      matrizPregRespOportunidad = matrizPreguntasPorEtapa.map((el, index) => {
        return {
          id: el.id,
          idPregunta: el.id_pregunta,
          idEtapa: el.id_etapa,
          idProceso: el.id_proceso,
          pregunta: el.pregunta,
          contexto: el.contexto,
          respuesta: matrizRespuestasOportunidad[index].respuesta,
          validacion: matrizRespuestasOportunidad[index].valido,
          deshabilitado: matrizRespuestasOportunidad[index].deshabilitado,
        };
      });
      console.log(matrizPregRespOportunidad);

      //Arma la matriz de cuentas
      matrizCuentasOportunidad = jsonAll[8].data.map((el) => ({
        id: el.idCuenta,
        nombre: el.nombreCuenta,
      }));
      console.log(matrizCuentasOportunidad);

      //Arma la matriz de usuarios
      matrizUsuarios = jsonAll[9].data.map((el) => ({
        id: el.id_user,
        nombre: el.name,
      }));
      console.log(matrizUsuarios);

      //Arma la matriz de cotizaciones de la oportunidad
      matrizCotizacionesOportunidad = jsonAll[10].data.map((el) => ({
        idCotizacion: el.idCotizacion,
        numeroVersion: el.numeroVersion,
        importeCotizacion: el.importeCotizacion,
        idEstadoCotizacion: el.idEstadoCotizacion,
      }));
      console.log(matrizCotizacionesOportunidad);

      setIdOportunidad(idOportunidadSeleccionada);

      setDatosDB({
        matrizNombreEtapasVenta,
        matrizUsuariosActivos,
        matrizDatosOportunidad,
        matrizEtapasVenta,
        matrizEtapasCompra,
        matrizLineasNegocio,
        matrizEstadoOportunidad,
        matrizPregRespOportunidad,
        matrizCuentasOportunidad,
        matrizUsuarios,
        matrizCotizacionesOportunidad,
      });
      console.log(datosDB);
      setStatusOportunidad(matrizDatosOportunidad.idEstadoOportunidad);
      setOportunidadDashboardLB(idOportunidadSeleccionada);
      setOpenBackdrop(false);
    };
    setOpenBackdrop(true);
    obtenerDatosOportunidad();
  }, [idOportunidadSeleccionada]);

  return (
    <Box sx={{ width: 1 }}>
      {openAlert === "success" && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          onClose={() => handleAlert(100)}
        >
          La operación fue exitosa.
        </Alert>
      )}
      {openAlert === "error" && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="error"
          onClose={() => handleAlert(100)}
        >
          La operación no se pudo realizar.
        </Alert>
      )}
      {Object.keys(datosDB).length > 0 && (
        <DatosBasicos
          handleAlert={handleAlert}
          idOportunidadSeleccionada={idOportunidad}
          datos={datosDB}
          registrarDatos={registrarDatos}
          error={errorDatoIngresado}
        />
      )}
      {Object.keys(datosDB).length > 0 && (
        <ListaCotizaciones
          listaCotizaciones={datosDB.matrizCotizacionesOportunidad}
          //routerLayout={routerLayout}
        />
      )}
      {idOportunidad > 0 && (
        //{Object.keys(datosDB).length > 0 && (
        <CicloVida
          nombreEtapasVenta={datosDB.matrizNombreEtapasVenta}
          pregRespOportunidad={datosDB.matrizPregRespOportunidad}
          idEtapaVenta={datosDB.matrizDatosOportunidad.idEtapaVentaOportunidad}
          registrarDatos={registrarDatos}
          respuestaIA={respuestaIA}
        ></CicloVida>
      )}
      {/*<DatosBottom datos={datosDB}></DatosBottom>*/}
      {Object.keys(datosDB).length > 0 && (
        <DatosBottom datos={datosDB} tipoRegistro="oportunidad"></DatosBottom>
      )}

      {Object.keys(datosDB).length > 0 && (
        <MenuBottom
          registrarRegistro={registrarOportunidad}
          registrarDatos={registrarDatos}
          idRegistro={idOportunidad}
          statusRegistro={statusOportunidad}
          //statusRegistro={datosDB.matrizDatosOportunidad.idEstadoOportunidad}
          tipoRegistro="oportunidad"
        ></MenuBottom>
      )}
      <VentanaConfirmacion
        openConfirmacion={openConfirmacion.open}
        titulo={openConfirmacion.titulo}
        contenido={openConfirmacion.contenido}
        onAceptar={openConfirmacion.onAceptar}
        onCancelar={openConfirmacion.onCancelar}
        //ejecutarConfirmacion={confimarAccion}
        accion={openConfirmacion.accion}
      ></VentanaConfirmacion>
      <BackdropPantalla open={openBackdrop} texto={"Cargando..."} />
    </Box>
  );
}
