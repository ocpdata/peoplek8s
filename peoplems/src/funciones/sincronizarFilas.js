function definirNumeroItemPorFila(filas) {
  //Retornar una matriz que indique que numero de item le corresponde a cada fila
  //El numero de item inicia en 1, es creciente y secuencial, y se asigna a cada fila de acuerdo a su orden en filas
  //Si la fila es un agrupador o pertenece a un grupo, el numero de item de esa fila debe ser el mismo numero de item que el del grupo al que pertenece
  //Es posible que una fila que pertenezca a un grupo este antes que el grupo. Validar con una segunda pasada
  if (!Array.isArray(filas) || filas.length === 0) return [];

  const matriz = new Array(filas.length).fill(0);

  // Primer pasada: asignar número de item secuencial a filas individuales y agrupadores
  let numeroItem = 1;
  const grupoToNumeroItem = {};

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    if (fila.grupo === 0) {
      matriz[i] = numeroItem;
      numeroItem++;
    } else if (fila.grupo > 1000) {
      matriz[i] = numeroItem;
      grupoToNumeroItem[fila.grupo - 1000] = numeroItem;
      numeroItem++;
    }
  }

  // Segunda pasada: asignar a los componentes de grupo el número de item de su agrupador
  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    if (fila.grupo > 0 && fila.grupo < 1000) {
      if (grupoToNumeroItem[fila.grupo]) {
        matriz[i] = grupoToNumeroItem[fila.grupo];
      } else {
        // Si el agrupador aún no fue encontrado, buscarlo en la lista
        for (let j = 0; j < filas.length; j++) {
          if (filas[j].grupo === fila.grupo + 1000) {
            matriz[i] = matriz[j];
            grupoToNumeroItem[fila.grupo] = matriz[j];
            break;
          }
        }
        // Si aún no se encontró, asignar provisionalmente el siguiente número de item
        if (!matriz[i]) {
          matriz[i] = numeroItem;
          grupoToNumeroItem[fila.grupo] = numeroItem;
          numeroItem++;
        }
      }
    }
  }

  return matriz;
}

//Para cada fila enviada, se calcula el costo y precio de venta. Tambien se actualiza el id, numero de item (contabilizado desde 1)
//Tambien se actualiza la lista de grupos incluyendo el total de cada grupo y sus componentes.
//Devuelve la lista de filas actualizad, la lista de grupos actualizada y el total de items (no numero de filas)
export function sincronizarFilas(listaFilas) {
  console.log("funcion sincronizarFilas", listaFilas);
  //1. Se crea una lista de las filas de la seccion. Se actualiza el numero de items de acuerdo a si los items son individuales o forman parte de un grupo
  //2. Se arma la lista de grupos (id, filas que lo componen y valor de venta)
  //3. Se obtiene la suma agregada de los componentes de cada grupo, asi como los componentes de cada grupo
  //4. Se arma la nueva lista de items con los grupos actualizados

  const matrizFilasItem = definirNumeroItemPorFila(listaFilas);

  //1. Se crea una lista de las filas de la seccion. Se actualiza el numero de items de acuerdo a si los items son indiviudales o forman parte de un grupo
  let numeroItem = 0;
  const listaFilasLeidas = listaFilas.map((fila, indice) => {
    //Definir un numeroItem creciente desde uno para cada fila. Si la fila es un agrupador o pertenece a un grupo, el numero de item debe ser el mismo. Los nuemros de item deben ser secuenciales

    numeroItem = matrizFilasItem[indice];
    let precioTotal = 0;
    let costoTotal = 0;
    if (Number(fila.grupo) < 1000) {
      costoTotal =
        fila.precioListaUnitario *
        (1 - fila.descuentoFabricante / 100) *
        (1 + fila.importacion / 100) *
        fila.cantidad;
      precioTotal =
        (costoTotal / (1 - fila.margen / 100)) *
        (1 - fila.descuentoFinal / 100) *
        fila.tipoCambio * //tipocambio
        (1 + fila.iva / 100);
    }
    return {
      id: indice + 1,
      //item: fila.numeroItem,
      item: numeroItem,
      grupo: Number(fila.grupo), //0 no forma parte de ningun grupo, 0 < n < 1000 es parte del grupo n, n > 1000 es el agregador del grupo (n-1000)
      fabricante: fila.fabricante,
      codigoItem: fila.codigoItem,
      descripcion: fila.descripcion,
      cantidad: fila.cantidad,
      precioListaUnitario: fila.precioListaUnitario,
      descuentoFabricante: fila.descuentoFabricante,
      importacion: fila.importacion,
      costoTotal: costoTotal,
      margen: fila.margen,
      tipoCambio: fila.tipoCambio, //tipocambio
      iva: fila.iva,
      descuentoFinal: fila.descuentoFinal,
      precioVentaTotal: precioTotal,
      filaResaltada: fila.filaResaltada,
      filaEscondida: fila.filaEscondida,
      filaSubtitulo: fila.filaSubtitulo,
      filaSinPrecio: fila.filaSinPrecio,
      formula: fila.formula,
      formulaPrecioTotal: fila.formulaPrecioTotal,
      status: fila.status,
    };
  });
  console.log("listaFilasLeidas", listaFilasLeidas);

  //2. Se arma la lista de grupos (id, filas que lo componen y valor de venta)
  const listaGrupos = [];
  listaFilasLeidas.map((fila) => {
    if (fila.grupo > 1000) {
      listaGrupos.push({
        id: fila.grupo - 1000,
        costo: 0,
        filas: [],
        venta: 0,
      });
    }
  });
  //console.log(listaGrupos);

  //3. Se obtiene la suma agregada de los componentes de cada grupo, asi como los componentes de cada grupo
  listaGrupos.forEach((grupo) => {
    grupo.venta = listaFilasLeidas.reduce((total, fila) => {
      if (fila.grupo === grupo.id) {
        total +=
          ((fila.precioListaUnitario *
            (1 - fila.descuentoFabricante / 100) *
            (1 + fila.importacion / 100)) /
            (1 - fila.margen / 100)) *
          (1 - fila.descuentoFinal / 100) *
          fila.tipoCambio * //tipocambio
          (1 + fila.iva / 100) *
          fila.cantidad;
      }
      return total;
    }, 0);
    grupo.filas = listaFilasLeidas.filter((fila) => fila.grupo === grupo.id);
  });
  //console.log(listaGrupos);

  //4. Arma la nueva lista de items con los grupos actualizados
  const listaFilasAMostrar = listaFilasLeidas.map((fila) => {
    //Coloca el valor de la suma de los componentes de cada grupo en su agregador, cantidad del agregador a 1 y el resto de campos de entrada del agregador los pone en cero
    if (fila.grupo > 1000) {
      fila.precioVentaTotal = listaGrupos.find(
        (grupo) => grupo.id === fila.grupo - 1000
      ).venta;
      fila.cantidad = 1;
      fila.precioListaUnitario = fila.precioVentaTotal;
      fila.descuentoFabricante = 0;
      fila.importacion = 0;
      fila.margen = 0;
      fila.descuentoFinal = 0;
      fila.iva = 0;
    }
    return fila;
  });
  //console.log(listaFilasAMostrar);

  return {
    listaFilasAMostrar: listaFilasAMostrar,
    listaGrupos: listaGrupos,
    totalItems: numeroItem,
  };
}
