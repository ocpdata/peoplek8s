import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export function AppBarCodigos({ setOpenVentanaCodigos }) {
  console.log("funcion AppBarCodigos");

  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography>{"Productos"}</Typography>
          <div>
            <IconButton aria-label="delete">
              <CloseRoundedIcon
                onClick={() => setOpenVentanaCodigos(false)}
                sx={{ color: "red" }}
              ></CloseRoundedIcon>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
