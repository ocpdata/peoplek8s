import {
  IconButton,
  Stack,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import { useState, useEffect, memo } from "react";
import numeral from "numeral";
import * as constantes from "../../../../config/constantes.js";

const OpcionesCotizacion = memo(function OpcionesCotizacion({
  datos,
  registrarDatos = { registrarDatos },
}) {
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(-1); //Entre 0 y 100. Se pone valor inicial -1 para poder usar useEffect con el valor 0
  const [descuentoAbsoluto, setDescuentoAbsoluto] = useState(0); //Entre 0 y 100
  const [distribucionDescuento, setDistribucionDescuento] = useState(
    constantes.DESCUENTO_TOTAL
  ); //Determina si el descuento es total (0) o por item (1)
  const [distribucionIVA, setDistribucionIVA] = useState(
    constantes.DISTRIBUCION_SIN_IVA
  ); //useState("Sin IVA");
  console.log("funcion OpcionesCotizacion", datos);

  function handleDistribucionDescuento(event) {
    console.log("funcion handleDistribucionDescuento", event.target.value);
    const distrDescuento = Number(event.target.value);

    let descAbsoluto = 0;
    switch (distrDescuento) {
      case constantes.DESCUENTO_TOTAL:
        descAbsoluto = datos.precioTotal * (Number(descuentoPorcentaje) / 100);
        registrarDatos(distrDescuento, "distribucionDescuentoTotal");
        break;

      case constantes.DESCUENTO_POR_ITEM:
        descAbsoluto = datos.precioTotal * (Number(descuentoPorcentaje) / 100);
        registrarDatos(distrDescuento, "distribucionDescuentoPorItem");
        break;
    }

    setDistribucionDescuento(distrDescuento);
    setDescuentoAbsoluto(descAbsoluto);
  }

  /*function handleCambioDescuentoPorcentaje(event) {
    console.log("funcion handleCambioDescuentoPorcentaje", event.target.value);
    const descPorcentaje = Number(event.target.value);
    const descAbsoluto = (datos.precioTotal * descPorcentaje) / 100;
    console.log(descAbsoluto);

    registrarDatos(descPorcentaje, "descuentoFinalPorcentaje");
    setDescuentoAbsoluto(descAbsoluto);
    setDescuentoPorcentaje(descPorcentaje);
  }*/

  function handleCambioDescuentoPorcentaje(event) {
    let input = event.target.value;

    // Si el usuario escribe solo "0", permite "0" o "0." para decimales
    if (input === "0" || input === "0." || input === "") {
      setDescuentoPorcentaje(input);
      setDescuentoAbsoluto((datos.precioTotal * Number(input)) / 100);
      registrarDatos(Number(input), "descuentoFinalPorcentaje");
      return;
    }

    // Elimina ceros a la izquierda (pero permite "0." para decimales)
    input = input.replace(/^0+([1-9])/, "$1");

    const descPorcentaje = Number(input);
    const descAbsoluto = (datos.precioTotal * descPorcentaje) / 100;

    setDescuentoPorcentaje(input);
    setDescuentoAbsoluto(descAbsoluto);
    registrarDatos(descPorcentaje, "descuentoFinalPorcentaje");
  }

  function handleDistribucionIVA(event) {
    console.log("funcion handleDistribucionIVA", event.target.value);
    const distrIVA = Number(event.target.value);

    switch (distrIVA) {
      case constantes.DISTRIBUCION_SIN_IVA:
        registrarDatos(distrIVA, "distribucionSinIVA");
        break;
      case constantes.DISTRIBUCION_IVA_TOTAL:
        registrarDatos(distrIVA, "distribucionIVATotal");
        break;
      case constantes.DISTRIBUCION_IVA_POR_ITEM:
        registrarDatos(distrIVA, "distribucionIVAPorItem");
        break;
    }
    setDistribucionIVA(distrIVA);
  }

  useEffect(() => {
    console.log(
      "useEffect descuentoFinalPorcentaje",
      datos.descuentoFinalPorcentaje,
      distribucionDescuento
    );
    //Si el hook distribucionDescuento es constantes.DESCUENTO_POR_ITEM, el descuento absoluto es 0, porque ya se distribuyó en los items
    //Si el hook distribucionDescuento es 0, el descuento absoluto es igual a la multipliacion del precioTotal por el procentaje de descuento
    if (distribucionDescuento === constantes.DESCUENTO_POR_ITEM) {
      setDescuentoAbsoluto(0);
    } else {
      const descAbsoluto =
        datos.precioTotal * (datos.descuentoFinalPorcentaje / 100);
      console.log(descAbsoluto);
      setDescuentoAbsoluto(descAbsoluto);
    }

    setDescuentoPorcentaje(datos.descuentoFinalPorcentaje);
  }, [datos.descuentoFinalPorcentaje, datos.precioTotal]);

  /*useEffect(() => {
    if (distribucionDescuento === 1) {
      setDescuentoAbsoluto(0);
    } else {
      const descAbsoluto =
        datos.precioTotal * (datos.descuentoFinalPorcentaje / 100);
      console.log(descAbsoluto);
      setDescuentoAbsoluto(descAbsoluto);
    }
  }, [datos.precioTotal]);*/

  useEffect(() => {
    console.log("useEffect 2", datos.distribucionDescuentoFinal);
    setDistribucionDescuento(datos.distribucionDescuentoFinal);
  }, [datos.distribucionDescuentoFinal]);

  useEffect(() => {
    console.log("useEffect distribucionIVA", datos.distribucionIVA);
    setDistribucionIVA(datos.distribucionIVA);
  }, [datos.distribucionIVA]);

  return (
    <Stack direction="row" spacing={15} sx={{ my: 2 }}>
      <FormControl>
        <FormLabel>Descuento Final</FormLabel>
        <FormGroup row>
          <TextField
            name={"descuentoFinalPorcentual"}
            label={"Porcentaje %"}
            value={descuentoPorcentaje}
            error={false}
            type={"number"}
            variant="standard"
            placeholder={"Porcentaje %"}
            required={false}
            onChange={handleCambioDescuentoPorcentaje}
            sx={{ mr: 3 }}
          />
          <TextField
            name={"descuentoFinalAbsoluto"}
            label={"Valor $"}
            //value={descuentoAbsoluto}
            value={numeral(descuentoAbsoluto).format("0,0.00")}
            error={false}
            //type={"number"}
            variant="standard"
            placeholder={"Descuento"}
            required={false}
            //sx={{ flexGrow: 1 }}
            //inputProps={{ readOnly: readOnly }}
            //fullWidth
            //onChange={handleCambioDescuentoAbsoluto}
          />

          <RadioGroup
            row
            value={distribucionDescuento}
            onChange={handleDistribucionDescuento}
          >
            <FormControlLabel
              value={constantes.DESCUENTO_TOTAL}
              control={<Radio />}
              label="Total"
            />
            <FormControlLabel
              value={constantes.DESCUENTO_POR_ITEM}
              control={<Radio />}
              label="Distribuido"
            />
          </RadioGroup>
        </FormGroup>
        <FormHelperText></FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>IVA</FormLabel>
        <FormGroup row>
          <RadioGroup
            row
            value={distribucionIVA}
            onChange={handleDistribucionIVA}
          >
            <FormControlLabel
              value={constantes.DISTRIBUCION_SIN_IVA}
              //value="Sin IVA"
              control={<Radio />}
              label="Sin IVA"
            />
            <FormControlLabel
              value={constantes.DISTRIBUCION_IVA_TOTAL}
              //value="IVA Total"
              control={<Radio />}
              label="IVA Total"
            />
            <FormControlLabel
              //value="IVA Distribuido"
              value={constantes.DISTRIBUCION_IVA_POR_ITEM}
              control={<Radio />}
              label="IVA Distribuido"
            />
          </RadioGroup>
        </FormGroup>
      </FormControl>
    </Stack>
  );
});

export { OpcionesCotizacion };
