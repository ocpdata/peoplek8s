import { useEffect, useRef, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepButton from "@mui/material/StepButton";
import { Box, Button, Typography, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import DoNotDisturbOutlinedIcon from "@mui/icons-material/DoNotDisturbOutlined";
import { Preguntas } from "./Preguntas";
import { grabarRespuestasOportunidad } from "../../controllers/grabarOportunidad.js";
import { Alerta } from "../comun/Alerta";

export function CicloVida({
  nombreEtapasVenta,
  pregRespOportunidad,
  idEtapaVenta,
  registrarDatos,
  respuestaIA = "",
}) {
  //Setters del stepper
  const [etapaVentaSeleccionada, setEtapaVentaSeleccionada] =
    useState(idEtapaVenta); //etapa de venta que se selecciona. No cambia la etapa real de la oportunidad
  const [etapaVentaActual, setEtapaVentaActual] = useState(idEtapaVenta); //etapa de venta que solo cambia cuando se valida, se regresa, o se salta
  const [estadoOportunidad, setEstadoOportunidad] = useState("");
  const [abrirPregunta, setAbrirPregunta] = useState(0);
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  console.log(
    "CicloVida componente",
    nombreEtapasVenta,
    pregRespOportunidad,
    idEtapaVenta,
    respuestaIA
  );

  //Registra en los datos de la oportunidad que se seleccionó la etapa que se clickeó. No cambia la etapa de la oportunidad ni la graba
  const handleStep = (idEtapaStepper) => () => {
    console.log("funcion handleStep", idEtapaStepper);
    setEtapaVentaSeleccionada(idEtapaStepper + 102);
    registrarDatos(idEtapaStepper, "stepperEtapaOportunidad");
  };

  function registrarRespuestas(respuesta) {
    const nuevaRespuesta = pregRespuestas.map((el) => {
      if (el.id === respuesta.id) {
        console.log("encontrado", el);
        return { ...el, respuesta: respuesta.respuesta };
      } else {
        return el;
      }
    });
  }

  //Recibe la señal de actualizar los setters con la información de la oportunidad seleccionada
  useEffect(() => {
    console.log("useEffect CicloVida");
    setEtapaVentaSeleccionada(idEtapaVenta);
    setEtapaVentaActual(idEtapaVenta - 102);

    switch (idEtapaVenta) {
      case 109:
        setEstadoOportunidad("Ganada"); //Ganado
        break;
      case 110:
        setEstadoOportunidad("Perdida"); //Perdido
        break;
      case 111:
        setEstadoOportunidad("Anulada"); //Anulado
        break;
      default:
        setEstadoOportunidad("Activa"); //Activa
        break;
    }
  }, [idEtapaVenta]);

  useEffect(() => {
    if (respuestaIA != "") {
      if (respuestaIA[0] === "S") {
        setOpenAlert("success");
      } else {
        setOpenAlert("error");
      }
    }
  }, [respuestaIA]);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
        sx={{
          backgroundColor: "lightblue",
        }}
      >
        <Typography component="span">
          Ciclo de Vida de la Oportunidad
        </Typography>
      </AccordionSummary>
      {openAlert != "sin Alerta" && (
        <Alerta
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          mensajeExito={respuestaIA}
          mensajeFracaso={respuestaIA}
        ></Alerta>
      )}
      <AccordionDetails>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            //maxHeight: 900,
            //minHeight: 200,
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            rowSpacing={2}
          >
            <Grid size={11}>
              <Stepper
                nonLinear
                alternativeLabel
                activeStep={etapaVentaSeleccionada - 102}
                sx={{ marginBottom: 5, marginTop: 2 }}
              >
                {nombreEtapasVenta.map((label, index) => {
                  return (
                    <Step key={index}>
                      <StepButton
                        onClick={handleStep(index)}
                        sx={{
                          color:
                            index <= etapaVentaActual ? "green" : "lightgray",
                          "& .MuiStepIcon-root": {
                            color:
                              index <= etapaVentaActual ? "green" : "lightgray",
                          },
                        }}
                      >
                        {/*</StepButton><StepButton color="inherit" onClick={handleStep(index)}>*/}
                        {label}
                      </StepButton>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
            <Grid size={1}>
              <IconButton aria-label="delete" sx={{ flexDirection: "column" }}>
                {estadoOportunidad === "Ganada" ? (
                  <CheckCircleOutlineOutlinedIcon
                    fontSize="large"
                    sx={{ color: "green" }}
                  ></CheckCircleOutlineOutlinedIcon>
                ) : estadoOportunidad === "Perdida" ? (
                  <DoDisturbOnOutlinedIcon
                    fontSize="large"
                    sx={{ color: "red" }}
                  ></DoDisturbOnOutlinedIcon>
                ) : estadoOportunidad === "Anulada" ? (
                  <DoNotDisturbOutlinedIcon
                    fontSize="large"
                    sx={{ color: "orange" }}
                  ></DoNotDisturbOutlinedIcon>
                ) : null}
                <Typography variant="caption">
                  {estadoOportunidad === "Ganada"
                    ? "Ganada"
                    : estadoOportunidad === "Perdida"
                    ? "Perdida"
                    : estadoOportunidad === "Anulada"
                    ? "Anulada"
                    : ""}
                </Typography>
              </IconButton>
            </Grid>
            <Grid size={12}>
              <Preguntas
                idEtapa={etapaVentaSeleccionada}
                registrarDatos={registrarDatos}
                listaPreguntas={pregRespOportunidad.filter((pregunta) => {
                  return pregunta.idEtapa === etapaVentaSeleccionada;
                })}
              ></Preguntas>
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
