import * as constantes from "../config/constantes.js";

export const grabarCotizacion = async (
  datos,
  datosOpciones,
  //handleAlert,
  tipoVersion,
  actualizarIdCuenta = () => {}
) => {
  /*export function grabarCotizacion(
  datos,
  datosOpciones,
  handleAlert,
  actualizarIdCuenta = () => {}
) {*/
  console.log("funcion grabarCotizacion", datos, datosOpciones, tipoVersion);

  let datosADevolver = { resultado: false, idCotizacion: 0, numeroVersion: 0 };

  //--------------WARNING Compatibilidad con app antigua --------------

  //Obtiene los contactos del cliente
  const cadBusqueda = `${constantes.PREFIJO_URL_API}/contactos/cuenta/${datos.propuestaVersion.idCuentaOportunidad}`;
  //const cadBusqueda =
  //"http://peoplenode.digitalvs.com:3010/api/contactos/cuenta/" +
  //datos.propuestaVersion.idCuentaOportunidad;
  //console.log(cadBusqueda);
  const resContactosCuenta = await fetch(cadBusqueda, constantes.HEADER_COOKIE);
  const jsonContactosCuenta = await resContactosCuenta.json();
  console.log(jsonContactosCuenta);
  const matrizContactosCuenta = jsonContactosCuenta.data.map((contacto) => ({
    id: contacto.idContacto,
    nombre: contacto.nombresApellidosContacto,
    email: contacto.emailContacto,
    telefono: contacto.movilContacto,
  }));
  console.log(matrizContactosCuenta);
  datosOpciones.matrizContactosCuenta = [...matrizContactosCuenta];

  //Encontrar el nombre de cuenta dentro de matrizCuentasCotizacion cuyo elemento sea idCuenta
  const cuenta = datosOpciones.matrizCuentasCotizacion.find(
    (c) => c.id === datos.propuestaVersion.idCuentaOportunidad
  );
  const nombreCuenta = cuenta ? cuenta.nombre : "";

  //Encontrar el nombre de la oportunidad

  //Encontrar el nombre del contacto dentro de matrizContactosCuenta cuyo elemento id sea datos.propuestaVersion.idContactoOportunidad
  const contacto = datosOpciones.matrizContactosCuenta.find(
    (c) => c.id === datos.propuestaVersion.idContactoOportunidad
  );
  const nombreContacto = contacto ? contacto.nombre : "";
  const telefonoContacto = contacto ? contacto.telefono : "";
  const emailContacto = contacto ? contacto.email : "";

  //Cambiar el id de distribucionIVA por el string correspondiente
  if (
    datos.propuestaVersion.distribucionIVA === constantes.DISTRIBUCION_SIN_IVA
  ) {
    datos.propuestaVersion.distribucionIVA = "Sin IVA";
  }
  if (
    datos.propuestaVersion.distribucionIVA === constantes.DISTRIBUCION_IVA_TOTAL
  ) {
    datos.propuestaVersion.distribucionIVA = "IVA Total";
  }
  if (
    datos.propuestaVersion.distribucionIVA ===
    constantes.DISTRIBUCION_IVA_POR_ITEM
  ) {
    datos.propuestaVersion.distribucionIVA = "IVA Distribuido";
  }

  //Encontrar el numero total de secciones
  const totalSecciones = datos.secciones.length;

  const vendedor = datosOpciones.matrizUsuarios.find(
    (c) => c.id === datos.propuestaVersion.idVendedorCotizacion
  );
  const telefonoVendedor = vendedor ? vendedor.telefono : "";
  const emailVendedor = vendedor ? vendedor.email : "";

  const preventa = datosOpciones.matrizUsuarios.find(
    (c) => c.id === datos.propuestaVersion.idPreventa
  );
  const emailPreventa = preventa ? preventa.email : "";

  const contactoImpresion = datosOpciones.matrizContactosCuenta.find(
    (c) => c.id === datos.propuestaVersion.idContactoImpresion
  );
  const nombreContactoImpresion = contactoImpresion
    ? contactoImpresion.nombre
    : "";
  const telefonoContactoImpresion = contactoImpresion
    ? contactoImpresion.telefono
    : "";
  const emailContactoImpresion = contactoImpresion
    ? contactoImpresion.email
    : "";

  console.log(nombreCuenta, nombreContacto, telefonoContacto);
  //-------------------------------------------------------------

  //Si se solicitó una nueva versión se incrementa el numero de version y el total de versiones
  let totalVersiones = 0;
  let numeroVersion = 0;
  switch (tipoVersion) {
    case "nuevaVersion":
      numeroVersion = datos.propuestaVersion.totalVersionesCotizacion + 1;
      totalVersiones = datos.propuestaVersion.totalVersionesCotizacion + 1;
      break;
    case "mantenerVersion":
      numeroVersion = datos.propuestaVersion.versionCotizacion;
      totalVersiones = datos.propuestaVersion.totalVersionesCotizacion;
      break;
    case "nuevaCotizacion":
      numeroVersion = 0;
      totalVersiones = 0;
      break;
  }

  //Para cada seccion, colocar el numero de item a cada fila iniciando desde 1.
  datos.secciones.forEach((seccion) => {
    let numeroItem = 1;
    seccion.filas.forEach((fila) => {
      fila.numeroItem = numeroItem++;
      fila.precioDescontado =
        fila.precioListaUnitario * (1 - fila.descuentoFabricante / 100);
      fila.aging = 0;
      fila.costoUnitario = fila.precioDescontado * (1 + fila.importacion / 100);
      fila.precioUnitario = fila.costoUnitario / (1 - fila.margen / 100);
      fila.precioVentaTotal = fila.precioUnitario * fila.cantidad;
      //fila.precioTotal = fila.precioUnitario * fila.cantidad;
    });
  });

  //Cambiar la propiedad precioTotal de cada item para que muestre la formula que se usaba antes y mantener la compatibilidad con la version anterior de people
  //Para cada item de cada seccion, si el item es el agrupador, osea la propiedad grupo es mayor a 1000, la propiedad precioTotal debe almacenar una formula en string, que incluya a todos los items que componen el grupo (menos el agrupador). Por ejemplo, si el grupo e sel 1, la propiedad grupo del item agrupador es 1001 y la propiedad grupo de los componentes de dicho grupo seria 1. Y la formula sería asi: Por ejemplo: si el item agrupador es el 1001, y hay 3 items que componen este grupo, entonces precioTotal debe ser: "[:x,precio_total]+[:y,precio_total]+[:z,precio_total]", siendo x, y, z los numeros de item de cada item
  //Si el item no forma parte de un grupo, o no es un agrupador, la propiedad precioTotal debe ser: "[$r,cantidad]*[$r,precio_unitario]". No deben cambiarse ni r, ni cantidad ni precio_uniatrio. Deben ser literales.
  datos.secciones.forEach((seccion) => {
    // Primero, crear un mapa de items por grupo para acceso rápido
    const itemsPorGrupo = {};
    seccion.filas.forEach((item) => {
      if (item.grupo && item.grupo <= 1000) {
        if (!itemsPorGrupo[item.grupo]) itemsPorGrupo[item.grupo] = [];
        itemsPorGrupo[item.grupo].push(item);
      }
    });

    seccion.filas.forEach((item) => {
      if (item.grupo && item.grupo > 1000) {
        // Es un agrupador
        const grupoBase = item.grupo - 1000;
        const itemsGrupo = itemsPorGrupo[grupoBase] || [];
        // Excluir el agrupador de la lista
        const formula = itemsGrupo
          .filter((i) => i !== item)
          .map((i) => `[:${i.numeroItem - 1},precio_total]`)
          .join("+");
        item.precioTotal = "=" + formula;
      } else {
        // No es agrupador ni parte de grupo, o es componente de grupo
        item.precioTotal = "[$r,cantidad]*[$r,precio_unitario]";
      }
    });
  });
  console.log("datosagrbar", datos);
  //return;

  //Los datos recibido deben dividirse en 4 objetos: propuesta,version,secciones e items
  const propuesta = {
    id: null,
    idCotizacion: datos.propuestaVersion.idCotizacion,
    totalVersiones: totalVersiones,
    nombreCuenta: nombreCuenta,
    idCuenta: datos.propuestaVersion.idCuentaOportunidad,
    nombreOportunidad: datos.propuestaVersion.nombreOportunidad,
    idOportunidad: datos.propuestaVersion.idOportunidadCotizacion,
    idPais: datos.propuestaVersion.idPais,
    nroDocumentos: datos.propuestaVersion.numeroDocumentos,
    nombreContacto: nombreContacto,
    idContacto: datos.propuestaVersion.idContactoOportunidad,
    telefonoContacto: telefonoContacto,
    emailContacto: emailContacto,
    idStatusCotizacion: datos.propuestaVersion.idStatusCotizacion,
    idPropietarioCotizacion: datos.propuestaVersion.idPropietarioCotizacion,
    idPvOportunidad: datos.propuestaVersion.idPvOportunidad,
    idEtapaVentaOportunidad: datos.propuestaVersion.idEtapaVentaOportunidad,
    requiereOperaciones: datos.propuestaVersion.requiereOperaciones,
    requiereSoporte: datos.propuestaVersion.requiereSoporte,
    horasImplementacion: datos.propuestaVersion.horasImplementacion,
    diasImplementacion: datos.propuestaVersion.diasImplementacion,
    totalMesesSoporte: datos.propuestaVersion.totalMesesSoporte,
    notasCorrectivas: datos.propuestaVersion.notasCorrectivas,
  };

  const version = {
    id: null,
    idCotizacion: datos.propuestaVersion.idCotizacion,
    versionCotizacion: numeroVersion,
    nombreCotizacion: datos.propuestaVersion.nombreCotizacion,
    totalSecciones: totalSecciones,
    introduccionCotizacion: datos.propuestaVersion.introduccionCotizacion,
    idVendedorCotizacion: datos.propuestaVersion.idVendedorCotizacion,
    telefonoVendedor: telefonoVendedor,
    emailVendedor: emailVendedor,
    idPreventa: datos.propuestaVersion.idPreventa,
    emailPreventa: emailPreventa,
    nombreContactoImpresion: nombreContactoImpresion,
    idContactoImpresion: datos.propuestaVersion.idContactoImpresion,
    telefonoContactoImpresion: telefonoContactoImpresion,
    emailContactoImpresion: emailContactoImpresion,
    idMonedaBase: datos.propuestaVersion.idMonedaBase,
    idMonedaCambio: datos.propuestaVersion.moneda,
    tipoCambio: datos.propuestaVersion.tipoCambio,
    descuentoFinalPorcentaje: datos.propuestaVersion.descuentoFinalPorcentaje,
    distribucionDescuentoFinal:
      datos.propuestaVersion.distribucionDescuentoFinal,
    IVA: datos.propuestaVersion.IVA,
    IVAPorcentaje: datos.propuestaVersion.IVAPorcentaje / 100,
    distribucionIVA: datos.propuestaVersion.distribucionIVA,
    otroImpuesto: datos.propuestaVersion.otroImpuesto,
    valorOtroImpuesto: datos.propuestaVersion.valorOtroImpuesto,
    otroImpuestoDisplay: datos.propuestaVersion.otroImpuestoDisplay,
    fechaCreacionCotizacion: datos.propuestaVersion.fechaCreacionCotizacion,
    fechaCotizacion: datos.propuestaVersion.fechaCotizacion,
    fechaModificacionCotizacion:
      datos.propuestaVersion.fechaModificacionCotizacion,
    fechaCierreOportunidad: datos.propuestaVersion.fechaCierreOportunidad,
    fechaAceptada: datos.propuestaVersion.fechaAceptada,
    idEstadoCotizacion: datos.propuestaVersion.idEstadoCotizacion,
    tiempoEntrega: datos.propuestaVersion.tiempoEntrega,
    validez: datos.propuestaVersion.validez,
    garantia: datos.propuestaVersion.garantia,
    formaPago: datos.propuestaVersion.formaPago,
    notasCotizacion: datos.propuestaVersion.notasCotizacion,
    precioTotal: datos.propuestaVersion.precioTotal,
    costoTotal: datos.propuestaVersion.costoTotal,
    financiamientoResumen: datos.propuestaVersion.financiamientoResumen,
    financiamientoTEA: datos.propuestaVersion.financiamientoTEA,
    financiamientoPeriodoPago: datos.propuestaVersion.financiamientoPeriodoPago,
    financiamientoNumeroPeriodos:
      datos.propuestaVersion.financiamientoNumeroPeriodos,
    financiamientoValorInicial:
      datos.propuestaVersion.financiamientoValorInicial,
    financiado: datos.propuestaVersion.financiado,
    notasInternas: datos.propuestaVersion.notasInternas,
    statusVersion: datos.propuestaVersion.statusVersion,
  };

  const secciones = [];
  datos.secciones.forEach((seccion) => {
    secciones.push({
      id: null,
      idCotizacion: datos.propuestaVersion.idCotizacion,
      versionCotizacion: numeroVersion,
      numeroSeccion: seccion.datosSeccion.numeroSeccion,
      tituloSeccion: seccion.datosSeccion.tituloSeccion,
      numeroItems: seccion.datosSeccion.numeroItems,
      idControlSeccion: seccion.datosSeccion.idControlSeccion,
      idPreventa: datos.propuestaVersion.idPreventa,
      status: seccion.datosSeccion.statusSeccion,
    });
  });

  const items = [];
  datos.secciones.forEach((seccion) => {
    seccion.filas.forEach((item) => {
      items.push({
        id: null,
        idCotizacion: datos.propuestaVersion.idCotizacion,
        versionCotizacion: numeroVersion,
        numeroSeccion: seccion.datosSeccion.numeroSeccion,
        numeroItem: item.numeroItem,
        fabricante: item.fabricante,
        codigo: item.codigoItem,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precioListaUnitario: item.precioListaUnitario,
        descuentoFabricante: item.descuentoFabricante,
        precioDescontado: item.precioDescontado,
        importacion: item.importacion,
        aging: item.aging,
        costoUnitario: item.costoUnitario,
        costoTotal: item.costoTotal,
        margen: item.margen,
        descuentoFinal: item.descuentoFinal,
        precioUnitario: item.precioUnitario,
        precioVentaTotal: item.precioVentaTotal,
        precioTotal: item.precioTotal,
        //precioVentaTotal: item.precioTotal,
        //precioTotal: item.formula,
        filaResaltada: item.filaResaltada,
        filaEscondida: item.filaEscondida,
        filaSubtitulo: item.filaSubtitulo,
        filaSinPrecio: item.filaSinPrecio,
        formulaPrecioTotal: item.formulaPrecioTotal,
        perteneceFormula: item.grupo,
        status: item.status,
      });
    });
  });

  const datosAEnviar = {
    propuesta,
    version,
    secciones,
    items,
  };
  console.log(datosAEnviar);

  let resultado = 0; //Ok

  let resultadoGrabar;
  try {
    if (propuesta.idCotizacion === 0) {
      resultadoGrabar = await fetch(
        `${constantes.PREFIJO_URL_API}/cotizaciones/`,
        //`${constantes.PREFIJO_URL_API}/cotizaciones/grabar`,
        //"http://peoplenode.digitalvs.com:3010/api/cotizaciones/grabar",
        {
          method: "POST",
          body: JSON.stringify(datosAEnviar),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );
    } else {
      resultadoGrabar = await fetch(
        `${constantes.PREFIJO_URL_API}/cotizaciones/${propuesta.idCotizacion}/${version.versionCotizacion}`,
        {
          method: "PUT",
          body: JSON.stringify(datosAEnviar),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );
    }
    console.log(resultadoGrabar);
    if (!resultadoGrabar.ok) {
      throw new Error(
        `Error al grabar cotización: ${resultadoGrabar.statusText}`
      );
    }
    const jsonResultadoGrabar = await resultadoGrabar.json();
    console.log(jsonResultadoGrabar);
    datosADevolver = {
      resultado: true,
      idCotizacion: jsonResultadoGrabar.data[0].idCotizacion,
      numeroVersion: jsonResultadoGrabar.data[0].numeroVersion,
    };
  } catch (error) {
    console.error(error);

    //handleAlert(500);
    //return { error: error.message };
  }
  return datosADevolver;
};
