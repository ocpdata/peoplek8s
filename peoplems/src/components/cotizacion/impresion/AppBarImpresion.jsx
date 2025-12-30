import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PrintIcon from "@mui/icons-material/Print";
import {
  APROBADA,
  ENVIADA,
  GANADA,
  ACEPTADA,
} from "../../../config/constantes.js";
import { Alerta } from "../../comun/Alerta";
import { useState } from "react";

export function AppBarImpresion({
  setOpenVentanaImpresion,
  reactToPrintFn,
  estadoCotizacion,
}) {
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  console.log("funcion AppBarImpresion");

  function imprimir() {
    console.log("funcion imprimir");
    if (
      estadoCotizacion === APROBADA ||
      estadoCotizacion === ENVIADA ||
      estadoCotizacion === GANADA ||
      estadoCotizacion === ACEPTADA
    ) {
      reactToPrintFn();
    } else {
      console.log("No está aprobada");
      setOpenAlert("error");
    }
  }

  return (
    <>
      {openAlert != "sinAlerta" && (
        <Alerta openAlert={openAlert} setOpenAlert={setOpenAlert}></Alerta>
      )}
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography>{"Impresión"}</Typography>
          <div>
            <IconButton aria-label="delete">
              <PrintIcon
                onClick={imprimir}
                //onClick={reactToPrintFn}
                sx={{ color: "white" }}
              ></PrintIcon>
            </IconButton>
            <IconButton aria-label="delete">
              <CloseRoundedIcon
                onClick={() => setOpenVentanaImpresion(false)}
                sx={{ color: "red" }}
              ></CloseRoundedIcon>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
