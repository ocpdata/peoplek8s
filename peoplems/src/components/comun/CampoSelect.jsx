import { useEffect, useState } from "react";
import { Select, InputLabel, FormControl, Box, MenuItem } from "@mui/material";

export const CampoSelect = ({
  nombreInstancia,
  idOptionSelected,
  registrarDatos = () => {},
  etiqueta,
  idEtiqueta,
  options,
  readOnly = false,
}) => {
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  /*console.log(
    "funcion CampoSelect",
    nombreInstancia,
    idOptionSelected,
    options
  );*/

  function handleChange(event) {
    setValue(event.target.value);
    registrarDatos(event.target.value, nombreInstancia);
  }

  useEffect(() => {
    setValue(idOptionSelected);
    setList(options);
  }, [idOptionSelected, options]);

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id={idEtiqueta}>{etiqueta}</InputLabel>
        <Select
          value={value}
          name={nombreInstancia}
          onChange={handleChange}
          variant="standard"
          label={etiqueta}
          labelId={idEtiqueta}
          fullWidth
          readOnly={readOnly}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                maxWidth: 100,
              },
            },
          }}
        >
          {list.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.nombre}
            </MenuItem>
          ))}
          {/*options &&
            options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.nombre}
              </MenuItem>
            ))*/}
        </Select>
      </FormControl>
    </Box>
  );
};
