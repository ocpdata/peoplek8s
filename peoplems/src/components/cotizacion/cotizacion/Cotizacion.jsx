import { useEffect, useState, memo, useRef, useCallback } from "react";
import { Atom } from "react-loading-indicators";
import {
  IconButton,
  Stack,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";

import PostAddIcon from "@mui/icons-material/PostAdd";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import dayjs from "dayjs";

import { CampoSelect } from "../../comun/CampoSelect";
import { CampoTexto } from "../../comun/CampoTexto";

import TablaCotizacion from "./tablaCotizacion/TablaCotizacion";

import { VentanaConfirmacion } from "../../comun/VentanaConfirmacion";
import { VentanaImpresion } from "../impresion/VentanaImpresion";
import IntroduccionCotizacion from "./IntroduccionCotizacion";
import { Alerta } from "../../comun/Alerta";

const Cotizacion = memo(function Cotizacion({
  introduccion,
  seccionesString,
  registrarDatos,
  datosBasicos,
  datosOpciones,
  totales,
  registrarCotizacion,
  filasCopiadas,
}) {
  const [seccionesCotizacion, setSeccionesCotizacion] = useState([]);
  const [openVentanaImpresion, setOpenVentanaImpresion] = useState(false);
  const [openConfirmacion, setOpenConfirmacion] = useState({});
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  const [espera, setEspera] = useState(false);

  /**
   * Referencia mutable que almacena la altura de cada sección de la cotización.
   *
   * @const {React.MutableRefObject<Array<{ idSeccion: number|string, altura: number }>>} alturaSeccion
   *
   * @description
   * Utiliza `useRef` para mantener un arreglo de objetos, donde cada objeto representa la altura (en píxeles)
   * de una sección específica de la cotización, junto con su identificador único (`idSeccion`).
   * Este arreglo se utiliza, por ejemplo, para calcular el espacio ocupado por cada sección al imprimir la cotización.
   *
   * Ejemplo de estructura:
   * [
   *   { idSeccion: 1, altura: 120 },
   *   { idSeccion: 2, altura: 150 }
   * ]
   */
  const alturaSeccion = useRef([]);

  console.log("funcion Cotizacion", JSON.parse(seccionesString));

  function handleImpresionCotizacion() {
    console.log("funcion handleImpresionCotizacion", seccionesCotizacion);

    //registrarDatos(seccionesCotizacion, "impresionCotizacion");

    setOpenVentanaImpresion(true);
  }

  /**
   * Registra la altura de una sección específica en la cotización.
   *
   * @function registrarAlturaSeccion
   * @param {number|string} idSeccion - Identificador único de la sección cuya altura se va a registrar.
   * @param {number} alturaComponente - Altura del componente de la sección en píxeles.
   *
   * @description
   * Esta función agrega un objeto con el identificador de la sección y su altura (incluyendo un margen)
   * al arreglo de alturas de secciones (`alturaSeccion.current`). Es útil para calcular el espacio ocupado
   * por cada sección, por ejemplo, al imprimir la cotización.
   *
   * @example
   * registrarAlturaSeccion(2, 150);
   */
  const registrarAlturaSeccion = useCallback(
    function registrarAlturaSeccion(idSeccion, alturaComponente) {
      console.log(
        "funcion registrarAlturaSeccion",
        idSeccion,
        alturaComponente
      );

      const margen = 3;
      const altura = margen + alturaComponente + margen;

      //Añadir el objeto altura al hook alturaSeccion usando setAlturaSeccion
      alturaSeccion.current.push({ idSeccion, altura });
      console.log("altura", alturaSeccion.current);
    },
    [seccionesString]
  );

  function handleGrabarCotizacion() {
    console.log("funcion handleGrabarCotizacion");
    setOpenConfirmacion({
      open: true,
      titulo: "Grabar cotización",
      contenido: "¿Desea mantener la versión actual de la cotización?",
      accion: "GrabarCotizacion",
      onAceptar: () => {
        setOpenConfirmacion({ open: false });
        setEspera(true); // <-- Mostrar spinner
        (async () => {
          const result = await registrarCotizacion(
            "mantenerVersion",
            datosOpciones
          );
          setEspera(false); // <-- Ocultar spinner
          if (result) {
            setOpenAlert("success");
          } else {
            setOpenAlert("error");
          }
          setEspera(false);
        })();
      },
      onGrabarNuevaVersion: () => {
        setOpenConfirmacion({ open: false });
        setEspera(true); // <-- Mostrar spinner
        //Se debe enviar a grabar con el numero de version nuevo
        (async () => {
          const result = await registrarCotizacion(
            "mantenerVersion",
            datosOpciones
          );
          if (result) {
            setOpenAlert("success");
          } else {
            setOpenAlert("error");
          }
          setEspera(false);
        })();
      },
      onCancelar: () => {
        console.log("Confirmación cancelada para eliminar ítems");
        setOpenConfirmacion({ open: false });
      },
    });
  }

  function handleAdicionarSeccion() {
    const secciones = JSON.parse(seccionesString);
    const seccionesTemporales = [
      ...secciones,
      {
        datosSeccion: {
          idControlSeccion: 1,
          numeroItems: 0,
          numeroSeccion: secciones.length + 1,
          statusSeccion: 1,
          tituloSeccion: "",
        },
        filas: [],
      },
    ];
    setSeccionesCotizacion(seccionesTemporales);
    registrarDatos(seccionesTemporales, "adicionarSeccion");
  }

  useEffect(() => {
    const secciones = JSON.parse(seccionesString);
    setSeccionesCotizacion(secciones);
  }, [seccionesString]);

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          sx={{
            backgroundColor: "lightblue",
          }}
        >
          <Typography component="span">Cotización</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {openAlert != "sinAlerta" && (
            <Alerta openAlert={openAlert} setOpenAlert={setOpenAlert}></Alerta>
          )}
          <Box>
            <Stack direction="row" spacing={2}>
              <Tooltip title="Adicionar una sección">
                <IconButton>
                  <PlaylistAddIcon
                    fontSize="large"
                    color="primary"
                    onClick={handleAdicionarSeccion}
                  ></PlaylistAddIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Imprimir la cotización">
                <IconButton>
                  <PrintIcon
                    fontSize="large"
                    color="primary"
                    onClick={handleImpresionCotizacion}
                  ></PrintIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Grabar la cotización">
                <IconButton>
                  {
                    <SaveIcon
                      fontSize="large"
                      color="primary"
                      onClick={handleGrabarCotizacion}
                    ></SaveIcon>
                  }
                </IconButton>
              </Tooltip>
            </Stack>

            <IntroduccionCotizacion
              texto={introduccion}
              registrarDatos={registrarDatos}
            />

            {JSON.parse(seccionesString) &&
              JSON.parse(seccionesString).map((seccion) => (
                <TablaCotizacion
                  seccionString={JSON.stringify(seccion)}
                  registrarDatos={registrarDatos}
                  key={seccion.datosSeccion.numeroSeccion}
                  registrarAlturaSeccion={registrarAlturaSeccion}
                  filasCopiadas={filasCopiadas}
                  datosBasicos={datosBasicos}
                ></TablaCotizacion>
              ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      {openVentanaImpresion ? (
        <VentanaImpresion
          openVentanaImpresion={openVentanaImpresion}
          setOpenVentanaImpresion={setOpenVentanaImpresion}
          //secciones={seccionesCotizacion}
          secciones={JSON.parse(seccionesString)}
          datosBasicos={datosBasicos}
          datosOpciones={datosOpciones}
          totales={totales}
          altura={alturaSeccion.current}
        />
      ) : null}
      {openConfirmacion.open && (
        <VentanaConfirmacion
          openConfirmacion={openConfirmacion.open}
          titulo={openConfirmacion.titulo}
          contenido={openConfirmacion.contenido}
          accion={openConfirmacion.accion}
          onAceptar={openConfirmacion.onAceptar}
          onGrabarNuevaVersion={openConfirmacion.onGrabarNuevaVersion}
          onCancelar={openConfirmacion.onCancelar}
        ></VentanaConfirmacion>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={espera}
      >
        <Atom color="#3189cc" size="medium" text="Grabando..." textColor="" />
        {/*<CircularProgress color="inherit" />*/}
      </Backdrop>
    </>
  );
});

export default Cotizacion;
