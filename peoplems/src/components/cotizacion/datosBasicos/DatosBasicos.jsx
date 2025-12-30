import { useEffect, useState, memo, useContext } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NumericFormat } from "react-number-format";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";

import { CampoSelect } from "../../comun/CampoSelect";
import { CampoTexto } from "../../comun/CampoTexto";
import { BackdropPantalla } from "../../comun/BackdropPantalla";
import { Alerta } from "../../comun/Alerta";

import { grabarCotizacion } from "../../../controllers/grabarCotizacion.js";
import { RegistroContexto } from "../../DashboardLayoutBasic";

import { OportunidadSelect } from "./OportunidadSelect";
import { ContactoSelect } from "./ContactoSelect";

import * as constantes from "../../../config/constantes.js";

const materialUITextFieldProps = {
  id: "id_importe_oportunidad",
  label: "Importe US$",
  variant: "standard",
};

const DatosBasicos = memo(function DatosBasicos({
  //handleAlert,
  idCotizacionSeleccionada,
  datosBasicos,
  datosOpciones,
  registrarDatos,
  tipoError,
  datosCotizacion,
}) {
  const [idCotizacion, setIdCotizacion] = useState(idCotizacionSeleccionada); //Renderiza el id de la cotizacion cada vez que este cambia (cuando se graba una cotizacion nueva)
  const [datos, setDatos] = useState(datosBasicos);
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { setCotizacionVersionDashboardLB } = useContext(RegistroContexto);

  console.log(
    "funcion DatosBasicos",
    idCotizacionSeleccionada,
    datosBasicos,
    datosOpciones
  );

  const crearCotizacion = async () => {
    console.log("funcion crearCotizacion", datos);

    //Validar si los parametros ingresados permiten crear una cotizacion
    if (datos.idCuentaOportunidad === 0) {
      setOpenAlert("error");
      return;
    }
    if (datos.idOportunidadCotizacion === 0) {
      setOpenAlert("error");
      return;
    }

    //Crea la cotizacion
    setOpenBackdrop(true);
    const resultadoGrabacion = await grabarCotizacion(
      datosCotizacion,
      datosOpciones,
      //handleAlert,
      "nuevaCotizacion"
    );
    console.log(resultadoGrabacion);
    if (resultadoGrabacion.resultado) {
      registrarDatos(resultadoGrabacion.idCotizacion, "idCotizacionNueva");

      //Crear el directorio `P_${resultadoGrabacion.idCotizacion}` en el directorio /home/ubuntu/datos si no existe
      // Llama a una API backend para crear el directorio, ya que no se puede hacer desde el frontend
      try {
        const cadDirectorio = `${constantes.URL_FILE_MANAGER}crearFolder`;
        console.log(cadDirectorio);
        console.log(`P_${resultadoGrabacion.idCotizacion}`);
        await fetch(cadDirectorio, {
          method: "POST",
          body: JSON.stringify({
            rutaDirectorioNuevo: `P_${resultadoGrabacion.idCotizacion}/`,
          }),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });

        /*const cadDirectorio = `${constantes.PREFIJO_URL_API}/cotizaciones/creardirectoriocotizacion/`;
        //const cadDirectorio = `http://peoplenode.digitalvs.com:3010/api/cotizaciones/creardirectoriocotizacion/`;
        await fetch(cadDirectorio, {
          method: "POST",
          body: JSON.stringify({
            archivo: `P_${resultadoGrabacion.idCotizacion}`,
          }),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });*/
      } catch (error) {
        console.error("Error al crear el directorio:", error);
      }
      setCotizacionVersionDashboardLB({
        idCotizacion: resultadoGrabacion.idCotizacion,
        versionCotizacion: 1,
      });
      setOpenAlert("success");
      //handleAlert(200);
    } else {
      setOpenAlert("error");
      //handleAlert(500)
    }
    setOpenBackdrop(false);
  };

  /*function handleAlert(resultado) {
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
  }*/

  //Se renderiza el componente cada vez que se cambia la cotizacion o algun dato de la cotizacion
  useEffect(() => {
    console.log(
      "DatosBasicos useEffect",
      idCotizacionSeleccionada,
      datosBasicos
    );
    setDatos(datosBasicos);
    setIdCotizacion(idCotizacionSeleccionada);
  }, [idCotizacionSeleccionada, datosBasicos.idCuentaOportunidad, datosBasicos.idContactoOportunidad]);

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            backgroundColor: "lightblue",
          }}
        >
          <Typography component="span">Datos Oportunidad</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {openAlert != "sinAlerta" && (
            <Alerta openAlert={openAlert} setOpenAlert={setOpenAlert}></Alerta>
          )}
          <Box>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              rowSpacing={2}
            >
              {/*==========================*/}
              <Grid size={5}>
                <CampoSelect
                  nombreInstancia="cuentaCotizacion"
                  idOptionSelected={datos.idCuentaOportunidad}
                  registrarDatos={registrarDatos}
                  etiqueta={"Cuenta"}
                  idEtiqueta={"lbCuenta"}
                  options={datosOpciones.matrizCuentasCotizacion}
                  readOnly={idCotizacion > 0 ? true : false}
                />
              </Grid>
              <Grid size={5}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    name={"fechaCierreOportunidad"}
                    label="Fecha de cierre"
                    //Se debe colocar la fecha de cierre en el formato normal y se indica que actualmente está en el formato DD-MM-YYYY
                    value={dayjs(datos.fechaCierreOportunidad, "DD-MM-YYYY")}
                    format="DD-MM-YYYY"
                    onChange={(fecha) => {
                      //La fecha se convierte a mdy para actualizarla
                      console.log(fecha);
                      //La fecha leida desde el componente viene en el formato normal y se coloca en el formato DD-MM-YYYY
                      registrarDatos(
                        dayjs(fecha).format("DD-MM-YYYY"),
                        "fechaCierreOportunidad"
                      );
                    }}
                    readOnly={idCotizacion > 0 ? true : false}
                    slotProps={{
                      layout: {
                        sx: {
                          color: "#1565c0",
                          borderRadius: "1px",
                          borderWidth: "0px",
                          borderColor: "#2196f3",
                          border: "1px solid",
                          backgroundColor: "#ffffff",
                        },
                      },
                      textField: { fullWidth: true, variant: "standard" },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              {/*==========================*/}
              <Grid size={5}>
                <OportunidadSelect
                  nombreInstancia="oportunidadCotizacion"
                  idOptionSelected={datos.idOportunidadCotizacion}
                  registrarDatos={registrarDatos}
                  etiqueta={"Oportunidad"}
                  idEtiqueta={"lbOportunidad"}
                  idCuentaSeleccionada={datos.idCuentaOportunidad}
                  datosBasicos={datosBasicos}
                  readOnly={idCotizacion > 0 ? true : false}
                />
              </Grid>
              <Grid size={5}>
                <CampoSelect
                  nombreInstancia="etapaVentaCotizacion"
                  idOptionSelected={datos.idEtapaVentaOportunidad}
                  registrarDatos={registrarDatos}
                  etiqueta={"Etapa de Venta"}
                  idEtiqueta={"Etapa de Venta"}
                  options={datosOpciones.matrizEtapasVenta}
                  readOnly={true}
                  //readOnly={idCotizacion > 0 ? true : false}
                />
              </Grid>
              {/*==========================*/}
              <Grid size={5}>
                <ContactoSelect
                  nombreInstancia="contactoOportunidad"
                  idOptionSelected={datos.idContactoOportunidad}
                  registrarDatos={registrarDatos}
                  etiqueta={"Contacto"}
                  idEtiqueta={"lbContacto"}
                  idCuentaSeleccionada={datos.idCuentaOportunidad}
                  readOnly={true}
                  //readOnly={idCotizacion > 0 ? true : false}
                ></ContactoSelect>
              </Grid>
              <Grid size={5}>
                <Grid container direction="row" justifyContent="space-between">
                  <Grid size={5}>
                    <NumericFormat
                      value={datos.importeOportunidad}
                      name="importeOportunidad"
                      prefix="$"
                      thousandSeparator
                      customInput={TextField}
                      decimalScale={2}
                      fullWidth
                      {...materialUITextFieldProps}
                      onValueChange={(values, sourceInfo) => {
                        registrarDatos(values.floatValue, "importeOportunidad");
                      }}
                      readOnly={true}
                      //readOnly={idCotizacion > 0 ? true : false}
                    />
                  </Grid>
                  {idCotizacion === 0 && (
                    <Grid size={5}>
                      <Button variant="text" onClick={crearCotizacion}>
                        Crear cotización
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
      <BackdropPantalla open={openBackdrop} texto={"Creando..."} />
      {/*<Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <Atom color="blue" size="medium" text="Grabando..." textColor="" />
      </Backdrop>*/}
    </>
  );
});

export default DatosBasicos;
