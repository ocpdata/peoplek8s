import { useState, useEffect, useRef } from "react";
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
//import { grabarContacto } from "../../controllers/grabarContacto.js";
//import { grabarOportunidad } from "../../controllers/grabarOportunidad.js";
import { JefeSelect } from "./JefeSelect";
//import { CuentaSelect } from "./CuentaSelect";
import { InfluyeEnSelect } from "./InfluyeEnSelect";
//import { RegistroContexto } from "../DashboardLayoutBasic";

export function DatosBasicos({
  handleAlert,
  idContactoSeleccionado,
  datos,
  registrarDatos,
  tipoError,
}) {
  console.log("DatosBasicos", idContactoSeleccionado, datos);
  const [idContacto, setIdContacto] = useState(0); //El valor recibido se displaya
  const [idCuentaContacto, setIdCuentaContacto] = useState(0);
  //const { setCotizacionVersionDashboardLB } = useContext(RegistroContexto);

  //Carga los datos de un contacto si ya esta creado. Se ejecuta cada vez que hay un id de contacto diferente
  useEffect(() => {
    console.log("DatosBasicos useEffect", idContactoSeleccionado);
    setIdContacto(idContactoSeleccionado);
    setIdCuentaContacto(datos.datosContacto.idCuentaContacto);
  }, [idContactoSeleccionado, datos.datosContacto.idCuentaContacto]);

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
                nombreInstancia="nombresContacto"
                texto={datos.datosContacto.nombresContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Nombres"}
                placeholder={"Nombres"}
                requerido={true}
                error={tipoError}
              ></CampoTexto>
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="apellidosContacto"
                texto={datos.datosContacto.apellidosContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Apellidos"}
                placeholder={"Apellidos"}
                requerido={true}
                error={tipoError}
              ></CampoTexto>
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="cuentaContacto"
                idOptionSelected={datos.datosContacto.idCuentaContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Cuenta"}
                idEtiqueta={"lbCuenta"}
                options={datos.matrizCuentasContacto}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="cargoContacto"
                texto={datos.datosContacto.cargoContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Cargo"}
                placeholder={"Cargo"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="telefonoContacto"
                texto={datos.datosContacto.telefonoContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Teléfono"}
                placeholder={"Teléfocno"}
                tipo="tel"
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="extensionContacto"
                texto={datos.datosContacto.extensionContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Extensión"}
                placeholder={"Extensión"}
                tipo="tel"
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="movilContacto"
                texto={datos.datosContacto.movilContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Móvil"}
                placeholder={"Num. celular"}
                tipo="tel"
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="emailContacto"
                texto={datos.datosContacto.emailContacto}
                registrarDatos={registrarDatos}
                etiqueta={"E-mail"}
                placeholder={"Correo electrónico"}
                requerido={true}
                error={tipoError}
                tipo="email"
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="departamentoContacto"
                texto={datos.datosContacto.departamentoContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Departamento"}
                placeholder={"Area de trabajo"}
              />
            </Grid>
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="paisContacto"
                idOptionSelected={datos.datosContacto.idPaisContacto}
                registrarDatos={registrarDatos}
                etiqueta={"País"}
                idEtiqueta={"lbPais"}
                options={datos.matrizPaisesContacto}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="estadoContacto"
                texto={datos.datosContacto.estadoContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Estado"}
                placeholder={"Estado del país"}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="ciudadContacto"
                texto={datos.datosContacto.ciudadContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Ciudad"}
                placeholder={"Ciudad del estado"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="direccionContacto"
                texto={datos.datosContacto.direccionContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Dirección"}
                placeholder={"Dirección"}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="codigoPostalContacto"
                texto={datos.datosContacto.codigoPostalContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Código Postal"}
                placeholder={"CP de la dirección"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <InfluyeEnSelect
                idOptionSelected={datos.datosContacto.idInfluyeEnContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Influye en"}
                idEtiqueta={"lbInfluyeEn"}
                idCuentaSeleccionada={idCuentaContacto}
              ></InfluyeEnSelect>
            </Grid>
            <Grid size={5}>
              <JefeSelect
                idOptionSelected={datos.datosContacto.idJefeContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Jefe"}
                idEtiqueta={"lbJefe"}
                idCuentaSeleccionada={idCuentaContacto}
              ></JefeSelect>
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="participacionContacto"
                idOptionSelected={datos.datosContacto.idParticipacionContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Participación"}
                idEtiqueta={"lbParticipacion"}
                options={datos.matrizParticipacionContacto}
              />
            </Grid>
            <Grid size={5}>
              <CampoSelect
                nombreInstancia="relacionContacto"
                idOptionSelected={datos.datosContacto.idRelacionContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Relación"}
                idEtiqueta={"lbPRelacion"}
                options={datos.matrizRelacionContacto}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <Grid container direction="row" justifyContent="space-between">
                <Grid size={5}>
                  <CampoTexto
                    nombreInstancia="saludoContacto"
                    texto={datos.datosContacto.saludoContacto}
                    registrarDatos={registrarDatos}
                    etiqueta={"Saludo"}
                    placeholder={"Saludo"}
                  />
                </Grid>
                <Grid size={5}>
                  <CampoSelect
                    nombreInstancia="propietarioContacto"
                    idOptionSelected={datos.datosContacto.idPropietarioContacto}
                    registrarDatos={registrarDatos}
                    etiqueta={"Propietario"}
                    placeholder={"Propietario"}
                    options={datos.matrizUsuariosActivos}
                    readOnly={true}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={5}>
              <CampoSelect
                nombreInstancia="situacionLaboralContacto"
                idOptionSelected={
                  datos.datosContacto.idSituacionLaboralContacto
                }
                registrarDatos={registrarDatos}
                etiqueta={"Situación laboral"}
                placeholder={"Situación laboral"}
                options={datos.matrizSituacionLaboralContacto}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="descripcionContacto"
                texto={datos.datosContacto.descripcionContacto}
                registrarDatos={registrarDatos}
                etiqueta={"Descripción"}
                placeholder={"Descripción"}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                nombreInstancia="idContacto"
                texto={idContacto}
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
