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

export function JefeSelect({
  idOptionSelected,
  registrarDatos,
  etiqueta,
  idEtiqueta,
  idCuentaSeleccionada = 0, //La cuenta del contacto. Es un parametro state que controla el useEffect
}) {
  const [value, setValue] = useState(idOptionSelected); //Controla el valor elegido dentro del Select Jefe
  const [listJefe, setListJefe] = useState([]); //Controla la actualizacion de la lista de Select Jefe

  console.log(
    "funcion JefeSelect",
    idOptionSelected,
    etiqueta,
    idEtiqueta,
    idCuentaSeleccionada
  );

  //Cada vez que se modifica idCuenta, se descarga la lista de contactos
  useEffect(() => {
    let cadBusqueda = "";

    cadBusqueda = `${constantes.PREFIJO_URL_API}/contactos/cuenta/${idCuentaSeleccionada}`;

    fetch(cadBusqueda, constantes.HEADER_COOKIE)
      .then((resp) => resp.json())
      .then((json) => {
        //console.log(JSON.stringify(json));
        options = [];

        //Define el array de las opciones de la lista del Select
        json.data.map((item) =>
          options.push(
            createData(item.idContacto, item.nombresApellidosContacto)
          )
        );
        options.push(createData(0, "Ninguno"));
        //console.log(options);
        setListJefe(options);
      });
  }, [idCuentaSeleccionada]);

  useEffect(() => {
    setValue(idOptionSelected);
  }, [idOptionSelected]);

  //Actualiza el valor seleccionado y tambien lo envia hacia el componenente padre
  function handleChange(event) {
    setValue(event.target.value);
    registrarDatos(event.target.value, "jefeContacto");
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id={idEtiqueta}>{etiqueta}</InputLabel>
        <Select
          value={value}
          name="jefeContacto"
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
