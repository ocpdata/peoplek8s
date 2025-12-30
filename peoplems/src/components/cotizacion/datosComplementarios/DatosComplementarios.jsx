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
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";

import { OpcionesCotizacion } from "./condiciones/OpcionesCotizacion";
import CondicionesComerciales from "./condiciones/CondicionesComerciales";
import { ResumenCotizacion } from "./resumen/ResumenCotizacion";

export function DatosComplementarios({
  totales,
  datos,
  datosCondicionesComerciales,
  datosOpciones,
  registrarDatos,
}) {
  const [notasInternas, setNotasInternas] = useState("");
  console.log("funcion DatosComplementarios", totales, datos, datosOpciones);

  function handleCambioNotasInternas(event) {
    console.log("funcion notasInternas");

    setNotasInternas(event.target.value);
    registrarDatos(event.target.value, "notasInternas");
  }

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            backgroundColor: "lightblue",
          }}
        >
          <Typography component="span">Datos Complementarios</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {
            <ResumenCotizacion
              totales={totales}
              datos={datos}
              //datos={datos}
              registrarDatos={registrarDatos}
            ></ResumenCotizacion>
          }
          <OpcionesCotizacion
            datos={datos}
            registrarDatos={registrarDatos}
          ></OpcionesCotizacion>
          {datosCondicionesComerciales && (
            <CondicionesComerciales
              datosCondiciones={datosCondicionesComerciales}
              datosOpciones={datosOpciones}
              registrarDatos={registrarDatos}
            ></CondicionesComerciales>
          )}
          <TextField
            name={"notasInternas"}
            label={"Notas internas"}
            value={notasInternas}
            error={false}
            type={"text"}
            variant="standard"
            placeholder={"Notas internas"}
            required={false}
            fullWidth
            multiline
            maxRows={6}
            minRows={2}
            onChange={handleCambioNotasInternas}
          ></TextField>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
