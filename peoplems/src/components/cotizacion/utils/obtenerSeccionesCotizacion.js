import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as constantes from "../../../config/constantes.js";

//Coloca un timeout a la funcion fetch para evitar que una conexión no se quede pegada
const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 10000 } = options; // 10 segundos por default
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(resource, {
    ...constantes.HEADER_COOKIE,
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(id));
};

//Inicializa los datos de la cotizacion, sean estos leidos desde la base de datos o creados como nueva cotizacion
function inicializarDatos(datosLeidos = {}, datosNuevaCotizacion, userId) {
  console.log("inicializarDatos", datosLeidos);
  dayjs.extend(customParseFormat);
  const datos = {
    //Datos de propuesta
    id: datosNuevaCotizacion.id,
    idCotizacion: datosNuevaCotizacion.idCotizacion,
    idOportunidadCotizacion: datosNuevaCotizacion.idOportunidadCotizacion,
    idPropietarioCotizacion: userId,
    idStatusCotizacion: datosNuevaCotizacion.idStatusCotizacion,
    totalVersionesCotizacion: datosNuevaCotizacion.totalVersionesCotizacion,
    idPais: 2,
    numeroDocumentos: 0,
    idPvOportunidad: 2,
    requiereOperaciones: 0,
    requiereSoporte: 0,
    horasImplementacion: 0,
    diasImplementacion: 0,
    totalMesesSoporte: 0,
    notasCorrectivas: "",

    //Datos de version
    versionCotizacion: 0,
    fechaCotizacion: dayjs().format("DD-MM-YYYY"),
    idContactoCotizacion: 0,
    idEstadoCotizacion: 1,
    idVendedorCotizacion: userId,
    introduccionCotizacion: "",
    descuentoFinalPorcentaje: datosNuevaCotizacion.descuentoFinalPorcentaje,
    distribucionDescuentoFinal: datosNuevaCotizacion.distribucionDescuentoFinal,
    precioTotal: 0,
    IVAPorcentaje: 16,
    //distribucionIVA: "Sin IVA",
    distribucionIVA: constantes.DISTRIBUCION_SIN_IVA,
    tiempoEntrega: 5,
    validez: 1,
    garantia: 1,
    formaPago: 1,
    moneda: 1,
    tipoCambio: 1,
    notasCotizacion: constantes.cadenaNotasComerciales,
    notasInternas: "",
    idCreadoPorCotizacion: userId, //No está en la base de datos
    idModificadoPorCotizacion: userId, //No está en la base de datos
    fechaCreacionCotizacion: dayjs().format("DD-MM-YYYY"),
    fechaModificacionCotizacion: dayjs().format("DD-MM-YYYY"),
    nombreCotizacion: "",
    totalSecciones: 0,
    telefonoVendedor: "",
    emailVendedor: "",
    idPreventa: 0,
    emailPreventa: "",
    nombreContactoImpresion: "",
    idContactoImpresion: 0,
    telefonoContactoImpresion: "",
    emailContactoImpresion: "",
    idMonedaBase: 1,
    IVA: 0,
    otroImpuesto: 0,
    valorOtroImpuesto: 0,
    otroImpuestoDisplay: "Ninguno",
    fechaAceptada: "",
    costoTotal: 0,
    financiamientoResumen: 0,
    financiamientoTEA: 0,
    financiamientoPeriodoPago: 0,
    financiamientoNumeroPeriodos: 0,
    financiamientoValorInicial: 0,
    financiado: 0,
    statusVersion: 1,

    descuentoFinalAbsoluto: 0, //No está en la base de datos
    totalDescontado: 0, //No está en la base de datos

    //Datos de oportunidad - No se graban
    idCuentaOportunidad: 0,
    nombreOportunidad: "",
    fechaCierreOportunidad: dayjs().format("DD-MM-YYYY"),
    idEtapaVentaOportunidad: 0,
    idContactoOportunidad: 0,
    importeOportunidad: 0,
  };
  if (Object.keys(datosLeidos).length > 0) {
    //Datos de propuesta
    datos.id = datosNuevaCotizacion.id;
    datos.idCotizacion = datosNuevaCotizacion.idCotizacion;
    datos.idOportunidadCotizacion =
      datosNuevaCotizacion.idOportunidadCotizacion;
    datos.idPropietarioCotizacion = userId;
    datos.idStatusCotizacion = datosNuevaCotizacion.idStatusCotizacion;
    datos.totalVersionesCotizacion =
      datosNuevaCotizacion.totalVersionesCotizacion;
    datos.idPais = datosNuevaCotizacion.idPais;
    datos.numeroDocumentos = datosNuevaCotizacion.numeroDocumentos;
    datos.idPvOportunidad = datosNuevaCotizacion.idPvOportunidad;
    datos.requiereOperaciones = datosNuevaCotizacion.requiereOperaciones;
    datos.requiereSoporte = datosNuevaCotizacion.requiereSoporte;
    datos.horasImplementacion = datosNuevaCotizacion.horasImplementacion;
    datos.diasImplementacion = datosNuevaCotizacion.diasImplementacion;
    datos.totalMesesSoporte = datosNuevaCotizacion.totalMesesSoporte;
    datos.notasCorrectivas = datosNuevaCotizacion.notasCorrectivas;

    //Datos de version
    datos.versionCotizacion = datosNuevaCotizacion.versionCotizacion;
    datos.fechaCotizacion = datosNuevaCotizacion.fechaCotizacion;
    datos.idContactoCotizacion = datosNuevaCotizacion.idContactoCotizacion;
    datos.idEstadoCotizacion = datosNuevaCotizacion.idEstadoCotizacion;
    datos.idVendedorCotizacion = userId;
    datos.introduccionCotizacion = datosNuevaCotizacion.introduccionCotizacion;
    datos.descuentoFinalPorcentaje = datosLeidos.descuentoFinalPorcentaje;
    datos.distribucionDescuentoFinal = datosLeidos.distribucionDescuentoFinal;
    datos.precioTotal = datosLeidos.precioTotal;
    datos.IVAPorcentaje = datosLeidos.IVAPorcentaje * 100; //Warning. Hay que obtener este valor desde la configuracion, no desde version
    switch (datosLeidos.distribucionIVA) {
      case "Sin IVA":
        datos.distribucionIVA = constantes.DISTRIBUCION_SIN_IVA;
        break;
      case "IVA Total":
        datos.distribucionIVA = constantes.DISTRIBUCION_IVA_TOTAL;
        break;
      case "IVA Distribuido":
        datos.distribucionIVA = constantes.DISTRIBUCION_IVA_POR_ITEM;
        break;
    }
    //datos.distribucionIVA = datosLeidos.distribucionIVA;
    datos.tiempoEntrega = datosNuevaCotizacion.tiempoEntrega;
    datos.validez = datosNuevaCotizacion.validez;
    datos.garantia = datosNuevaCotizacion.garantia;
    datos.formaPago = datosNuevaCotizacion.formaPago;
    datos.moneda = datosLeidos.moneda;
    datos.tipoCambio = datosLeidos.tipoCambio;
    datos.notasCotizacion = datosLeidos.notasCotizacion;
    datos.notasInternas = datosNuevaCotizacion.notasInternas;
    datos.idCreadoPorCotizacion = userId; //No está en la base de datos
    datos.idModificadoPorCotizacion = userId; //No está en la base de datos
    datos.fechaCreacionCotizacion = dayjs(
      datosNuevaCotizacion.fechaCreacionCotizacion,
      "DD-MM-YYYY"
    ).format("DD-MM-YYYY");
    datos.fechaModificacionCotizacion = dayjs(
      datosNuevaCotizacion.fechaModificacionCotizacion,
      "DD-MM-YYYY"
    ).format("DD-MM-YYYY");
    datos.nombreCotizacion = datosNuevaCotizacion.nombreCotizacion;
    datos.totalSecciones = datosLeidos.totalSecciones;
    datos.telefonoVendedor = datosNuevaCotizacion.telefonoVendedor;
    datos.emailVendedor = datosNuevaCotizacion.emailVendedor;
    datos.idPreventa = datosNuevaCotizacion.idPreventa;
    datos.emailPreventa = datosNuevaCotizacion.emailPreventa;
    datos.nombreContactoImpresion = datosLeidos.nombreContactoImpresion;
    datos.idContactoImpresion = datosNuevaCotizacion.idContactoImpresion;
    datos.telefonoContactoImpresion =
      datosNuevaCotizacion.telefonoContactoImpresion;
    datos.emailContactoImpresion = datosNuevaCotizacion.emailContactoImpresion;
    datos.idMonedaBase = datosLeidos.idMonedaBase;
    datos.IVA = datosLeidos.IVA;
    datos.otroImpuesto = datosLeidos.otroImpuesto;
    datos.valorOtroImpuesto = datosLeidos.valorOtroImpuesto;
    datos.otroImpuestoDisplay = datosLeidos.otroImpuestoDisplay;
    datos.fechaAceptada = datosNuevaCotizacion.fechaAceptada;
    datos.costoTotal = datosLeidos.costoTotal;
    datos.financiamientoResumen = datosLeidos.financiamientoResumen;
    datos.financiamientoTEA = datosLeidos.financiamientoTEA;
    datos.financiamientoPeriodoPago = datosLeidos.financiamientoPeriodoPago;
    datos.financiamientoNumeroPeriodos =
      datosLeidos.financiamientoNumeroPeriodos;
    datos.financiamientoValorInicial = datosLeidos.financiamientoValorInicial;
    datos.financiado = datosLeidos.financiado;
    datos.statusVersion = datosNuevaCotizacion.statusVersion;

    datos.descuentoFinalAbsoluto = 0;
    datos.totalDescontado = 0;

    //Datos de oportunidad - No se graban
    datos.idCuentaOportunidad = datosNuevaCotizacion.idCuentaOportunidad;
    datos.nombreOportunidad = datosNuevaCotizacion.nombreOportunidad;
    datos.fechaCierreOportunidad = datosNuevaCotizacion.fechaCierreOportunidad;
    datos.idEtapaVentaOportunidad =
      datosNuevaCotizacion.idEtapaVentaOportunidad;
    datos.idContactoOportunidad = datosNuevaCotizacion.idContactoOportunidad;
    datos.importeOportunidad = datosNuevaCotizacion.importeOportunidad;
  }
  console.log("datos inicializados", datos);
  return datos;
}

export const obtenerSeccionesCotizacion = async (
  idCotizacionVersionSeleccionada,
  datosNuevaCotizacion,
  userId
) => {
  console.log(
    "obtenerSeccionesCotizacion",
    idCotizacionVersionSeleccionada.idCotizacion
  );

  //Obtiene los datos de la cotizacion
  const cadCotizacion = `${constantes.PREFIJO_URL_API}/cotizaciones/${idCotizacionVersionSeleccionada.idCotizacion}/${idCotizacionVersionSeleccionada.versionCotizacion}`;

  console.log(cadCotizacion);
  const resDatosCotizacion = fetchWithTimeout(cadCotizacion, {});

  //Obtiene los datos de las secciones de la version de la cotizacion
  const cadSecciones = `${constantes.PREFIJO_URL_API}/cotizaciones/${idCotizacionVersionSeleccionada.idCotizacion}/${idCotizacionVersionSeleccionada.versionCotizacion}/secciones`;

  console.log(cadSecciones);
  const resDatosSeccion = fetchWithTimeout(cadSecciones, {});

  //Obtiene los datos de las secciones de la version de la cotizacion
  const cadItems = `${constantes.PREFIJO_URL_API}/cotizaciones/${idCotizacionVersionSeleccionada.idCotizacion}/${idCotizacionVersionSeleccionada.versionCotizacion}/items`;

  console.log(cadItems);
  const resDatosItem = fetchWithTimeout(cadItems, {});

  //Ejecuta las peticiones de manera simultanea
  let resAll;
  try {
    resAll = await Promise.all([
      resDatosCotizacion,
      resDatosSeccion,
      resDatosItem,
    ]);
  } catch (error) {
    console.error("Error al realizar las peticiones a las APIs:", error);
    return;
  }
  console.log(resAll);

  //Obtiene el json simultaneo de las 7 peticiones a las APIs,
  const resAllJson = resAll.map((el) => el.json());
  let jsonAll;
  try {
    jsonAll = await Promise.all(resAllJson);
  } catch (error) {
    console.error("Error al obtener datos de las APIs:", error);
    return;
  }

  console.log(jsonAll);

  //Obtiene los datos de la propuesta y de la version seleccionbada. Si la propuesta es nueva se inicializan dichos valores
  const datosPropuestaVersion = inicializarDatos(
    jsonAll[0].data[0],
    datosNuevaCotizacion,
    userId
  );
  //console.log(datosPropuestaVersion);

  //La cotizacion usa 4 tablas en la base de datos de cotizaciones
  //En las tablas de propuestas y versiones se puede actualizar una fila o añadir una nueva.
  //En las tablas de secciones e items, sus filas pueden ser reemplazadas por otras (por cambio de posicion), o eliminadas
  //Cuando se actualicen estas tablas, primero deben desactivarse todas sus filas y luego activarlas, actualizandolas o creando las nuevas filas
  //Por este ultimo motivo, no se requiere descargar los numeros de secciones o de items, se deben crear en vivo cuando se descarguen o se creen (live)

  //Ordena las secciones. La primera seccion tienen un numero de seccion igual a 1
  const datosSecciones = [];
  jsonAll[1].data.map((seccion) => {
    datosSecciones.push({ datosSeccion: seccion });
  });
  //Hacer que la propiedad numeroSeccion de cada elemento del array datosSecciones se numere incrementalmente desde uno
  datosSecciones.forEach((seccion, index) => {
    seccion.datosSeccion.numeroSeccion = index + 1;
  });
  //console.log(datosSecciones);

  //Inserta los items dentro de cada seccion y los dispone como filas de una tabla, coloca los campos de id(fila), grupo y numeroSeccion en cada fila
  //WARNING Falta colocar la columna iva cuando se leen las filas
  const ivaLeido =
    datosPropuestaVersion.distribucionIVA ===
    constantes.DISTRIBUCION_IVA_POR_ITEM
      ? 16
      : 0;

  const listaFilas = [];
  datosSecciones.map((seccion, indiceSeccion) => {
    listaFilas.push(
      jsonAll[2].data
        .filter(
          (item) => item.numeroSeccion === seccion.datosSeccion.numeroSeccion
        )
        .map((fila, indiceFila) => {
          let precioTotal = 0;
          let costoTotal = 0;
          if (Number(fila.perteneceFormula) < 1000) {
            costoTotal =
              fila.precioListaItem *
              (1 - fila.descuentoFabricante / 100) *
              (1 + fila.importacion / 100) *
              fila.cantidadItem;
            precioTotal =
              (costoTotal / (1 - fila.margen / 100)) *
              (1 - fila.descuentoFinal / 100) *
              (1 + ivaLeido / 100);
          }
          return {
            id: indiceFila + 1,
            grupo: Number(fila.perteneceFormula), //0 no forma parte de ningun grupo, 0 < n < 1000 es parte del grupo n, n > 1000 es el agregador del grupo (n-1000)
            fabricante: fila.idFabricante,
            codigoItem: fila.codigoItem,
            descripcion: fila.descripcionItem,
            cantidad: fila.cantidadItem,
            precioListaUnitario: fila.precioListaItem,
            descuentoFabricante: fila.descuentoFabricante,
            importacion: fila.importacion,
            costoTotal: costoTotal,
            margen: fila.margen,
            descuentoFinal: fila.descuentoFinal,
            iva: ivaLeido,
            precioVentaTotal: precioTotal, //WARNING Se calcula en vez de leer fila.precioVentaTotal
            perteneceFormula: fila.perteneceFormula,
            filaResaltada: fila.filaResaltada,
            filaEscondida: fila.filaEscondida,
            filaSubtitulo: fila.filaSubtitulo,
            filaSinPrecio: fila.filaSinPrecio,
            numeroSeccion: indiceSeccion + 1,
            formula: fila.formula,
            status: fila.status,
            formulaPrecioTotal: 0, //WARNING Esto debe eliminarse. Es por compatibilidad con app anterior
          };
        })
    );
  });
  //console.log(listaFilas);

  //Hacer que los grupos inicien desde uno
  //Se identifica el numero de grupos leidos
  const numeroGruposLeidos = listaFilas.filter(
    (fila) => fila.grupo > 1000
  ).length;
  //console.log(numeroGruposLeidos);

  //Se ordenan los numeros de grupo para que sean secuencuales e inicien desde uno
  //Se crea un array de los grupos con dos campos: idLeido y idProcesado. Si los numeros de grupos están en secuencia creciente sin faltar ninguno, idLeido es igua a idProcesado
  let idGrupo = 0;
  const listaGruposLeidos = listaFilas
    .filter((fila) => fila.grupo > 1000)
    .map((fila) => {
      return {
        idLeido: fila.grupo,
        idProcesado: ++idGrupo,
      };
    });
  //console.log(listaGruposLeidos);

  //Si hay grupos leidos, se procede con el siguiente bloque
  if (numeroGruposLeidos > 0) {
    //WARNING --Debe revisarse
    //Si el tamaño del array listaGruposLeidos es igual al numero de grupos leidos, no se hace nada
    if (
      listaGruposLeidos[listaGruposLeidos.length - 1].idLeido ===
      numeroGruposLeidos + 1000
    ) {
      //console.log("no se hace nada");
    } else {
      //5. Si el tamaño del array listaGruposLeidos es menor al numero de grupos leidos, se ordena el array de grupos colocando en idProcesado el id de grupo que le corresponde en orden creciente.
      //console.log("se hace algo");
      //6. Se modifica el numero de cada grupo y de cada componente leido en el array filas por el idProcesado
      listaFilas.forEach((fila) => {
        listaGruposLeidos.forEach((grupo) => {
          if (fila.grupo === grupo.idLeido) {
            fila.grupo = grupo.idProcesado + 1000;
          }
          if (fila.grupo === grupo.idLeido - 1000) {
            fila.grupo = grupo.idProcesado;
          }
        });
      });
      //console.log(listaFilas);
    }
  }

  datosSecciones.forEach((seccion, index) => {
    seccion.filas = [...listaFilas[index]];
  });

  //Hacer que la propiedad numeroItems de cada elemento del array datosSecciones tenga el valor de la cantidad de elementos de cada propiedad items
  datosSecciones.forEach((seccion) => {
    seccion.datosSeccion.numeroItems = seccion.filas.length;
  });

  //console.log(datosSecciones);

  //Se une en dataCotizacion tanto los datos de propuesta y version como los de las secciones
  const dataCotizacion = {
    propuestaVersion: datosPropuestaVersion,
    secciones: datosSecciones,
  };
  //console.log(dataCotizacion);

  /*const datos = {
    datosCotizacion: dataCotizacion,
    matrizCuentasCotizacion: ,
    matrizEtapasVenta,
    matrizContactosCuenta,
    matrizEstadosCotizacion,
    matrizUsuarios,
    matrizTiemposEntregaCotizacion,
    matrizValidezCotizacion,
    matrizGarantiaCotizacion,
    matrizFormaPagoCotizacion,
    matrizMonedaCotizacion,
  };*/
  console.log(dataCotizacion);

  return dataCotizacion;
};
