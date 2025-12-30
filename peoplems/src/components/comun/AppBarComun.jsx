import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export function AppBarComun({ setOpenVentana, tituloVentana }) {
  console.log("funcion AppBarComun");

  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography>{tituloVentana}</Typography>
          <div>
            <IconButton aria-label="delete">
              <CloseRoundedIcon
                onClick={() => setOpenVentana(false)}
                sx={{ color: "red" }}
              ></CloseRoundedIcon>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
