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
import { uniqBy } from "lodash";

import * as constantes from "../../config/constantes.js";

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
  idCuenta,
  //options,
}) {
  const [value, setValue] = useState([]); //Controla el valor elegido dentro del Select Cuenta
  const [list, setList] = useState([]); //Las opciones del campo copropietarios

  console.log(
    "funcion CopropietarioSelect",
    idOptionSelected,
    etiqueta,
    idEtiqueta,
    idCuenta
    //options
  );

  //let options = [];

  //Cada vez que se modifica idCuenta, se descarga la lista de usuarios copropietarios de la cuenta
  useEffect(() => {
    console.log("useEffect Copropietario");

    const obtenerCopropietariosCuenta = async () => {
      //Usuarios activos de una cuenta
      const cadUsuariosActivosCuenta = `${constantes.PREFIJO_URL_API}/usuarios/activos?idcuenta=${idCuenta}`;
      //const cadUsuariosActivosCuenta = `${constantes.PREFIJO_URL_API}/configuracion/usuariosactivoscuenta/${idCuenta}`;
      console.log(cadUsuariosActivosCuenta);
      const resUsuariosActivosCuenta = await fetch(
        cadUsuariosActivosCuenta,
        constantes.HEADER_COOKIE
      );
      const jsonUsuariosActivosCuenta = await resUsuariosActivosCuenta.json();
      console.log(jsonUsuariosActivosCuenta);

      const options = uniqBy(jsonUsuariosActivosCuenta.data, "id");
      console.log(options);
      setList(options);
    };
    obtenerCopropietariosCuenta();
  }, [idCuenta]);

  useEffect(() => {
    setValue(idOptionSelected);
  }, [idOptionSelected]);

  //Actualiza el valor seleccionado y tambien lo envia hacia el componenente padre
  function handleChange(event) {
    setValue(event.target.value);
    registrarDatos(event.target.value, "copropietarioOportunidad");
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id={idEtiqueta}>{etiqueta}</InputLabel>
        <Select
          value={value}
          name="copropietarioOportunidad"
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
          {list.map((option) => (
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
