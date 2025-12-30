import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

export function Preguntas({ idEtapa, listaPreguntas, registrarDatos }) {
  const [preguntasEtapa, setPreguntasEtapa] = useState(listaPreguntas);
  const [value, setValue] = useState("");

  console.log("Preguntas componente", idEtapa, listaPreguntas);

  useEffect(() => {
    console.log("useEffect Pregunta", idEtapa);

    setPreguntasEtapa(listaPreguntas);
  }, [listaPreguntas]);

  function handleChange(event) {
    //Actualiza la respuesta y la coloca en la matriz de preguntas y respuestas de la etapa para displayar en pantalla
    let respuesta = "";
    const valorIngresado = preguntasEtapa.map((el) => {
      if (el.idPregunta === Number(event.target.name)) {
        respuesta = event.target.value;
      } else {
        respuesta = el.respuesta;
      }
      return { ...el, respuesta: respuesta };
    });
    console.log(valorIngresado);

    //Filtra solo la pregunta y respuesta
    const valorAEnviar = valorIngresado.filter((el) => {
      return el.idPregunta === Number(event.target.name);
    });
    console.log("valorAEnviar", valorAEnviar);
    //console.log(preguntasEtapa);
    setValue(event.target.value);
    setPreguntasEtapa(valorIngresado);
    registrarDatos(valorAEnviar[0], "preguntasOportunidad");
  }

  return (
    <Box>
      <Grid
        container
        //direction="row"
        //justifyContent="space-between"
        rowSpacing={2}
        //sx={{ height: 800 }}
      >
        {preguntasEtapa.map((pregunta) => {
          return (
            <Grid key={pregunta.idPregunta} size={12} container direction="row">
              <Grid size={11}>
                <TextField
                  name={pregunta.idPregunta}
                  label={pregunta.pregunta}
                  value={pregunta.respuesta}
                  inputProps={{ readOnly: pregunta.validacion }}
                  disabled={pregunta.deshabilitado}
                  color={pregunta.validacion ? "success" : "main"}
                  InputLabelProps={{
                    style: {
                      color: pregunta.validacion && "white",
                      backgroundColor: pregunta.validacion && "green",
                    },
                  }}
                  InputProps={{
                    style: { color: pregunta.validacion && "green" },
                  }}
                  multiline
                  maxRows={4}
                  variant="standard"
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={1}>
                <IconButton
                  aria-label="delete"
                  sx={{ flexDirection: "column", marginTop: 1 }}
                >
                  <MicIcon fontSize="small" sx={{ color: "blue" }}></MicIcon>
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
