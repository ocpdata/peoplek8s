import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useState } from "react";
import numeral from "numeral";
import * as constantes from "../../config/constantes";
import { IconoLoader } from "../comun/IconoLoader";

const columnsCuentas = [
  { field: "idCuenta", headerName: "Id", flex: 0.4 },
  { field: "nombreCuenta", headerName: "Cuenta", flex: 2 },
  { field: "tipoCuenta", headerName: "Tipo", flex: 1 },
  { field: "sectorCuenta", headerName: "Sector", flex: 1 },
  { field: "propietarioCuenta", headerName: "Propietario", flex: 1 },
];

const columnsContactos = [
  { field: "idContacto", headerName: "Id", flex: 0.4 },
  { field: "nombresContacto", headerName: "Nombres", flex: 1.5 },
  { field: "apellidosContacto", headerName: "Apellidos", flex: 1.5 },
  { field: "emailContacto", headerName: "E-mail", flex: 1 },
  { field: "cuentaContacto", headerName: "Cuenta", flex: 2 },
  { field: "cargoContacto", headerName: "Cargo", flex: 1 },
  { field: "propietarioContacto", headerName: "Propietario", flex: 1 },
];

const columnsOportunidades = [
  { field: "idOportunidad", headerName: "Id", flex: 0.4 },
  { field: "nombreOportunidad", headerName: "Oportunidad", flex: 2 },
  { field: "etapaOportunidad", headerName: "Etapa", flex: 1 },
  { field: "cuentaOportunidad", headerName: "Cuenta", flex: 2 },
  { field: "anoCierreOportunidad", headerName: "Año cierre", flex: 1 },
  { field: "propietarioOportunidad", headerName: "Propietario", flex: 1 },
];

const columnsRegistrosFabricantes = [
  { field: "idRegistro", headerName: "Id", flex: 0.4 },
  { field: "cuentaRegistro", headerName: "Cuenta", flex: 2 },
  { field: "oportunidadRegistro", headerName: "Oportunidad", flex: 2 },
  { field: "fabricanteRegistro", headerName: "Fabricante", flex: 1 },
  { field: "vendedorRegistro", headerName: "Vendedor", flex: 1 },
  { field: "numeroRegistro", headerName: "Registro", flex: 1 },
  { field: "estadoRegistro", headerName: "Estado", flex: 1 },
  { field: "vencimientoRegistro", headerName: "Vencimiento", flex: 1 },
];

const columnasCotizaciones = [
  {
    field: "idCotizacion",
    headerName: "Id",
    flex: 0.5,
    renderHeader: (params) => <strong>{"Id "}</strong>,
  },
  {
    field: "versionCotizacion",
    headerName: "Versión",
    flex: 0.6,
    renderHeader: (params) => <strong>{"Versión "}</strong>,
  },
  {
    field: "cuentaOportunidad",
    //headerName: "Cuenta",
    flex: 2,
    //headerAlign: "center",
    renderHeader: (params) => <strong>{"Cuenta "}</strong>,
  },
  {
    field: "nombreOportunidad",
    //headerName: "Oportunidad",
    flex: 2,
    //headerAlign: "center",
    renderHeader: (params) => <strong>{"Oportunidad "}</strong>,
  },
  {
    field: "etapaOportunidad",
    headerName: "Etapa",
    flex: 1,
    //headerAlign: "center",
    renderHeader: (params) => <strong>{"Etapa "}</strong>,
  },
  {
    field: "importePropuesta",
    headerName: "Importe US$",
    flex: 1,
    type: "number",
    valueFormatter: (value) => {
      return numeral(value).format("0,0.00");
    },
    renderHeader: (params) => <strong>{"Importe US$ "}</strong>,
  },
  {
    field: "fechaCierreCotizacion",
    headerName: "Cierre",
    flex: 1,
    type: "date",
    renderHeader: (params) => <strong>{"Cierre "}</strong>,
  },
  {
    field: "estadoCotizacion",
    headerName: "Estado",
    flex: 1,
    //headerAlign: "center",
    renderHeader: (params) => <strong>{"Estado "}</strong>,
  },
];

export const GridBusqueda = ({
  list,
  tipoRegistro,
  setOpenVentanaBusquedaConRegistro,
}) => {
  console.log("GridBusqueda", tipoRegistro, list);

  const columnas =
    tipoRegistro === "cuentas"
      ? columnsCuentas
      : tipoRegistro === "contactos"
      ? columnsContactos
      : tipoRegistro === "oportunidades"
      ? columnsOportunidades
      : tipoRegistro === "registrosFabricantes"
      ? columnsRegistrosFabricantes
      : tipoRegistro === "cotizaciones"
      ? columnasCotizaciones
      : tipoRegistro === "cuentasPendientesAprobacion"
      ? columnsCuentas
      : tipoRegistro === "contactosPendientesAprobacion"
      ? columnsContactos
      : tipoRegistro === "oportunidadesPendientesAprobacion"
      ? columnsOportunidades
      : "";

  function editarRegistro() {}

  function obtenerRegistro(tipoRegistro, params) {
    switch (tipoRegistro) {
      case "cuentas":
        return params.row.idCuenta;
      case "contactos":
        return params.row.idContacto;
      case "oportunidades":
        return params.row.idOportunidad;
      case "registrosFabricantes":
        return params.row.idRegistro;
      case "cotizaciones":
        return {
          idCotizacion: params.row.idCotizacion,
          versionCotizacion: params.row.versionCotizacion,
        };
      case "cuentasPendientesAprobacion":
        return params.row.idCuenta;
      case "contactosPendientesAprobacion":
        return params.row.idContacto;
      case "oportunidadesPendientesAprobacion":
        return params.row.idOportunidad;
    }
  }

  return (
    <div style={{ height: "90%", width: "100%" }}>
      {list.length > 0 ? (
        <DataGrid
          rows={list}
          columns={columnas}
          onRowDoubleClick={(params, event, details) => {
            console.log(params);
            const idRegistro = obtenerRegistro(tipoRegistro, params);
            setOpenVentanaBusquedaConRegistro(idRegistro);
          }}
        />
      ) : (
        <Box sx={{ position: "absolute", top: "45%", left: "45%" }}>
          <IconoLoader texto={"Cargando..."} />
        </Box>
      )}
    </div>
  );
};
