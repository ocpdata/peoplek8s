import { useEffect, useState, useContext } from "react";
import { Box, Grid, Modal } from "@mui/material";
import { AppBarBusqueda } from "./AppBarBusqueda";
import { GridBusqueda } from "./GridBusqueda";
import { AuthContext } from "../../pages/Login";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export function VentanaPendientes({
  openVentanaPendientes,
  setOpenVentanaPendientes,
  tipoRegistro,
  setOpenVentanaBusquedaConRegistro,
}) {
  return (
    <Modal open={openVentanaPendientes}>
      <Box sx={style}>
        <AppBarBusqueda
          setOpenVentanaBusqueda={setOpenVentanaBusqueda}
          tipoRegistro={tipoRegistro}
        />
        <GridBusqueda
          list={list}
          tipoRegistro={tipoRegistro}
          setOpenVentanaBusquedaConRegistro={setOpenVentanaBusquedaConRegistro}
        />
      </Box>
    </Modal>
  );
}
