import { useState, useEffect, useContext, useCallback } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { cloneDeep, uniqBy } from "lodash";
import { DatosBasicos } from "../components/cuenta/DatosBasicos";
import { ListaOportunidades } from "../components/cuenta/ListaOportunidades";
import { ListaContactos } from "../components/cuenta/ListaContactos";
import { DatosBottom } from "../components/comun/DatosBottom";
import { MenuBottom } from "../components/comun/MenuBottom";
import { VentanaConfirmacion } from "../components/comun/VentanaConfirmacion";
import { grabarRegistro } from "../controllers/grabarOportunidad.js";
import * as permisos from "../config/permisos.js";
import { AuthContext } from "./Login";
import { RegistroContexto } from "../components/DashboardLayoutBasic";
import { BackdropPantalla } from "../components/comun/BackdropPantalla";

import * as constantes from "../config/constantes.js";

export function CrearCuenta({ idCuentaSeleccionada, setIdCuentaSeleccionada }) {
  const [idCuenta, setIdCuenta] = useState("");
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  const [datosDB, setDatosDB] = useState([]);
  const [openConfirmacion, setOpenConfirmacion] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [statusCuenta, setStatusCuenta] = useState(0);
  const { user } = useContext(AuthContext);
  const { setCuentaDashboardLB } = useContext(RegistroContexto);

  //==== Estados de los errores al momento de grabar
  const [errorDatoIngresado, setErrorDatoIngresado] = useState(false);

  console.log("funcion CrearCuenta", idCuentaSeleccionada);

  function inicializarDatos(datosLeidos = {}, idOportunidad = 0) {
    console.log("inicializarDatos", datosLeidos, idOportunidad);
    const datos = {
      idCuenta: 0,
      nombreCuenta: "",
      registroCuenta: "",
      idTipoCuenta: 4,
      telefonoCuenta: "",
      idSectorCuenta: 13,
      webCuenta: "",
      ciudadCuenta: "",
      estadoCuenta: "",
      idPropietarioCuenta: user.id,
      idPaisCuenta: 2,
      copropietarioCuenta: [],
      descripcionCuenta: "",
      direccionCuenta: "",
      id: null,
      idCreadoPorCuenta: user.id,
      idModificadoPorCuenta: user.id,
      fechaCreacionCuenta: dayjs().format("DD-MM-YYYY"),
      fechaModificacionCuenta: dayjs().format("DD-MM-YYYY"),
      statusCuenta: 0, //Cuenta inactiva
    };
    if (Object.keys(datosLeidos).length > 0) {
      dayjs.extend(customParseFormat);
      datos.idCuenta = datosLeidos.id_cuenta_crm;
      datos.nombreCuenta = datosLeidos.nombre_cuenta;
      datos.registroCuenta = datosLeidos.registro;
      datos.idTipoCuenta = datosLeidos.id_tipo_cuenta;
      datos.telefonoCuenta = datosLeidos.telefono;
      datos.idSectorCuenta = datosLeidos.id_sector;
      datos.webCuenta = datosLeidos.web;
      datos.ciudadCuenta = datosLeidos.ciudad;
      datos.estadoCuenta = datosLeidos.estado;
      datos.idPropietarioCuenta = datosLeidos.id_propietario_crm;
      datos.idPaisCuenta = datosLeidos.id_pais;
      if (datosLeidos.lista_copropietarios == "") {
        datos.copropietarioCuenta = [];
      } else {
        datos.copropietarioCuenta = datosLeidos.lista_copropietarios
          .split(/,(?:\s*,)*/)
          .map(Number);
      }
      datos.descripcionCuenta = datosLeidos.descripcion;
      datos.direccionCuenta = datosLeidos.direccion;
      datos.id = null;
      datos.idCreadoPorCuenta = datosLeidos.id_creado_por_crm;
      datos.idModificadoPorCuenta = datosLeidos.id_modificado_por_crm;
      datos.fechaCreacionCuenta = dayjs(
        datosLeidos.fecha_de_creacion,
        "DD-MM-YYYY"
      ).format("DD-MM-YYYY");
      datos.fechaModificacionCuenta = dayjs(
        datosLeidos.fecha_de_modificacion,
        "DD-MM-YYYY"
      ).format("DD-MM-YYYY");
      datos.statusCuenta = datosLeidos.status;
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
    let datosCuenta = {}; //Datos de la cuenta
    let matrizUsuariosActivos = []; //Lista de usuarios
    let matrizTiposCuenta = []; //Lista de tipos de cuenta
    let matrizSectoresCuenta = []; //Lista de sectores de cuenta
    let matrizPaisesCuenta = []; //Lista de paises de cuenta
    let matrizUsuarios = []; //Lista de usuarios
    let matrizTemporal = [];

    const obtenerDatosCuenta = async () => {
      let cadCuenta = `${constantes.PREFIJO_URL_API}/cuentas/${idCuentaSeleccionada}`;
      console.log(cadCuenta);
      const resDatosCuenta = fetch(cadCuenta, constantes.HEADER_COOKIE);

      //Obtener usuarios
      const resUsuariosActivos = fetch(
        `${constantes.PREFIJO_URL_API}/usuarios/activos`,
        //`${constantes.PREFIJO_URL_API}/configuracion/usuariosactivos`,
        constantes.HEADER_COOKIE
      );

      const resUsuarios = fetch(
        `${constantes.PREFIJO_URL_API}/usuarios`,
        //`${constantes.PREFIJO_URL_API}/configuracion/usuarios`,
        constantes.HEADER_COOKIE
      );

      const resTiposCuenta = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/tipoCuenta`,
        constantes.HEADER_COOKIE
      );

      const resSectoresCuenta = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/sectorCuenta`,
        constantes.HEADER_COOKIE
      );

      const resPaisesCuenta = fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/paises`,
        constantes.HEADER_COOKIE
      );

      //Ejecuta las peticiones simultaneas
      const resAll = await Promise.all([
        resDatosCuenta,
        resUsuariosActivos,
        resTiposCuenta,
        resSectoresCuenta,
        resPaisesCuenta,
        resUsuarios,
      ]);

      //Obtiene el json simultaneo de las 5 peticiones a las APIs,
      const resAllJson = resAll.map((el) => el.json());
      const jsonAll = await Promise.all(resAllJson);

      console.log(jsonAll);

      if (idCuentaSeleccionada > 0) {
        //========== Cuenta existente ========
        datosCuenta = inicializarDatos(
          jsonAll[0].data[0],
          idCuentaSeleccionada
        );
      } else {
        //========  Cuenta nueva ===============
        datosCuenta = inicializarDatos();
      }

      //Arma la matriz de usuarios
      matrizTemporal = jsonAll[1].data.filter(
        (usuario) => usuario.id_role === 3 || usuario.id_role === 24
      );
      console.log(matrizTemporal);
      matrizUsuariosActivos = uniqBy(matrizTemporal, "id");
      console.log(matrizUsuariosActivos);

      //Arma la matriz de tipos de cuenta
      matrizTiposCuenta = jsonAll[2].data.map((el) => ({
        id: el.id_tipo_cuenta,
        nombre: el.nombre,
      }));
      console.log(matrizTiposCuenta);

      //Arma la matriz de sectores de cuenta
      matrizSectoresCuenta = jsonAll[3].data.map((el) => ({
        id: el.id_sector,
        nombre: el.nombre,
      }));
      console.log(matrizSectoresCuenta);

      //Arma la matriz de paises de cuenta
      matrizPaisesCuenta = jsonAll[4].data.map((el) => ({
        id: el.id_pais,
        nombre: el.nombre,
      }));
      console.log(matrizPaisesCuenta);

      //Arma la matriz de usuarios
      matrizUsuarios = jsonAll[5].data.map((el) => ({
        id: el.id_user,
        nombre: el.name,
      }));
      console.log(matrizUsuarios);

      setIdCuenta(idCuentaSeleccionada);

      setDatosDB({
        datosCuenta,
        matrizUsuarios,
        matrizTiposCuenta,
        matrizSectoresCuenta,
        matrizPaisesCuenta,
        matrizUsuariosActivos,
      });
      setStatusCuenta(datosCuenta.statusCuenta);
      setCuentaDashboardLB(idCuentaSeleccionada);
      setOpenBackdrop(false);
    };
    setOpenBackdrop(true); // <-- Mostrar spinner
    obtenerDatosCuenta();
  }, [idCuentaSeleccionada]);

  //Registrar los datos ingresados en el formulario de DatosBasicos y en el ciclo de vida
  //Se ejecuta cuando se graban los datos de la oportunidad y se actualizan los datos de la oportunidad
  function registrarDatos(input, instancia) {
    console.log("registrarDatos", input, instancia);
    const datos = { ...datosDB };
    switch (instancia) {
      case "nombreCuenta":
        datos.datosCuenta.nombreCuenta = input;
        break;
      case "importeOportunidad":
        datos.datosCuenta.importeOportunidad = input;
        break;
      case "registroCuenta":
        datos.datosCuenta.registroCuenta = input;
        break;
      case "tipoCuenta":
        datos.datosCuenta.idTipoCuenta = input;
        break;
      case "telefonoCuenta":
        datos.datosCuenta.telefonoCuenta = input;
        break;
      case "sectorCuenta":
        datos.datosCuenta.idSectorCuenta = input;
        break;
      case "webCuenta":
        datos.datosCuenta.webCuenta = input;
        break;
      case "ciudadCuenta":
        datos.datosCuenta.ciudadCuenta = input;
        break;
      case "estadoCuenta":
        datos.datosCuenta.estadoCuenta = input;
        break;
      case "copropietarioCuenta":
        datos.datosCuenta.copropietarioCuenta = input;
        break;
      case "estadoOportunidad":
        datos.datosCuenta.idEstadoCuenta = input;
        break;
      case "propietarioCuenta":
        datos.datosCuenta.idPropietarioCuenta = input;
        break;
      case "paisCuenta":
        datos.datosCuenta.idPaisCuenta = input;
        break;
      /*case "copropietarioCuenta":
        datos.datosCuenta.copropietarioCuenta = input;
        break;*/
      case "descripcionCuenta":
        datos.datosCuenta.descripcionCuenta = input;
        break;
      case "direccionCuenta":
        datos.datosCuenta.direccionCuenta = input;
        break;
      case "accionEstadoOportunidad":
        switch (input) {
          case "grabar":
            setOpenConfirmacion({
              open: true,
              titulo: "Confirmación",
              contenido: "Desea grabar los cambios en la cuenta?",
              accion: input,
              onAceptar: () => {
                setOpenConfirmacion({ open: false });
                grabarCuenta();
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

  const registrarCuenta = useCallback(async () => {
    console.log("funcion RegistrarCuenta");
    let valido = true;
    let preaccion; //Indica a grabarRegistro() si se creará o actualizará una cuenta
    /*Permiso	Activar		
      Status inicial	Label	    Status final	Preaccion	  Accion
      0 - Inactiva	  Activar	  1 - Activa	  Crear	      POST
      1 - Activa	    Grabar	  1 - Activa	  Grabar	    PUT
      2- Pendiente	  Activar	  1 - Activa	  Grabar	    PUT
				
      Permiso	No Activar	
      Status inicial	Label	    Status final	Preaccion	  Accion
      0 - Inactiva	  Crear	    2- Pendiente	Crear	      POST
      1 - Activa	    Grabar	  1 - Activa	  Grabar	    PUT
      2- Pendiente				*/

    const error = {
      nombreCuenta: false,
    };

    //Obtiene los datos a grabar
    const datos = cloneDeep(datosDB);
    console.log(datos);

    if (datos.datosCuenta.nombreCuenta.length < 3) {
      error.nombreCuenta = true;
      valido = false;
    }

    setErrorDatoIngresado(error);

    if (!valido) {
      console.log("error de parametros de cuenta");
      handleAlert(300);
      return false;
    } else {
      //Si el usuario no tiene permiso de activar una nueva cuenta, el status de la cuenta es 2 (Pendiente)
      //Si el usuario tiene permiso de activar una nueva cuenta, el status de la cuenta es 1 (activa)
      if (
        user?.permisos?.includes(
          permisos.PERMISO__VENTAS_CRM_CUENTAS_CREARSELECCIONAR_ACTIVAR
        )
      ) {
        switch (datos.datosCuenta.statusCuenta) {
          case 0:
            preaccion = "crear";
            break;
          case 1:
          case 2:
            preaccion = "actualizar";
            break;
        }
        datos.datosCuenta.statusCuenta = 1;
      } else {
        switch (datos.datosCuenta.statusCuenta) {
          case 0:
            preaccion = "crear";
            datos.datosCuenta.statusCuenta = 2;
            break;
          case 1:
            preaccion = "actualizar";
            datos.datosCuenta.statusCuenta = 1;
            break;
        }
      }
      const resultadoGrabacion = await grabarRegistro(
        datos,
        "cuenta",
        preaccion
      );
      console.log("resultadoGrabacion", resultadoGrabacion);

      //Si la grabación se realizó correctamente, actualizar el id del registro en el formulario
      if (resultadoGrabacion.resultado) {
        actualizarIdCuenta(
          resultadoGrabacion.idRegistro,
          resultadoGrabacion.statusRegistro
        );
      }
      return resultadoGrabacion.resultado;
    }
  });

  //Actualiza el id de la oportunidad despues de haber sido grabada
  function actualizarIdCuenta(idCuenta, statusCuentaDB) {
    console.log("funcion actualizarIdCuenta", idCuenta);
    const datos = { ...datosDB };
    datos.datosCuenta.idCuenta = idCuenta;
    datos.datosCuenta.statusCuenta = statusCuentaDB;
    console.log("actualizarIdCuenta datos", datos);
    setDatosDB(datos);
    setIdCuenta(idCuenta);
    setIdCuentaSeleccionada(idCuenta);
    setStatusCuenta(datos.datosCuenta.statusCuenta);
    setCuentaDashboardLB(idCuenta);
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
          idCuentaSeleccionada={idCuentaSeleccionada}
          datos={datosDB}
          registrarDatos={registrarDatos}
          error={errorDatoIngresado}
        />
      )}
      <ListaOportunidades
        idCuentaSeleccionada={idCuentaSeleccionada}
        permisos={user.permisos}
      />
      <ListaContactos idCuentaSeleccionada={idCuentaSeleccionada} />
      {Object.keys(datosDB).length > 0 && (
        <DatosBottom datos={datosDB} tipoRegistro="cuenta"></DatosBottom>
      )}
      {Object.keys(datosDB).length > 0 && (
        <MenuBottom
          registrarRegistro={registrarCuenta}
          registrarDatos={registrarDatos}
          idRegistro={idCuenta}
          statusRegistro={statusCuenta}
          tipoRegistro="cuenta"
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
