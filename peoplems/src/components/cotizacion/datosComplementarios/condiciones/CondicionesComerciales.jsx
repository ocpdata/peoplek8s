import {
  IconButton,
  Stack,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import { CampoSelect } from "../../../comun/CampoSelect";
import { CampoTexto } from "../../../comun/CampoTexto";
import { FieldSet } from "../resumen/FieldSet";
import { useState, useEffect, memo } from "react";

const CondicionesComerciales = memo(function CondicionesComerciales({
  datosCondiciones,
  datosOpciones,
  registrarDatos,
}) {
  const [tiempoEntrega, setTiempoEntrega] = useState(1);
  const [validez, setValidez] = useState(1);
  const [garantia, setGarantia] = useState(1);
  const [formaPago, setFormaPago] = useState(1);
  const [moneda, setMoneda] = useState(1);
  const [tipoCambio, setTipoCambio] = useState(1);
  const [notasCotizacion, setNotasCotizacion] = useState("");
  console.log(
    "funcion CondicionesComerciales",
    datosCondiciones,
    datosOpciones
  );

  useEffect(() => {
    setTiempoEntrega(datosCondiciones.tiempoEntrega);
  }, [datosCondiciones.tiempoEntrega]);

  useEffect(() => {
    setValidez(datosCondiciones.validez);
  }, [datosCondiciones.validez]);

  useEffect(() => {
    setGarantia(datosCondiciones.garantia);
  }, [datosCondiciones.garantia]);

  useEffect(() => {
    setFormaPago(datosCondiciones.formaPago);
  }, [datosCondiciones.formaPago]);

  useEffect(() => {
    setMoneda(datosCondiciones.moneda);
  }, [datosCondiciones.moneda]);

  useEffect(() => {
    setTipoCambio(datosCondiciones.tipoCambio);
  }, [datosCondiciones.tipoCambio]);

  useEffect(() => {
    setNotasCotizacion(datosCondiciones.notasCotizacion);
  }, [datosCondiciones.notasComerciales]);

  function handleCambioNotasCotizacion(event) {
    console.log("funcion handleCambioNotasCotizacion");

    setNotasCotizacion(event.target.value);
    registrarDatos(event.target.value, "notasCotizacion");
  }

  return (
    <FieldSet
      titulo={"Condiciones Comerciales"}
      color="primary.main"
      tamanoTitulo="1.2rem"
      anchoBorde={2}
      radioBorde={1}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        rowSpacing={2}
        my={1}
      >
        <Grid xs={5}>
          <Grid
            container
            direction="column"
            //justifyContent="space-between"
            //rowSpacing={2}
          >
            <Grid xs={12} my={1}>
              <CampoSelect
                nombreInstancia="tiempoEntregaCotizacion"
                idOptionSelected={tiempoEntrega}
                registrarDatos={registrarDatos}
                etiqueta={"Tiempo de entrega"}
                idEtiqueta={"lbTiempoEntrega"}
                options={datosOpciones.matrizTiemposEntregaCotizacion}
                //readOnly={idCotizacion > 0 ? true : false}
              />
            </Grid>
            <Grid xs={12} my={1}>
              <CampoSelect
                nombreInstancia="validezCotizacion"
                idOptionSelected={validez}
                registrarDatos={registrarDatos}
                etiqueta={"Validez de la cotización"}
                idEtiqueta={"lbValidez"}
                options={datosOpciones.matrizValidezCotizacion}
                //readOnly={idCotizacion > 0 ? true : false}
              />
            </Grid>
            <Grid xs={12} my={1}>
              <CampoSelect
                nombreInstancia="garantiaCotizacion"
                idOptionSelected={garantia}
                registrarDatos={registrarDatos}
                etiqueta={"Garantía"}
                idEtiqueta={"lbGarantia"}
                options={datosOpciones.matrizGarantiaCotizacion}
                //readOnly={idCotizacion > 0 ? true : false}
              />
            </Grid>
            <Grid xs={12} my={1}>
              <CampoSelect
                nombreInstancia="formaPagoCotizacion"
                idOptionSelected={formaPago}
                registrarDatos={registrarDatos}
                etiqueta={"Forma de pago"}
                idEtiqueta={"lbFormaPago"}
                options={datosOpciones.matrizFormaPagoCotizacion}
                //readOnly={idCotizacion > 0 ? true : false}
              />
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              rowSpacing={2}
              my={1}
            >
              <Grid xs={5}>
                <CampoSelect
                  nombreInstancia="monedaCotizacion"
                  idOptionSelected={moneda}
                  registrarDatos={registrarDatos}
                  etiqueta={"Moneda"}
                  idEtiqueta={"lbMoneda"}
                  options={datosOpciones.matrizMonedaCotizacion}
                />
              </Grid>
              <Grid xs={5}>
                <CampoTexto
                  nombreInstancia="tipoCambio"
                  texto={tipoCambio}
                  registrarDatos={registrarDatos}
                  etiqueta={"Tipo de cambio"}
                  placeholder={"Tipo de cambio"}
                  //requerido={true}
                  //error={tipoError}
                  //readOnly={idCuenta > 0 ? true : false}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={5}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            rowSpacing={2}
          >
            <TextField
              name={"notasCotizacion"}
              label={"Notas de la cotización"}
              value={notasCotizacion}
              error={false}
              type={"text"}
              variant="standard"
              placeholder={"Notas de la cotización"}
              required={false}
              fullWidth
              multiline
              maxRows={12}
              minRows={12}
              onChange={handleCambioNotasCotizacion}
            ></TextField>
          </Grid>
        </Grid>
      </Grid>
    </FieldSet>
  );
});

export default CondicionesComerciales;
