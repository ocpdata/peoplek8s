import { Box, Typography } from "@mui/material";

export function FieldSet({
  titulo,
  color = "grey.800",
  tamanoTitulo = "1rem",
  anchoBorde = 1,
  radioBorde = 2,
  children,
  sx = {},
  ...props
}) {
  return (
    <Box
      component="fieldset"
      sx={{
        borderColor: color,
        borderWidth: anchoBorde,
        borderRadius: radioBorde,
        ...sx,
      }}
      {...props}
    >
      {titulo && (
        <Typography
          component="legend"
          sx={{
            color: color,
            fontSize: tamanoTitulo,
          }}
        >
          {titulo}
        </Typography>
      )}
      {children}
    </Box>
  );
}
