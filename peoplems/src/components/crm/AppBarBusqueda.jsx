import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export function AppBarBusqueda({ tipoRegistro, setOpenVentanaBusqueda }) {
  console.log("AppBarBusqueda", tipoRegistro, setOpenVentanaBusqueda);

  //====== Define valores segun el tipo de registro ============
  const nombreBarra =
    tipoRegistro === "cuentas"
      ? "Cuentas"
      : tipoRegistro === "contactos"
      ? "Contactos"
      : tipoRegistro === "oportunidades"
      ? "Oportunidades"
      : tipoRegistro === "cotizaciones"
      ? "Cotizaciones"
      : "";

  return (
    <Box>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {nombreBarra}
          </Typography>
          <div>
            <IconButton aria-label="delete">
              <CloseRoundedIcon
                onClick={setOpenVentanaBusqueda}
                sx={{ color: "red" }}
              ></CloseRoundedIcon>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
