import { useEffect, useState, memo } from "react";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";

import { CampoSelect } from "../comun/CampoSelect";
import { CampoTexto } from "../comun/CampoTexto";

import * as constantes from "../../config/constantes.js";
import { VentanaBusqueda } from "../crm/VentanaBusqueda";
import { obtenerSeccionesCotizacion } from "./utils/obtenerSeccionesCotizacion.js";
import { useContext } from "react";
import { AuthContext } from "../../pages/Login";

const DatosCotizacion = memo(function DatosCotizacion({
  idCotizacionSeleccionada = 0,
  datosCotizacion = {},
  datosOpciones = {},
  //datosDB,
  registrarDatos = () => {},
  tipoError = false,
}) {
  const [idCotizacion, setIdCotizacion] = useState(idCotizacionSeleccionada); //Renderiza el id de la cotizacion cada vez que este cambia (cuando se graba una cotizacion nueva)
  const [datos, setDatos] = useState(datosCotizacion);
  const [openVentanaBusqueda, setOpenVentanaBusqueda] = useState(false); //Controla el display de la ventana de busqueda
  const { user } = useContext(AuthContext);

  console.log(
    "funcion DatosCotizacion",
    idCotizacionSeleccionada,
    datosCotizacion,
    datosOpciones
  );

  function handleClonarCotizacion() {
    //Cuando se desea clonar una cotizacion, se escoge desde la ventana de busqueda de cotizaciones, la cotizacion que se quiere clonar, se selecciona, y esta reemplazará a la propuesta con la que actualmente se está trabajando

    setOpenVentanaBusqueda(!openVentanaBusqueda);
  }

  function setOpenVentanaBusquedaAyuda() {
    setOpenVentanaBusqueda(!openVentanaBusqueda);
  }

  //Se obtiene la cotizacion seleccionada y se cierra la ventana de busqueda
  async function setOpenVentanaBusquedaConRegistro(idRegistro) {
    console.log("clonado:", idRegistro, datos);
    const datosClonados = await obtenerSeccionesCotizacion(
      idRegistro,
      datos,
      user.id
    );
    console.log("datosClonados", datosClonados);
    registrarDatos(datosClonados, "clonarCotizacion");
    setOpenVentanaBusqueda(!openVentanaBusqueda);
  }

  //Se renderiza el componente cada vez que se cambia la cuenta
  useEffect(() => {
    console.log("useEffect DatosCotizacion", idCotizacionSeleccionada);
    setDatos(datosCotizacion);
    setIdCotizacion(idCotizacionSeleccionada);
  }, [idCotizacionSeleccionada, datosCotizacion]);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: "lightblue",
        }}
      >
        <Typography component="span">Datos Cotización</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            rowSpacing={2}
          >
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="nombrePropuesta"
                texto={datosCotizacion.nombreOportunidad}
                registrarDatos={registrarDatos}
                etiqueta={"Nombre de la propuesta"}
                placeholder={"Nombre de la propuesta"}
                requerido={true}
                error={tipoError}
                //readOnly={idCuenta > 0 ? true : false}
              ></CampoTexto>
            </Grid>
            <Grid size={5}>
              <Grid container direction="row" justifyContent="space-between">
                <Grid size={5}>
                  <CampoTexto
                    nombreInstancia="numeroCotizacion"
                    texto={datosCotizacion.idCotizacion}
                    registrarDatos={registrarDatos}
                    etiqueta={"Id"}
                    idEtiqueta={"lbId"}
                    placeholder={"Número de la cotización"}
                    readOnly={true}
                  />
                </Grid>
                <Grid size={5}>
                  <CampoTexto
                    nombreInstancia="versionCotizacion"
                    texto={datosCotizacion.versionCotizacion}
                    registrarDatos={registrarDatos}
                    etiqueta={"Versión"}
                    idEtiqueta={"lbVersion"}
                    placeholder={"Versión de la cotización"}
                    readOnly={true}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <Grid container direction="row" justifyContent="space-between">
                <Grid size={5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      name={"fechaCotizacion"}
                      label="Fecha de la cotización"
                      //Se debe colocar la fecha de cierre en el formato normal y se indica que actualmente está en el formato DD-MM-YYYY
                      value={dayjs(
                        datosCotizacion.fechaCotizacion,
                        "DD-MM-YYYY"
                      )}
                      format="DD-MM-YYYY"
                      onChange={(fecha) => {
                        //La fecha se convierte a mdy para actualizarla
                        console.log(fecha);
                        //La fecha leida desde el componente viene en el formato normal y se coloca en el formato DD-MM-YYYY
                        registrarDatos(
                          dayjs(fecha).format("DD-MM-YYYY"),
                          "fechaCotizacion"
                        );
                      }}
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
                <Grid size={5}>
                  <CampoSelect
                    nombreInstancia="contactoImpresion"
                    idOptionSelected={datosCotizacion.idContactoCotizacion}
                    registrarDatos={registrarDatos}
                    etiqueta={"Cotizado a"}
                    idEtiqueta={"lbCotizadoA"}
                    options={datosOpciones.matrizContactosCuenta}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={5}>
              <Grid container direction="row" justifyContent="space-between">
                <Grid size={5}>
                  <CampoSelect
                    nombreInstancia="estadoCotizacion"
                    idOptionSelected={datosCotizacion.idEstadoCotizacion}
                    registrarDatos={registrarDatos}
                    etiqueta={"Estado cotización"}
                    idEtiqueta={"lbEstadoCotizacion"}
                    options={datosOpciones.matrizEstadosCotizacion}
                    readOnly={true}
                  />
                </Grid>
                <Grid size={5}>
                  <CampoSelect
                    nombreInstancia="vendedorCotizacion"
                    idOptionSelected={datosCotizacion.idVendedorCotizacion}
                    registrarDatos={registrarDatos}
                    etiqueta={"Vendedor"}
                    idEtiqueta={"lbVendedor"}
                    options={datosOpciones.matrizUsuarios}
                    readOnly={true}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/*==========================*/}
            <Grid size={12}>
              <Button variant="text" onClick={handleClonarCotizacion}>
                Clonar
              </Button>
              {/*<Button variant="text">Agregar</Button>*/}
            </Grid>
          </Grid>
          {openVentanaBusqueda ? (
            <VentanaBusqueda
              openVentanaBusqueda={openVentanaBusqueda}
              setOpenVentanaBusqueda={setOpenVentanaBusquedaAyuda}
              setOpenVentanaBusquedaConRegistro={
                setOpenVentanaBusquedaConRegistro
              }
              tipoRegistro={"cotizaciones"}
              ano={
                constantes.listaAnos.find(
                  (option) => option.id === constantes.idAnoActual
                )?.nombre
              }
            />
          ) : null}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

export default DatosCotizacion;
