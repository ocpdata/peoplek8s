import { useState, useEffect, memo } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { CampoSelect } from "./CampoSelect";
import { CampoTexto } from "./CampoTexto";

const DatosBottom = memo(({ datos, tipoRegistro, datosOpciones = {} }) => {
  //export const DatosBottom = ({ datos, tipoRegistro, datosOpciones = {} }) => {
  console.log("funcion DatosBottom", datos, tipoRegistro);
  const [datosRegistro, setDatosRegistro] = useState({
    idCreadoPor: "",
    idModificadoPor: "",
    fechaCreacion: "",
    fechaModificacion: "",
    options: [],
  });

  useEffect(() => {
    console.log("useEffect DatosBottom", datos, tipoRegistro);
    let idCreadoPor = "";
    let idModificadoPor = "";
    let fechaCreacion = "";
    let fechaModificacion = "";
    let options = [];

    switch (tipoRegistro) {
      case "cuenta":
        idCreadoPor = datos.datosCuenta
          ? datos.datosCuenta.idCreadoPorCuenta
          : "";
        idModificadoPor = datos.datosCuenta
          ? datos.datosCuenta.idModificadoPorCuenta
          : "";
        fechaCreacion = datos.datosCuenta
          ? datos.datosCuenta.fechaCreacionCuenta
          : "";
        fechaModificacion = datos.datosCuenta
          ? datos.datosCuenta.fechaModificacionCuenta
          : "";
        options = [...datos.matrizUsuarios];
        break;
      case "contacto":
        idCreadoPor = datos.datosContacto
          ? datos.datosContacto.idCreadoPorContacto
          : "";
        idModificadoPor = datos.datosContacto
          ? datos.datosContacto.idModificadoPorContacto
          : "";
        fechaCreacion = datos.datosContacto
          ? datos.datosContacto.fechaCreacionContacto
          : "";
        fechaModificacion = datos.datosContacto
          ? datos.datosContacto.fechaModificacionContacto
          : "";
        options = [...datos.matrizUsuarios];
        break;
      case "oportunidad":
        idCreadoPor = datos.matrizDatosOportunidad
          ? datos.matrizDatosOportunidad.idCreadoPorOportunidad
          : "";
        idModificadoPor = datos.matrizDatosOportunidad
          ? datos.matrizDatosOportunidad.idModificadoPorOportunidad
          : "";
        fechaCreacion = datos.matrizDatosOportunidad
          ? datos.matrizDatosOportunidad.fechaCreacionOportunidad
          : "";
        fechaModificacion = datos.matrizDatosOportunidad
          ? datos.matrizDatosOportunidad.fechaModificacionOportunidad
          : "";
        options = datos.matrizUsuarios.map((el) => el);
        break;
      case "cotizacion":
        idCreadoPor = datos ? datos.idCreadoPorCotizacion : "";
        idModificadoPor = datos ? datos.idModificadoPorCotizacion : "";
        fechaCreacion = datos ? datos.fechaCreacionCotizacion : "";
        fechaModificacion = datos ? datos.fechaModificacionCotizacion : "";
        options = datosOpciones.matrizUsuarios.map((el) => el);
        break;
      default:
        break;
    }
    console.log(
      idCreadoPor,
      idModificadoPor,
      fechaCreacion,
      fechaModificacion,
      options
    );
    setDatosRegistro({
      idCreadoPor,
      idModificadoPor,
      fechaCreacion,
      fechaModificacion,
      options,
    });
  }, [datos]);

  return (
    <Paper
      sx={{
        marginTop: 2,
        padding: 2,
        //marginBottom: 10,
        backgroundColor: "#f0f0f0",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        rowSpacing={2}
      >
        <Grid size={5}>
          <CampoSelect
            nombreInstancia="nombreCreadoPor"
            idOptionSelected={datosRegistro.idCreadoPor}
            etiqueta="Creado por"
            idEtiqueta="lbCreadoPor"
            options={datosRegistro.options}
            readOnly={true}
          />
        </Grid>
        <Grid size={5}>
          <CampoSelect
            nombreInstancia="nombreModificadoPor"
            idOptionSelected={datosRegistro.idModificadoPor}
            etiqueta="Última modificación hecha por"
            idEtiqueta="lbModificadoPor"
            options={datosRegistro.options}
            readOnly={true}
          />
        </Grid>
        <Grid size={5}>
          <CampoTexto
            nombreInstancia="fechaCreacion"
            texto={datosRegistro.fechaCreacion}
            etiqueta={"Fecha de creación"}
            readonly={true}
          />
        </Grid>
        <Grid size={5}>
          <CampoTexto
            nombreInstancia="fechaModificacion"
            texto={datosRegistro.fechaModificacion}
            etiqueta={"Fecha de última modificación"}
            readonly={true}
          />
        </Grid>
      </Grid>
    </Paper>
  );
});

export { DatosBottom };
