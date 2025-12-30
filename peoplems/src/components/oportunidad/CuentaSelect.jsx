import { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

import * as constantes from "../../config/constantes.js";

function createData(param1, param2) {
  return {
    id: param1,
    nombre: param2,
  };
}

let options = [];

export function CuentaSelect({
  idOptionSelected,
  registrarDatos,
  etiqueta,
  idEtiqueta,
  readOnly = false,
}) {
  const [value, setValue] = useState(""); //Controla el valor elegido dentro del Select Cuenta
  const [listCuenta, setListCuenta] = useState([]); //Controla la actualizacion de la lista de Select Jefe
  console.log("funcion CuentaSelect", idOptionSelected, etiqueta, idEtiqueta);

  //Cada vez que se renderiza el Select, se descarga la lista de cuentas
  useEffect(() => {
    fetch(`${constantes.PREFIJO_URL_API}/cuentas}`, constantes.HEADER_COOKIE)
      .then((resp) => resp.json())
      .then((json) => {
        options = [];

        //Define el array de las opciones de la lista del Select
        json.data.map((item) =>
          options.push(createData(item.idCuenta, item.nombreCuenta))
        );
        setListCuenta(options);
      });
  }, [idOptionSelected]);

  useEffect(() => {
    setValue(idOptionSelected);
  }, [idOptionSelected]);

  //Actualiza el valor seleccionado y tambien lo envia hacia el componenente padre
  function handleChange(event) {
    setValue(event.target.value);
    registrarDatos(event.target.value, "cuentaOportunidad");
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id={idEtiqueta}>{etiqueta}</InputLabel>
        <Select
          value={value}
          name="cuentaOportunidad"
          onChange={handleChange}
          variant="standard"
          label={etiqueta}
          labelId={idEtiqueta}
          readOnly={readOnly}
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
          {listCuenta.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
