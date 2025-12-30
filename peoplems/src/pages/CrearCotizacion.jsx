import {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { cloneDeep } from "lodash";

import { AuthContext } from "./Login";

import DatosBasicos from "../components/cotizacion/datosBasicos/DatosBasicos";
import DatosCotizacion from "../components/cotizacion/DatosCotizacion";
import Cotizacion from "../components/cotizacion/cotizacion/Cotizacion";
import { DatosComplementarios } from "../components/cotizacion/datosComplementarios/DatosComplementarios";
import FlujoAprobacion from "../components/cotizacion/FlujoAprobacion";
import { FileCotizacion } from "../components/cotizacion/FileCotizacion";
import { VentanaTabla } from "../components/cotizacion/ordenesGanadas/VentanaTabla";

import { DatosBottom } from "../components/comun/DatosBottom";
import { BackdropPantalla } from "../components/comun/BackdropPantalla";
import { RegistroContexto } from "../components/DashboardLayoutBasic";

import { grabarCotizacion } from "../controllers/grabarCotizacion.js";
import { grabarRegistro } from "../controllers/grabarOportunidad.js";

import * as constantes from "../config/constantes.js";
import * as permisos from "../config/permisos.js";

import { calcularTotalesCotizacion } from "../funciones/calcularTotalesCotizacion.js";
import { sincronizarFilas } from "../funciones/sincronizarFilas.js";
//import { VentanaTabla } from "../components/cotizacion/VentanaTabla";

const CrearCotizacion = memo(function CrearCotizacion({
  idCotizacionVersionSeleccionada,
  setIdCotizacionVersionSeleccionada, //WARNING Esta no se usa aqui ni se pasa a un componente
}) {
  const [idCotizacion, setIdCotizacion] = useState("");

  //Separacion de datos
  const [datosBasicos, setDatosBasicos] = useState({}); //datosDB.current.datosCotizacion.propuestaVersion
  const [datosCotizacion, setDatosCotizacion] = useState({}); //datosDB.current.datosCotizacion.propuestaVersion
  const [introduccionCotizacion, setIntroduccionCotizacion] = useState(""); //datosDB.current.datosCotizacion.propuestaVersion.introduccionCotizacion
  const [seccionesCotizacion, setSeccionesCotizacion] = useState([]); //datosDB.current.datosCotizacion.secciones
  const [datosComplementarios, setDatosComplementarios] = useState({}); //datosDB.current.datosCotizacion.propuestaVersion
  const [datosCondicionesComerciales, setDatosCondicionesComerciales] =
    useState({});
  const [totalesCotizacion, setTotalesCotizacion] = useState({});
  const [datosFlujo, setDatosFlujo] = useState({});
  const [datosBottom, setDatosBottom] = useState({});
  const [datosOpciones, setDatosOpciones] = useState({}); //matrizCuentasCotizacion,matrizEtapasVenta,matrizContactosCuenta,matrizEstadosCotizacion,matrizUsuarios,
  const [filasCopiadas, setFilasCopiadas] = useState([]);
  const [openVentanaOrdenesRecibidas, setOpenVentanaOrdenesRecibidas] =
    useState(false); //Muestra la vetana de las ordenes recibidas por la cotizacion
  const [ordenesRecibidas, setOrdenesRecibidas] = useState([]);

  //datosDB es el objeto que almacena: datosCotizacion, matrizCuentasCotizacion, matrizEtapasVenta, matrizContactosCuenta, matrizEstadosCotizacion, matrizUsuarios,
  //datosCotizacion es el objeto que almacena los datos de la cotizacion
  //propuestaVersion es la propiedad que almacena los datos de propuesta y version de la cotizacion
  //secciones es un array que almacena todas las secciones; dentro de cada elemento del array se almacenan los datos de cada seccion y el array de items de la seccion
  //items es un array que almacena los items de una seccion
  const datosDB = useRef({});

  const { user } = useContext(AuthContext);
  const { setCotizacionVersionDashboardLB } = useContext(RegistroContexto);
  console.log("usuario", user);

  //==== Estados de los errores al momento de grabar
  const [errorDatoIngresado, setErrorDatoIngresado] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openAlert, setOpenAlert] = useState("sinAlerta");

  console.log("funcion CrearCotizacion", idCotizacionVersionSeleccionada);

  //Inicializa los datos de la cotizacion, sean estos leidos desde la base de datos o creados como nueva cotizacion
  function inicializarDatos(datosLeidos = {}) {
    console.log("inicializarDatos", datosLeidos);
    dayjs.extend(customParseFormat);
    const datos = {
      //Datos de propuesta
      id: null,
      idCotizacion: 0,
      idOportunidadCotizacion: 0,
      idPropietarioCotizacion: user.id,
      idStatusCotizacion: 1,
      totalVersionesCotizacion: 0,
      idPais: 2,
      numeroDocumentos: 0,
      idPvOportunidad: 2,
      requiereOperaciones: 0,
      requiereSoporte: 0,
      horasImplementacion: 0,
      diasImplementacion: 0,
      totalMesesSoporte: 0,
      notasCorrectivas: "",

      //Datos de version
      versionCotizacion: 0,
      fechaCotizacion: dayjs().format("DD-MM-YYYY"),
      idContactoCotizacion: 0,
      idEstadoCotizacion: 1,
      idVendedorCotizacion: user.id,
      introduccionCotizacion: "",
      descuentoFinalPorcentaje: 0,
      distribucionDescuentoFinal: 0,
      precioTotal: 0,
      IVAPorcentaje: 16,
      //distribucionIVA: "Sin IVA",
      distribucionIVA: constantes.DISTRIBUCION_SIN_IVA,
      tiempoEntrega: 5,
      validez: 1,
      garantia: 1,
      formaPago: 1,
      moneda: 1,
      tipoCambio: 1,
      notasCotizacion: constantes.cadenaNotasComerciales,
      notasInternas: "",
      idCreadoPorCotizacion: user.id, //No está en la base de datos
      idModificadoPorCotizacion: user.id, //No está en la base de datos
      fechaCreacionCotizacion: dayjs().format("DD-MM-YYYY"),
      fechaModificacionCotizacion: dayjs().format("DD-MM-YYYY"),
      nombreCotizacion: "",
      totalSecciones: 0,
      telefonoVendedor: "",
      emailVendedor: "",
      idPreventa: 0,
      emailPreventa: "",
      nombreContactoImpresion: "",
      idContactoImpresion: 0,
      telefonoContactoImpresion: "",
      emailContactoImpresion: "",
      idMonedaBase: 1,
      IVA: 0,
      otroImpuesto: 0,
      valorOtroImpuesto: 0,
      otroImpuestoDisplay: "Ninguno",
      fechaAceptada: "",
      costoTotal: 0,
      financiamientoResumen: 0,
      financiamientoTEA: 0,
      financiamientoPeriodoPago: 0,
      financiamientoNumeroPeriodos: 0,
      financiamientoValorInicial: 0,
      financiado: 0,
      statusVersion: 1,

      descuentoFinalAbsoluto: 0, //No está en la base de datos
      totalDescontado: 0, //No está en la base de datos

      //Datos de oportunidad - No se graban
      idCuentaOportunidad: 0,
      nombreOportunidad: "",
      fechaCierreOportunidad: dayjs().format("DD-MM-YYYY"),
      idEtapaVentaOportunidad: 0,
      idContactoOportunidad: 0,
      importeOportunidad: 0,
    };
    if (Object.keys(datosLeidos).length > 0) {
      //Datos de propuesta
      datos.id = datosLeidos.id;
      datos.idCotizacion = datosLeidos.idCotizacion;
      datos.idOportunidadCotizacion = datosLeidos.idOportunidadCotizacion;
      datos.idPropietarioCotizacion = datosLeidos.idPropietarioCotizacion;
      datos.idStatusCotizacion = datosLeidos.idStatusCotizacion;
      datos.totalVersionesCotizacion = datosLeidos.totalVersionesCotizacion;
      datos.idPais = datosLeidos.idPais;
      datos.numeroDocumentos = datosLeidos.numeroDocumentos;
      datos.idPvOportunidad = datosLeidos.idPvOportunidad;
      datos.requiereOperaciones = datosLeidos.requiereOperaciones;
      datos.requiereSoporte = datosLeidos.requiereSoporte;
      datos.horasImplementacion = datosLeidos.horasImplementacion;
      datos.diasImplementacion = datosLeidos.diasImplementacion;
      datos.totalMesesSoporte = datosLeidos.totalMesesSoporte;
      datos.notasCorrectivas = datosLeidos.notasCorrectivas;

      //Datos de version
      datos.versionCotizacion = datosLeidos.versionCotizacion;
      datos.fechaCotizacion = datosLeidos.fechaCotizacion;
      datos.idContactoCotizacion = datosLeidos.idContactoCotizacion;
      datos.idEstadoCotizacion = datosLeidos.idEstadoCotizacion;
      datos.idVendedorCotizacion = datosLeidos.idVendedorCotizacion;
      datos.introduccionCotizacion = datosLeidos.introduccionCotizacion;
      datos.descuentoFinalPorcentaje = datosLeidos.descuentoFinalPorcentaje;
      datos.distribucionDescuentoFinal = datosLeidos.distribucionDescuentoFinal;
      datos.precioTotal = datosLeidos.precioTotal;
      datos.IVAPorcentaje = datosLeidos.IVAPorcentaje * 100; //Warning. Hay que obtener este valor desde la configuracion, no desde version
      switch (datosLeidos.distribucionIVA) {
        case "Sin IVA":
          datos.distribucionIVA = constantes.DISTRIBUCION_SIN_IVA;
          break;
        case "IVA Total":
          datos.distribucionIVA = constantes.DISTRIBUCION_IVA_TOTAL;
          break;
        case "IVA Distribuido":
          datos.distribucionIVA = constantes.DISTRIBUCION_IVA_POR_ITEM;
          break;
      }
      //datos.distribucionIVA = datosLeidos.distribucionIVA;
      datos.tiempoEntrega = datosLeidos.tiempoEntrega;
      datos.validez = datosLeidos.validez;
      datos.garantia = datosLeidos.garantia;
      datos.formaPago = datosLeidos.formaPago;
      datos.moneda = datosLeidos.moneda;
      datos.tipoCambio = datosLeidos.tipoCambio;
      datos.notasCotizacion = datosLeidos.notasCotizacion;
      datos.notasInternas = datosLeidos.notasInternas;
      datos.idCreadoPorCotizacion = datosLeidos.idVendedorCotizacion; //No está en la base de datos
      datos.idModificadoPorCotizacion = datosLeidos.idVendedorCotizacion; //No está en la base de datos
      datos.fechaCreacionCotizacion = dayjs(
        datosLeidos.fechaCreacionCotizacion,
        "DD-MM-YYYY"
      ).format("DD-MM-YYYY");
      datos.fechaModificacionCotizacion = dayjs(
        datosLeidos.fechaModificacionCotizacion,
        "DD-MM-YYYY"
      ).format("DD-MM-YYYY");
      datos.nombreCotizacion = datosLeidos.nombreCotizacion;
      datos.totalSecciones = datosLeidos.totalSecciones;
      datos.telefonoVendedor = datosLeidos.telefonoVendedor;
      datos.emailVendedor = datosLeidos.emailVendedor;
      datos.idPreventa = datosLeidos.idPreventa;
      datos.emailPreventa = datosLeidos.emailPreventa;
      datos.nombreContactoImpresion = datosLeidos.nombreContactoImpresion;
      datos.idContactoImpresion = datosLeidos.idContactoImpresion;
      datos.telefonoContactoImpresion = datosLeidos.telefonoContactoImpresion;
      datos.emailContactoImpresion = datosLeidos.emailContactoImpresion;
      datos.idMonedaBase = datosLeidos.idMonedaBase;
      datos.IVA = datosLeidos.IVA;
      datos.otroImpuesto = datosLeidos.otroImpuesto;
      datos.valorOtroImpuesto = datosLeidos.valorOtroImpuesto;
      datos.otroImpuestoDisplay = datosLeidos.otroImpuestoDisplay;
      datos.fechaAceptada = datosLeidos.fechaAceptada;
      datos.costoTotal = datosLeidos.costoTotal;
      datos.financiamientoResumen = datosLeidos.financiamientoResumen;
      datos.financiamientoTEA = datosLeidos.financiamientoTEA;
      datos.financiamientoPeriodoPago = datosLeidos.financiamientoPeriodoPago;
      datos.financiamientoNumeroPeriodos =
        datosLeidos.financiamientoNumeroPeriodos;
      datos.financiamientoValorInicial = datosLeidos.financiamientoValorInicial;
      datos.financiado = datosLeidos.financiado;
      datos.statusVersion = datosLeidos.statusVersion;

      datos.descuentoFinalAbsoluto = 0;
      datos.totalDescontado = 0;

      //Datos de oportunidad - No se graban
      datos.idCuentaOportunidad = datosLeidos.idCuentaOportunidad;
      datos.nombreOportunidad = datosLeidos.nombreOportunidad;
      datos.fechaCierreOportunidad = datosLeidos.fechaCierreOportunidad;
      datos.idEtapaVentaOportunidad = datosLeidos.idEtapaVentaOportunidad;
      datos.idContactoOportunidad = datosLeidos.idContactoOportunidad;
      datos.importeOportunidad = datosLeidos.importeOportunidad;
    }
    console.log("datos inicializados", datos);
    return datos;
  }

  const handleAlert = useCallback(
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
    },
    [
      idCotizacionVersionSeleccionada.idCotizacion,
      idCotizacionVersionSeleccionada.versionCotizacion,
    ]
  );

  //Registrar los datos ingresados en el formulario de DatosBasicos y en el ciclo de vida
  //Se ejecuta cuando se graban los datos de la oportunidad y se actualizan los datos de la oportunidad
  const registrarDatos = useCallback(
    //async (input, instancia, otro = 0) => {
    async (input, instancia, otro = 0) => {
      console.log("registrarDatos", input, instancia, otro);
      let newPropuestaVersion = {};
      switch (instancia) {
        //------------ Datos Basicos ----------------
        case "cuentaCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.idCuentaOportunidad =
            input;
          console.log(datosDB.current.matrizCuentasCotizacion);

          setDatosBasicos({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          break;

        case "oportunidadCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.idOportunidadCotizacion =
            input;
          setDatosBasicos({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          break;

        //----WARNING Compatible con appa antigua ----
        case "nombreOportunidadCotizacion":
          //datos.datosCotizacion.idOportunidad = input;
          datosDB.current.datosCotizacion.propuestaVersion.nombreOportunidad =
            input;
          setDatosBasicos({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          break;
        //-----------------------------------------------

        case "contactoOportunidad":
          datosDB.current.datosCotizacion.propuestaVersion.idContactoOportunidad =
            input;
          setDatosBasicos({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          break;
        case "fechaCierreOportunidad":
          datosDB.current.datosCotizacion.propuestaVersion.fechaCierreOportunidad =
            input;
          setDatosBasicos({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          break;
        case "etapaVentaOportunidad":
          datosDB.current.datosCotizacion.propuestaVersion.idEtapaVentaOportunidad =
            input;
          setDatosBasicos({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          break;
        case "importeOportunidad":
          datosDB.current.datosCotizacion.propuestaVersion.importeOportunidad =
            input;
          setDatosBasicos({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          break;

        //Colocar todos los paramteros cuando se crea una nueva cotizacion
        case "idCotizacionNueva":
          datosDB.current.datosCotizacion.propuestaVersion.idCotizacion = input;
          datosDB.current.datosCotizacion.propuestaVersion.idContactoCotizacion =
            datosDB.current.datosCotizacion.propuestaVersion.idContactoOportunidad;
          datosDB.current.datosCotizacion.propuestaVersion.versionCotizacion = 1;
          datosDB.current.datosCotizacion.propuestaVersion.totalVersionesCotizacion = 1;
          datosDB.current.datosCotizacion.propuestaVersion.nombreCotizacion =
            datosDB.current.datosCotizacion.propuestaVersion.nombreOportunidad;
          datosDB.current.datosCotizacion.propuestaVersion.idContactoImpresion =
            datosDB.current.datosCotizacion.propuestaVersion.idContactoOportunidad;
          setIdCotizacion(input);
          setDatosCotizacion({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          break;

        //----------- Datos Cotizacion ----------------
        case "nombreCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.nombreCotizacion =
            input;
          setDatosCotizacion({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          break;

        //---------- Introduccion -------------------
        case "introduccionCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.introduccionCotizacion =
            input;
          break;

        //-------  Cotizacion ----------
        case "fechaCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.fechaCotizacion =
            input;
          break;
        case "contactoImpresion":
          datosDB.current.datosCotizacion.propuestaVersion.idContactoImpresion =
            input;
          break;

        case "filasCotizacion":
          //Actualizar las filas del array datos.filas que correspondan cuyo indice sea el parametro otro;
          console.log(datosDB.current.datosCotizacion.secciones);
          console.log(
            datosDB.current.datosCotizacion.secciones[otro - 1].filas
          );
          datosDB.current.datosCotizacion.secciones[otro - 1].filas = input.map(
            (fila, index) => ({
              ...datosDB.current.datosCotizacion.secciones[otro - 1].filas[
                index
              ],
              ...fila,
            })
          );
          const totales = calcularTotalesCotizacion(
            datosDB.current.datosCotizacion.secciones
          );
          setTotalesCotizacion(totales);

          //Calcular los valores de version
          console.log(datosDB.current.datosCotizacion.propuestaVersion);
          console.log(totales.precioVentaTotal);
          datosDB.current.datosCotizacion.propuestaVersion.precioTotal =
            totales.precioVentaTotal;
          setDatosComplementarios(
            datosDB.current.datosCotizacion.propuestaVersion
          );

          break;

        case "clonarCotizacion":
          setIdCotizacion(idCotizacionVersionSeleccionada.idCotizacion);
          setDatosBasicos(input.propuestaVersion);
          setDatosCotizacion(input.propuestaVersion);
          setSeccionesCotizacion(input.secciones);
          setIntroduccionCotizacion(
            input.propuestaVersion.introduccionCotizacion
          );
          setDatosComplementarios(input.propuestaVersion);
          setDatosCondicionesComerciales({
            tiempoEntrega: input.propuestaVersion.tiempoEntrega,
            validez: input.propuestaVersion.validez,
            garantia: input.propuestaVersion.garantia,
            formaPago: input.propuestaVersion.formaPago,
            moneda: input.propuestaVersion.moneda,
            tipoCambio: input.propuestaVersion.tipoCambio,
            notasCotizacion: input.propuestaVersion.notasCotizacion,
          });
          setTotalesCotizacion(calcularTotalesCotizacion(input.secciones));
          setDatosFlujo(input.propuestaVersion);
          setDatosBottom(input.propuestaVersion);
          setCotizacionVersionDashboardLB(idCotizacionVersionSeleccionada);

          break;
        //------------ Seccion Cotizacion --------------------
        case "tituloSeccion":
          //Hacer que la propiedad tituloSeccion de datosDB.current.datosCotizacion.secciones.datosSeccion tome el valor de otro si datosDB.current.datosCotizacion.secciones.datosSeccion.numeroSeccion es igual a input
          datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
            if (seccion.datosSeccion.numeroSeccion === input) {
              seccion.datosSeccion.tituloSeccion = otro;
            }
          });
          setSeccionesCotizacion([
            ...datosDB.current.datosCotizacion.secciones,
          ]);
          break;
        case "ordenarSecciones": {
          // input = numero de seccion a desplazar, otro = "abajo" o "arriba"
          const datosSecciones = datosDB.current.datosCotizacion.secciones;
          const index = datosSecciones.findIndex(
            (seccion) => seccion.datosSeccion.numeroSeccion === input
          );
          if (index !== -1) {
            let swapWith = -1;
            if (otro === "abajo" && index < datosSecciones.length - 1) {
              swapWith = index + 1;
            } else if (otro === "arriba" && index > 0) {
              swapWith = index - 1;
            }
            if (swapWith !== -1) {
              // Intercambiar las secciones
              [datosSecciones[index], datosSecciones[swapWith]] = [
                datosSecciones[swapWith],
                datosSecciones[index],
              ];
              // Renumerar numeroSeccion y filas
              datosSecciones.forEach((seccion, idx) => {
                seccion.datosSeccion.numeroSeccion = idx + 1;
                if (Array.isArray(seccion.filas)) {
                  seccion.filas.forEach((fila) => {
                    fila.numeroSeccion = idx + 1;
                  });
                }
              });
            }
          }

          //Reemplazar datosDB.current.datosCotizacion.secciones con datosSecciones
          datosDB.current.datosCotizacion.secciones = [...datosSecciones];
          setSeccionesCotizacion([
            ...datosDB.current.datosCotizacion.secciones,
          ]);

          //Reemplazar datosDB.current.datosCotizacion.secciones con input
          /*datosDB.current.datosCotizacion.secciones = input;
          setSeccionesCotizacion(input);*/
          break;
        }

        case "eliminarSeccion": {
          const datosSecciones = datosDB.current.datosCotizacion.secciones;
          const indexEliminar = datosSecciones.findIndex(
            (seccion) => seccion.datosSeccion.numeroSeccion === input
          );
          if (indexEliminar !== -1) {
            datosSecciones.splice(indexEliminar, 1);
            // Renumerar numeroSeccion y filas
            datosSecciones.forEach((seccion, idx) => {
              seccion.datosSeccion.numeroSeccion = idx + 1;
              if (Array.isArray(seccion.filas)) {
                seccion.filas.forEach((fila) => {
                  fila.numeroSeccion = idx + 1;
                });
              }
            });
            //Reemplazar datosDB.current.datosCotizacion.secciones con datosSecciones
            datosDB.current.datosCotizacion.secciones = [...datosSecciones];
            // Actualizar el estado con las secciones ordenadas
            setSeccionesCotizacion([...datosSecciones]);
          }

          //datosDB.current.datosCotizacion.secciones = input;
          //setSeccionesCotizacion(input);

          const totalesSeccion = calcularTotalesCotizacion(
            datosDB.current.datosCotizacion.secciones
          );
          setTotalesCotizacion(totalesSeccion);

          //Calcular los valores de version
          console.log(datosDB.current.datosCotizacion.propuestaVersion);
          console.log(totalesSeccion.precioVentaTotal);
          datosDB.current.datosCotizacion.propuestaVersion.precioTotal =
            totalesSeccion.precioVentaTotal;
          setDatosComplementarios(
            datosDB.current.datosCotizacion.propuestaVersion
          );

          //Reducir la propiedad totalSecciones
          datosDB.current.datosCotizacion.totalSecciones--;
          break;
        }

        case "inclusionSeccion":
          // Establece idControlSeccion en la sección correspondiente
          /*const seccionIndex =
            datosDB.current.datosCotizacion.secciones.findIndex(
              (s) => s.datosSeccion.numeroSeccion === input
            );
          if (seccionIndex !== -1) {
            datosDB.current.datosCotizacion.secciones[
              seccionIndex
            ].idControlSeccion = otro;
          }*/
          datosDB.current.datosCotizacion.secciones[
            input - 1
          ].idControlSeccion = otro;
          const seccion = datosDB.current.datosCotizacion.secciones.find(
            (s) => s.datosSeccion.numeroSeccion === input
          );
          if (seccion) {
            seccion.datosSeccion.idControlSeccion = otro;
            setSeccionesCotizacion([
              ...datosDB.current.datosCotizacion.secciones,
            ]);
            const totalesSeccion = calcularTotalesCotizacion(
              datosDB.current.datosCotizacion.secciones
            );
            setTotalesCotizacion(totalesSeccion);

            //Calcular los valores de version
            console.log(datosDB.current.datosCotizacion.propuestaVersion);
            console.log(totalesSeccion.precioVentaTotal);
            datosDB.current.datosCotizacion.propuestaVersion.precioTotal =
              totalesSeccion.precioVentaTotal;
            setDatosComplementarios(
              datosDB.current.datosCotizacion.propuestaVersion
            );
          }

          break;

        case "adicionarSeccion":
          datosDB.current.datosCotizacion.secciones = input;
          setSeccionesCotizacion(input);

          //Incrementar la propiedad totalSecciones
          datosDB.current.datosCotizacion.totalSecciones++;
          break;

        case "duplicarSeccion":
          //Dupplicar la seccion numero input
          const secciones = datosDB.current.datosCotizacion.secciones;
          const index = secciones.findIndex(
            (seccion) => seccion.datosSeccion.numeroSeccion === input
          );
          if (index !== -1) {
            // Deep clone the section to duplicate
            const seccionDuplicada = cloneDeep(secciones[index]);
            // Assign a new section number at the end
            const nuevaSeccionNumero = secciones.length + 1;
            seccionDuplicada.datosSeccion.numeroSeccion = nuevaSeccionNumero;
            // Optionally, update the title or other fields if needed
            // seccionDuplicada.datosSeccion.tituloSeccion += " (Copia)";
            // Update all filas to have the new section number
            if (Array.isArray(seccionDuplicada.filas)) {
              seccionDuplicada.filas.forEach((fila) => {
                fila.numeroSeccion = nuevaSeccionNumero;
              });
            }
            // Insert the duplicated section at the end
            secciones.push(seccionDuplicada);
          }
          datosDB.current.datosCotizacion.secciones = [...secciones];
          setSeccionesCotizacion(datosDB.current.datosCotizacion.secciones);

          //Incrementar la propiedad totalSecciones
          datosDB.current.datosCotizacion.totalSecciones++;
          break;

        //--------------------- Items Seccion ----------------------
        case "adicionarItem":
        case "removerItem":
          //Reemplazar el array filas de la seccion otro de datosDB.current.datosCotizacion.secciones por input
          datosDB.current.datosCotizacion.secciones[otro - 1].filas =
            input.listaFilasAMostrar;
          datosDB.current.datosCotizacion.secciones[
            otro - 1
          ].datosSeccion.numeroItems = input.totalItems;
          setDatosComplementarios({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          /*setSeccionesCotizacion([
            ...datosDB.current.datosCotizacion.secciones,
          ]);*/
          break;
        case "moverFilaArriba":
        case "moverFilaAbajo":
          datosDB.current.datosCotizacion.secciones[otro - 1].filas =
            input.listaFilasAMostrar;
          /*setSeccionesCotizacion([
            ...datosDB.current.datosCotizacion.secciones,
          ]);*/
          break;

        case "duplicarItem":
          datosDB.current.datosCotizacion.secciones[otro - 1].filas =
            input.listaFilasAMostrar;
          datosDB.current.datosCotizacion.secciones[
            otro - 1
          ].datosSeccion.numeroItems = input.totalItems;
          break;

        case "copiarItems":
          setFilasCopiadas(input);
          break;

        case "pegarItem":
          datosDB.current.datosCotizacion.secciones[otro - 1].filas =
            input.listaFilasAMostrar;
          datosDB.current.datosCotizacion.secciones[
            otro - 1
          ].datosSeccion.numeroItems = input.totalItems;
          break;

        case "agruparItems":
          datosDB.current.datosCotizacion.secciones[otro - 1].filas =
            input.listaFilasAMostrar;

          datosDB.current.datosCotizacion.secciones[
            otro - 1
          ].datosSeccion.numeroItems = input.totalItems;
          /*setSeccionesCotizacion([
            ...datosDB.current.datosCotizacion.secciones,
          ]);*/
          break;

        case "editarGrupoItems":
          datosDB.current.datosCotizacion.secciones[otro - 1].filas =
            input.listaFilasAMostrar;

          datosDB.current.datosCotizacion.secciones[
            otro - 1
          ].datosSeccion.numeroItems = input.totalItems;
          /*setSeccionesCotizacion([
            ...datosDB.current.datosCotizacion.secciones,
          ]);*/
          break;

        case "resaltarFila":
        case "mostrarFila":
        case "esconderFila":
        case "subtituloFila":
        case "sinPrecioFila":
          datosDB.current.datosCotizacion.secciones[otro - 1].filas = input;
          setSeccionesCotizacion([
            ...datosDB.current.datosCotizacion.secciones,
          ]);
          break;

        case "colocarCodigo":
          datosDB.current.datosCotizacion.secciones[otro - 1].filas =
            input.listaFilasAMostrar;
          setSeccionesCotizacion([
            ...datosDB.current.datosCotizacion.secciones,
          ]);
          break;

        //------------ Opciones Cotizacion --------------------
        case "descuentoFinalPorcentaje":
          datosDB.current.datosCotizacion.propuestaVersion.descuentoFinalPorcentaje =
            input;

          switch (
            Number(
              datosDB.current.datosCotizacion.propuestaVersion
                .distribucionDescuentoFinal
            )
          ) {
            case constantes.DESCUENTO_TOTAL:
              //console.log("No cMBIO Nd");
              break;

            case constantes.DESCUENTO_POR_ITEM:
              //console.log("Si cambio");
              datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
                seccion.filas.forEach((fila) => {
                  // Considera agrupadores los items cuyo grupo > 1000
                  if (!(fila.grupo > 1000)) {
                    fila.descuentoFinal =
                      datosDB.current.datosCotizacion.propuestaVersion.descuentoFinalPorcentaje;
                  }
                });
              });
              setSeccionesCotizacion([
                ...datosDB.current.datosCotizacion.secciones,
              ]);
              break;
          }

          setDatosComplementarios({
            ...datosDB.current.datosCotizacion.propuestaVersion,
          });
          /*setSeccionesCotizacion([
            ...datosDB.current.datosCotizacion.secciones,
          ]);*/
          break;

        case "distribucionDescuentoTotal":
          {
            datosDB.current.datosCotizacion.propuestaVersion.distribucionDescuentoFinal =
              input;
            //Hacer que todos los items que no sean agrupadores de todas las secciones tengan como la propiedad descuentoFinal el valor de input
            datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
              seccion.filas.forEach((item) => {
                // Considera agrupadores los items cuyo grupo > 1000
                if (!(item.grupo > 1000)) {
                  item.descuentoFinal = 0;
                }
              });
            });

            //Sincronizar las filas y grupos de todas las secciones
            datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
              seccion.filas = sincronizarFilas(
                seccion.filas
              ).listaFilasAMostrar;
            });

            //Recalcular los totales debido al descuento distribuido por item
            const totales = calcularTotalesCotizacion(
              datosDB.current.datosCotizacion.secciones
            );
            setTotalesCotizacion(totales);

            //Guardar el nuevo valor de precioTotal de la version debido al descuento distribuido
            datosDB.current.datosCotizacion.propuestaVersion.precioTotal =
              totales.precioVentaTotal;

            setDatosComplementarios({
              ...datosDB.current.datosCotizacion.propuestaVersion,
            });
            setSeccionesCotizacion([
              ...datosDB.current.datosCotizacion.secciones,
            ]);
          }
          break;

        case "distribucionDescuentoPorItem":
          {
            datosDB.current.datosCotizacion.propuestaVersion.distribucionDescuentoFinal =
              input;

            //Hacer que todos los items que no sean agrupadores de todas las secciones tengan como la propiedad descuentoFinal el valor de input
            datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
              seccion.filas.forEach((fila) => {
                // Considera agrupadores los items cuyo grupo > 1000
                if (!(fila.grupo > 1000)) {
                  fila.descuentoFinal =
                    datosDB.current.datosCotizacion.propuestaVersion.descuentoFinalPorcentaje;
                }
              });
            });

            //Sincronizar las filas y grupos de todas las secciones
            datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
              seccion.filas = sincronizarFilas(
                seccion.filas
              ).listaFilasAMostrar;
            });

            //Recalcular los totales debido al descuento distribuido por item
            const totales = calcularTotalesCotizacion(
              datosDB.current.datosCotizacion.secciones
            );
            setTotalesCotizacion(totales);

            //Guardar el nuevo valor de precioTotal de la version debido al descuento distribuido
            datosDB.current.datosCotizacion.propuestaVersion.precioTotal =
              totales.precioVentaTotal;

            setDatosComplementarios({
              ...datosDB.current.datosCotizacion.propuestaVersion,
            });
            setSeccionesCotizacion([
              ...datosDB.current.datosCotizacion.secciones,
            ]);
          }
          break;

        case "distribucionSinIVA":
          {
            if (
              datosDB.current.datosCotizacion.propuestaVersion
                .distribucionIVA === constantes.DISTRIBUCION_IVA_POR_ITEM //"IVA Distribuido"
            ) {
              datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
                seccion.filas.forEach((fila) => {
                  // Considera agrupadores los items cuyo grupo > 1000
                  if (!(fila.grupo > 1000)) {
                    fila.iva = 0;
                  }
                });
              });
            }

            //Sincronizar las filas y grupos de todas las secciones
            datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
              seccion.filas = sincronizarFilas(
                seccion.filas
              ).listaFilasAMostrar;
            });

            //Recalcular los totales debido al descuento distribuido por item
            const totales = calcularTotalesCotizacion(
              datosDB.current.datosCotizacion.secciones
            );
            setTotalesCotizacion(totales);

            //Guardar el nuevo valor de precioTotal de la version debido al descuento distribuido
            datosDB.current.datosCotizacion.propuestaVersion.precioTotal =
              totales.precioVentaTotal;

            datosDB.current.datosCotizacion.propuestaVersion.distribucionIVA =
              input;
            setDatosComplementarios({
              ...datosDB.current.datosCotizacion.propuestaVersion,
            });
          }
          break;

        case "distribucionIVATotal":
          {
            if (
              datosDB.current.datosCotizacion.propuestaVersion
                .distribucionIVA === constantes.DISTRIBUCION_IVA_POR_ITEM //"IVA Distribuido"
            ) {
              datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
                seccion.filas.forEach((fila) => {
                  // Considera agrupadores los items cuyo grupo > 1000
                  if (!(fila.grupo > 1000)) {
                    fila.iva = 0;
                  }
                });
              });
            }

            //Sincronizar las filas y grupos de todas las secciones
            datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
              seccion.filas = sincronizarFilas(
                seccion.filas
              ).listaFilasAMostrar;
            });

            //Recalcular los totales debido al descuento distribuido por item
            const totales = calcularTotalesCotizacion(
              datosDB.current.datosCotizacion.secciones
            );
            setTotalesCotizacion(totales);

            //Guardar el nuevo valor de precioTotal de la version debido al descuento distribuido
            datosDB.current.datosCotizacion.propuestaVersion.precioTotal =
              totales.precioVentaTotal;

            datosDB.current.datosCotizacion.propuestaVersion.distribucionIVA =
              input;
            setDatosComplementarios({
              ...datosDB.current.datosCotizacion.propuestaVersion,
            });
          }
          break;

        case "distribucionIVAPorItem":
          {
            switch (
              datosDB.current.datosCotizacion.propuestaVersion.distribucionIVA
            ) {
              //case "Sin IVA":
              case constantes.DISTRIBUCION_SIN_IVA:
                datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
                  seccion.filas.forEach((fila) => {
                    // Considera agrupadores los items cuyo grupo > 1000
                    if (!(fila.grupo > 1000)) {
                      fila.iva =
                        datosDB.current.datosCotizacion.propuestaVersion.IVAPorcentaje;
                    }
                  });
                });
                setSeccionesCotizacion([
                  ...datosDB.current.datosCotizacion.secciones,
                ]);
                break;

              //case "IVA Total":
              case constantes.DISTRIBUCION_IVA_TOTAL:
                datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
                  seccion.filas.forEach((fila) => {
                    // Considera agrupadores los items cuyo grupo > 1000
                    if (!(fila.grupo > 1000)) {
                      fila.iva =
                        datosDB.current.datosCotizacion.propuestaVersion.IVAPorcentaje;
                    }
                  });
                });
                setSeccionesCotizacion([
                  ...datosDB.current.datosCotizacion.secciones,
                ]);
                break;
            }

            //Sincronizar las filas y grupos de todas las secciones
            datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
              seccion.filas = sincronizarFilas(
                seccion.filas
              ).listaFilasAMostrar;
            });

            //Recalcular los totales debido al descuento distribuido por item
            const totales = calcularTotalesCotizacion(
              datosDB.current.datosCotizacion.secciones
            );
            setTotalesCotizacion(totales);

            //Guardar el nuevo valor de precioTotal de la version debido al descuento distribuido
            datosDB.current.datosCotizacion.propuestaVersion.precioTotal =
              totales.precioVentaTotal;

            datosDB.current.datosCotizacion.propuestaVersion.distribucionIVA =
              input;
            setDatosComplementarios({
              ...datosDB.current.datosCotizacion.propuestaVersion,
            });
          }
          break;

        //------------ Condiciones Comerciales ---------------
        case "tiempoEntregaCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.tiempoEntrega =
            input;
          break;
        case "validezCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.validez = input;
          break;
        case "garantiaCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.garantia = input;
          break;
        case "formaPagoCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.formaPago = input;
          break;
        case "monedaCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.moneda = input;
          //Obtiene el tipo de cambio de acuerdo a la moneda seleccionada
          let monedaCambio = 1;
          switch (
            Number(datosDB.current.datosCotizacion.propuestaVersion.moneda)
          ) {
            case 1:
              monedaCambio = "USD";
              break;
            case 2:
              monedaCambio = "PEN";
              break;
            case 3:
              monedaCambio = "MXN";
              break;
            case 4:
              monedaCambio = "CLP";
              break;
            case 5:
              monedaCambio = "EUR";
              break;
            case 6:
              monedaCambio = "GBP";
              break;
            case 7:
              monedaCambio = "CRC";
              break;
            case 8:
              monedaCambio = "GTQ";
              break;
          }

          fetch(
            `${constantes.URL_TIPO_CAMBIO}${monedaCambio}`,
            constantes.HEADER_COOKIE
          )
            .then((response) => response.json())
            .then((data) => {
              console.log("datos recibidos", data);
              datosDB.current.datosCotizacion.propuestaVersion.tipoCambio =
                Object.values(data.rates)[0];
              setDatosComplementarios({
                ...datosDB.current.datosCotizacion.propuestaVersion,
              });
              console.log(datosCondicionesComerciales);
              setDatosCondicionesComerciales({
                tiempoEntrega:
                  datosDB.current.datosCotizacion.propuestaVersion
                    .tiempoEntrega,
                validez:
                  datosDB.current.datosCotizacion.propuestaVersion.validez,
                garantia:
                  datosDB.current.datosCotizacion.propuestaVersion.garantia,
                formaPago:
                  datosDB.current.datosCotizacion.propuestaVersion.formaPago,
                moneda: datosDB.current.datosCotizacion.propuestaVersion.moneda,
                tipoCambio:
                  datosDB.current.datosCotizacion.propuestaVersion.tipoCambio,
                notasCotizacion:
                  datosDB.current.datosCotizacion.propuestaVersion
                    .notasCotizacion,
              });

              //************************************************************************************* */
              //Se actualizan los precios de venta de cada item de acuerdo al tipo de cambio seleccionado.
              //Hacer que todos los items que no sean agrupadores de todas las secciones tengan como tipo de cambio el valor seleccionado
              datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
                seccion.filas.forEach((fila) => {
                  // Considera agrupadores los items cuyo grupo > 1000
                  if (!(fila.grupo > 1000)) {
                    fila.tipoCambio =
                      datosDB.current.datosCotizacion.propuestaVersion.tipoCambio;
                  }
                });
              });
              console.log("prueba", datosDB.current.datosCotizacion.secciones);

              //Sincronizar las filas y grupos de todas las secciones
              datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
                seccion.filas = sincronizarFilas(
                  seccion.filas
                ).listaFilasAMostrar;
              });

              //Recalcular los totales debido al tipo de cambio
              const totales = calcularTotalesCotizacion(
                datosDB.current.datosCotizacion.secciones
              );
              //*************************************************************************************** */

              setTotalesCotizacion(totales);
              setSeccionesCotizacion([
                ...datosDB.current.datosCotizacion.secciones,
              ]);
            })
            .catch((error) => {
              "Error moneda";
            });

          break;

        case "tipoCambio":
          {
            datosDB.current.datosCotizacion.propuestaVersion.tipoCambio = input;
            setDatosComplementarios({
              ...datosDB.current.datosCotizacion.propuestaVersion,
            });

            setDatosCondicionesComerciales({
              tiempoEntrega:
                datosDB.current.datosCotizacion.propuestaVersion.tiempoEntrega,
              validez: datosDB.current.datosCotizacion.propuestaVersion.validez,
              garantia:
                datosDB.current.datosCotizacion.propuestaVersion.garantia,
              formaPago:
                datosDB.current.datosCotizacion.propuestaVersion.formaPago,
              moneda: datosDB.current.datosCotizacion.propuestaVersion.moneda,
              tipoCambio:
                datosDB.current.datosCotizacion.propuestaVersion.tipoCambio,
              notasCotizacion:
                datosDB.current.datosCotizacion.propuestaVersion
                  .notasCotizacion,
            });
            //************************************************************************************* */
            //Se actualizan los precios de venta de cada item de acuerdo al tipo de cambio seleccionado.
            //Hacer que todos los items que no sean agrupadores de todas las secciones tengan como tipo de cambio el valor seleccionado
            datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
              seccion.filas.forEach((fila) => {
                // Considera agrupadores los items cuyo grupo > 1000
                if (!(fila.grupo > 1000)) {
                  fila.tipoCambio =
                    datosDB.current.datosCotizacion.propuestaVersion.tipoCambio;
                }
              });
            });
            console.log("prueba", datosDB.current.datosCotizacion.secciones);

            //Sincronizar las filas y grupos de todas las secciones
            datosDB.current.datosCotizacion.secciones.forEach((seccion) => {
              seccion.filas = sincronizarFilas(
                seccion.filas
              ).listaFilasAMostrar;
            });

            //Recalcular los totales debido al tipo de cambio
            const totales = calcularTotalesCotizacion(
              datosDB.current.datosCotizacion.secciones
            );
            //*************************************************************************************** */

            setTotalesCotizacion(totales);
            setSeccionesCotizacion([
              ...datosDB.current.datosCotizacion.secciones,
            ]);
          }
          break;

        case "notasCotizacion":
          datosDB.current.datosCotizacion.propuestaVersion.notasCotizacion =
            input;
          setDatosComplementarios(
            datosDB.current.datosCotizacion.propuestaVersion
          );
          break;

        //------------ Notas internas ------------------
        case "notasInternas":
          datosDB.current.datosCotizacion.propuestaVersion.notasInternas =
            input;
          setDatosComplementarios(
            datosDB.current.datosCotizacion.propuestaVersion
          );

          break;

        //----------- Estados Cotizacion ---------------
        case "estadoCotizacion":
          const inputAnterior =
            datosDB.current.datosCotizacion.propuestaVersion.idEstadoCotizacion;
          datosDB.current.datosCotizacion.propuestaVersion.idEstadoCotizacion =
            input;
          setOpenBackdrop(true); // <-- Mostrar spinner
          const resultadoRegistrarCotizacion = await registrarCotizacion(
            "mantenerVersion",
            datosDB.current
          );
          if (resultadoRegistrarCotizacion) {
            switch (input) {
              //Si el estado nuevo de la propuesta es ganada, debe abrirse una ventana que muestre las ordenes que se recibieron del cliente por esta propuesta
              //Tambien debe permtir ingresar nuevas ordenes o editar las que ya existen
              //La ventana debe tener un boton para grabar las ordenes recibidas mostradas y otro para dar por cerrada el ingreso de las ordenes de esta cotizacion
              case constantes.GANADA:
                //Descargar las ordenes recibidas que comprenden esta cotización ganada
                const cadOrdenesRecibidas = `${constantes.URL_TIPO_CAMBIO}/postventa/ordenesrecibidas/cotizacion/${datosDB.current.datosCotizacion.propuestaVersion.idCotizacion}/${datosDB.current.datosCotizacion.propuestaVersion.versionCotizacion}`;
                //const cadOrdenesRecibidas = `${constantes.URL_TIPO_CAMBIO}/postventa/cotizaciones/${datosDB.current.datosCotizacion.propuestaVersion.idCotizacion}/${datosDB.current.datosCotizacion.propuestaVersion.versionCotizacion}/ordenesrecibidas`
                console.log(cadOrdenesRecibidas);
                const resDatosOrdenesRecibidas = await fetchWithTimeout(
                  cadOrdenesRecibidas,
                  constantes.HEADER_COOKIE
                );
                const jsonOrdenesRecibidas =
                  await resDatosOrdenesRecibidas.json();
                const matrizOrdenesRecibidas = jsonOrdenesRecibidas.data.map(
                  (orden) => ({
                    id: orden.idOrdenRecibida,
                    idOrdenRecibida: orden.idOrdenRecibida,
                    idPropuesta: orden.idPropuesta,
                    numeroVersion: orden.numeroVersion,
                    numeroOrden: orden.numeroOrden,
                    importeMonedaBase:
                      orden.tipoCambio == 1
                        ? Number(orden.importeMonedaBase)
                        : Number(orden.importeMonedaCambio / orden.tipoCambio),
                    importeMonedaCambio:
                      orden.tipoCambio == 1
                        ? 0
                        : Number(orden.importeMonedaCambio),
                    idMonedaBase: orden.idMonedaBase,
                    idMonedaCambio: orden.idMonedaCambio,
                    tipoCambio: Number(orden.tipoCambio),
                    fechaRecibida: orden.fechaRecibida,
                    fechaEntrega: orden.fechaEntrega,
                    formaPago: orden.formaPago,
                    garantia: orden.garantia,
                    notas: orden.notas,
                    status: orden.status,
                  })
                );
                setOrdenesRecibidas(matrizOrdenesRecibidas);
                console.log(matrizOrdenesRecibidas);
                setOpenVentanaOrdenesRecibidas(true);
                break;

              default:
                break;
            }

            setDatosFlujo(datosDB.current.datosCotizacion.propuestaVersion);
          } else {
            datosDB.current.datosCotizacion.propuestaVersion.idEstadoCotizacion =
              inputAnterior;
            console.log("No se pudo cambiar el estado de la cotización");
          }
          setOpenBackdrop(false);
          /*if (registrarCotizacion("mantenerVersion", datosDB.current)) {
            setDatosFlujo(datosDB.current.datosCotizacion.propuestaVersion);
          } else {
            datosDB.current.datosCotizacion.propuestaVersion.idEstadoCotizacion =
              inputAnterior;
            console.log("No se pudo cambiar el estado de la cotización");
          }*/

          break;

        //--------------- Ordenes Recibidas -------------------
        case "adicionarOrdenRecibida":
        case "eliminarOrdenRecibida":
          console.log("adicionarOrdenRecibida");
          setOrdenesRecibidas(input);
          break;

        case "actualizarFilasOrdenesRecibidas":
          setOrdenesRecibidas(input);
          break;

        case "grabarOrdenesRecibidas":
          const matrizOrdenesRecibidas = [...ordenesRecibidas, ...input];
          console.log(matrizOrdenesRecibidas);
          setOrdenesRecibidas(matrizOrdenesRecibidas);

          setOpenBackdrop(true); // <-- Mostrar spinner
          //Se debe enviar a grabar con el numero de version nuevo
          (async () => {
            const result = await registrarOrdenesRecibidas(
              matrizOrdenesRecibidas
            );
            if (result) {
              setOpenAlert("success");
            } else {
              setOpenAlert("error");
            }
            setOpenBackdrop(false);
          })();
          break;

        case "declararCotizacionGanada":
          {
            const matrizOrdenesRecibidas = [...ordenesRecibidas, ...input];
            console.log(matrizOrdenesRecibidas);
            setOrdenesRecibidas(matrizOrdenesRecibidas);

            setOpenBackdrop(true); // <-- Mostrar spinner
            //Se debe enviar a grabar con el numero de version nuevo
            (async () => {
              //Graba las ordenes
              const result = await registrarOrdenesRecibidas(
                matrizOrdenesRecibidas
              );

              //Graba la cotizacion con el nuevo estado
              datosDB.current.datosCotizacion.propuestaVersion.idEstadoCotizacion =
                constantes.GANADA;

              const resultadoRegistrarCotizacion = await registrarCotizacion(
                "mantenerVersion",
                datosDB.current
              );

              if (result && resultadoRegistrarCotizacion) {
                setOpenAlert("success");
              } else {
                setOpenAlert("error");
              }
              setOpenBackdrop(false);
            })();
          }
          break;

        //-------------- Impresión ------------------------------------------
        /*case "impresionCotizacion":
          console.log("current", datosDB.current.datosCotizacion.secciones);
          //datosDB.current.datosCotizacion.secciones = input;
          //setSeccionesCotizacion(...datosDB.current.datosCotizacion.secciones);
          break;*/
      }
      console.log(datosDB.current);
      //setDatosDB(datos);
      //setDatosCotizacion(datosDB.current.datosCotizacion.propuestaVersion);
    },
    [
      idCotizacionVersionSeleccionada.idCotizacion,
      idCotizacionVersionSeleccionada.versionCotizacion,
    ]
  );

  //Graba la cotizacion
  const registrarCotizacion = useCallback(
    async (tipoVersion, datosOpcionesF) => {
      //function registrarCotizacion(tipoVersion) {
      console.log("funcion registrarCotizacion", tipoVersion, datosDB.current);
      const resultadoGrabacion = await grabarCotizacion(
        datosDB.current.datosCotizacion,
        datosOpcionesF,
        //handleAlert,
        tipoVersion
      );
      console.log(resultadoGrabacion);
      datosDB.current.datosCotizacion.propuestaVersion.idCotizacion =
        resultadoGrabacion.idCotizacion;
      datosDB.current.datosCotizacion.propuestaVersion.versionCotizacion =
        resultadoGrabacion.numeroVersion;
      setDatosCotizacion({
        ...datosDB.current.datosCotizacion.propuestaVersion,
      });
      return true;
    },
    []
  );

  const registrarOrdenesRecibidas = useCallback(async (ordenes) => {
    //function registrarCotizacion(tipoVersion) {
    console.log("funcion registrarOrdenesRecibidas", ordenes);

    const datos = {
      idCotizacion:
        datosDB.current.datosCotizacion.propuestaVersion.idCotizacion,
      numeroVersion:
        datosDB.current.datosCotizacion.propuestaVersion.versionCotizacion,
      ordenes: ordenes,
    };
    const resultadoGrabacion = await grabarRegistro(datos, "ordenesRecibidas");
    console.log(resultadoGrabacion);
    const ordenesRecibidasLeidas = resultadoGrabacion.ordenes.map((orden) => ({
      ...orden,
      id: orden.idOrdenRecibida,
    }));

    setOrdenesRecibidas(ordenesRecibidasLeidas);
    return true;
  }, []);

  //Coloca un timeout a la funcion fetch para evitar que una conexión no se quede pegada
  const fetchWithTimeout = async (resource, options = {}) => {
    const { timeout = 10000 } = options; // 10 segundos por default
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    return fetch(resource, {
      ...constantes.HEADER_COOKIE,
      ...options,
      signal: controller.signal,
    }).finally(() => clearTimeout(id));
  };

  useEffect(() => {
    console.log("useEffect CrearCotizacion");
    let datosPropuestaVersion = {}; //Datos de la cuenta
    let matrizCuentasCotizacion = [];
    let matrizEtapasVenta = [];

    //Obtiene los datos de la cotizacion y las opciones de cada seleccion desde la base de datos
    const obtenerDatosCotizacion = async () => {
      console.log(
        "obtenerDatosCotizacion",
        idCotizacionVersionSeleccionada.idCotizacion
      );
      //Obtiene los datos de la cotizacion

      //================= REVISAR ============================
      //Si no tiene permisos para ver cotizaciones no muestra nada
      if (
        !user?.permisos?.includes(permisos.ACCESO__VENTAS_COTIZADOR_ABRIRCOT)
      ) {
        setOpenBackdrop(false);
        return;
      }

      const cadCotizacion = `${constantes.PREFIJO_URL_API}/cotizaciones/${idCotizacionVersionSeleccionada.idCotizacion}/${idCotizacionVersionSeleccionada.versionCotizacion}`;
      console.log(cadCotizacion);
      const resDatosCotizacion = fetchWithTimeout(cadCotizacion, {});

      //Obtiene las cuentas
      let cadCuentas = "";
      if (user?.permisos?.includes(permisos.ALCANCE__TODAS_LAS_PROPUESTAS)) {
        cadCuentas = `${constantes.PREFIJO_URL_API}/cuentas/`;
      } else {
        cadCuentas = `${constantes.PREFIJO_URL_API}/cuentas/usuario/${user.id}`;
        //cadCuentas = `${constantes.PREFIJO_URL_API}/usuarios/${user.id}/cuentas/`;
      }
      console.log(cadCuentas);
      const resCuentas = fetchWithTimeout(cadCuentas, {});

      //Obtiene las etapas de venta
      const resEtapasVenta = fetchWithTimeout(
        `${constantes.PREFIJO_URL_API}/configuracion/etapaventa`,
        {}
      );

      //Obtiene la lista de los estados de una cotizacion
      const resEstadosCotizacion = fetchWithTimeout(
        `${constantes.PREFIJO_URL_API}/configuracion/estadocotizacion`,
        {}
      );

      //Obtiene la lista de los usuarios
      const resUsuarios = fetchWithTimeout(
        `${constantes.PREFIJO_URL_API}/usuarios`,
        //`${constantes.PREFIJO_URL_API}/configuracion/usuarios`,
        {}
      );

      //Obtiene los datos de las secciones de la version de la cotizacion
      const cadSecciones = `${constantes.PREFIJO_URL_API}/cotizaciones/${idCotizacionVersionSeleccionada.idCotizacion}/${idCotizacionVersionSeleccionada.versionCotizacion}/secciones`;

      console.log(cadSecciones);
      const resDatosSeccion = fetchWithTimeout(cadSecciones, {});

      //Obtiene los datos de las secciones de la version de la cotizacion
      const cadItems = `${constantes.PREFIJO_URL_API}/cotizaciones/${idCotizacionVersionSeleccionada.idCotizacion}/${idCotizacionVersionSeleccionada.versionCotizacion}/items`;
      console.log(cadItems);
      const resDatosItem = fetchWithTimeout(cadItems, {});

      //Obtiene la lista de las opciones de los tiempos de entrega de una cotizacion
      const resTiemposEntregaCotizacion = fetchWithTimeout(
        `${constantes.PREFIJO_URL_API}/configuracion/tiemposentrega`,
        {}
      );
      console.log("fetch tiemposentrega");

      //Obtiene la lista de las opciones de validez de una cotizacion
      const resValidezCotizacion = fetchWithTimeout(
        `${constantes.PREFIJO_URL_API}/configuracion/validez`,
        {}
      );
      console.log("fetch validez");

      //Obtiene la lista de las opciones de garantia de una cotizacion
      const resGarantiaCotizacion = fetchWithTimeout(
        `${constantes.PREFIJO_URL_API}/configuracion/garantia`,
        {}
      );
      console.log("fetch garantia");

      //Obtiene la lista de las opciones de las formas de pago de una cotizacion
      const resFormaPagoCotizacion = fetchWithTimeout(
        `${constantes.PREFIJO_URL_API}/configuracion/formapago`,
        {}
      );
      console.log("fetch formpago");

      //Obtiene la lista de las opciones de las monedas de una cotizacion
      const resMonedaCotizacion = fetchWithTimeout(
        `${constantes.PREFIJO_URL_API}/configuracion/moneda`,
        {}
      );
      console.log("fetch moneda");

      //Ejecuta las peticiones de manera simultanea
      let resAll;
      try {
        resAll = await Promise.all([
          resDatosCotizacion,
          resCuentas,
          resEtapasVenta,
          resEstadosCotizacion,
          resUsuarios,
          resDatosSeccion,
          resDatosItem,
          resTiemposEntregaCotizacion,
          resValidezCotizacion,
          resGarantiaCotizacion,
          resFormaPagoCotizacion,
          resMonedaCotizacion,
        ]);
      } catch (error) {
        console.error("Error al realizar las peticiones a las APIs:", error);
        return;
      }
      console.log(resAll);

      //Obtiene el json simultaneo de las 7 peticiones a las APIs,
      const resAllJson = resAll.map((el) => el.json());
      let jsonAll;
      try {
        jsonAll = await Promise.all(resAllJson);
      } catch (error) {
        console.error("Error al obtener datos de las APIs:", error);
        return;
      }

      console.log(jsonAll);

      //Obtiene los datos de la propuesta y de la version seleccionbada. Si la propuesta es nueva se inicializan dichos valores
      if (idCotizacionVersionSeleccionada.idCotizacion > 0) {
        //========== Cuenta existente ========
        datosPropuestaVersion = inicializarDatos(jsonAll[0].data[0]);
      } else {
        //========  Cotizacion nueva ===============
        datosPropuestaVersion = inicializarDatos();
      }
      //console.log(datosPropuestaVersion);

      //Arma la matriz de cuentas
      matrizCuentasCotizacion = jsonAll[1].data.map((el) => ({
        id: el.idCuenta,
        nombre: el.nombreCuenta,
      }));
      //console.log(matrizCuentasCotizacion);

      //Arma la matriz de etapas de venta
      matrizEtapasVenta = jsonAll[2].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      //Arma la matriz de los estados de una cotizacion
      const matrizEstadosCotizacion = jsonAll[3].data.map((el) => ({
        id: el.idEstadoCotizacion,
        nombre: el.nombreEstadoCotizacion,
      }));

      //Arma la matriz de los usuarios
      const matrizUsuarios = jsonAll[4].data.map((el) => ({
        id: el.id_user,
        nombre: el.name,
        email: el.email,
        telefono: el.telefono,
      }));

      //La cotizacion usa 4 tablas en la base de datos de cotizaciones
      //En las tablas de propuestas y versiones se puede actualizar una fila o añadir una nueva.
      //En las tablas de secciones e items, sus filas pueden ser reemplazadas por otras (por cambio de posicion), o eliminadas
      //Cuando se actualicen estas tablas, primero deben desactivarse todas sus filas y luego activarlas, actualizandolas o creando las nuevas filas
      //Por este ultimo motivo, no se requiere descargar los numeros de secciones o de items, se deben crear en vivo cuando se descarguen o se creen (live)

      //Ordena las secciones. La primera seccion tienen un numero de seccion igual a 1
      const datosSecciones = [];
      jsonAll[5].data.map((seccion) => {
        datosSecciones.push({ datosSeccion: seccion });
      });
      //Hacer que la propiedad numeroSeccion de cada elemento del array datosSecciones se numere incrementalmente desde uno
      datosSecciones.forEach((seccion, index) => {
        seccion.datosSeccion.numeroSeccion = index + 1;
      });
      //console.log(datosSecciones);

      //Inserta los items dentro de cada seccion y los dispone como filas de una tabla, coloca los campos de id(fila), grupo y numeroSeccion en cada fila
      //WARNING Falta colocar la columna iva cuando se leen las filas
      const ivaLeido =
        datosPropuestaVersion.distribucionIVA ===
        constantes.DISTRIBUCION_IVA_POR_ITEM
          ? 16
          : 0;
      const listaFilas = [];
      datosSecciones.map((seccion, indiceSeccion) => {
        listaFilas.push(
          jsonAll[6].data
            .filter(
              (item) =>
                item.numeroSeccion === seccion.datosSeccion.numeroSeccion
            )
            .map((fila, indiceFila) => {
              let precioTotal = 0;
              let costoTotal = 0;
              if (Number(fila.perteneceFormula) < 1000) {
                costoTotal =
                  fila.precioListaItem *
                  (1 - fila.descuentoFabricante / 100) *
                  (1 + fila.importacion / 100) *
                  fila.cantidadItem;
                precioTotal =
                  (costoTotal / (1 - fila.margen / 100)) *
                  (1 - fila.descuentoFinal / 100) *
                  fila.tipoCambio * //tipocambio
                  (1 + ivaLeido / 100);
              }
              return {
                id: indiceFila + 1,
                grupo: Number(fila.perteneceFormula), //0 no forma parte de ningun grupo, 0 < n < 1000 es parte del grupo n, n > 1000 es el agregador del grupo (n-1000)
                fabricante: fila.idFabricante,
                codigoItem: fila.codigoItem,
                descripcion: fila.descripcionItem,
                cantidad: fila.cantidadItem,
                precioListaUnitario: fila.precioListaItem,
                descuentoFabricante: fila.descuentoFabricante,
                importacion: fila.importacion,
                costoTotal: costoTotal,
                margen: fila.margen,
                tipoCambio: datosPropuestaVersion.tipoCambio,
                descuentoFinal: fila.descuentoFinal,
                iva: ivaLeido,
                precioVentaTotal: precioTotal, //WARNING Se calcula en vez de leer fila.precioVentaTotal
                perteneceFormula: fila.perteneceFormula,
                filaResaltada: fila.filaResaltada,
                filaEscondida: fila.filaEscondida,
                filaSubtitulo: fila.filaSubtitulo,
                filaSinPrecio: fila.filaSinPrecio,
                numeroSeccion: indiceSeccion + 1,
                formula: fila.formula,
                status: fila.status,
                formulaPrecioTotal: 0, //WARNING Esto debe eliminarse. Es por compatibilidad con app anterior
              };
            })
        );
      });
      //console.log(listaFilas);

      //Hacer que los grupos inicien desde uno
      //Se identifica el numero de grupos leidos
      const numeroGruposLeidos = listaFilas.filter(
        (fila) => fila.grupo > 1000
      ).length;
      //console.log(numeroGruposLeidos);

      //Se ordenan los numeros de grupo para que sean secuencuales e inicien desde uno
      //Se crea un array de los grupos con dos campos: idLeido y idProcesado. Si los numeros de grupos están en secuencia creciente sin faltar ninguno, idLeido es igua a idProcesado
      let idGrupo = 0;
      const listaGruposLeidos = listaFilas
        .filter((fila) => fila.grupo > 1000)
        .map((fila) => {
          return {
            idLeido: fila.grupo,
            idProcesado: ++idGrupo,
          };
        });
      //console.log(listaGruposLeidos);

      //Si hay grupos leidos, se procede con el siguiente bloque
      if (numeroGruposLeidos > 0) {
        //WARNING --Debe revisarse
        //Si el tamaño del array listaGruposLeidos es igual al numero de grupos leidos, no se hace nada
        if (
          listaGruposLeidos[listaGruposLeidos.length - 1].idLeido ===
          numeroGruposLeidos + 1000
        ) {
          //console.log("no se hace nada");
        } else {
          //5. Si el tamaño del array listaGruposLeidos es menor al numero de grupos leidos, se ordena el array de grupos colocando en idProcesado el id de grupo que le corresponde en orden creciente.
          //console.log("se hace algo");
          //6. Se modifica el numero de cada grupo y de cada componente leido en el array filas por el idProcesado
          listaFilas.forEach((fila) => {
            listaGruposLeidos.forEach((grupo) => {
              if (fila.grupo === grupo.idLeido) {
                fila.grupo = grupo.idProcesado + 1000;
              }
              if (fila.grupo === grupo.idLeido - 1000) {
                fila.grupo = grupo.idProcesado;
              }
            });
          });
          //console.log(listaFilas);
        }
      }

      datosSecciones.forEach((seccion, index) => {
        seccion.filas = [...listaFilas[index]];
      });

      //Hacer que la propiedad numeroItems de cada elemento del array datosSecciones tenga el valor de la cantidad de elementos de cada propiedad items
      datosSecciones.forEach((seccion) => {
        seccion.datosSeccion.numeroItems = seccion.filas.length;
      });

      //console.log(datosSecciones);

      //Se une en dataCotizacion tanto los datos de propuesta y version como los de las secciones
      const dataCotizacion = {
        propuestaVersion: datosPropuestaVersion,
        secciones: datosSecciones,
      };
      //console.log(dataCotizacion);

      //Obtiene los contactos del cliente
      const cadBusqueda = `${constantes.PREFIJO_URL_API}/contactos/cuenta/${dataCotizacion.propuestaVersion.idCuentaOportunidad}`;
      //const cadBusqueda =
      //"http://peoplenode.digitalvs.com:3010/api/contactos/cuenta/" +
      //dataCotizacion.propuestaVersion.idCuentaOportunidad;
      console.log(cadBusqueda);
      const resContactosCuenta = await fetchWithTimeout(cadBusqueda);
      const jsonContactosCuenta = await resContactosCuenta.json();
      const matrizContactosCuenta = jsonContactosCuenta.data.map(
        (contacto) => ({
          id: contacto.idContacto,
          nombre: contacto.nombresApellidosContacto,
          email: contacto.emailContacto,
          telefono: contacto.movilContacto,
        })
      );
      //console.log(matrizContactosCuenta);

      //Arma la matriz de los tiempos de entrega de una cotizacion
      const matrizTiemposEntregaCotizacion = jsonAll[7].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      //Arma la matriz de la validez de una cotizacion
      const matrizValidezCotizacion = jsonAll[8].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      //Arma la matriz de la garantia de una cotizacion
      const matrizGarantiaCotizacion = jsonAll[9].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      //Arma la matriz de la forma de pago de una cotizacion
      const matrizFormaPagoCotizacion = jsonAll[10].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      //Arma la matriz de la moneda de una cotizacion
      const matrizMonedaCotizacion = jsonAll[11].data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
      }));

      datosDB.current = {
        datosCotizacion: dataCotizacion,
        matrizCuentasCotizacion,
        matrizEtapasVenta,
        matrizContactosCuenta,
        matrizEstadosCotizacion,
        matrizUsuarios,
        matrizTiemposEntregaCotizacion,
        matrizValidezCotizacion,
        matrizGarantiaCotizacion,
        matrizFormaPagoCotizacion,
        matrizMonedaCotizacion,
      };
      console.log(datosDB.current);

      setIdCotizacion(idCotizacionVersionSeleccionada.idCotizacion);
      setDatosBasicos(dataCotizacion.propuestaVersion);
      setDatosCotizacion(dataCotizacion.propuestaVersion);
      setSeccionesCotizacion(dataCotizacion.secciones);
      setIntroduccionCotizacion(
        dataCotizacion.propuestaVersion.introduccionCotizacion
      );
      setDatosComplementarios(dataCotizacion.propuestaVersion);
      setDatosCondicionesComerciales({
        tiempoEntrega: dataCotizacion.propuestaVersion.tiempoEntrega,
        validez: dataCotizacion.propuestaVersion.validez,
        garantia: dataCotizacion.propuestaVersion.garantia,
        formaPago: dataCotizacion.propuestaVersion.formaPago,
        moneda: dataCotizacion.propuestaVersion.moneda,
        tipoCambio: dataCotizacion.propuestaVersion.tipoCambio,
        notasCotizacion: dataCotizacion.propuestaVersion.notasCotizacion,
      });

      //************************************************************************************* */
      //Se actualizan los precios de venta de cada item de acuerdo al tipo de cambio seleccionado.
      //Hacer que todos los items que no sean agrupadores de todas las secciones tengan como tipo de cambio el valor descargado
      dataCotizacion.secciones.forEach((seccion) => {
        seccion.filas.forEach((fila) => {
          // Considera agrupadores los items cuyo grupo > 1000
          if (!(fila.grupo > 1000)) {
            fila.tipoCambio = dataCotizacion.propuestaVersion.tipoCambio;
          }
        });
      });
      console.log("prueba", dataCotizacion.secciones);

      //Sincronizar las filas y grupos de todas las secciones
      dataCotizacion.secciones.forEach((seccion) => {
        seccion.filas = sincronizarFilas(seccion.filas).listaFilasAMostrar;
      });
      //************************************************************************************* */

      setTotalesCotizacion(calcularTotalesCotizacion(dataCotizacion.secciones));
      setDatosFlujo(dataCotizacion.propuestaVersion);
      setDatosBottom(dataCotizacion.propuestaVersion);
      setDatosOpciones({
        matrizCuentasCotizacion,
        matrizEtapasVenta,
        matrizContactosCuenta,
        matrizEstadosCotizacion,
        matrizUsuarios,
        matrizTiemposEntregaCotizacion,
        matrizValidezCotizacion,
        matrizGarantiaCotizacion,
        matrizFormaPagoCotizacion,
        matrizMonedaCotizacion,
      });

      console.log("setear cot desde oportunidad");
      setCotizacionVersionDashboardLB(idCotizacionVersionSeleccionada);

      //Crear el directorio `P_${resultadoGrabacion.idCotizacion}` en el directorio /home/ubuntu/datos si no existe
      // Llama a una API backend para crear el directorio, ya que no se puede hacer desde el frontend

      /*try {
        const cadDirectorio = `${constantes.PREFIJO_URL_API}/cotizaciones/creardirectoriocotizacion/`;
        //const cadDirectorio = `http://peoplenode.digitalvs.com:3010/api/cotizaciones/creardirectoriocotizacion/`;
        await fetch(cadDirectorio, {
          //await fetchWithTimeout(cadDirectorio, {
          method: "POST",
          body: JSON.stringify({
            archivo: `P_${idCotizacionVersionSeleccionada.idCotizacion}`,
          }),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });
      } catch (error) {
        console.error("Error al crear el directorio:", error);
      }*/
      setOpenBackdrop(false);
    };
    setOpenBackdrop(true); // <-- Mostrar spinner
    obtenerDatosCotizacion();
  }, [idCotizacionVersionSeleccionada.idCotizacion, idCotizacionVersionSeleccionada.versionCotizacion]);

  return (
    <Box sx={{ width: 1 }}>
      {Object.keys(datosBasicos).length > 0 && (
        <DatosBasicos
          //handleAlert={handleAlert}
          //idCotizacionSeleccionada={1298}
          idCotizacionSeleccionada={idCotizacion}
          datosBasicos={datosBasicos}
          datosOpciones={datosOpciones}
          registrarDatos={registrarDatos}
          datosCotizacion={datosDB.current.datosCotizacion}
          //tipoError={errorDatoIngresado}
        />
      )}
      {idCotizacion > 0 && (
        <DatosCotizacion
          idCotizacionSeleccionada={idCotizacion}
          datosCotizacion={datosCotizacion}
          datosOpciones={datosOpciones}
          registrarDatos={registrarDatos}
          tipoError={errorDatoIngresado}
        />
      )}
      {idCotizacion > 0 && (
        <Cotizacion
          introduccion={introduccionCotizacion}
          seccionesString={JSON.stringify(seccionesCotizacion)}
          //secciones={seccionesCotizacion}
          registrarDatos={registrarDatos}
          datosBasicos={datosBasicos}
          datosOpciones={datosOpciones}
          totales={totalesCotizacion}
          registrarCotizacion={registrarCotizacion}
          filasCopiadas={filasCopiadas}
        ></Cotizacion>
      )}

      {idCotizacion > 0 && (
        <FileCotizacion cotizacion={idCotizacion}></FileCotizacion>
      )}

      {idCotizacion > 0 && (
        <DatosComplementarios
          totales={totalesCotizacion}
          datos={datosComplementarios}
          datosCondicionesComerciales={datosCondicionesComerciales}
          datosOpciones={datosOpciones}
          registrarDatos={registrarDatos}
        ></DatosComplementarios>
      )}
      {idCotizacion > 0 && (
        <FlujoAprobacion
          datos={datosFlujo}
          registrarDatos={registrarDatos}
        ></FlujoAprobacion>
      )}
      {idCotizacion > 0 && (
        //{Object.keys(datosBottom).length > 0 && (
        <DatosBottom
          datos={datosBottom}
          tipoRegistro="cotizacion"
          datosOpciones={datosOpciones}
        ></DatosBottom>
      )}
      <BackdropPantalla open={openBackdrop} texto={"Cargando..."} />
      {openVentanaOrdenesRecibidas && (
        <VentanaTabla
          openVentana={openVentanaOrdenesRecibidas}
          setOpenVentana={setOpenVentanaOrdenesRecibidas}
          tituloVentana={"Ordenes Recibidas"}
          filas={ordenesRecibidas}
          registrarDatos={registrarDatos}
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          datos={datosComplementarios}
          //onGrabar={handleGrabar}
          //onConfirmar={handleConfirmar}
          //onCancelar={handleCancelar}
        />
      )}
    </Box>
  );
});

export { CrearCotizacion };
