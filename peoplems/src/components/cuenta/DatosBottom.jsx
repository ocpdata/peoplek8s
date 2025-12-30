import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { CampoSelect } from "./CampoSelect";
import { CampoTexto } from "./CampoTexto";

export const DatosBottom = ({ datos }) => {
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
            idOptionSelected={
              datos.datosCuenta ? datos.datosCuenta.idCreadoPorCuenta : ""
            }
            etiqueta="Creado por"
            idEtiqueta="lbCreadoPor"
            options={datos.matrizUsuarios}
            readOnly={true}
          />
        </Grid>
        <Grid size={5}>
          <CampoSelect
            nombreInstancia="nombreModificadoPor"
            idOptionSelected={
              datos.datosCuenta ? datos.datosCuenta.idModificadoPorCuenta : ""
            }
            etiqueta="Última modificación hecha por"
            idEtiqueta="lbModificadoPor"
            options={datos.matrizUsuarios}
            readOnly={true}
          />
        </Grid>
        <Grid size={5}>
          <CampoTexto
            nombreInstancia="fechaCreacionCuenta"
            texto={
              datos.datosCuenta ? datos.datosCuenta.fechaCreacionCuenta : ""
            }
            //setCampo={() => {}}
            etiqueta={"Fecha de creación"}
            readonly={true}
          />
        </Grid>
        <Grid size={5}>
          <CampoTexto
            nombreInstancia="fechaModificacionCuenta"
            texto={
              datos.datosCuenta ? datos.datosCuenta.fechaModificacionCuenta : ""
            }
            etiqueta={"Fecha de última modificación"}
            readonly={true}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
