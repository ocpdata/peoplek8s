import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";

export function CampoTexto({
  nombreInstancia,
  texto,
  registrarDatos,
  etiqueta,
  placeholder = "",
  requerido = false,
  readOnly = false,
  error = false,
  tipo = "text",
}) {
  const [value, setValue] = useState("");
  console.log("funcion CampoTexto", nombreInstancia, texto);

  //Renderiza los componentes cada vez que se ingresan datos
  function handleChange(event) {
    setValue(event.target.value);
    registrarDatos(event.target.value, nombreInstancia);
  }

  //Renderiza cada vez que hay un valor nuevo
  useEffect(() => {
    setValue(texto);
  }, [texto]);

  return (
    <TextField
      name={nombreInstancia}
      label={etiqueta}
      value={value}
      error={error}
      type={tipo}
      variant="standard"
      placeholder={placeholder}
      required={requerido}
      inputProps={{ readOnly: readOnly }}
      fullWidth
      onChange={handleChange}
    />
  );
}
