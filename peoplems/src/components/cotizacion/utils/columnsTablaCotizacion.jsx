import numeral from "numeral";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { blue } from "@mui/material/colors";
import { EditTextarea } from "../impresion/EditTextarea";

export function getChipProps(params) {
  //console.log(params);
  if (params.row.grupo > 1000) {
    return {
      icon: (
        <IconButton>
          <GroupWorkIcon
            //onClick={() => handleExpandirGrupo(params.row)} //Cuando se quiera expandir o contraer el grupo
            style={{ fill: blue[500] }}
            fontSize={"small"}
          />
        </IconButton>
      ),
      label: params.value,
      style: {
        borderColor: blue[500],
      },
    };
  } else {
    return {
      icon: <KeyboardArrowRightIcon style={{ fill: blue[500] }} />,
      label: params.value,
      style: {
        borderColor: "white",
      },
    };
  }
}

// Puedes pasar listFilas y getChipProps como argumentos si lo necesitas
export function getColumnsTablaCotizacion(listFilas, datosBasicos) {
  return [
    { field: "id", headerName: "Id" },
    {
      field: "item",
      headerName: "Item",
      renderCell: (params) => {
        if (params.row.grupo > 0) {
          return (
            <Chip variant="outlined" size="small" {...getChipProps(params)} />
          );
        }
      },
    },
    { field: "fabricante", headerName: "Fabricante" },
    { field: "grupo", headerName: "Grupo" },
    {
      field: "codigoItem",
      headerName: "Código",
      colSpan: (value, row) => {
        //Si la fila tiene la opcion de subtitulo activado, este campo toma dos columnas. Si no es subtitulo, devuelve 1 (una columna)
        const fila = listFilas.find((fila) => fila.id === row.id);
        if (fila && fila.filaSubtitulo) {
          return 2;
        }
        return 1;
      },
      valueGetter: (value, row) => {
        const fila = listFilas.find((fila) => fila.id === row.id);
        if (fila && fila.filaSubtitulo) {
          return fila.descripcion;
        }
        return value;
      },
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      editable: true,
      type: "string",
      renderEditCell: (params) => <EditTextarea {...params} />,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      editable: true,
      type: "number",
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "precioListaUnitario",
      headerName: "Precio lista unitario",
      editable: true,
      type: "number",
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "descuentoFabricante",
      headerName: "Descuento del fabricante",
      type: "number",
      editable: true,
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "precioListaDescontado",
      headerName: "Precio lista descontado",
      type: "number",
      valueGetter: (value, row) => {
        return row.precioListaUnitario * (1 - row.descuentoFabricante / 100);
      },
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "importacion",
      headerName: "Importación",
      type: "number",
      editable: true,
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "costoUnitario",
      headerName: "Costo unitario",
      type: "number",
      valueGetter: (value, row) => {
        return (
          row.precioListaUnitario *
          (1 - row.descuentoFabricante / 100) *
          (1 + row.importacion / 100)
        );
      },
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "costoTotal",
      headerName: "Costo total",
      type: "number",
      valueGetter: (value, row) => {
        return (
          row.precioListaUnitario *
          (1 - row.descuentoFabricante / 100) *
          (1 + row.importacion / 100) *
          row.cantidad
        );
      },
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "margen",
      headerName: "Margen",
      type: "number",
      editable: true,
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "descuentoFinal",
      headerName: "Descuento final",
      type: "number",
      editable: true,
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "iva",
      headerName: "IVA",
      type: "number",
      editable: false,
      valueFormatter: (value) => {
        return numeral(value).format("0,0.00");
      },
    },
    {
      field: "precioVentaUnitario",
      headerName: "Precio venta unitario",
      type: "number",
      valueGetter: (value, row) => {
        return (
          ((row.precioListaUnitario *
            (1 - row.descuentoFabricante / 100) *
            (1 + row.importacion / 100)) /
            (1 - row.margen / 100)) *
          (1 - row.descuentoFinal / 100) *
          datosBasicos.tipoCambio *
          (1 + row.iva / 100)
        );
      },
      valueFormatter: (value, row) => {
        const fila = listFilas.find((fila) => fila.id === row.id);
        if (fila && fila.filaSinPrecio) {
          return "";
        } else return numeral(value).format("0,0.00");
      },
    },
    {
      field: "precioVentaTotal",
      headerName: "Precio venta total",
      type: "number",
      valueGetter: (value, row) => {
        if (row.grupo < 1000) {
          return (
            ((row.precioListaUnitario *
              (1 - row.descuentoFabricante / 100) *
              (1 + row.importacion / 100)) /
              (1 - row.margen / 100)) *
            (1 - row.descuentoFinal / 100) *
            datosBasicos.tipoCambio *
            (1 + row.iva / 100) *
            row.cantidad
          );
        } else {
          return value;
        }
      },
      valueFormatter: (value, row) => {
        const fila = listFilas.find((fila) => fila.id === row.id);
        if (fila && fila.filaSinPrecio) {
          return "";
        } else return numeral(value).format("0,0.00");
      },
    },
  ];
}
