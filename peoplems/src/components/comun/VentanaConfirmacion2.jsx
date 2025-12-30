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
  //ejecutarConfirmacion,
  accion,
  onAceptar = () => {},
  onCancelar = () => {},
}) {
  const [open, setOpen] = useState(false);

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
        {/*<Button onClick={() => ejecutarConfirmacion(accion)}>Confirmar</Button>
        <Button onClick={() => ejecutarConfirmacion("cancelar")} autoFocus>
          Cancelar
        </Button>*/}
        <Button onClick={() => onAceptar()}>Aceptar</Button>
        <Button onClick={() => onCancelar()}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
