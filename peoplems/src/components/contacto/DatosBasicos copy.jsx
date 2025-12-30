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
import { CampoSelect } from "./CampoSelect";
import { CampoTexto } from "./CampoTexto";
import { grabarContacto } from "../../controllers/grabarContacto.js";
import { JefeSelect } from "./JefeSelect";
import { CuentaSelect } from "./CuentaSelect";
import { InfluyeEnSelect } from "./InfluyeEnSelect";

import * as constantes from "../../config/constantes.js";

//Retorna el objeto de datos de cuenta inicializado. No cambia con ningun rerender y es una funcion de utilidad. Por eso esta afuera del componente
function inicializarDatos() {
  const datos = {
    idContacto: 0,
    nombresContacto: "",
    apellidosContacto: "",
    idCuentaContacto: 0,
    cargoContacto: "",
    telefonoContacto: "",
    extensionContacto: "",
    movilContacto: "",
    emailContacto: "",
    departamentoContacto: "",
    idPaisContacto: 2,
    estadoContacto: "",
    ciudadContacto: "",
    direccionContacto: "",
    codigoPostalContacto: "",
    idInfluyeEnContacto: 0,
    idJefeContacto: 0,
    idParticipacionContacto: 1,
    idRelacionContacto: 1,
    idPropietarioContacto: 1,
    saludoContacto: "",
    idSituacionLaboralContacto: 1,
    descripcionContacto: "",
    id: null,
    idCreadoPorContacto: 1,
    idModificadoPorContacto: 1,
    fechaCreacionContacto: "",
    fechaModificacionContacto: "",
    statusContacto: 1,
  };
  console.log("inicializarDatos", datos);
  return datos;
}

export function DatosBasicos({ handleAlert, idContactoSeleccionado }) {
  console.log("DatosBasicos", idContactoSeleccionado);
  const [idContacto, setIdContacto] = useState(idContactoSeleccionado); //El valor recibido se displaya
  const [nombresContacto, setNombresContacto] = useState("");
  const [apellidosContacto, setApellidosContacto] = useState("");
  const [idCuentaContacto, setIdCuentaContacto] = useState(0); //Controla el cambio de la lista de Select Jefe e InfluyeEn de acuerdo a la cuenta seleccionada del contacto
  const [cargoContacto, setCargoContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [extensionContacto, setExtensionContacto] = useState("");
  const [movilContacto, setMovilContacto] = useState("");
  const [emailContacto, setEmailContacto] = useState("");
  const [departamentoContacto, setDepartamentoContacto] = useState("");
  const [idPaisContacto, setIdPaisContacto] = useState(2);
  const [estadoContacto, setEstadoContacto] = useState("");
  const [ciudadContacto, setCiudadContacto] = useState("");
  const [direccionContacto, setDireccionContacto] = useState("");
  const [codigoPostalContacto, setCodigoPostalContacto] = useState("");
  const [idInfluyeEnContacto, setIdInfluyeEnContacto] = useState(0);
  const [idJefeContacto, setIdJefeContacto] = useState(0);
  const [idParticipacionContacto, setIdParticipacionContacto] = useState(1);
  const [idRelacionContacto, setIdRelacionContacto] = useState(1);
  const [saludoContacto, setSaludoContacto] = useState(0);
  const [idPropietarioContacto, setIdPropietarioContacto] = useState(0);
  const [idSituacionLaboralContacto, setIdSituacionLaboralContacto] =
    useState(1);
  const [descripcionContacto, setDescripcionContacto] = useState("");

  //==== Estados de los errores al momento de grabar
  const [invalidoNombresContacto, setInvalidoNombresContacto] = useState(false);
  const [invalidoApellidosContacto, setInvalidoApellidosContacto] =
    useState(false);
  const [invalidoEmailContacto, setInvalidoEmailContacto] = useState(false);

  //Obtiene los datos almacenados en los setters
  function obtenerDatosIngresados() {
    const datos = {
      idContacto: idContacto,
      nombresContacto: nombresContacto,
      apellidosContacto: apellidosContacto,
      idCuentaContacto: idCuentaContacto,
      cargoContacto: cargoContacto,
      telefonoContacto: telefonoContacto,
      extensionContacto: extensionContacto,
      movilContacto: movilContacto,
      emailContacto: emailContacto,
      departamentoContacto: departamentoContacto,
      idPaisContacto: idPaisContacto,
      estadoContacto: estadoContacto,
      ciudadContacto: ciudadContacto,
      direccionContacto: direccionContacto,
      codigoPostalContacto: codigoPostalContacto,
      idInfluyeEnContacto: idInfluyeEnContacto,
      idJefeContacto: idJefeContacto,
      idParticipacionContacto: idParticipacionContacto,
      idRelacionContacto: idRelacionContacto,
      idPropietarioContacto: idPropietarioContacto,
      saludoContacto: saludoContacto,
      idSituacionLaboralContacto: idSituacionLaboralContacto,
      descripcionContacto: descripcionContacto,
      id: null,
      idCreadoPorContacto: 1,
      idModificadoPorContacto: 1,
      fechaCreacionContacto: "",
      fechaModificacionContacto: "",
      statusContacto: 1,
    };
    console.log(datos);
    return datos;
  }

  //Carga los datos de un contacto si ya esta creado. Se ejecuta cada vez que hay un id de contacto diferente
  useEffect(() => {
    console.log("useEffect DatosBasicos");
    let cadContacto = `${constantes.PREFIJO_URL_API}/contactos/${idContactoSeleccionado}`;
    //"http://peoplenode.digitalvs.com:3010/api/contactos/" +
    //idContactoSeleccionado;
    console.log(cadContacto);
    fetch(cadContacto, {})
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json.data);
        if (json.data.length > 0) {
          //========== Cuenta existente ========
          setIdContacto(idContactoSeleccionado);
          setNombresContacto(json.data[0].nombres);
          setApellidosContacto(json.data[0].apellidos);
          setIdCuentaContacto(json.data[0].id_cuenta_crm);
          setCargoContacto(json.data[0].cargo);
          setTelefonoContacto(json.data[0].telefono);
          setExtensionContacto(json.data[0].extension);
          setMovilContacto(json.data[0].movil);
          setEmailContacto(json.data[0].correo_electronico);
          setDepartamentoContacto(json.data[0].departamento);
          setIdPaisContacto(json.data[0].id_pais);
          setEstadoContacto(json.data[0].estado);
          setCiudadContacto(json.data[0].ciudad);
          setDireccionContacto(json.data[0].direccion);
          setCodigoPostalContacto(json.data[0].codigo_postal);
          setIdInfluyeEnContacto(json.data[0].id_influencia_crm);
          setIdJefeContacto(json.data[0].id_jefe_crm);
          setIdParticipacionContacto(json.data[0].id_participacion_crm);
          setIdRelacionContacto(json.data[0].id_relacion_crm);
          setSaludoContacto(json.data[0].saludo);
          setIdPropietarioContacto(json.data[0].id_propietario_contacto_crm);
          setIdSituacionLaboralContacto(json.data[0].id_estado_actual);
          setDescripcionContacto(json.data[0].descripcion);
        } else {
          //========  Cuenta nueva ===============
          const datosLeidos = inicializarDatos();
          setIdContacto(datosLeidos.idContacto);
          setNombresContacto(datosLeidos.nombresContacto);
          setApellidosContacto(datosLeidos.apellidosContacto);
          setIdCuentaContacto(datosLeidos.idCuentaContacto);
          setCargoContacto(datosLeidos.cargoContacto);
          setTelefonoContacto(datosLeidos.telefonoContacto);
          setExtensionContacto(datosLeidos.extensionContacto);
          setMovilContacto(datosLeidos.movilContacto);
          setEmailContacto(datosLeidos.emailContacto);
          setDepartamentoContacto(datosLeidos.departamentoContacto);
          setIdPaisContacto(datosLeidos.idPaisContacto);
          setEstadoContacto(datosLeidos.estadoContacto);
          setCiudadContacto(datosLeidos.ciudadContacto);
          setDireccionContacto(datosLeidos.direccionContacto);
          setCodigoPostalContacto(datosLeidos.codigoPostalContacto);
          setIdInfluyeEnContacto(datosLeidos.idInfluyeEnContacto);
          setIdJefeContacto(datosLeidos.idJefeContacto);
          setIdParticipacionContacto(datosLeidos.idParticipacionContacto);
          setIdRelacionContacto(datosLeidos.idRelacionContacto);
          setSaludoContacto(datosLeidos.saludoContacto);
          setIdPropietarioContacto(datosLeidos.idPropietarioContacto);
          setIdSituacionLaboralContacto(datosLeidos.idSituacionLaboralContacto);
          setDescripcionContacto(datosLeidos.descripcionContacto);
        }
      });
  }, [idContactoSeleccionado]);

  //======== Activa el contacto
  //Actualiza el id del contacto cuando se graba un nueva contacto. Sirve para rerenderizar
  function actualizarIdContacto(datos) {
    console.log("funcion actualizarIdContacto", datos);
    setIdContacto(datos.idContacto);
  }

  //Valida y graba el contacto
  function activarContacto() {
    console.log("funcion activarContacto");

    let valido = true;

    //Obtiene los datos a grabar
    const datosAGrabar = obtenerDatosIngresados();

    if (datosAGrabar.nombresContacto.length < 3) {
      valido = false;
      setInvalidoNombresContacto(true);
    } else {
      setInvalidoNombresContacto(false);
    }
    if (datosAGrabar.apellidosContacto.length < 3) {
      valido = false;
      setInvalidoApellidosContacto(true);
    } else {
      setInvalidoApellidosContacto(false);
    }
    if (datosAGrabar.emailContacto.length < 3) {
      valido = false;
      setInvalidoEmailContacto(true);
    } else {
      setInvalidoEmailContacto(false);
    }

    //Alerta si no se puede grabar o procede con la grabación
    if (!valido) {
      console.log("error de parametros de contacto al intentar grabar");
      handleAlert(300);
    } else {
      handleAlert(200);
      grabarContacto(datosAGrabar, handleAlert, actualizarIdContacto);
    }
  }

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
                campo="nombresContacto"
                valor={nombresContacto}
                setCampo={setNombresContacto}
                etiqueta={"Nombres"}
                placeholder={"Nombres"}
                requerido={true}
                error={invalidoNombresContacto}
              ></CampoTexto>
            </Grid>
            <Grid size={5}>
              <CampoTexto
                campo="apellidosContacto"
                valor={apellidosContacto}
                setCampo={setApellidosContacto}
                etiqueta={"Apellidos"}
                placeholder={"Apellidos"}
                requerido={true}
                error={invalidoApellidosContacto}
              ></CampoTexto>
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CuentaSelect
                valor={idCuentaContacto}
                setCampo={setIdCuentaContacto}
                etiqueta={"Cuenta"}
                idEtiqueta={"lbCuenta"}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                campo="cargoContacto"
                valor={cargoContacto}
                setCampo={setCargoContacto}
                etiqueta={"Cargo"}
                placeholder={"Cargo"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                campo="telefonoContacto"
                valor={telefonoContacto}
                setCampo={setTelefonoContacto}
                etiqueta={"Teléfono"}
                placeholder={"Teléfocno"}
                tipo="tel"
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                campo="extensionContacto"
                valor={extensionContacto}
                setCampo={setExtensionContacto}
                etiqueta={"Extensión"}
                placeholder={"Extensión"}
                tipo="tel"
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                campo="movilContacto"
                valor={movilContacto}
                setCampo={setMovilContacto}
                etiqueta={"Móvil"}
                placeholder={"Num. celular"}
                tipo="tel"
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                campo="emailContacto"
                valor={emailContacto}
                setCampo={setEmailContacto}
                etiqueta={"E-mail"}
                placeholder={"Correo electrónico"}
                requerido={true}
                error={invalidoEmailContacto}
                tipo="email"
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                campo="departamentoContacto"
                valor={departamentoContacto}
                setCampo={setDepartamentoContacto}
                etiqueta={"Departamento"}
                placeholder={"Area de trabajo"}
              />
            </Grid>
            <Grid size={5}>
              <CampoSelect
                campo="paisContacto"
                valor={idPaisContacto}
                setCampo={setIdPaisContacto}
                etiqueta={"País"}
                idEtiqueta={"lbPais"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                campo="estadoContacto"
                valor={estadoContacto}
                setCampo={setEstadoContacto}
                etiqueta={"Estado"}
                placeholder={"Estado del país"}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                campo="ciudadContacto"
                valor={ciudadContacto}
                setCampo={setCiudadContacto}
                etiqueta={"Ciudad"}
                placeholder={"Ciudad del estado"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                campo="direccionContacto"
                valor={direccionContacto}
                setCampo={setDireccionContacto}
                etiqueta={"Dirección"}
                placeholder={"Dirección"}
              />
            </Grid>
            <Grid size={5}>
              <CampoTexto
                campo="codigoPostalContacto"
                valor={codigoPostalContacto}
                setCampo={setCodigoPostalContacto}
                etiqueta={"Código Postal"}
                placeholder={"CP de la dirección"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <InfluyeEnSelect
                valor={idInfluyeEnContacto}
                setCampo={setIdInfluyeEnContacto}
                etiqueta={"Influye en"}
                idEtiqueta={"lbInfluyeEn"}
                idCuentaSeleccionada={idCuentaContacto}
              ></InfluyeEnSelect>
            </Grid>
            <Grid size={5}>
              <JefeSelect
                valor={idJefeContacto}
                setCampo={setIdJefeContacto}
                etiqueta={"Jefe"}
                idEtiqueta={"lbJefe"}
                idCuentaSeleccionada={idCuentaContacto}
              ></JefeSelect>
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoSelect
                campo="participacionContacto"
                valor={idParticipacionContacto}
                setCampo={setIdParticipacionContacto}
                etiqueta={"Participación"}
                idEtiqueta={"lbParticipacion"}
              />
            </Grid>
            <Grid size={5}>
              <CampoSelect
                campo="relacionContacto"
                valor={idRelacionContacto}
                setCampo={setIdRelacionContacto}
                etiqueta={"Relación"}
                idEtiqueta={"lbPRelacion"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <Grid container direction="row" justifyContent="space-between">
                <Grid size={5}>
                  <CampoTexto
                    campo="saludoContacto"
                    valor={saludoContacto}
                    setCampo={setSaludoContacto}
                    etiqueta={"Saludo"}
                    placeholder={"Saludo"}
                  />
                </Grid>
                <Grid size={5}>
                  <CampoSelect
                    campo="propietarioContacto"
                    valor={idPropietarioContacto}
                    setCampo={setIdPropietarioContacto}
                    etiqueta={"Propietario"}
                    placeholder={"Propietario"}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={5}>
              <CampoSelect
                campo="situacionLaboralContacto"
                valor={idSituacionLaboralContacto}
                setCampo={setIdSituacionLaboralContacto}
                etiqueta={"Situación laboral"}
                placeholder={"Situación laboral"}
              />
            </Grid>
            {/*==========================*/}
            <Grid size={5}>
              <CampoTexto
                campo="descripcionContacto"
                valor={descripcionContacto}
                setCampo={setDescripcionContacto}
                etiqueta={"Descripción"}
                placeholder={"Descripción"}
              />
            </Grid>
            <Grid size={5}>
              <Grid container direction="row" justifyContent="space-between">
                <Grid size={5}>
                  <CampoTexto
                    campo="idContacto"
                    //valor={idContacto}
                    valor={idContacto}
                    setCampo={setIdContacto}
                    etiqueta={"Id"}
                    placeholder={"Id"}
                    readonly={true}
                  />
                </Grid>
                <Grid size={5}>
                  <Button
                    variant="contained"
                    onClick={() => activarContacto(handleAlert)}
                  >
                    {idContacto > 0 ? "Grabar" : "Activar"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
