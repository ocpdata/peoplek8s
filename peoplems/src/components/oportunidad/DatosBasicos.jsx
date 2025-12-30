import { useState, useEffect, useContext } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";
import { CampoSelect } from "../comun/CampoSelect";
import { CampoTexto } from "../comun/CampoTexto";
/*import { CampoSelect } from "./CampoSelect";
import { CampoTexto } from "./CampoTexto";*/
//import { grabarOportunidad } from "../../controllers/grabarOportunidad.js";
import { ContactoSelect } from "./ContactoSelect";
import { CuentaSelect } from "./CuentaSelect";
import { CopropietarioSelect } from "./CopropietarioSelect";

const materialUITextFieldProps = {
  id: "id_importe_oportunidad",
  label: "Importe US$",
  variant: "standard",
};

export function DatosBasicos({
  handleAlert,
  idOportunidadSeleccionada,
  datos,
  registrarDatos,
  tipoError,
}) {
  console.log("DatosBasicos", idOportunidadSeleccionada, datos);

  //===== Estados de los datos de la oportunidad
  //Tanto la oportunidad, como la cuenta modifican lo que se displaya
  const [idOportunidad, setIdOportunidad] = useState("");
  const [idCuentaOportunidad, setIdCuentaOportunidad] = useState("");

  //Se renderiza el componente cada vez que se cambia la cuenta o la oportunidad
  useEffect(() => {
    console.log("DatosBasicos useEffect", idOportunidadSeleccionada);
    setIdOportunidad(idOportunidadSeleccionada);
    setIdCuentaOportunidad(datos.matrizDatosOportunidad.idCuentaOportunidad);
  }, [
    idOportunidadSeleccionada,
    datos.matrizDatosOportunidad.idCuentaOportunidad,
  ]);

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
        <Typography component="span">Datos Básicos</Typography>
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
                nombreInstancia="nombreOportunidad"
                texto={datos.matrizDatosOportunidad.nombreOportunidad}
                registrarDatos={registrarDatos}
                etiqueta={"Oportunidad"}
                placeholder={"Oportunidad"}
                requerido={true}
                error={tipoError}
              ></CampoTexto>
            </Grid>
            <Grid size={5}>
              <NumericFormat
                value={datos.matrizDatosOportunidad.importeOportunidad}
                name="importeOportunidad"
                prefix="$"
                thousandSeparator
                customInput={TextField}
                fullWidth
                {...materialUITextFieldProps}
                onValueChange={(values, sourceInfo) => {
                  registrarDatos(values.floatValue, "importeOportunidad");
                }}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="cuentaOportunidad"
                idOptionSelected={idCuentaOportunidad}
                registrarDatos={registrarDatos}
                etiqueta={"Cuenta"}
                idEtiqueta={"lbCuenta"}
                readOnly={idOportunidad > 0 ? true : false}
                options={datos.matrizCuentasOportunidad}
              />
            </Grid>
            <Grid size={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  name={"fechaCierreOportunidad"}
                  label="Fecha de cierre"
                  //Se debe colocar la fecha de cierre en el formato normal y se indica que actualmente está en el formato DD-MM-YYYY
                  value={dayjs(
                    datos.matrizDatosOportunidad.fechaCierreOportunidad,
                    "DD-MM-YYYY"
                  )}
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
              <ContactoSelect
                idOptionSelected={
                  datos.matrizDatosOportunidad.idContactoOportunidad
                }
                registrarDatos={registrarDatos}
                etiqueta={"Contacto"}
                idEtiqueta={"lbContacto"}
                idCuentaSeleccionada={idCuentaOportunidad}
              ></ContactoSelect>
            </Grid>
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="etapaVentaOportunidad"
                idOptionSelected={
                  datos.matrizDatosOportunidad.idEtapaVentaOportunidad
                }
                registrarDatos={registrarDatos}
                etiqueta={"Eatapa de Venta"}
                idEtiqueta={"Etapa de Venta"}
                options={datos.matrizEtapasVenta}
                readOnly={true}
                //readOnly={idOportunidad > 0 ? true : false}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="lineaNegocioOportunidad"
                idOptionSelected={
                  datos.matrizDatosOportunidad.idLineaNegocioOportunidad
                }
                registrarDatos={registrarDatos}
                etiqueta={"Línea de negocio"}
                idEtiqueta={"lbLineaNegocio"}
                options={datos.matrizLineasNegocio}
              />
            </Grid>
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="etapaCompraOportunidad"
                idOptionSelected={
                  datos.matrizDatosOportunidad.idEtapaCompraOportunidad
                }
                registrarDatos={registrarDatos}
                etiqueta={"Eatapa de Compra"}
                idEtiqueta={"Etapa de Compra"}
                options={datos.matrizEtapasCompra}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <Grid container direction="row" justifyContent="space-between">
                <Grid size={5}>
                  <CampoSelect
                    nombreInstancia="propietarioOportunidad"
                    idOptionSelected={
                      datos.matrizDatosOportunidad.idPropietarioOportunidad
                    }
                    registrarDatos={registrarDatos}
                    etiqueta={"Propietario"}
                    idEtiqueta={"lbPropietario"}
                    options={datos.matrizUsuariosActivos}
                    readOnly={true}
                  />
                </Grid>
                <Grid size={5}>
                  <CopropietarioSelect
                    //campo="copropietarioOportunidad"
                    idOptionSelected={
                      datos.matrizDatosOportunidad.copropietarioOportunidad
                    }
                    registrarDatos={registrarDatos}
                    etiqueta={"CoPropietario"}
                    idEtiqueta={"lbCopropietario"}
                    idCuenta={datos.matrizDatosOportunidad.idCuentaOportunidad}
                    /*options={
                      datos.matrizUsuariosActivos
                        ? datos.matrizUsuariosActivos
                        : []
                    }*/
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="estadoOportunidad"
                idOptionSelected={
                  datos.matrizDatosOportunidad.idEstadoOportunidad
                }
                registrarDatos={registrarDatos}
                etiqueta={"Estado"}
                idEtiqueta={"lbEstado"}
                options={datos.matrizEstadoOportunidad}
                readOnly={true}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="preventaOportunidad"
                idOptionSelected={
                  datos.matrizDatosOportunidad.idPreventaOportunidad
                }
                registrarDatos={registrarDatos}
                etiqueta={"Preventa"}
                idEtiqueta={"lbPreventa"}
                options={datos.matrizUsuarios ? datos.matrizUsuarios : []}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="idOportunidad"
                texto={idOportunidad}
                registrarDatos={registrarDatos}
                etiqueta={"Id de oportunidad"}
                placeholder={"Id de oportunidad"}
                readonly={true}
              />
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
