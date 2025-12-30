import {
  DataGrid,
  GridToolbarContainer,
  useGridApiRef,
  GridEditInputCell,
} from "@mui/x-data-grid";
//import { GridEditInputCell } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Atom } from "react-loading-indicators";
import numeral from "numeral";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CustomToolbarVentanaTabla } from "./CustomToolbarVentanaTabla";
import { VentanaConfirmacion } from "../../comun/VentanaConfirmacion";

const columnsCuentas = [
  { field: "id", headerName: "Id", flex: 0.4 },
  {
    field: "numeroOrden",
    headerName: "Orden Cliente",
    flex: 1,
    editable: true,
  },
  {
    field: "importeMonedaBase",
    headerName: "Importe US$",
    flex: 1,
    type: "number",
    valueGetter: (value, row) => {
      console.log("value", value);
      console.log("row", row);
      if (row.tipoCambio !== 1 && row.tipoCambio !== 0) {
        return row.importeMonedaCambio / row.tipoCambio;
      }
      return row.importeMonedaBase;
    },
    valueFormatter: (value) => {
      return numeral(value).format("0,0.00");
    },
    renderEditCell: (params) => {
      if (params.row.tipoCambio !== 1) {
        // Solo lectura si tipoCambio !== 1
        return <span>{numeral(params.value).format("0,0.00")}</span>;
      }
      // Editor normal si tipoCambio === 1
      return <GridEditInputCell {...params} />;
    },
  },
  {
    field: "tipoCambio",
    headerName: "Tipo de cambio",
    flex: 0.5,
    type: "number",
    valueFormatter: (value) => {
      return numeral(value).format("0,0.00");
    },
  },
  {
    field: "importeMonedaCambio",
    headerName: "Importe MXN",
    flex: 1,
    editable: true,
    type: "number",
    valueFormatter: (value) => {
      return numeral(value).format("0,0.00");
    },
  },
  {
    field: "fechaRecibida",
    headerName: "Recepción",
    flex: 0.5,
    editable: true,
    type: "date",
    valueFormatter: (value) => {
      return value ? dayjs(value).format("DD-MM-YYYY") : "";
    },
    //valueGetter: (params) => (params.value ? new Date(params.value) : null),
  },
  {
    field: "fechaEntrega",
    headerName: "Entrega",
    flex: 0.5,
    editable: true,
    type: "date",
    valueFormatter: (value) => {
      return value ? dayjs(value).format("DD-MM-YYYY") : "";
    },
    //valueGetter: (params) => (params.value ? new Date(params.value) : null),
  },
  {
    field: "formaPago",
    headerName: "Forma de pago",
    flex: 0.5,
    editable: true,
  },
  { field: "garantia", headerName: "Garantía", flex: 0.5, editable: true },
  { field: "notas", headerName: "Notas", flex: 0.5, editable: true },
];

export function GridVentanaTabla({ filas, registrarDatos, datos }) {
  console.log("funcion GridVentanaTabla", filas);
  const [loading, setLoading] = useState(false);
  const [filasTabla, setFilasTabla] = useState(filas);
  const [openConfirmacion, setOpenConfirmacion] = useState({});
  const apiRef = useGridApiRef();

  function handleProcessRowUpdate(newRow, oldRow) {
    const listaFilas = [...filasTabla];

    //1. Dentro del array de filas actual, se identifica el indice de la fila que corresponde con el id de la fila modificada.
    let indiceFila = 0;
    listaFilas.forEach((fila, indice) => {
      if (fila.id === newRow.id) {
        indiceFila = indice;
      }
    });

    //2. Cambiar la fila anterior con la nueva
    listaFilas.splice(indiceFila, 1, newRow);
    console.log(listaFilas);

    registrarDatos(listaFilas, "actualizarFilasOrdenesRecibidas");

    return newRow;
  }

  function handleProcessRowUpdateError(params) {
    console.log(params);
  }

  useEffect(() => {
    setFilasTabla(filas);
  }, [JSON.stringify(filas)]);

  return (
    <div style={{ height: "90%", width: "100%" }}>
      <DataGrid
        rows={filasTabla}
        columns={columnsCuentas}
        loading={loading}
        //onCellDoubleClick={handleDoubleClickCelda}
        apiRef={apiRef}
        checkboxSelection
        disableRowSelectionOnClick
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        editMode="row"
        slots={{
          toolbar: CustomToolbarVentanaTabla,
        }}
        slotProps={{
          toolbar: {
            filas: filasTabla,
            registrarDatos,
            apiRef,
            setOpenConfirmacion,
            datos,
          },
          loadingOverlay: {
            variant: "circular-progress",
            noRowsVariant: "circular-progress",
          },
        }}
      />
      <VentanaConfirmacion
        openConfirmacion={openConfirmacion.open}
        titulo={openConfirmacion.titulo}
        contenido={openConfirmacion.contenido}
        //ejecutarConfirmacion={confimarAccion}
        //accion={openConfirmacion.accion}
        onAceptar={openConfirmacion.onAceptar}
        onCancelar={openConfirmacion.onCancelar}
      ></VentanaConfirmacion>
    </div>
  );
}
