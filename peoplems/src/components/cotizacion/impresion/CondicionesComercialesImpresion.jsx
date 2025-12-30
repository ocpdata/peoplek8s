import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { FieldSet } from "../datosComplementarios/resumen/FieldSet";
import { useState, useEffect } from "react";

export function CondicionesComercialesImpresion({ datos, datosOpciones }) {
  const [tiempoEntrega, setTiempoEntrega] = useState("");
  const [validez, setValidez] = useState("");
  const [garantia, setGarantia] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [moneda, setMoneda] = useState("");
  console.log("funcion CondicionesComercialesImpresion");

  //Obtener el texto de la lista de opciones de datOpciones.matrizTiemposEntregaCotizacion cuyo opcion sea datos.tiempoEntrega
  useEffect(() => {
    const opcionTiempoEntrega =
      datosOpciones.matrizTiemposEntregaCotizacion.find(
        (item) => item.id === datos.tiempoEntrega
      );
    if (opcionTiempoEntrega) {
      console.log("Texto de tiempo de entrega:", opcionTiempoEntrega.nombre);
    }
    setTiempoEntrega(opcionTiempoEntrega.nombre);

    const opcionValidez = datosOpciones.matrizValidezCotizacion.find(
      (item) => item.id === datos.validez
    );
    setValidez(opcionValidez.nombre);

    const opcionGarantia = datosOpciones.matrizGarantiaCotizacion.find(
      (item) => item.id === datos.garantia
    );
    setGarantia(opcionGarantia.nombre);

    const opcionFormaPago = datosOpciones.matrizFormaPagoCotizacion.find(
      (item) => item.id === datos.formaPago
    );
    setFormaPago(opcionFormaPago.nombre);

    const opcionMoneda = datosOpciones.matrizMonedaCotizacion.find(
      (item) => item.id === datos.moneda
    );
    setMoneda(opcionMoneda.nombre);
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
                <Typography align="left">Tiempo de entrega</Typography>
              </TableCell>
              <TableCell>
                <Typography align="right">{tiempoEntrega}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography align="lef">Validez</Typography>
              </TableCell>
              <TableCell>
                <Typography align="right">{validez}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography align="left">Garantía</Typography>
              </TableCell>
              <TableCell>
                <Typography align="right">{garantia}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography align="left">Forma de pago</Typography>
              </TableCell>
              <TableCell>
                <Typography align="right">{formaPago}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography align="left">Moneda</Typography>
              </TableCell>
              <TableCell>
                <Typography align="right">{moneda}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </FieldSet>
  );
}
