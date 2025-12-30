import { memo } from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import numeral from "numeral";

const CustomFooterTablaCotizacion = memo(function CustomFooterTablaCotizacion({
  listFilas,
}) {
  console.log("funcion CustomFooterTablaCotizacion", JSON.parse(listFilas));
  //Calcular la suma total de todos los items en listFilas menos el precio de venta de los agrupadores
  const costoTotal = JSON.parse(listFilas).reduce((sum, fila) => {
    //console.log(fila);
    if (fila.grupo <= 1000) {
      //console.log(sum, fila.costoTotal);
      if (fila.costoTotal) {
        return sum + Number(fila.costoTotal);
      } else {
        return sum;
      }
    }
    //console.log(sum);
    return sum;
  }, 0);
  //console.log(costoTotal);
  const ventaTotal = JSON.parse(listFilas).reduce((sum, fila) => {
    console.log(fila);
    if (fila.grupo <= 1000) {
      //console.log(sum, fila.precioVentaTotal);
      return sum + Number(fila.precioVentaTotal);
    }
    //console.log(sum);
    return sum;
  }, 0);
  //console.log(ventaTotal);

  return (
    //<Box sx={{ p: 1, display: "flex" }}>
    <div>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        rowSpacing={2}
      >
        <Grid xs={5}>
          <Typography
            align="right"
            sx={{ color: "red", fontFamily: "Verdana", fontSize: "1rem" }}
          >
            Costo Total: {numeral(costoTotal).format("0,0.00")} US$
          </Typography>
        </Grid>
        <Grid xs={5}>
          <Typography
            align="left"
            sx={{ color: "green", fontFamily: "Verdana", fontSize: "1rem" }}
          >
            Venta Total: {numeral(ventaTotal).format("0,0.00")} US$
          </Typography>
        </Grid>
      </Grid>
    </div>
    //</Box>
  );
});

export { CustomFooterTablaCotizacion };
