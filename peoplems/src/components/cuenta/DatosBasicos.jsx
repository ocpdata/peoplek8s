import { useEffect, useState } from "react";
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
import { CampoSelect } from "../comun/CampoSelect";
import { CampoTexto } from "../comun/CampoTexto";
/*import { CampoSelect } from "./CampoSelect";
import { CampoTexto } from "./CampoTexto";*/

import { CopropietarioSelect } from "./CopropietarioSelect";
//import { grabarCuenta } from "../../controllers/grabarCuenta.js";

//Retorna el objeto de datos de cuenta inicializado
/*function inicializarDatos() {
  const datos = {
    idCuenta: "",
    nombreCuenta: "",
    registroCuenta: "",
    idTipoCuenta: 4,
    telefonoCuenta: "",
    idSectorCuenta: 13,
    webCuenta: "",
    ciudadCuenta: "",
    estadoCuenta: "",
    idPropietarioCuenta: 1,
    copropietarioCuenta: [],
    idPaisCuenta: 2,
    direccionCuenta: "",
    descripcionCuenta: "",
    id: null,
    idCreadoPorCuenta: 1,
    idModificadoPorCuenta: 1,
    fechaCreacionCuenta: "",
    fechaModificacionCuenta: "",
    statusCuenta: 1,
  };
  console.log("inicializarDatos", datos);
  return datos;
}*/

export function DatosBasicos({
  handleAlert,
  idCuentaSeleccionada,
  datos,
  registrarDatos,
  tipoError,
}) {
  const [idCuenta, setIdCuenta] = useState(idCuentaSeleccionada); //Renderiza el id de la cuenta cada vez que este cambia (cuando se graba una cuenta nueva)

  console.log("funcion DatosBasicos", idCuentaSeleccionada, datos);

  //Se renderiza el componente cada vez que se cambia la cuenta
  useEffect(() => {
    console.log("DatosBasicos useEffect", idCuentaSeleccionada);
    setIdCuenta(idCuentaSeleccionada);
  }, [idCuentaSeleccionada]);

  /*//======== Activa la cuenta
  //Actualiza el id de la cuenta cuando se graba una nueva cuenta. Sirve para rerenderizar
  function actualizarIdCuenta(datos) {
    console.log("funcion actualizarIdCuenta", datos);
    setIdCuenta(datos.idCuenta);
  }*/

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
                nombreInstancia="nombreCuenta"
                texto={datos.datosCuenta.nombreCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Cuenta"}
                placeholder={"Cuenta"}
                requerido={true}
                error={tipoError}
                readOnly={idCuenta > 0 ? true : false}
              ></CampoTexto>
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="registroCuenta"
                texto={datos.datosCuenta.registroCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Registro"}
                placeholder={"RFC"}
              ></CampoTexto>
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="tipoCuenta"
                idOptionSelected={datos.datosCuenta.idTipoCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Tipo"}
                idEtiqueta={"lbTipo"}
                options={datos.matrizTiposCuenta}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="telefonoCuenta"
                texto={datos.datosCuenta.telefonoCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Teléfono"}
                placeholder={"Teléfono"}
                tipo="tel"
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="sectorCuenta"
                idOptionSelected={datos.datosCuenta.idSectorCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Sector"}
                placeholder={"lbSector"}
                options={datos.matrizSectoresCuenta}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="webCuenta"
                texto={datos.datosCuenta.webCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Web"}
                placeholder={"URL"}
                type="url"
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="ciudadCuenta"
                texto={datos.datosCuenta.ciudadCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Ciudad"}
                placeholder={"Ciudad"}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="estadoCuenta"
                texto={datos.datosCuenta.estadoCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Estado"}
                placeholder={"Estado"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="propietarioCuenta"
                idOptionSelected={datos.datosCuenta.idPropietarioCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Propietario"}
                idEtiqueta={"lbPropietario"}
                options={datos.matrizUsuariosActivos}
                readOnly={true}
              />
            </Grid>
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="paisCuenta"
                idOptionSelected={datos.datosCuenta.idPaisCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"País"}
                idEtiqueta={"lbPais"}
                options={datos.matrizPaisesCuenta}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CopropietarioSelect
                idOptionSelected={datos.datosCuenta.copropietarioCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Copropietario"}
                idEtiqueta={"lbCopropietario"}
                options={datos.matrizUsuariosActivos}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="descripcionCuenta"
                texto={datos.datosCuenta.descripcionCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Descripción de la cuenta"}
                placeholder={"Descripción"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="direccionCuenta"
                texto={datos.datosCuenta.direccionCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Dirección"}
                placeholder={"Dirección"}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="idCuenta"
                texto={datos.datosCuenta.idCuenta}
                registrarDatos={registrarDatos}
                etiqueta={"Id"}
                placeholder={"Id"}
                readOnly={true}
              />
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
