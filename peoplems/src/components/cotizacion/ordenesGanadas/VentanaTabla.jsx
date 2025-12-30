import React from "react";
import { Box, Grid, Modal } from "@mui/material";
import { AppBarComun } from "../../comun/AppBarComun";
import { GridVentanaTabla } from "./GridVentanaTabla";
import { Alerta } from "../../comun/Alerta";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1,
  maxWidth: "lg",
  height: 1,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function VentanaTabla({
  openVentana,
  setOpenVentana,
  tituloVentana,
  filas,
  registrarDatos,
  openAlert,
  setOpenAlert,
  datos,
}) {
  console.log("funcion VentanaTabla");
  //const [openAlert, setOpenAlert] = useState("sinAlerta");

  return (
    <>
      <Modal open={openVentana}>
        <Box sx={style}>
          <AppBarComun
            setOpenVentana={setOpenVentana}
            tituloVentana={tituloVentana}
          ></AppBarComun>
          {openAlert != "sinAlerta" && (
            <Alerta openAlert={openAlert} setOpenAlert={setOpenAlert}></Alerta>
          )}
          <GridVentanaTabla
            filas={filas}
            registrarDatos={registrarDatos}
            datos={datos}
          ></GridVentanaTabla>
        </Box>
      </Modal>
    </>
  );
}
