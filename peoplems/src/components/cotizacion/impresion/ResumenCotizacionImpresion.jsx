import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { FieldSet } from "../datosComplementarios/resumen/FieldSet";
import { useEffect, useState } from "react";
import numeral from "numeral";
import * as constantes from "../../../config/constantes.js";

export function ResumenCotizacionImpresion({ totales, datos }) {
  console.log("funcion ResumenCotizacionImpresion", totales, datos);
  const [ventaTotal, setVentaTotal] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [totalDescontado, setTotalDescontado] = useState(0);
  const [IVA, setIVA] = useState(0);
  const [totalIVAIncluido, setTotalIVAIncluido] = useState(0);

  /**
   * useEffect hook en ResumenCotizacionImpresion:
   *
   * Este useEffect se ejecuta una sola vez al montar el componente.
   * Calcula y formatea los valores de:
   * - Total de venta (`ventaTotal`)
   * - Descuento final aplicado (`descuento`)
   * - Total después de aplicar el descuento (`totalDescontado`)
   * - IVA calculado sobre el total descontado (`IVA`)
   * - Total final con IVA incluido (`totalIVAIncluido`)
   *
   * Los resultados se almacenan en los estados correspondientes, utilizando la librería `numeral` para el formato numérico.
   * Los cálculos dependen de las propiedades `totales` y `datos` recibidas por el componente.
   */
  useEffect(() => {
    setVentaTotal(numeral(totales.precioVentaTotal).format("0,0.00"));
    const descuentoNumero =
      totales.precioVentaTotal * (datos.descuentoFinalPorcentaje / 100);
    setDescuento(numeral(descuentoNumero).format("0,0.00"));
    console.log(descuentoNumero, datos.descuentoFinalPorcentaje);

    const totalDescontadoNumero = totales.precioVentaTotal - descuentoNumero;
    setTotalDescontado(numeral(totalDescontadoNumero).format("0,0.00"));

    const ivaNumero = totalDescontadoNumero * (datos.IVAPorcentaje / 100);
    setIVA(numeral(ivaNumero).format("0,0.00"));
    console.log("iva", datos.IVAPorcentaje, ivaNumero, totalDescontadoNumero);
    const totalIVAIncluidoNumero = totalDescontadoNumero + ivaNumero;
    setTotalIVAIncluido(numeral(totalIVAIncluidoNumero).format("0,0.00"));
  }, []);

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
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography align="right">Total</Typography>
              </TableCell>
              <TableCell>
                <Typography align="right">{ventaTotal}</Typography>
              </TableCell>
            </TableRow>
            {datos.distribucionDescuentoFinal ===
              constantes.DESCUENTO_TOTAL && (
              <>
                <TableRow>
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
                </TableRow>
              </>
            )}
            {datos.distribucionIVA === constantes.DISTRIBUCION_IVA_TOTAL && (
              <>
                <TableRow>
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
}
