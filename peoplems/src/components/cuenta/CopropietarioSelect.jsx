import { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Checkbox,
} from "@mui/material";

function createData(param1, param2) {
  return {
    id: param1,
    nombre: param2,
  };
}

export function CopropietarioSelect({
  idOptionSelected,
  registrarDatos,
  etiqueta,
  idEtiqueta,
  options,
}) {
  const [value, setValue] = useState([]); //Controla el valor elegido dentro del Select Cuenta

  console.log(
    "funcion CopropietarioSelect",
    idOptionSelected,
    etiqueta,
    idEtiqueta,
    options
  );

  useEffect(() => {
    setValue(idOptionSelected);
  }, [idOptionSelected]);

  //Actualiza el valor seleccionado y tambien lo envia hacia el componenente padre
  function handleChange(event) {
    setValue(event.target.value);
    registrarDatos(event.target.value, "copropietarioCuenta");
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id={idEtiqueta}>{etiqueta}</InputLabel>
        <Select
          value={value}
          name="copropietarioCuenta"
          onChange={handleChange}
          variant="standard"
          label={etiqueta}
          multiple
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                maxWidth: 100,
                //width: 100,
              },
            },
          }}
          fullWidth
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={value.includes(option.id)} />
              {option.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
