import { useState, useContext } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import DoNotDisturbOutlinedIcon from "@mui/icons-material/DoNotDisturbOutlined";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import MoveUpOutlinedIcon from "@mui/icons-material/MoveUpOutlined";
import * as permisos from "../../config/permisos.js";
import { AuthContext } from "../..//pages//Login";

export const MenuBottom = ({
  registrarDatos,
  idRegistro = 0,
  statusRegistro = 0,
}) => {
  const [valorBottomNav, setValorBottomNav] = useState("Grabar");
  const { user } = useContext(AuthContext);
  console.log("funcion MenuBottom", idRegistro, statusRegistro);

  return (
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
        <BottomNavigationAction
          value="Grabar"
          label={() => {
            if (
              user?.permisos?.includes(
                permisos.PERMISO__VENTAS_CRM_CUENTAS_CREARSELECCIONAR_ACTIVAR
              )
            ) {
              if (idRegistro > 0) {
                switch (statusRegistro) {
                  case 1:
                    return "Grabar";
                    break;
                  case 2:
                    return "Activar";
                    break;
                }
              } else {
                return "Crear";
              }
            } else {
              if (idRegistro > 0) {
                switch (statusRegistro) {
                  case 1:
                    return "Grabar";
                    break;
                  case 2:
                    return "";
                    break;
                }
              } else {
                return "Crear";
              }
            }
          }}
          //label={idRegistro > 0 ? "Grabar" : "Activar"}
          icon={
            <SaveOutlinedIcon
              onClick={() =>
                registrarDatos("grabar", "accionEstadoOportunidad")
              }
            />
          }
        />
      </BottomNavigation>
    </Paper>
  );
};
