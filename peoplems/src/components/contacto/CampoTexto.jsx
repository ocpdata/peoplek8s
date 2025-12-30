import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

export function CampoTexto({
  campo,
  valor,
  setCampo,
  etiqueta,
  placeholder = "",
  requerido = false,
  readonly = false,
  error = false,
  tipo = "text",
}) {
  const [value, setValue] = useState(valor);
  console.log("funcion CampoTexto", campo, valor);

  //Renderiza los componentes cada vez que se ingresan datos
  function handleChange(event) {
    console.log(event.target.name);
    setValue(event.target.value);
    setCampo(event.target.value);
  }

  //Renderiza cada vez que hay un valor nuevo
  useEffect(() => {
    setValue(valor);
  }, [valor]);

  /*//Renderiza el id de la cuenta cada vez que cambia
  useEffect(() => {
    if (campo === "idContacto") setValue(valor);
  });*/

  return (
    <TextField
      name={campo}
      label={etiqueta}
      value={value}
      error={error}
      type={tipo}
      variant="standard"
      placeholder={placeholder}
      required={requerido}
      inputProps={{ readOnly: readonly }}
      fullWidth
      onChange={handleChange}
    />
  );
}
