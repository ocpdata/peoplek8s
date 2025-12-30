import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export function AppBarCrearCodigo({ setOpenVentanaCrearCodigo }) {
  console.log("funcion AppBarCrearCodigo");

  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography>{"Crear un producto"}</Typography>
          <div>
            <IconButton aria-label="delete">
              <CloseRoundedIcon
                onClick={() => setOpenVentanaCrearCodigo(false)}
                sx={{ color: "red" }}
              ></CloseRoundedIcon>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
