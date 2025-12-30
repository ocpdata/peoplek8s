import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  useGridApiRef,
  useGridApiContext,
  GridCellEditStopReasons,
} from "@mui/x-data-grid";

import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
//import Button from "@mui/material/Button";
//import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import SwipeUpAltIcon from "@mui/icons-material/SwipeUpAlt";
import SwipeDownAltIcon from "@mui/icons-material/SwipeDownAlt";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { useEffect, useState, useLayoutEffect, useCallback } from "react";
import numeral from "numeral";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import KeyboardOptionKeyIcon from "@mui/icons-material/KeyboardOptionKey";
import PanToolIcon from "@mui/icons-material/PanTool";
import DoNotTouchIcon from "@mui/icons-material/DoNotTouch";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Chip from "@mui/material/Chip";
import { purple, red, blue } from "@mui/material/colors";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import HighlightIcon from "@mui/icons-material/Highlight";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";

import InventoryIcon from "@mui/icons-material/Inventory";
import Grid from "@mui/material/Grid2";
import { ANCHO_PAGINA } from "../../../config/constantes.js";
//import { EditTextarea } from "../EditTextarea";
import { VentanaConfirmacion } from "../../comun/VentanaConfirmacion";
import { VentanaCodigos } from "../codigos/VentanaCodigos";
import { sincronizarFilas } from "../../../funciones/sincronizarFilas.js";
import { getColumnsTablaCotizacion } from "../utils/columnsTablaCotizacion";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .filaResaltada": {
    backgroundColor: "lightblue",
  },
  /*"& .MuiDataGrid-cell": {
    color: "gray",
    borderColor: "#292524",
  },*/
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderBottom: "0", // !important",
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: theme.palette.primary.main,
    //color: "#75706c",
  },
  "& .MuiDataGrid-cell": {
    whiteSpace: "normal", // Permite saltos de línea
    wordBreak: "break-word", // Rompe palabras largas
    lineHeight: "1.4",
    alignItems: "center",
    display: "flex",
  },
  /*"& .MuiDataGrid-scrollbarFiller": {
    borderBottom: "0 !important",
  },*/
}));

export function TablaCotizacionImpresion({
  seccion,
  //modoImpresion = false,
  //habilitarCheckBox = true,
  datosBasicos,
}) {
  console.log("funcion TablaCotizacionImpresion", seccion);
  const [listFilas, setListFilas] = useState([]);
  const [listGrupos, setListGrupos] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const columnsTablaCotizacion = getColumnsTablaCotizacion(
    listFilas,
    datosBasicos
  );

  const columnsReadOnly = columnsTablaCotizacion.map((col) => ({
    ...col,
    editable: false,
    sortable: false,
    disableColumnMenu: true,
  }));

  const columnsWithWidth = columnsReadOnly.map((col) => {
    switch (col.field) {
      case "item":
        return { ...col, flex: 1 };
      case "codigoItem":
        return { ...col, flex: 3 };
      case "descripcion":
        return { ...col, flex: 6 };
      case "cantidad":
        return { ...col, flex: 2 };
      case "precioVentaUnitario":
        return { ...col, flex: 4 };
      case "precioVentaTotal":
        return { ...col, flex: 5 };
      default:
        return { ...col, flex: 1 }; // ancho por defecto
    }
  });

  function CustomFooterStatusComponent(props) {
    //console.log("funcion CustomFooterStatusComponent", props);
    //Calcular la suma total de todos los items en listFilas menos el precio de venta de los agrupadores
    const costoTotal = listFilas.reduce((sum, fila) => {
      //console.log(fila);
      if (fila.grupo <= 1000) {
        //console.log(sum, fila.costoTotal);
        return sum + Number(fila.costoTotal);
      }
      //console.log(sum);
      return sum;
    }, 0);
    //console.log(costoTotal);
    const ventaTotal = listFilas.reduce((sum, fila) => {
      //console.log(fila);
      if (fila.grupo <= 1000) {
        //console.log(sum, fila.precioVentaTotal);
        return sum + Number(fila.precioVentaTotal);
      }
      //console.log(sum);
      return sum;
    }, 0);
    //console.log(ventaTotal);

    return (
      //<Box sx={{ p: 1, display: "flex" }}>
      <div>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          rowSpacing={2}
        >
          <Grid item xs={5}></Grid>

          <Grid item xs={5}>
            <Typography
              align="left"
              sx={{ color: "green", fontFamily: "Verdana", fontSize: "1rem" }}
            >
              Sub-Total: {numeral(ventaTotal).format("0,0.00")}
            </Typography>
          </Grid>
        </Grid>
      </div>
      //</Box>
    );

    //return <Box sx={{ p: 1, display: "flex" }}>Status {props.status}</Box>;
  }

  function CustomToolbar({ titulo = "" }) {
    console.log("funcion CustomToolbar", titulo);
    return (
      <GridToolbarContainer>
        <TextField
          name={"nombreInstancia"}
          //label={!modoImpresion ? "Título" : ""}
          value={titulo}
          error={false}
          type={"text"}
          variant="standard"
          placeholder={"Título"}
          required={false}
          sx={{ flexGrow: 1 }}
          inputProps={{ readOnly: true }}
        />
      </GridToolbarContainer>
    );
  }

  //Se ejecuta cada vez que hay una seccion
  useEffect(() => {
    //2. Se sincroniza la nueva lista de filas y grupos
    const filasAMostrar = sincronizarFilas(seccion.filas);

    setTotalItems(filasAMostrar.totalItems);
    setListFilas(filasAMostrar.listaFilasAMostrar);

    setListGrupos(filasAMostrar.listaGrupos);
  }, [seccion]);

  return (
    <div style={{ height: "90%", width: "100%" }}>
      {/*<div style={{ height: "90%", width: Number(ANCHO_PAGINA) }}>*/}
      {/*<div style={{ height: "90%", width: "100%" }}></div>*/}
      <StyledDataGrid
        rows={listFilas.filter((fila) => {
          return !fila.filaEscondida;
        })}
        //columns={columnsTablaCotizacion}
        columns={columnsWithWidth}
        //sx={{ my: 3, mx: 10 }}
        sx={{ my: 3, mx: 4, px: 4 }}
        //checkboxSelection={!modoImpresion}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              fabricante: false,
              grupo: false,
              precioListaUnitario: false,
              descuentoFabricante: false,
              precioListaDescontado: false,
              importacion: false,
              costoUnitario: false,
              costoTotal: false,
              margen: false,
              descuentoFinal: false,
              iva: false,
            },
          },
        }}
        getRowHeight={() => "auto"}
        getRowClassName={(params) => {
          return params.row.filaResaltada ? "filaResaltada" : "";
        }}
        slots={{
          toolbar: CustomToolbar,
          footer: CustomFooterStatusComponent,
        }}
        slotProps={{
          toolbar: {
            titulo: seccion.datosSeccion.tituloSeccion,
          },
          footer: { status: "hola" },
        }}
      />
    </div>
  );
}
