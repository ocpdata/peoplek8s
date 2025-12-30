//Displaya el menu inferior de algunas pantallas
//Incluye opciones de grabar y otras dependiendo del tipo de registro al que corresponde la pantalla
//
import { useEffect, useState, useContext } from "react";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";

import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import DoNotDisturbOutlinedIcon from "@mui/icons-material/DoNotDisturbOutlined";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import MoveUpOutlinedIcon from "@mui/icons-material/MoveUpOutlined";
import CheckIcon from "@mui/icons-material/Check";

import * as permisos from "../../config/permisos.js";
import { AuthContext } from "../..//pages//Login";
import { Alerta } from "./Alerta";
import { VentanaConfirmacion } from "./VentanaConfirmacion";
import { BackdropPantalla } from "./BackdropPantalla";
import { BotonGrabarBottom } from "./BotonGrabarBottom";

export const MenuBottom = ({
  registrarRegistro,
  registrarDatos,
  idRegistro = 0,
  statusRegistro = 0,
  tipoRegistro,
}) => {
  const [valorBottomNav, setValorBottomNav] = useState("Grabar");
  const [display, setDisplay] = useState({
    cuenta: false,
    contacto: false,
    oportunidad: false,
  });
  const { user } = useContext(AuthContext);
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  const [openConfirmacion, setOpenConfirmacion] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [permisoActivar, setPermisoActivar] = useState(0);
  console.log("funcion MenuBottom", tipoRegistro, idRegistro, statusRegistro);

  //Determina que permiso se necesita para activar un tipo de registro (cuenta, contacto u oportunidad), cada vez que cambia el tipo de registro o su status
  useEffect(() => {
    let displayLocal = {
      cuenta: false,
      contacto: false,
      oportunidad: false,
    };

    switch (tipoRegistro) {
      case "cuenta":
        displayLocal.cuenta = true;
        break;
      case "contacto":
        displayLocal.contacto = true;
        break;
      case "oportunidad":
        if (statusRegistro === 1) {
          displayLocal.oportunidad = true;
        }
        break;
    }
    setDisplay(displayLocal);

    displayLocal.cuenta
      ? setPermisoActivar(
          permisos.PERMISO__VENTAS_CRM_CUENTAS_CREARSELECCIONAR_ACTIVAR
        )
      : displayLocal.contacto
      ? setPermisoActivar(
          permisos.PERMISO__VENTAS_CRM_CONTACTOS_CREARSELECCIONAR_ACTIVAR
        )
      : displayLocal.oportunidad
      ? setPermisoActivar(
          permisos.PERMISO__VENTAS_CRM_OPORTUNIDADES_CREARSELECCIONAR_ACTIVAR
        )
      : setPermisoActivar(
          permisos.PERMISO__VENTAS_CRM_OPORTUNIDADES_CREARSELECCIONAR_ACTIVAR
        );
  }, [tipoRegistro, statusRegistro]);

  function handleGrabarRegistro(tipoRegistro) {
    console.log("funcion handleGrabarRegistro");
    let accion = "";
    switch (tipoRegistro) {
      case "cuenta":
      case "contacto":
      case "oportunidad":
        accion = "grabarRegistro";
        break;
    }
    setOpenConfirmacion({
      open: true,
      titulo: "Confirmación",
      contenido: "Desea grabar los cambios?",

      accion: accion,
      onAceptar: () => {
        setOpenConfirmacion({ open: false });
        setOpenBackdrop(true); // <-- Mostrar spinner
        (async () => {
          const result = await registrarRegistro();
          setOpenBackdrop(false); // <-- Ocultar spinner
          if (result) {
            setOpenAlert("success");
          } else {
            setOpenAlert("error");
          }
        })();
      },
      onCancelar: () => {
        console.log("Se canceló la grabación del registro");
        setOpenConfirmacion({ open: false });
      },
    });
  }

  return (
    <>
      {openAlert != "sin Alerta" && (
        <Alerta openAlert={openAlert} setOpenAlert={setOpenAlert}></Alerta>
      )}
      <Paper
        sx={{
          //position: "fixed",
          bottom: 10,
          left: 0,
          right: 0,
        }}
        //sx={{ bottom: 20, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          sx={{ bgcolor: "lightblue" }}
          showLabels
          value={valorBottomNav}
          onChange={(event, newValue) => {
            setValorBottomNav(newValue);
          }}
        >
          {display.oportunidad && (
            <BottomNavigationAction
              value="Anular"
              label="Anular"
              icon={
                <DoNotDisturbOutlinedIcon
                  onClick={() =>
                    registrarDatos("anular", "accionEstadoOportunidad")
                  }
                />
              }
            />
          )}
          {display.oportunidad && (
            <BottomNavigationAction
              value="Perder"
              label="Perder"
              icon={
                <DoDisturbOnOutlinedIcon
                  onClick={() =>
                    registrarDatos("perder", "accionEstadoOportunidad")
                  }
                />
              }
            />
          )}
          {display.oportunidad && (
            <BottomNavigationAction
              value="Saltar"
              label="Saltar Etapa"
              icon={
                <MoveUpOutlinedIcon
                  onClick={() =>
                    registrarDatos("saltar", "accionEstadoOportunidad")
                  }
                />
              }
            />
          )}
          {display.oportunidad && (
            <BottomNavigationAction
              value="Regresar"
              label="Regresar Etapa"
              icon={
                <SettingsBackupRestoreIcon
                  onClick={() =>
                    registrarDatos("retroceder", "accionEstadoOportunidad")
                  }
                />
              }
            />
          )}
          {display.oportunidad && (
            <BottomNavigationAction
              value="Validar"
              label="Validar Etapa"
              icon={
                <ArrowForwardOutlinedIcon
                  onClick={() =>
                    registrarDatos("validar", "accionEstadoOportunidad")
                  }
                />
              }
            />
          )}

          <BottomNavigationAction
            value="Grabar"
            label={(() => {
              if (user?.permisos?.includes(permisoActivar)) {
                // Tiene permiso de activar
                console.log("tiene permiso de activar");
                if (statusRegistro === 0 || statusRegistro === 2)
                  return "Activar";
                if (statusRegistro === 1) return "Grabar";
              } else {
                // No tiene permiso de activar
                console.log("no tiene permiso de activar");
                if (statusRegistro === 0) return "Crear";
                if (statusRegistro === 1) return "Grabar";
                if (statusRegistro === 2) return ""; // No mostrar etiqueta
              }
              return "hola"; // Valor por defecto si no coincide ningún caso
            })()}
            icon={(() => {
              if (user?.permisos?.includes(permisoActivar)) {
                return (
                  <SaveOutlinedIcon
                    onClick={() => handleGrabarRegistro(tipoRegistro)}
                  />
                );
              } else {
                if (statusRegistro < 2) {
                  return (
                    <SaveOutlinedIcon
                      onClick={() => handleGrabarRegistro(tipoRegistro)}
                    />
                  );
                }
              }
            })()}
          />
        </BottomNavigation>
      </Paper>
      <VentanaConfirmacion
        openConfirmacion={openConfirmacion.open}
        titulo={openConfirmacion.titulo}
        contenido={openConfirmacion.contenido}
        onAceptar={openConfirmacion.onAceptar}
        onCancelar={openConfirmacion.onCancelar}
        //ejecutarConfirmacion={confimarAccion}
        accion={openConfirmacion.accion}
      ></VentanaConfirmacion>
      <BackdropPantalla open={openBackdrop} texto={"Grabando..."} />
    </>
  );
};
