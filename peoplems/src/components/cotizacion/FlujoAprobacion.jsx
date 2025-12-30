import {
  Stepper,
  Step,
  StepButton,
  Box,
  StepLabel,
  Button,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import { FieldSet } from "./datosComplementarios/resumen/FieldSet";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect, useState, memo, useContext } from "react";
import { VentanaConfirmacion } from "../comun/VentanaConfirmacion";
//import { VentanaTabla } from "./VentanaTabla";
import {
  BORRADOR,
  EN_EVALUACION,
  APROBADA,
  RECHAZADA,
  GANADA,
  PERDIDA,
  ABANDONADA,
  ACEPTADA,
  PONER_COTIZACION_EN_ESTADO_BORRADOR,
  SOLICITAR_APROBACION_DE_COTIZACION,
  APROBAR_O_RECHAZAR_COTIZACION,
  DECLARAR_LA_COTIZACION_GANADA,
  ACEPTAR_LA_COTIZACION_GANADA,
} from "../../config/constantes.js";
import * as permisos from "../../config/permisos.js";
import { AuthContext } from "../..//pages//Login";
import { Alerta } from "../comun/Alerta";

const FlujoAprobacion = memo(function FlujoAprobacion({
  datos,
  registrarDatos,
}) {
  const [estadoCotizacion, setEstadoCotizacion] = useState(0);
  const [estadoVisual, setEstadoVisual] = useState(0);
  const [openConfirmacion, setOpenConfirmacion] = useState({});
  const [listaEstados, setListaEstados] = useState([]);
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  const [mensajeFracaso, setMensajeFracaso] = useState("");
  /*const [openVentanaCotizacionGanada, setOpenVentanaCotizacionGanada] =
    useState(false);*/

  const { user } = useContext(AuthContext);
  console.log(user);
  console.log("funcion FlujoAprobacion", datos, permisos);

  useEffect(() => {
    console.log("useEffect FlujoAprobacion", datos.idEstadoCotizacion);
    let listEstados = [];
    let estadVisual = 0;
    switch (datos.idEstadoCotizacion) {
      case BORRADOR: //Borrador
        listEstados = [
          "Borrador",
          "En evaluación",
          "Aprobada",
          "Ganada",
          "Aceptada",
        ];
        estadVisual = 1;
        break;
      case EN_EVALUACION: //En Aprobacion
        listEstados = [
          "Borrador",
          "En evaluación",
          "Aprobada",
          "Ganada",
          "Aceptada",
        ];
        estadVisual = 2;
        break;
      case APROBADA: //Aprobada
        listEstados = [
          "Borrador",
          "En evaluación",
          "Aprobada",
          "Ganada",
          "Aceptada",
        ];
        estadVisual = 3;
        break;
      case RECHAZADA: //Rechazada
        listEstados = [
          "Borrador",
          "En evaluación",
          "Rechazada",
          "Ganada",
          "Aceptada",
        ];
        estadVisual = 3;
        break;
      case GANADA: //Ganada
        listEstados = [
          "Borrador",
          "En evaluación",
          "Aprobada",
          "Ganada",
          "Aceptada",
        ];
        estadVisual = 4;
        break;
      case PERDIDA: //Perdida
        listEstados = [
          "Borrador",
          "En evaluación",
          "Aprobada",
          "Perdida",
          "Aceptada",
        ];
        estadVisual = 4;
        break;
      case ACEPTADA: //Aceptada
        listEstados = [
          "Borrador",
          "En evaluación",
          "Aprobada",
          "Ganada",
          "Aceptada",
        ];
        estadVisual = 5;
        break;
      case ABANDONADA: //Perdida
        listEstados = [
          "Borrador",
          "En evaluación",
          "Aprobada",
          "Abandonada",
          "Aceptada",
        ];
        estadVisual = 4;
        break;
    }
    setListaEstados(listEstados);
    setEstadoVisual(estadVisual - 1);
    setEstadoCotizacion(datos.idEstadoCotizacion);
  }, [datos.idEstadoCotizacion]);

  function handleClickEstado(indice) {
    console.log("funcion handleClickEstado", indice);

    switch (indice) {
      case PONER_COTIZACION_EN_ESTADO_BORRADOR:
        if (
          user?.permisos?.includes(
            permisos.PERMISO__VENTAS_COTIZADOR_NUEVACOTABRIRCOT_PERMITIRCAMBIOS
          )
        ) {
          setOpenConfirmacion({
            open: true,
            titulo: "Poner la cotización en estado Borrador",
            contenido: "¿Desea poner la cotización en estado Borrador?",
            accion: "PonerBorrador",
            onPonerBorrador: () => {
              console.log("Poner en borrador la cotización");
              registrarDatos(BORRADOR, "estadoCotizacion"); //En borrador
              setOpenAlert("success");
              setOpenConfirmacion({ open: false });
            },
            onCancelar: () => {
              console.log(
                "Cancelada la solicitud de poner en borrador la cotización"
              );
              setOpenConfirmacion({ open: false });
            },
          });
        } else {
          setMensajeFracaso("No tiene el permiso para realizar esta operación");
          setOpenAlert("error");
          console.log("no tiene permisos");
        }

        break;

      //Solicitar aprobación
      case SOLICITAR_APROBACION_DE_COTIZACION:
        if (
          user?.permisos?.includes(
            permisos.PERMISO__VENTAS_COTIZADOR_NUEVACOTABRIRCOT_FLUJO_SOLICITARAPROBACION
          )
        ) {
          if (estadoCotizacion === BORRADOR || estadoCotizacion === RECHAZADA) {
            setOpenConfirmacion({
              open: true,
              titulo: "Solicitar aprobar la cotización",
              contenido:
                "¿Desea enviar la solicitud para aprobación de la cotización?",
              accion: "SolicitarAprobacion",
              onSolicitar: () => {
                console.log("Solicitar aprobar la cotización");
                registrarDatos(EN_EVALUACION, "estadoCotizacion"); //En aprobacion
                setOpenAlert("success");
                setOpenConfirmacion({ open: false });
              },
              onCancelar: () => {
                console.log(
                  "Cancelada la solicitud de aprobación de la cotización"
                );
                setOpenConfirmacion({ open: false });
              },
            });
          } else {
            setMensajeFracaso(
              "Para solicitar la aprobación de la propuesta, esta debe estar en la etapa de borrador"
            );
            setOpenAlert("error");
          }
        } else {
          setMensajeFracaso("No tiene el permiso para realizar esta operación");
          setOpenAlert("error");
          console.log("no tiene permisos");
        }
        break;

      case APROBAR_O_RECHAZAR_COTIZACION:
        if (
          user?.permisos?.includes(
            permisos.PERMISO__VENTAS_COTIZADOR_NUEVACOTABRIRCOT_FLUJO_APROBAR
          )
        ) {
          if (estadoCotizacion === EN_EVALUACION) {
            setOpenConfirmacion({
              open: true,
              titulo: "Aprobar la cotización",
              contenido: "¿Desea aprobar o rechazar la cotización?",
              accion: "Aprobacion",
              onAprobar: () => {
                console.log("Aprobar la cotización");
                registrarDatos(APROBADA, "estadoCotizacion"); //Aprobada
                setOpenAlert("success");
                setOpenConfirmacion({ open: false });
              },
              onRechazar: () => {
                console.log("Rechazar la cotización");
                registrarDatos(RECHAZADA, "estadoCotizacion"); //Rechazada
                setOpenAlert("success");
                setOpenConfirmacion({ open: false });
              },
              onCancelar: () => {
                console.log("Cancelada la aprobación de la cotización");
                setOpenConfirmacion({ open: false });
              },
            });
          } else {
            setMensajeFracaso(
              "Para aprobar o rechazar la propuesta, debe haberse solicitado su aprobación previamente"
            );
            setOpenAlert("error");
          }
        } else {
          setMensajeFracaso("No tiene el permiso para realizar esta operación");
          setOpenAlert("error");
          console.log("no tiene permisos");
        }
        break;

      case DECLARAR_LA_COTIZACION_GANADA:
        if (
          user?.permisos?.includes(
            permisos.PERMISO__VENTAS_COTIZADOR_NUEVACOTABRIRCOT_FLUJO_DECLARARGANADA
          )
        ) {
          setOpenConfirmacion({
            open: true,
            titulo: "Declarar la cotización como Ganada, Perdida o Abandonada",
            contenido: "¿Como desea declara la cotización?",
            accion: "GanarPerderAbandonar",
            onGanada: () => {
              console.log("Declarar ganada la cotización");
              if (estadoCotizacion === APROBADA) {
                registrarDatos(GANADA, "estadoCotizacion"); //Ganada
                setOpenAlert("success");
                setOpenConfirmacion({ open: false });
                //setOpenVentanaCotizacionGanada(true);
              } else {
                setMensajeFracaso(
                  "Para declarar la propuesta como ganada, debe haber sido aprobada previamente"
                );
                setOpenAlert("error");
                setOpenConfirmacion({ open: false });
              }
            },
            onPerdida: () => {
              if (
                estadoCotizacion === APROBADA ||
                estadoCotizacion === BORRADOR ||
                estadoCotizacion === EN_EVALUACION ||
                estadoCotizacion === RECHAZADA
              ) {
                console.log("Declarar perdida la cotización");
                registrarDatos(PERDIDA, "estadoCotizacion"); //Perdida
                setOpenAlert("success");
                setOpenConfirmacion({ open: false });
              } else {
                setMensajeFracaso(
                  "Para declarar la propuesta como perdida, no debe estar ganada o aceptada"
                );
                setOpenAlert("error");
                setOpenConfirmacion({ open: false });
              }
            },
            onAbandonada: () => {
              if (
                estadoCotizacion === APROBADA ||
                estadoCotizacion === BORRADOR ||
                estadoCotizacion === EN_EVALUACION ||
                estadoCotizacion === RECHAZADA
              ) {
                console.log("Declarar abandonada la cotización");
                registrarDatos(ABANDONADA, "estadoCotizacion"); //Abandonada
                setOpenAlert("success");
                setOpenConfirmacion({ open: false });
              } else {
                setMensajeFracaso(
                  "Para declarar la propuesta como abandonada, no debe estar ganada o aceptada"
                );
                setOpenAlert("error");
                setOpenConfirmacion({ open: false });
              }
            },
            onCancelar: () => {
              console.log("Cancelada la aprobación de la cotización");
              setOpenConfirmacion({ open: false });
            },
          });
        } else {
          setMensajeFracaso("No tiene el permiso para realizar esta operación");
          setOpenAlert("error");
          console.log("no tiene permisos");
        }
        break;

      case ACEPTAR_LA_COTIZACION_GANADA:
        if (
          user?.permisos?.includes(
            permisos.PERMISO__VENTAS_COTIZADOR_NUEVACOTABRIRCOT_FLUJO_ACEPTARORDEN
          )
        ) {
          if (estadoCotizacion === GANADA) {
            setOpenConfirmacion({
              open: true,
              titulo: "Aceptar la cotización ganada",
              contenido: "¿Desea aceptar la cotización ganada?",
              accion: "Aceptar",
              onAceptar: () => {
                console.log("Aceptar la cotización");
                registrarDatos(ACEPTADA, "estadoCotizacion"); //Aceptada
                setOpenAlert("success");
                setOpenConfirmacion({ open: false });
              },
              onCancelar: () => {
                console.log("Cancelada la aprobación de la cotización");
                setOpenConfirmacion({ open: false });
              },
            });
          } else {
            setMensajeFracaso(
              "Para aceptar la propuesta, debe haber sido declarada ganada previamente"
            );
            setOpenAlert("error");
          }
        } else {
          setMensajeFracaso("No tiene el permiso para realizar esta operación");
          setOpenAlert("error");
          console.log("no tiene permisos");
        }

        break;
    }
  }

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            backgroundColor: "lightblue",
          }}
        >
          <Typography component="span">Progreso de la Cotización</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {openAlert != "sinAlerta" && (
            <Alerta
              openAlert={openAlert}
              setOpenAlert={setOpenAlert}
              mensajeFracaso={mensajeFracaso}
            ></Alerta>
          )}
          <FieldSet
            titulo={"Flujo de la Propuesta"}
            color="primary.main"
            tamanoTitulo="1.2rem"
            anchoBorde={2}
            radioBorde={1}
            my={2}
          >
            <Stepper
              nonLinear
              alternativeLabel
              activeStep={estadoVisual}
              sx={{ marginBottom: 5, marginTop: 2 }}
            >
              {listaEstados.map((label, index) => {
                return (
                  <Step key={index}>
                    <StepButton
                      color="inherit"
                      onClick={() => handleClickEstado(index)}
                    >
                      {label}
                    </StepButton>
                  </Step>
                );
              })}
            </Stepper>
          </FieldSet>
          {openConfirmacion.open && (
            <VentanaConfirmacion
              openConfirmacion={openConfirmacion.open}
              titulo={openConfirmacion.titulo}
              contenido={openConfirmacion.contenido}
              //ejecutarConfirmacion={confimarAccion}
              accion={openConfirmacion.accion}
              onPonerBorrador={openConfirmacion.onPonerBorrador}
              onSolicitar={openConfirmacion.onSolicitar}
              onAprobar={openConfirmacion.onAprobar}
              onRechazar={openConfirmacion.onRechazar}
              onGanada={openConfirmacion.onGanada}
              onPerdida={openConfirmacion.onPerdida}
              onAbandonada={openConfirmacion.onAbandonada}
              onAceptar={openConfirmacion.onAceptar}
              onCancelar={openConfirmacion.onCancelar}
            ></VentanaConfirmacion>
          )}
          {/*openVentanaCotizacionGanada && (
            <VentanaTabla
              openVentana={openVentanaCotizacionGanada}
              setOpenVentana={setOpenVentanaCotizacionGanada}
              tituloVentana={"Cotización Ganada"}
              //onGrabar={handleGrabar}
              //onConfirmar={handleConfirmar}
              //onCancelar={handleCancelar}
            />
          )*/}
        </AccordionDetails>
      </Accordion>
    </>
  );
});

export default FlujoAprobacion;
