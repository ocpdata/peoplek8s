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

function createData(tipoRegistro, param1, param2) {
  console.log("createdata", tipoRegistro);
  return {
    id: param1,
    nombre: param2,
  };
}

let optionsPaises = [];
let optionsParticipacion = [];
let optionsRelacion = [];
let optionsPropietarios = [];
let optionsSituacionLaboral = [];

export function CampoSelect({ campo, valor, setCampo, etiqueta, idEtiqueta }) {
  const [value, setValue] = useState(valor);
  const [listPais, setListPais] = useState([]);
  const [listParticipacion, setListParticipacion] = useState([]);
  const [listRelacion, setListRelacion] = useState([]);
  const [listPropietario, setListPropietario] = useState([]);
  const [listSituacionLaboral, setListSituacionLaboral] = useState([]);
  console.log("funcion CampoSelect", campo, valor);

  useEffect(() => {
    console.log("Obteniendo lista de registros", campo);

    campo === "paisContacto" &&
      fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/paises`,
        constantes.HEADER_COOKIE
      )
        .then((resp) => resp.json())
        .then((json) => {
          //console.log(JSON.stringify(json));
          optionsPaises = [];

          json.data.map((item) =>
            optionsPaises.push(createData(campo, item.id_pais, item.nombre))
          );
          //console.log(optionsPaises);
          setListPais(optionsPaises);
        });

    campo === "participacionContacto" &&
      fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/participacion`,
        constantes.HEADER_COOKIE
      )
        .then((resp) => resp.json())
        .then((json) => {
          console.log(JSON.stringify(json));
          optionsParticipacion = [];

          json.data.map((item) =>
            optionsParticipacion.push(
              createData(campo, item.id_participacion, item.nombre)
            )
          );
          console.log(optionsParticipacion);
          setListParticipacion(optionsParticipacion);
        });

    campo === "relacionContacto" &&
      fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/relacion`,
        constantes.HEADER_COOKIE
      )
        .then((resp) => resp.json())
        .then((json) => {
          console.log(JSON.stringify(json));
          optionsRelacion = [];

          json.data.map((item) =>
            optionsRelacion.push(
              createData(campo, item.id_relacion, item.nombre)
            )
          );
          console.log(optionsRelacion);
          setListRelacion(optionsRelacion);
        });

    campo === "propietarioContacto" &&
      fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/usuarios`,
        constantes.HEADER_COOKIE
      )
        .then((resp) => resp.json())
        .then((json) => {
          //console.log(JSON.stringify(json));
          optionsPropietarios = [];

          json.data.map((item) =>
            optionsPropietarios.push(createData(campo, item.id_user, item.name))
          );
          //console.log(optionsPropietarios);
          setListPropietario(optionsPropietarios);
        });

    campo === "situacionLaboralContacto" &&
      fetch(
        `${constantes.PREFIJO_URL_API}/configuracion/situacionlaboral`,
        constantes.HEADER_COOKIE
      )
        .then((resp) => resp.json())
        .then((json) => {
          //console.log(JSON.stringify(json));
          optionsSituacionLaboral = [];

          json.data.map((item) =>
            optionsSituacionLaboral.push(
              createData(campo, item.id_estado_contacto, item.nombre)
            )
          );
          //console.log(optionsSituacionLaboral);
          setListSituacionLaboral(optionsSituacionLaboral);
        });

    setValue(valor);
  }, [valor]);

  function handleChange(event) {
    console.log(event.target);
    setValue(event.target.value);
    setCampo(event.target.value);
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id={idEtiqueta}>{etiqueta}</InputLabel>
        <Select
          value={value}
          name={campo}
          onChange={handleChange}
          variant="standard"
          label={etiqueta}
          labelId={idEtiqueta}
          fullWidth
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                maxWidth: 100,
                //width: 100,
              },
            },
          }}
        >
          {campo === "paisContacto" &&
            optionsPaises.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.nombre}
              </MenuItem>
            ))}

          {campo === "participacionContacto" &&
            optionsParticipacion.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.nombre}
              </MenuItem>
            ))}
          {campo === "relacionContacto" &&
            optionsRelacion.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.nombre}
              </MenuItem>
            ))}
          {campo === "propietarioContacto" &&
            optionsPropietarios.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.nombre}
              </MenuItem>
            ))}
          {campo === "situacionLaboralContacto" &&
            optionsSituacionLaboral.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.nombre}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}
