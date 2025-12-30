export function calcularTotalesCotizacion(secciones) {
  console.log("funcion calcularTotalesCotizacion", secciones);
  //Obtener la suma de todos las propiedades costoTotal y la suma de todos los precioVentaTotal de todas las filas de cada seccion de datosFilas
  //No considerar en esta suma las filas cuya propiedad grupo sea mayor a 1000
  if (secciones) {
    const sumaTotales = secciones.reduce(
      (acumulador, seccion) => {
        if (seccion.datosSeccion.idControlSeccion === 1) {
          const resumenFila = seccion.filas.reduce(
            (acc, fila) => {
              if (fila.grupo <= 1000) {
                if (
                  Number(fila.fabricante) === 27 ||
                  Number(fila.fabricante) === 34
                ) {
                  acc.costoTotalServicios += fila.costoTotal || 0;
                  acc.precioVentaTotalServicios += fila.precioVentaTotal || 0;
                } else {
                  acc.costoTotalProductos += fila.costoTotal || 0;
                  acc.precioVentaTotalProductos += fila.precioVentaTotal || 0;
                }
                acc.costoTotal += fila.costoTotal || 0;
                acc.precioVentaTotal += fila.precioVentaTotal || 0;
              }
              //console.log(acc);
              return acc;
            },
            {
              costoTotal: 0,
              precioVentaTotal: 0,
              costoTotalServicios: 0,
              precioVentaTotalServicios: 0,
              costoTotalProductos: 0,
              precioVentaTotalProductos: 0,
            }
          );
          //console.log(resumenFila.costoTotal);
          acumulador.costoTotal += resumenFila.costoTotal;
          acumulador.precioVentaTotal += resumenFila.precioVentaTotal;
          acumulador.costoTotalServicios += resumenFila.costoTotalServicios;
          acumulador.precioVentaTotalServicios +=
            resumenFila.precioVentaTotalServicios;
          acumulador.costoTotalProductos += resumenFila.costoTotalProductos;
          acumulador.precioVentaTotalProductos +=
            resumenFila.precioVentaTotalProductos;
        }
        return acumulador;
      },
      {
        costoTotal: 0,
        precioVentaTotal: 0,
        costoTotalServicios: 0,
        precioVentaTotalServicios: 0,
        costoTotalProductos: 0,
        precioVentaTotalProductos: 0,
      }
    );

    console.log("Suma de totales:", sumaTotales);
    return sumaTotales;
  } else {
    return {
      costoTotal: 0,
      precioVentaTotal: 0,
      costoTotalServicios: 0,
      precioVentaTotalServicios: 0,
      costoTotalProductos: 0,
      precioVentaTotalProductos: 0,
    };
  }
}
