import { useContext } from "react";
import { TextField, Grid } from "@mui/material";
import { brandData } from "../../../config/constantes";
import { AuthContext } from "../../../pages/Login";

export function DatosCotizacionImpresion({ datosBasicos, datosOpciones }) {
  const { user } = useContext(AuthContext);

  //Encontrar el nombre de la empresa en  datosDB.matrizCuentasCotizacion sabiendo que el id de la empresa es datosDB.datosCotizacion.idCuentaOportunidad
  const empresaCliente =
    datosOpciones.matrizCuentasCotizacion.find(
      (cuenta) => cuenta.id === datosBasicos.idCuentaOportunidad
    )?.nombre || "Empresa no encontrada";
  console.log("Nombre de la empresa:", empresaCliente);

  //Encontrar el nombre del contacto en datosDB.matrizContactosCuenta sabiendo que el id del contacto es datosDB.datosCotizacion.idContactoCotizacion
  const nombreContacto =
    datosOpciones.matrizContactosCuenta.find(
      (contacto) => contacto.id === datosBasicos.idContactoCotizacion
    )?.nombre || "Contacto no encontrado";
  const emailContacto =
    datosOpciones.matrizContactosCuenta.find(
      (contacto) => contacto.id === datosBasicos.idContactoCotizacion
    )?.email || "Contacto no encontrado";
  console.log("Nombre del contacto:", nombreContacto, emailContacto);

  //Encontrar el nombre del usuario en datosDB.matrizUsuarios sabiendo que el id del usuario es user.id
  const nombreUsuario =
    datosOpciones.matrizUsuarios.find((usuario) => usuario.id === user.id)
      ?.nombre || "Usuario no encontrado";
  const emailUsuario =
    datosOpciones.matrizUsuarios.find((usuario) => usuario.id === user.id)
      ?.email || "Usuario no encontrado";
  const telefonoUsuario =
    datosOpciones.matrizUsuarios.find((usuario) => usuario.id === user.id)
      ?.telefono || "Usuario no encontrado";
  console.log(
    "Nombre del usuario:",
    nombreUsuario,
    emailUsuario,
    telefonoUsuario
  );

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      rowSpacing={2}
      //mx={4}
      px={4}
    >
      <Grid item xs={5}>
        <TextField
          fullWidth
          value={`${brandData.razonSocial} \nRFC:${brandData.rfc} \n${brandData.direccion}`}
          variant="outlined"
          multiline
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          fullWidth
          value={`Fecha: ${datosBasicos.fechaCotizacion}`}
          variant="outlined"
          multiline
          minRows={4}
          inputProps={{ readOnly: true }}
          //sx={{ ml: 4 }}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          fullWidth
          value={`Cliente: ${empresaCliente}`}
          variant="outlined"
          multiline
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          fullWidth
          value={`Propuesta: ${datosBasicos.idCotizacion} V-${datosBasicos.versionCotizacion}`}
          variant="outlined"
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          fullWidth
          value={`Contacto: ${nombreContacto} \n${emailContacto}`}
          variant="outlined"
          multiline
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          fullWidth
          value={`Vendedor: ${nombreUsuario} \n${emailUsuario}    Telf:${telefonoUsuario}`}
          variant="outlined"
          multiline
          inputProps={{ readOnly: true }}
        />
      </Grid>
    </Grid>
  );
}
