import { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

import * as constantes from "../../../config/constantes.js";

function createData(param1, param2) {
  return {
    id: param1,
    nombre: param2,
  };
}

//Cuando se selecciona una cuenta, la lista de contactos debe actualizarse con los contactos de dicha cuenta
export function ContactoSelect({
  nombreInstancia,
  idOptionSelected,
  registrarDatos,
  etiqueta,
  idEtiqueta,
  idCuentaSeleccionada = 0, //La cuenta del contacto. Es un parametro state que controla el useEffect
  readOnly,
}) {
  const [value, setValue] = useState(""); //Controla el valor elegido dentro del Select Cuenta
  const [list, setList] = useState([]); //Controla la actualizacion de la lista de Select Cuenta

  /*console.log(
    "funcion ContactoSelect",
    idOptionSelected,
    etiqueta,
    idEtiqueta,
    idCuentaSeleccionada
  );*/

  //Cada vez que se modifica idCuenta, se descarga la lista de contactos
  useEffect(() => {
    //console.log("useEffect");
    let options = [];

    let cadBusqueda = "";
    if (idCuentaSeleccionada === "") {
      idCuentaSeleccionada = 0;
    }
    cadBusqueda = `${constantes.PREFIJO_URL_API}/contactos/cuenta/${idCuentaSeleccionada}`;
    fetch(cadBusqueda, constantes.HEADER_COOKIE)
      .then((resp) => resp.json())
      .then((json) => {
        options = [];

        //Define el array de las opciones de la lista del Select
        json.data.map((item) =>
          options.push(
            createData(item.idContacto, item.nombresApellidosContacto)
          )
        );
        setList(options);
      });
  }, [idCuentaSeleccionada]);

  useEffect(() => {
    setValue(idOptionSelected);
  }, [idOptionSelected]);

  //Actualiza el valor seleccionado y tambien lo envia hacia el componenente padre
  function handleChange(event) {
    setValue(event.target.value);
    registrarDatos(event.target.value, nombreInstancia);
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id={idEtiqueta}>{etiqueta}</InputLabel>
        <Select
          value={list.length > 0 ? value : ""}
          //value={value}
          name={nombreInstancia}
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
          readOnly={readOnly}
        >
          {list.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
