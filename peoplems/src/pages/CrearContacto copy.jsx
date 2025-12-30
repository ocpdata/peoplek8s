import { useState, useEffect, useContext, useCallback } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { cloneDeep, uniqBy } from "lodash";
import { DatosBasicos } from "../components/contacto/DatosBasicos";
import { DatosBottom } from "../components/comun/DatosBottom";
import { MenuBottom } from "../components/comun/MenuBottom";
import { VentanaConfirmacion } from "../components/comun/VentanaConfirmacion";
import { grabarRegistro } from "../controllers/grabarOportunidad.js";
import * as permisos from "../config/permisos.js";
import { AuthContext } from "./Login";
import { RegistroContexto } from "../components/DashboardLayoutBasic";
import { BackdropPantalla } from "../components/comun/BackdropPantalla";

import * as constantes from "../config/constantes.js";

export function CrearContacto({
  idContactoSeleccionado,
  setIdContactoSeleccionado,
}) {
  const [idContacto, setIdContacto] = useState("");
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  const [datosDB, setDatosDB] = useState([]);
  const [openConfirmacion, setOpenConfirmacion] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [statusContacto, setStatusContacto] = useState(0);
  const { user } = useContext(AuthContext);
  const { setContactoDashboardLB } = useContext(RegistroContexto);

  console.log("funcion CrearContacto", idContactoSeleccionado);

  //==== Estados de los errores al momento de grabar
  const [errorDatoIngresado, setErrorDatoIngresado] = useState({
    nombresContacto: false,
    apellidosContacto: false,
    emailContacto: false,
  });

  function inicializarDatos(datosLeidos = {}, idContacto = 0) {
    console.log("inicializarDatos", datosLeidos, idContacto);
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
      idPropietarioContacto: user.id,
      saludoContacto: "",
      idSituacionLaboralContacto: 1,
      descripcionContacto: "",
      id: null,
      idCreadoPorContacto: user.id,
      idModificadoPorContacto: user.id,
      fechaCreacionContacto: dayjs().format("DD-MM-YYYY"),
      fechaModificacionContacto: dayjs().format("DD-MM-YYYY"),
      statusContacto: 2, //Pendiente de activar
    };
    if (Object.keys(datosLeidos).length > 0) {
      dayjs.extend(customParseFormat);
      datos.idContacto = datosLeidos.id_contacto_crm;
      datos.nombresContacto = datosLeidos.nombres;
      datos.apellidosContacto = datosLeidos.apellidos;
      datos.idCuentaContacto = datosLeidos.id_cuenta_crm;
      datos.cargoContacto = datosLeidos.cargo;
      datos.telefonoContacto = datosLeidos.telefono;
      datos.extensionContacto = datosLeidos.extension;
      datos.movilContacto = datosLeidos.movil;
      datos.emailContacto = datosLeidos.correo_electronico;
      datos.departamentoContacto = datosLeidos.departamento;
      datos.idPaisContacto = datosLeidos.id_pais;
      datos.estadoContacto = datosLeidos.estado;
      datos.ciudadContacto = datosLeidos.ciudad;
      datos.direccionContacto = datosLeidos.direccion;
      datos.codigoPostalContacto = datosLeidos.codigo_postal;
      datos.idInfluyeEnContacto = datosLeidos.id_influencia_crm;
      datos.idJefeContacto = datosLeidos.id_jefe_crm;
      datos.idParticipacionContacto = datosLeidos.id_participacion_crm;
      datos.idRelacionContacto = datosLeidos.id_relacion_crm;
      datos.idPropietarioContacto = datosLeidos.id_propietario_contacto_crm;
      datos.saludoContacto = datosLeidos.saludo;
      datos.idSituacionLaboralContacto = datosLeidos.id_estado_actual;
      datos.descripcionContacto = datosLeidos.descripcion;
      datos.id = null;
      datos.idCreadoPorContacto = datosLeidos.id_creado_por_crm;
      datos.idModificadoPorContacto = datosLeidos.id_modificado_por_crm;
      datos.fechaCreacionContacto = dayjs(
        datosLeidos.fecha_creacion,
        "DD-MM-YYYY"
      ).format("DD-MM-YYYY");
      datos.fechaModificacionContacto = dayjs(
        datosLeidos.fecha_modificacion,
        "DD-MM-YYYY"
      ).format("DD-MM-YYYY");
      datos.statusContacto = datosLeidos.status;
    }

    console.log(datos);
    return datos;
  }

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

  useEffect(() => {
    console.log("useEffect crearContacto");
    let datosContacto = {}; //Datos de la cuenta
    let matrizUsuariosActivos = []; //Lista de usuarios
    //let matrizTiposContacto = []; //Lista de tipos de cuenta
    //let matrizSectoresContacto = []; //Lista de sectores de cuenta
    let matrizPaisesContacto = []; //Lista de paises de cuenta
    let matrizParticipacionContacto = [];
    let matrizRelacionContacto = [];
    let matrizSituacionLaboralContacto = [];
    let matrizCuentasContacto = [];
    let matrizUsuarios = []; //Lista de usuarios
    let matrizTemporal = [];

    const obtenerDatosContacto = async () => {
      let cadContacto = `${constantes.PREFIJO_URL_API}/contactos/${idContactoSeleccionado}`;
      console.log(cadContacto);
      const resDatosContacto = fetch(cadContacto, constantes.HEADER_COOKIE);

      const resPaisesContacto = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/paises`,
        constantes.HEADER_COOKIE
      );

      const resParticipacionContacto = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/participacion`,
        constantes.HEADER_COOKIE
      );

      const resRelacionContacto = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/relacion`,
        constantes.HEADER_COOKIE
      );

      const resUsuariosActivos = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/usuariosactivos`,
        constantes.HEADER_COOKIE
      );

      const resUsuarios = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/usuarios`,
        constantes.HEADER_COOKIE
      );

      const resSituacionLaboralContacto = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/situacionlaboral`,
        constantes.HEADER_COOKIE
      );

      let cadCuentas = "";
      if (user?.permisos?.includes(permisos.ALCANCE__TODAS_LAS_CUENTAS)) {
        cadCuentas = `${constantes.PREFIJO_URL_API}/cuentas/`;
      } else {
        cadCuentas = `${constantes.PREFIJO_URL_API}/usuarios/${user.id}/cuentas/`;
      }
      const resCuentasContacto = fetch(cadCuentas, constantes.HEADER_COOKIE);

      //Ejecuta las peticiones simultaneas
      const resAll = await Promise.all([
        resDatosContacto,
        resPaisesContacto,
        resParticipacionContacto,
        resRelacionContacto,
        resUsuariosActivos,
        resSituacionLaboralContacto,
        resCuentasContacto,
        resUsuarios,
      ]);

      //Obtiene el json simultaneo de las 5 peticiones a las APIs,
      const resAllJson = resAll.map((el) => el.json());
      const jsonAll = await Promise.all(resAllJson);

      console.log(jsonAll);

      if (idContactoSeleccionado > 0) {
        //========== Cuenta existente ========
        datosContacto = inicializarDatos(
          jsonAll[0].data[0],
          idContactoSeleccionado
        );
      } else {
        //========  Cuenta nueva ===============
        datosContacto = inicializarDatos();
      }

      //Arma la matriz de paises de cuenta
      matrizPaisesContacto = jsonAll[1].data.map((el) => ({
        id: el.id_pais,
        nombre: el.nombre,
      }));
      console.log(matrizPaisesContacto);

      //Arma la matriz de participacion del contacto
      matrizParticipacionContacto = jsonAll[2].data.map((el) => ({
        id: el.id_participacion,
        nombre: el.nombre,
      }));
      console.log(matrizParticipacionContacto);

      //Arma la matriz de relacion con el contacto
      matrizRelacionContacto = jsonAll[3].data.map((el) => ({
        id: el.id_relacion,
        nombre: el.nombre,
      }));
      console.log(matrizRelacionContacto);

      //Arma la matriz de usuarios
      /*matrizUsuarios = jsonAll[4].map((el) => ({
        id: el.id_user,
        nombre: el.name,
      }));
      console.log(matrizUsuarios);*/
      matrizTemporal = jsonAll[4].data.filter(
        (usuario) => usuario.id_role === 3 || usuario.id_role === 24
      );
      console.log(matrizTemporal);
      matrizUsuariosActivos = uniqBy(matrizTemporal, "id");
      console.log(matrizUsuariosActivos);

      //Arma la matriz de situacion laboral
      matrizSituacionLaboralContacto = jsonAll[5].data.map((el) => ({
        id: el.id_estado_contacto,
        nombre: el.nombre,
      }));
      console.log(matrizSituacionLaboralContacto);

      //Arma la matriz de cuentas
      matrizCuentasContacto = jsonAll[6].data.map((el) => ({
        id: el.idCuenta,
        nombre: el.nombreCuenta,
      }));
      console.log(matrizCuentasContacto);

      //Arma la matriz de usuarios
      matrizUsuarios = jsonAll[7].data.map((el) => ({
        id: el.id_user,
        nombre: el.name,
      }));
      console.log(matrizUsuarios);

      setIdContacto(idContactoSeleccionado);

      setDatosDB({
        datosContacto,
        matrizPaisesContacto,
        matrizParticipacionContacto,
        matrizRelacionContacto,
        matrizUsuariosActivos,
        matrizSituacionLaboralContacto,
        matrizCuentasContacto,
        matrizUsuarios,
      });
      setStatusContacto(datosContacto.statusContacto);
      setContactoDashboardLB(idContactoSeleccionado);
      setOpenBackdrop(false);
    };
    setOpenBackdrop(true); // <-- Mostrar spinner
    obtenerDatosContacto();
  }, [idContactoSeleccionado]);

  //Registrar los datos ingresados en el formulario de DatosBasicos y en el ciclo de vida
  //Se ejecuta cuando se graban los datos de la oportunidad y se actualizan los datos de la oportunidad
  function registrarDatos(input, instancia) {
    console.log("registrarDatos", input, instancia);
    const datos = { ...datosDB };
    switch (instancia) {
      case "nombresContacto":
        datos.datosContacto.nombresContacto = input;
        break;
      case "apellidosContacto":
        datos.datosContacto.apellidosContacto = input;
        break;
      case "cuentaContacto":
        datos.datosContacto.idCuentaContacto = input;
        break;
      case "cargoContacto":
        datos.datosContacto.cargoContacto = input;
        break;
      case "telefonoContacto":
        datos.datosContacto.telefonoContacto = input;
        break;
      case "extensionContacto":
        datos.datosContacto.extensionContacto = input;
        break;
      case "movilContacto":
        datos.datosContacto.movilContacto = input;
        break;
      case "emailContacto":
        datos.datosContacto.emailContacto = input;
        break;
      case "departamentoContacto":
        datos.datosContacto.departamentoContacto = input;
        break;
      case "paisContacto":
        datos.datosContacto.idPaisContacto = input;
        break;
      case "estadoContacto":
        datos.datosContacto.estadoContacto = input;
        break;
      case "ciudadContacto":
        datos.datosContacto.ciudadContacto = input;
        break;
      case "direccionContacto":
        datos.datosContacto.direccionContacto = input;
        break;
      case "codigoPostalContacto":
        datos.datosContacto.codigoPostalContacto = input;
        break;
      case "influyeEnContacto":
        datos.datosContacto.idInfluyeEnContacto = input;
        break;
      case "jefeContacto":
        datos.datosContacto.idJefeContacto = input;
        break;
      case "participacionContacto":
        datos.datosContacto.idParticipacionContacto = input;
        break;
      case "relacionContacto":
        datos.datosContacto.idRelacionContacto = input;
        break;
      case "saludoContacto":
        datos.datosContacto.saludoContacto = input;
        break;
      case "propietarioContacto":
        datos.datosContacto.idPropietarioContacto = input;
        break;
      case "situacionLaboralContacto":
        datos.datosContacto.idSituacionLaboralContacto = input;
        break;
      case "descripcionContacto":
        datos.datosContacto.descripcionContacto = input;
        break;
      case "accionEstadoOportunidad":
        switch (input) {
          case "grabar":
            setOpenConfirmacion({
              open: true,
              titulo: "Confirmación",
              contenido: "Desea grabar los cambios en el contacto?",
              accion: input,
              onAceptar: () => {
                setOpenConfirmacion({ open: false });
                grabarContacto();
              },
              onCancelar: () => {
                console.log("Se canceló grabar cuenta");
                setOpenConfirmacion({ open: false });
              },
            });
            break;
        }
        break;
    }
    console.log(datos);
    setDatosDB(datos);
  }

  const registrarContacto = useCallback(async () => {
    console.log("funcion registrarContacto");
    let valido = true;
    const error = {
      nombresContacto: false,
      apellidosContacto: false,
      emailContacto: false,
    };

    //Obtiene los datos a grabar
    const datos = cloneDeep(datosDB);
    console.log(datos);

    if (datos.datosContacto.nombresContacto.length < 3) {
      error.nombresContacto = true;
      valido = false;
    }
    if (datos.datosContacto.apellidosContacto.length < 3) {
      error.apellidosContacto = true;
      valido = false;
    }
    if (datos.datosContacto.emailContacto.length < 3) {
      error.emailContacto = true;
      valido = false;
    }

    setErrorDatoIngresado(error);

    if (!valido) {
      console.log("error de parametros de cuenta");
      handleAlert(300);
    } else {
      //Si el usuario no tiene permiso de activar un nuevo contacto, el status del contacto es 2 (Pendiente)
      //Si el usuario tiene permiso de activar un nuevo contacto, el status del contacto es 1 (activo)
      if (
        user?.permisos?.includes(
          permisos.PERMISO__VENTAS_CRM_CONTACTOS_CREARSELECCIONAR_ACTIVAR
        )
      ) {
        datos.datosContacto.statusContacto = 1;
      } else {
        if (idContacto === 0) {
          datos.datosContacto.statusContacto = 2;
        }
      }

      const resultadoGrabacion = await grabarRegistro(
        datos,
        "contacto"
        //handleAlert
      );
      console.log("resultadoGrabacion", resultadoGrabacion);

      //Si la grabación se realizó correctamente, actualizar el id del registro en el formulario
      if (resultadoGrabacion.resultado) {
        actualizarIdContacto(
          resultadoGrabacion.idRegistro,
          resultadoGrabacion.statusRegistro
        );
      }
      return resultadoGrabacion.resultado;

      //grabarRegistro(datos, "contacto", handleAlert, actualizarIdContacto);
    }
  });

  /*//Regresa la etapa de la oportunidad
  function confimarAccion(accion) {
    console.log("funcion confimarAccion", accion);
    const datos = { ...datosDB };
    switch (accion) {
      case "cancelar":
        setOpenConfirmacion(false);
        break;

      case "grabar":
        setOpenConfirmacion(false);
        grabarContacto();
        break;
    }
  }*/

  //Actualiza el id de la oportunidad despues de haber sido grabada
  function actualizarIdContacto(idContacto, statusContactoDB) {
    console.log("funcion actualizarIdContacto", idContacto);
    const datos = { ...datosDB };
    datos.datosContacto.idContacto = idContacto;
    datos.datosContacto.statusContacto = statusContactoDB;
    setDatosDB(datos);
    setIdContacto(idContacto);
    setIdContactoSeleccionado(idContacto);
    setStatusContacto(datos.datosContacto.statusContacto);
    setContactoDashboardLB(idContacto);
  }

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
          idContactoSeleccionado={idContactoSeleccionado}
          datos={datosDB}
          registrarDatos={registrarDatos}
          error={errorDatoIngresado}
        />
      )}
      {Object.keys(datosDB).length > 0 && (
        <DatosBottom datos={datosDB} tipoRegistro="contacto"></DatosBottom>
      )}
      {Object.keys(datosDB).length > 0 && (
        <MenuBottom
          registrarRegistro={registrarContacto}
          registrarDatos={registrarDatos}
          idRegistro={idContacto}
          statusRegistro={statusContacto}
          //statusRegistro={datosDB.datosContacto.statusContacto}
          tipoRegistro="contacto"
        ></MenuBottom>
      )}
      {openConfirmacion.open && (
        <VentanaConfirmacion
          openConfirmacion={openConfirmacion.open}
          titulo={openConfirmacion.titulo}
          contenido={openConfirmacion.contenido}
          onAceptar={openConfirmacion.onAceptar}
          onCancelar={openConfirmacion.onCancelar}
          //ejecutarConfirmacion={confimarAccion}
          accion={openConfirmacion.accion}
        ></VentanaConfirmacion>
      )}
      <BackdropPantalla open={openBackdrop} texto={"Cargando..."} />
      {/*<Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
      >
        <Atom color="#3189cc" size="medium" text="Grabando..." textColor="" />
      </Backdrop>*/}
    </Box>
  );
}
