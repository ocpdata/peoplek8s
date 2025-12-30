import { Paper } from "@mui/material";

export function LogoImpresion({ logoRef }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: 100,
        width: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Para evitar que la imagen se desborde
        border: "none",
        my: 3,
      }}
      ref={logoRef}
    >
      <img
        src="/AQ_Logo.png" // Reemplaza con la URL o ruta de tu imagen
        alt="Logo Access Quality"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </Paper>
  );
}
