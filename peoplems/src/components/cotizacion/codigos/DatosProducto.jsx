import { useRef, useState } from "react";
import { Box, TextField, Button } from "@mui/material/";
import Grid from "@mui/material/Grid2";
import { NumericFormat } from "react-number-format";
import { CampoSelect } from "../../comun/CampoSelect";
import { CampoTexto } from "../../comun/CampoTexto";
import { Alerta } from "../../comun/Alerta";

import * as constantes from "../../../config/constantes.js";

export function DatosProducto({ registrarDatos, listaFabricantes }) {
  const [openAlert, setOpenAlert] = useState(false);
  console.log("funcion DatosProducto", listaFabricantes);

  const datosCodigo = useRef({});
  const mensaje = useRef({});
  //mensaje.current.exito = "La operación se realizó satisfactoriamente";
  //mensaje.current.error = "Hubo un problema en la operación";

  async function crearCodigo() {
    console.log("funcion crearCodigo");

    //Validar que haya información necesaria para crear el código
    console.log(datosCodigo.current);
    if (
      datosCodigo.current.idFabricante &&
      datosCodigo.current.codigo != "" &&
      datosCodigo.current.codigo.length > 3
    ) {
      console.log("Hay información suficiente para crear un producto");
    } else {
      setOpenAlert("error");
      mensaje.current.error =
        "Por favor complete todos los campos antes de continuar.";
      console.log("Por favor complete todos los campos antes de continuar");
      return;
    }

    //Validar que el codigo no exista en la base del fabricante
    const cadBusqueda = `${constantes.PREFIJO_URL_API}/fabricantes/${datosCodigo.current.idFabricante}/validar/${datosCodigo.current.codigo}?accion=validarexistencia`;
    //const cadBusqueda = `${constantes.PREFIJO_URL_API}/fabricantes/validar/${datosCodigo.current.bdFabricante}/${datosCodigo.current.codigo}`;

    console.log(cadBusqueda);
    const resultadoCodigo = await fetch(cadBusqueda, constantes.HEADER_COOKIE);
    const jsonResultadoCodigo = await resultadoCodigo.json();
    console.log(jsonResultadoCodigo);
    if (jsonResultadoCodigo.success) {
      //if (jsonResultadoCodigo.data.length > 0) {
      console.log("Ya existe un codigo");
      setOpenAlert("error");
      mensaje.current.error =
        "El código que desea crear ya existe en la base de datos";
    } else {
      console.log("no existe el codigo");
      const cadBusqueda = `${constantes.PREFIJO_URL_API}/fabricantes/`;
      //const cadBusqueda = `http://peoplenode.digitalvs.com:3010/api/fabricantes/crearcodigo/`;
      console.log(cadBusqueda);
      const resultadoCodigo = await fetch(cadBusqueda, {
        method: "POST",
        body: JSON.stringify(datosCodigo.current),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      });
      const jsonResultadoCodigo = await resultadoCodigo.json();
      console.log(jsonResultadoCodigo);
      setOpenAlert("success");
      mensaje.current.exito = "El código fue creado satisfactoriamente";
    }
  }

  function handleParametrosCodigo(input, instancia) {
    //console.log("funcion handleParametrosCodigo");

    switch (instancia) {
      case "fabricante":
        datosCodigo.current.idFabricante = input;
        const fabricante = listaFabricantes.find((f) => f.id === input);
        if (fabricante) {
          datosCodigo.current.bdFabricante = fabricante.bdFabricante;
        }

        break;

      case "codigo":
        datosCodigo.current.codigo = input;
        break;

      case "precio":
        datosCodigo.current.precio = input;
        break;

      case "status":
        datosCodigo.current.idEstado = input;
        break;

      case "descripcion":
        datosCodigo.current.descripcion = input;
        break;
    }
  }

  return (
    <Box>
      {
        (console.log(mensaje.current),
        openAlert && (
          <Alerta
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            mensajeExito={mensaje.current.exito}
            mensajeFracaso={mensaje.current.error}
          ></Alerta>
        ))
      }
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        rowSpacing={2}
      >
        <Grid p={2} size={5}>
          <CampoSelect
            nombreInstancia="fabricante"
            idOptionSelected={0}
            registrarDatos={handleParametrosCodigo}
            etiqueta={"Fabricante"}
            idEtiqueta={"lbFabricante"}
            options={listaFabricantes}
            //readOnly={idCotizacion > 0 ? true : false}
          />
        </Grid>
        <Grid size={5}>
          <CampoTexto
            nombreInstancia="codigo"
            texto={""}
            registrarDatos={handleParametrosCodigo}
            etiqueta={"Código"}
            idEtiqueta={"lbCodigo"}
            placeholder={"Código del producto"}
            //readOnly={true}
          />
        </Grid>
        <Grid size={5}>
          <NumericFormat
            value={""}
            name="precio"
            prefix="$"
            thousandSeparator
            customInput={TextField}
            decimalScale={2}
            fullWidth
            {...{
              id: "idPrecioCodigo",
              label: "Precio US$",
              variant: "standard",
            }}
            onValueChange={(values, sourceInfo) => {
              handleParametrosCodigo(values.floatValue, "precio");
            }}
            //readOnly={true}
          />
        </Grid>
        <Grid size={5}>
          <CampoSelect
            nombreInstancia="status"
            idOptionSelected={0}
            registrarDatos={handleParametrosCodigo}
            etiqueta={"Estado"}
            idEtiqueta={"lbEstado"}
            options={[
              { id: 0, nombre: "Inactivo" },
              { id: 1, nombre: "Activo" },
            ]}
            //readOnly={idCotizacion > 0 ? true : false}
          />
        </Grid>
        <Grid size={12}>
          <CampoTexto
            nombreInstancia="descripcion"
            texto={""}
            registrarDatos={handleParametrosCodigo}
            etiqueta={"Descripción"}
            idEtiqueta={"lbDescripcion"}
            placeholder={"Descripción del producto"}
            //readOnly={true}
          />
        </Grid>
        <Grid size={5}>
          <Button variant="text" onClick={crearCodigo}>
            Crear producto
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
