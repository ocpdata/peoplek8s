import { useContext } from "react";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import * as permisos from "../../config/permisos.js";
import { AuthContext } from "../..//pages//Login";

export function BotonGrabarBottom({
  display,
  idRegistro,
  statusRegistro,
  handleGrabarRegistro,
}) {
  const { user } = useContext(AuthContext);
  console.log("funcion BotonGrabarBottom", display, idRegistro, statusRegistro);
  let permisoActivar = 0;

  display.cuenta
    ? (permisoActivar =
        permisos.PERMISO__VENTAS_CRM_CUENTAS_CREARSELECCIONAR_ACTIVAR)
    : display.contacto
    ? (permisoActivar =
        permisos.PERMISO__VENTAS_CRM_CONTACTOS_CREARSELECCIONAR_ACTIVAR)
    : display.oportunidad
    ? (permisoActivar =
        permisos.PERMISO__VENTAS_CRM_OPORTUNIDADES_CREARSELECCIONAR_ACTIVAR)
    : (permisoActivar =
        permisos.PERMISO__VENTAS_CRM_OPORTUNIDADES_CREARSELECCIONAR_ACTIVAR);

  console.log("permisoActivar", permisoActivar);

  return (
    <BottomNavigationAction
      value="Grabar"
      //Si se tiene permiso para activar, y el status es nuevo (0), mostrar "Activar"
      //Si el status es pendiente (2), mostrar "Activar"
      //Si el status es activo (1), mostrar "Grabar"
      //Si no se tiene permiso para activar, y el status es pendiente (2), no se muestra la etiqueta.
      //Si el status es nuevo (0) la etiqueta se "Crear"
      //Si el status es activo (1) la etiqueta es "Grabar"
      /*label={(() => {
        if (user?.permisos?.includes(permisoActivar)) {
          // Tiene permiso de activar
          console.log("tiene permiso de activar");
          if (statusRegistro === 0 || statusRegistro === 2) return "Activar";
          if (statusRegistro === 1) return "Grabar";
        } else {
          // No tiene permiso de activar
          console.log("no tiene permiso de activar");
          if (statusRegistro === 0) return "Crear";
          if (statusRegistro === 1) return "Grabar";
          if (statusRegistro === 2) return ""; // No mostrar etiqueta
        }
        return "hola"; // Valor por defecto si no coincide ningún caso
      })()}*/
      /*label={(() => {
        console.log("idRegistro:", idRegistro);
        console.log("statusRegistro:", statusRegistro);
        if (user?.permisos?.includes(permisoActivar)) {
          console.log("tiene permiso de activar");

          switch (statusRegistro) {
            case 0:
              return "Activar";
            case 1:
              return "Grabar";
            case 2:
              return "Activar";
          }
        } else {
          console.log("no tiene permiso de activar", statusRegistro);

          switch (statusRegistro) {
            case 0:
              console.log("Crear");
              return "Crear";
              break;
            case 1:
              return "Grabar";
              break;
            case 2:
              return "";
              break;
          }
        }
      })()}*/
      label={idRegistro > 0 ? "Grabar" : "Activar"}
      //Si se tiene permiso para activar se muestra el icono
      //Si no se tiene permiso para activar, y el status es pendiente (2), no se muestra el icono. Si el status es nuevo (0) o ya creado (1) se uestra el icono
      icon={(() => {
        if (!user?.permisos?.includes(permisoActivar)) {
          return <SaveOutlinedIcon onClick={() => handleGrabarRegistro()} />;
        } else {
          if (statusRegistro < 2) {
            return <SaveOutlinedIcon onClick={() => handleGrabarRegistro()} />;
          }
        }
      })()}
    />
  );
}
