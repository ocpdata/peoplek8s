import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useState, useEffect } from "react";

import * as constantes from "../../config/constantes.js";

function createData(param1, param2) {
  return {
    id: param1,
    nombre: param2,
  };
}

let options = [];

export function CuentaSelect({ valor, setCampo, etiqueta, idEtiqueta }) {
  const [value, setValue] = useState(valor); //Controla el valor elegido dentro del Select Cuenta
  const [listCuenta, setListCuenta] = useState([]); //Controla la actualizacion de la lista de Select Jefe

  console.log("funcion CuentaSelect", valor, etiqueta, idEtiqueta);

  //Cada vez que se renderiza el Select, se descarga la lista de cuentas
  let cadBusqueda = "";
  useEffect(() => {
    cadBusqueda = `${constantes.PREFIJO_URL_API}/cuentas`;
    fetch(cadBusqueda, constantes.HEADER_COOKIE)
      .then((resp) => resp.json())
      .then((json) => {
        options = [];

        //Define el array de las opciones de la lista del Select
        json.data.map((item) =>
          options.push(createData(item.idCuenta, item.nombreCuenta))
        );
        setListCuenta(options);
        setValue(valor);
      });
  }, [valor]);

  //Actualiza el valor seleccionado y tambien lo envia hacia el componenente padre
  function handleChange(event) {
    setValue(event.target.value);
    setCampo(event.target.value);
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id={idEtiqueta}>{etiqueta}</InputLabel>
        <Select
          value={value}
          name="cuentaContacto"
          onChange={handleChange}
          variant="standard"
          label={etiqueta}
          labelId={idEtiqueta}
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
              {option.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
