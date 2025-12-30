import { useState, useEffect, useContext } from "react";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { AuthContext } from "../../../pages/Login";
import * as permisos from "../../../config/permisos.js";

import * as constantes from "../../../config/constantes.js";

//Pone en un objeto los parametros enviados
function createData(param1, param2) {
  return {
    id: param1,
    nombre: param2,
  };
}

export function OportunidadSelect({
  nombreInstancia,
  idOptionSelected,
  registrarDatos,
  etiqueta,
  idEtiqueta,
  idCuentaSeleccionada = 0, //La cuenta del contacto. Es un parametro state que controla el useEffect
  datosBasicos,
  readOnly,
}) {
  const [value, setValue] = useState(""); //Controla el valor elegido dentro del Select Cuenta
  const [list, setList] = useState([]); //Controla la actualizacion de la lista de Select Cuenta
  const { user } = useContext(AuthContext);

  /*console.log(
    "funcion OportunidadSelect",
    idOptionSelected,
    etiqueta,
    idEtiqueta,
    idCuentaSeleccionada,
    datosBasicos
  );*/

  //let options = [];

  //Cada vez que se modifica idCuenta, se descarga la lista de oportunidades donde el usuario es propietario o copropietario de la oportunidad
  useEffect(() => {
    console.log("useEffect Oportunidad Select");
    let cadBusqueda = "";
    if (idCuentaSeleccionada === "") {
      idCuentaSeleccionada = 0;
    }
    //Obtiene la lista de oportunidades activas de una cuenta en base a un usuario que es propietario o copropietario de la oportunidad.
    //Si es una nueva oportunida (idCuentaseleccionada=0), solo se mostraran las oportunidades abiertas (no ganadas, ni perdidas, ni anuladas)
    //console.log(datos, idCuentaSeleccionada);
    if (datosBasicos.idCotizacion === 0) {
      cadBusqueda = `${constantes.PREFIJO_URL_API}/oportunidades/cuenta/${idCuentaSeleccionada}/usuario/${user.id}?estado=abierta`;
      //cadBusqueda = `${constantes.PREFIJO_URL_API}/oportunidades/abiertas/cuenta/usuario/${idCuentaSeleccionada}/${user.id}`;
    } else {
      if (user?.permisos?.includes(permisos.ALCANCE__TODAS_LAS_OPORTUNIDADES)) {
        cadBusqueda = `${constantes.PREFIJO_URL_API}/oportunidades/cuenta/${idCuentaSeleccionada}`;
      } else {
        cadBusqueda = `${constantes.PREFIJO_URL_API}/oportunidades/cuenta/${idCuentaSeleccionada}/usuario/${user.id}`;
        //cadBusqueda = `${constantes.PREFIJO_URL_API}/oportunidades/cuenta/usuario/${idCuentaSeleccionada}/${user.id}`;
      }
    }
    console.log(cadBusqueda);
    fetch(cadBusqueda, constantes.HEADER_COOKIE)
      .then((resp) => resp.json())
      .then((json) => {
        let options = [];
        console.log(json);
        //Define el array de las opciones de la lista del Select
        json.data.map((item) =>
          options.push(
            createData(
              item.idOportunidad,
              item.nombreOportunidad,
              item.idContacto
            )
          )
        );
        setList(options);
      });
  }, [idCuentaSeleccionada]);

  useEffect(() => {
    setValue(idOptionSelected);
  }, [idOptionSelected]);

  //Actualiza el valor seleccionado y tambien lo envia hacia el componente padre
  function handleChange(event) {
    setValue(event.target.value);
    registrarDatos(event.target.value, nombreInstancia);

    //Obtiene los datos de la oportunidad seleccionada
    const cadOportunidad = `${constantes.PREFIJO_URL_API}/oportunidades/${event.target.value}`;

    console.log(cadOportunidad);

    fetch(cadOportunidad, constantes.HEADER_COOKIE)
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json);

        registrarDatos(
          json.data[0].id_oportunidad_crm,
          "oportunidadCotizacion"
        );

        //----WARNING Compatible con appa antigua ----
        registrarDatos(
          json.data[0].nombre_oportunidad,
          "nombreOportunidadCotizacion"
        );
        //--------------------------------------------

        registrarDatos(json.data[0].id_contacto_crm, "contactoOportunidad");
        registrarDatos(json.data[0].fecha_cierre, "fechaCierreOportunidad");
        registrarDatos(
          json.data[0].id_etapa_oportunidad_crm,
          "etapaVentaOportunidad"
        );
        registrarDatos(json.data[0].importe, "importeOportunidad");
      });
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
