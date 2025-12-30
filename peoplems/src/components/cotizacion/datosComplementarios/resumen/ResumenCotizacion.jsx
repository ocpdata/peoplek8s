import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
} from "@mui/material";
import { useEffect, useState, memo } from "react";
import numeral from "numeral";
import { FieldSet } from "./FieldSet";
import * as constantes from "../../../../config/constantes.js";

const ResumenCotizacion = memo(function ResumenCotizacion({
  totales,
  datos,
  registrarDatos,
}) {
  console.log("funcion ResumenCotizacion", totales, datos);
  const [tablaResumen, setTablaResumen] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [totalDescontado, setTotalDescontado] = useState(0);
  const [IVA, setIVA] = useState(0);
  const [totalIVAIncluido, setTotalIVAIncluido] = useState(0);
  const [margenFinal, setMargenFinal] = useState(0);

  useEffect(() => {
    let tabla = [];
    let factorIVA = 0;

    if (datos.distribucionIVA === constantes.DISTRIBUCION_IVA_POR_ITEM) {
      factorIVA = 16 / 100;
    } else {
      factorIVA = 0;
    }
    tabla.push({
      nombre: "Productos",
      costo: numeral(totales.costoTotalProductos).format("0,0.00"),
      venta: numeral(totales.precioVentaTotalProductos).format("0,0.00"),
      margen: numeral(
        (1 -
          totales.costoTotalProductos /
            (totales.precioVentaTotalProductos /
              datos.tipoCambio /
              (1 + factorIVA))) *
          100
      ).format("0,0.00"),
    });
    tabla.push({
      nombre: "Servicios",
      costo: numeral(totales.costoTotalServicios).format("0,0.00"),
      venta: numeral(totales.precioVentaTotalServicios).format("0,0.00"),
      margen: numeral(
        (1 -
          totales.costoTotalServicios /
            (totales.precioVentaTotalServicios /
              datos.tipoCambio /
              (1 + factorIVA))) *
          100
      ).format("0,0.00"),
    });
    tabla.push({
      nombre: "Total",
      costo: numeral(totales.costoTotal).format("0,0.00"),
      venta: numeral(totales.precioVentaTotal).format("0,0.00"),
      margen: numeral(
        (1 -
          totales.costoTotal /
            (totales.precioVentaTotal / datos.tipoCambio / (1 + factorIVA))) *
          100
      ).format("0,0.00"),
    });
    const descuentoNumero =
      totales.precioVentaTotal * (datos.descuentoFinalPorcentaje / 100);
    const descuento = numeral(descuentoNumero).format("0,0.00");
    console.log(descuentoNumero, datos.descuentoFinalPorcentaje);

    const totalDescontadoNumero = totales.precioVentaTotal - descuentoNumero;
    const totalDescontado = numeral(totalDescontadoNumero).format("0,0.00");

    const ivaNumero = totalDescontadoNumero * (datos.IVAPorcentaje / 100);
    const iva = numeral(ivaNumero).format("0,0.00");
    console.log("iva", datos.IVAPorcentaje, ivaNumero, totalDescontadoNumero);
    const totalIVAIncluidoNumero = totalDescontadoNumero + ivaNumero;
    const totalIVAIncluido = numeral(totalIVAIncluidoNumero).format("0,0.00");

    const margenFinalNumero =
      (1 -
        totales.costoTotal /
          (totalDescontadoNumero / datos.tipoCambio / (1 + factorIVA))) *
      100;
    const margenFinal = numeral(margenFinalNumero).format("0,0.00");

    console.log(tabla);
    setTablaResumen(tabla);
    setDescuento(descuento);
    setTotalDescontado(totalDescontado);
    setIVA(iva);
    setTotalIVAIncluido(totalIVAIncluido);
    setMargenFinal(margenFinal);

    //registrarDatos(totalDescontadoNumero, "precioVentaTotal");
  }, [totales, datos.descuentoFinalPorcentaje]);

  return (
    <FieldSet
      titulo={"Resumen"}
      color="primary.main"
      tamanoTitulo="1.2rem"
      anchoBorde={2}
      radioBorde={1}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <Typography align="right">Costo US$</Typography>
              </TableCell>
              <TableCell>
                <Typography align="right">Venta US$</Typography>
              </TableCell>
              <TableCell>
                <Typography align="right">Margen %</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tablaResumen.map((fila, indice) => (
              <TableRow key={indice}>
                <TableCell>
                  <Typography align="left">{fila.nombre}</Typography>
                </TableCell>
                <TableCell>
                  <Typography align="right">{fila.costo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography align="right">{fila.venta}</Typography>
                </TableCell>
                <TableCell>
                  <Typography align="right">{fila.margen}</Typography>
                </TableCell>
              </TableRow>
            ))}
            {datos.distribucionDescuentoFinal ===
              constantes.DESCUENTO_TOTAL && (
              <>
                <TableRow>
                  <TableCell rowSpan={2} />
                  <TableCell>
                    <Typography align="right">Descuento Final</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography align="right">{descuento}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography align="right">Total Descontado</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography align="right">{totalDescontado}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography align="right">{margenFinal}</Typography>
                  </TableCell>
                </TableRow>
              </>
            )}
            {datos.distribucionIVA === constantes.DISTRIBUCION_IVA_TOTAL && (
              <>
                <TableRow>
                  <TableCell rowSpan={2} />
                  <TableCell>
                    <Typography align="right">IVA</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography align="right">{IVA}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography align="right">
                      Total con IVA incluído
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography align="right">{totalIVAIncluido}</Typography>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </FieldSet>
  );
});

export { ResumenCotizacion };
