import { useEffect, useState, memo } from "react";
import { TextField } from "@mui/material";

const IntroduccionCotizacion = memo(function IntroduccionCotizacion({
  texto,
  registrarDatos,
}) {
  //export function IntroduccionCotizacion({ texto, registrarDatos }) {
  const [introduccion, setIntroduccion] = useState(texto);
  console.log("funcion IntroduccionCotizacion", texto);

  useEffect(() => {
    console.log("useEffect IntroduccionCotizacion");

    setIntroduccion(texto);
  }, [texto]);

  return (
    <TextField
      fullWidth
      label="Introducción"
      value={introduccion}
      variant="standard"
      multiline
      maxRows={2}
      onChange={(event) => {
        registrarDatos(event.target.value, "introduccionCotizacion");
        setIntroduccion(event.target.value);
      }}
    />
  );
});

export default IntroduccionCotizacion;
