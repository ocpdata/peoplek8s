import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export function VentanaConfirmacion({
  openConfirmacion,
  titulo,
  contenido,
  accion,
  //ejecutarConfirmacion,
  //accion,
  onPonerBorrador = () => {},
  onSolicitar = () => {},
  onAprobar = () => {},
  onRechazar = () => {},
  onGanada = () => {},
  onPerdida = () => {},
  onAbandonada = () => {},
  onAceptar = () => {},
  onCancelar = () => {},
  onGrabarNuevaVersion = () => {},
}) {
  const [open, setOpen] = useState(false);
  console.log("funcion VentanaConfirmacion", accion);

  useEffect(() => {
    setOpen(openConfirmacion);
  }, [openConfirmacion]);

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {contenido}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {accion === "PonerBorrador" && (
          <Button onClick={() => onPonerBorrador()}>Borrador</Button>
        )}
        {accion === "SolicitarAprobacion" && (
          <Button onClick={() => onSolicitar()}>Solicitar</Button>
        )}
        {accion === "Aprobacion" && (
          <>
            <Button onClick={() => onAprobar()}>Aprobar</Button>
            <Button onClick={() => onRechazar()}>Rechazar</Button>
          </>
        )}
        {accion === "GanarPerderAbandonar" && (
          <>
            <Button onClick={() => onGanada()}>Ganada</Button>
            <Button onClick={() => onPerdida()}>Perdida</Button>
            <Button onClick={() => onAbandonada()}>Abandonada</Button>
          </>
        )}
        {accion === "Aceptar" && (
          <>
            <Button onClick={() => onAceptar()}>Aceptar</Button>
          </>
        )}
        {accion === "GrabarCotizacion" && (
          <>
            <Button onClick={() => onAceptar()}>Aceptar</Button>
            <Button onClick={() => onGrabarNuevaVersion()}>
              Nueva versión
            </Button>
          </>
        )}
        {accion === "grabarRegistro" && (
          <>
            <Button onClick={() => onAceptar()}>Aceptar</Button>
          </>
        )}
        {accion === "validar" && (
          <>
            <Button onClick={() => onAceptar()}>Aceptar</Button>
          </>
        )}

        <Button onClick={() => onCancelar()}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
