import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

export function Alerta({
  openAlert,
  setOpenAlert,
  mensajeExito = `La operación fue exitosa.`,
  mensajeFracaso = `La operación no se pudo realizar.`,
}) {
  console.log("funcion Alerta");
  return (
    <>
      {openAlert === "success" && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          onClose={() => setOpenAlert("sinAlerta")}
        >
          {mensajeExito}
        </Alert>
      )}
      {openAlert === "error" && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="error"
          onClose={() => setOpenAlert("sinAlerta")}
        >
          {mensajeFracaso}
        </Alert>
      )}
    </>
  );
}
