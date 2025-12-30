import mysql from "mysql2";
//const mysql = require("mysql2");

const dbCuentas = "ormprueba";
const dbCotizaciones = "ormpruebacotizaciones";
const dbConfiguraciones = "configuraciones_2";
const dbUsuarios = "usuarios_2";
const dbFabricantes = "ormfabricantes";
//const dbFabricantes = "fabricantes_2";
const dbConfiguraciones2 = "cuentas";
const dbPostventa = "ormpostventa";

const tbCuentas = `${dbCuentas}.cuentas_crm`;
const tbContactos = `${dbCuentas}.contactos_crm`;
const tbOportunidades = `${dbCuentas}.oportunidades_crm`;
const tbRegistrosF = `${dbCuentas}.registro_fabricantes`;
const tbRespuestasPV = `${dbCuentas}.texto_oportunidad_crm`;

const tbPropuestas = `${dbCotizaciones}.propuestas`;
const tbVersiones = `${dbCotizaciones}.versiones`;
const tbSecciones = `${dbCotizaciones}.secciones`;
const tbItems = `${dbCotizaciones}.items`;
const tbOpProp = `${dbCotizaciones}.oportunidades_propuestas`;

const tbTipoCuenta = `${dbConfiguraciones}.tipo_cuenta_crm`;
const tbSectores = `${dbConfiguraciones}.sectores_cuenta_crm`;
const tbEtapasVentaPVS = `${dbConfiguraciones}.etapas_venta_pvs`;
const tbEstadosRF = `${dbConfiguraciones}.estados_registro_fabricantes`;
const tbPaises = `${dbConfiguraciones2}.pais`;
const tbParticipacion = `${dbConfiguraciones}.participacion_contacto_crm`;
const tbRelacion = `${dbConfiguraciones}.relacion_contacto_crm`;
const tbSituacionLaboral = `${dbConfiguraciones}.estados_contacto`;
const tbEtapasCompra = `${dbConfiguraciones}.etapas_compra_oportunidad`;
const tbLineasNegocio = `${dbConfiguraciones}.linea_negocio`;
const tbEstadosOportunidad = `${dbConfiguraciones}.estados_oportunidad`;
const tbPreguntasPV = `${dbConfiguraciones}.preguntas_pv`;
const tbEstadosCotizacion = `${dbConfiguraciones2}.estado_propuesta`;
const tbTiemposEntregaCotizacion = `${dbConfiguraciones}.tiempos_entrega`;
const tbValidezCotizacion = `${dbConfiguraciones}.opciones_validez`;
const tbGarantiaCotizacion = `${dbConfiguraciones}.opciones_garantia`;
const tbFormaPagoCotizacion = `${dbConfiguraciones}.formas_pago`;
const tbMonedaCotizacion = `${dbConfiguraciones2}.monedas`;

const tbFabricantes = `${dbFabricantes}.fabricantes`;

const tbUsuarios = `${dbUsuarios}.users`;
const tbUsuariosRol = `${dbUsuarios}.userrole`;
const tbRolRule = `${dbUsuarios}.rolerule`;
const tbUsuariosClave = `${dbUsuarios}.claves`;

const tbOrdenesRecibidas = `${dbPostventa}.ordenes_recibidas`;

//========================================= CUENTAS ===================================================
//Obtener el listado de todas las cuentas
export const getListaCuentas = `SELECT ${tbCuentas}.id_cuenta_crm AS idCuenta, ${tbCuentas}.nombre_cuenta AS nombreCuenta, ${tbTipoCuenta}.nombre AS tipoCuenta, ${tbSectores}.nombre AS sectorCuenta, ${tbUsuarios}.name AS propietarioCuenta FROM ${tbCuentas} INNER JOIN ${tbTipoCuenta}, ${tbSectores}, ${tbUsuarios} WHERE ${tbCuentas}.id_tipo_cuenta = ${tbTipoCuenta}.id_tipo_cuenta AND ${tbCuentas}.id_sector = ${tbSectores}.id_sector AND ${tbCuentas}.id_propietario_crm = ${tbUsuarios}.id_user AND ${tbCuentas}.status = 1 ORDER BY ${tbCuentas}.nombre_cuenta ASC`;

//Obtener el listado de todas las cuentas en base a un usuario que es el propietario o copropietario
export function getListaCuentasPorUsuario(idUsuario) {
  const query = `SELECT ${tbCuentas}.id_cuenta_crm AS idCuenta, ${tbCuentas}.nombre_cuenta AS nombreCuenta, ${tbTipoCuenta}.nombre AS tipoCuenta, ${tbSectores}.nombre AS sectorCuenta, ${tbUsuarios}.name AS propietarioCuenta FROM ${tbCuentas} INNER JOIN ${tbTipoCuenta}, ${tbSectores}, ${tbUsuarios} WHERE ${tbCuentas}.id_tipo_cuenta = ${tbTipoCuenta}.id_tipo_cuenta AND ${tbCuentas}.id_sector = ${tbSectores}.id_sector AND (${tbCuentas}.id_propietario_crm = ${idUsuario} OR FIND_IN_SET(${idUsuario},${tbCuentas}.lista_copropietarios)) AND ${tbUsuarios}.id_user = ${idUsuario} AND ${tbCuentas}.status = 1 ORDER BY ${tbCuentas}.nombre_cuenta ASC`;
  return query;
}

//Obtener el numero total de cuentas en la BD
export const queryGetCantidadCuentas = `SELECT MAX(${tbCuentas}.id_cuenta_crm) AS maximo FROM ${tbCuentas}`;
//Grabar una cuenta nueva
export function ensamblarQueryGrabarCuenta(datos) {
  const query = `INSERT INTO ${tbCuentas} (id, id_cuenta_crm, nombre_cuenta, id_tipo_cuenta, id_propietario_crm, lista_copropietarios, id_sector, id_creado_por_crm, id_modificado_por_crm, fecha_de_creacion, fecha_de_modificacion, telefono, registro, web, direccion, ciudad, estado, id_pais, descripcion, status) VALUES(${datos.id}, ${datos.idCuenta},  "${datos.nombreCuenta}", ${datos.idTipoCuenta}, ${datos.idPropietarioCuenta}, "${datos.copropietarioCuenta}", ${datos.idSectorCuenta}, ${datos.idCreadoPorCuenta}, ${datos.idModificadoPorCuenta}, "${datos.fechaCreacionCuenta}", "${datos.fechaModificacionCuenta}", "${datos.telefonoCuenta}", "${datos.registroCuenta}", "${datos.webCuenta}", "${datos.direccionCuenta}", "${datos.ciudadCuenta}", "${datos.estadoCuenta}", ${datos.idPaisCuenta}, "${datos.descripcionCuenta}", ${datos.statusCuenta})`;
  return query;
}
//Obtener el id de una cuenta con el mismo id. Es para entregar el id a quien lo pregunta dentro de una respuesta valida
export function ensamblarQueryGetIdCuentaConIdCuenta(idCuenta) {
  const query = `SELECT ${tbCuentas}.id_cuenta_crm AS id, ${tbCuentas}.status AS statusCuenta FROM ${tbCuentas} WHERE ${tbCuentas}.id_cuenta_crm = ${idCuenta}`;
  return query;
}
//Descargar todos los datos de una cuenta
export function ensamblarQueryGetCuenta(idCuenta) {
  const query = `SELECT * FROM ${tbCuentas} WHERE ${tbCuentas}.id_cuenta_crm = ${idCuenta}`;
  return query;
}

//Obtener la informacion de una cuenta por su nombre
export function obtenerCuentaPorNombre(nombreCuenta) {
  // Devuelve la cadena SQL para búsqueda parcial e insensible a mayúsculas/minúsculas
  return `SELECT * FROM ormprueba.cuentas_crm WHERE LOWER(nombre_cuenta) LIKE LOWER('%${nombreCuenta}%')`;
}

//Actualizar una cuenta
export function ensamblarQueryActualizarCuenta(datos) {
  const query = `UPDATE ${tbCuentas} SET nombre_cuenta="${datos.nombreCuenta}", id_tipo_cuenta=${datos.idTipoCuenta}, id_propietario_crm=${datos.idPropietarioCuenta},lista_copropietarios="${datos.copropietarioCuenta}",id_sector=${datos.idSectorCuenta},id_modificado_por_crm=${datos.idModificadoPorCuenta},fecha_de_modificacion="${datos.fechaModificacionCuenta}",telefono="${datos.telefonoCuenta}",registro="${datos.registroCuenta}",web="${datos.webCuenta}",direccion="${datos.direccionCuenta}",ciudad="${datos.ciudadCuenta}",estado="${datos.estadoCuenta}",id_pais=${datos.idPaisCuenta},descripcion="${datos.descripcionCuenta}",status=${datos.statusCuenta} WHERE ${tbCuentas}.id_cuenta_crm = ${datos.idCuenta}`;
  return query;
}

//Obtener el listado de las cuentas pendientes de aprobar
export const getListaCuentasPendientesAprobacion = `SELECT ${tbCuentas}.id_cuenta_crm AS idCuenta, ${tbCuentas}.nombre_cuenta AS nombreCuenta, ${tbTipoCuenta}.nombre AS tipoCuenta, ${tbSectores}.nombre AS sectorCuenta, ${tbUsuarios}.name AS propietarioCuenta FROM ${tbCuentas} INNER JOIN ${tbTipoCuenta}, ${tbSectores}, ${tbUsuarios} WHERE ${tbCuentas}.id_tipo_cuenta = ${tbTipoCuenta}.id_tipo_cuenta AND ${tbCuentas}.id_sector = ${tbSectores}.id_sector AND ${tbCuentas}.id_propietario_crm = ${tbUsuarios}.id_user AND ${tbCuentas}.status = 2 ORDER BY ${tbCuentas}.nombre_cuenta ASC`;

//======================================== CONTACTOS =====================================================
//Obtener el listado de todos las contactos
export const queryContactos = `SELECT ${tbContactos}.id_contacto_crm AS idContacto, ${tbContactos}.nombres AS nombresContacto, ${tbContactos}.apellidos AS apellidosContacto, ${tbContactos}.correo_electronico AS emailContacto, ${tbCuentas}.nombre_cuenta AS cuentaContacto, ${tbContactos}.cargo AS cargoContacto, ${tbUsuarios}.name AS propietarioContacto FROM ${tbContactos} INNER JOIN ${tbCuentas}, ${tbUsuarios} WHERE ${tbContactos}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbContactos}.id_propietario_contacto_crm = ${tbUsuarios}.id_user AND ${tbContactos}.status = 1 ORDER BY ${tbContactos}.apellidos ASC`;

//Obtener el listado de todos las contactos por usuario
export function ensamblarQueryGetContactosPorUsuario(idUsuario) {
  const query = `SELECT ${tbContactos}.id_contacto_crm AS idContacto, ${tbContactos}.nombres AS nombresContacto, ${tbContactos}.apellidos AS apellidosContacto, ${tbContactos}.correo_electronico AS emailContacto, ${tbCuentas}.nombre_cuenta AS cuentaContacto, ${tbContactos}.cargo AS cargoContacto, ${tbUsuarios}.name AS propietarioContacto FROM ${tbContactos} INNER JOIN ${tbCuentas}, ${tbUsuarios} WHERE ${tbContactos}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbContactos}.id_propietario_contacto_crm = ${tbUsuarios}.id_user AND ${tbUsuarios}.id_user = ${idUsuario} AND ${tbContactos}.status = 1 ORDER BY ${tbContactos}.apellidos ASC`;
  return query;
}
//Obtener el numero total de contactos en la BD
export const queryGetCantidadContactos = `SELECT MAX(${tbContactos}.id_contacto_crm) AS maximo FROM ${tbContactos}`;
//Grabar un contacto nuevo
export function ensamblarQueryGrabarContacto(datos) {
  const query = `INSERT INTO ${tbContactos} (id, id_contacto_crm, nombres, apellidos, id_cuenta_crm, cargo, telefono, extension,movil, correo_electronico, departamento, id_pais, estado, ciudad, direccion,codigo_postal, id_influencia_crm, id_jefe_crm, id_participacion_crm, id_relacion_crm, id_propietario_contacto_crm, saludo, id_estado_actual, descripcion, id_creado_por_crm, id_modificado_por_crm, fecha_creacion, fecha_modificacion, status) VALUES(${datos.id}, ${datos.idContacto},  "${datos.nombresContacto}", "${datos.apellidosContacto}", ${datos.idCuentaContacto}, "${datos.cargoContacto}", "${datos.telefonoContacto}", "${datos.extensionContacto}", "${datos.movilContacto}", "${datos.emailContacto}", "${datos.departamentoContacto}", ${datos.idPaisContacto}, "${datos.estadoContacto}", "${datos.ciudadContacto}", "${datos.direccionContacto}", "${datos.codigoPostalContacto}", ${datos.idInfluyeEnContacto}, ${datos.idJefeContacto}, ${datos.idParticipacionContacto}, ${datos.idRelacionContacto}, ${datos.idPropietarioContacto}, "${datos.saludoContacto}", ${datos.idSituacionLaboralContacto}, "${datos.descripcionContacto}", ${datos.idCreadoPorContacto}, ${datos.idModificadoPorContacto}, "${datos.fechaCreacionContacto}", "${datos.fechaModificacionContacto}", ${datos.statusContacto})`;
  return query;
}
//Obtener el id de una cuenta con el mismo id. Es para entregar el id a quien lo pregunta dentro de una respuesta valida
export function ensamblarQueryGetIdContactoConIdContacto(idContacto) {
  const query = `SELECT ${tbContactos}.id_contacto_crm AS id, ${tbContactos}.status AS statusContacto FROM ${tbContactos} WHERE ${tbContactos}.id_contacto_crm = ${idContacto}`;
  return query;
}
//Descargar todos los datos de un contacto
export function ensamblarQueryGetContacto(idContacto) {
  const query = `SELECT * FROM ${tbContactos} WHERE ${tbContactos}.id_contacto_crm = ${idContacto}`;
  return query;
}
//Listar los contactos de una cuenta
export function ensamblarQueryContactosPorCuenta(idCuentaEnviada) {
  //console.log("idCuentaEnviada de contactos por cuenta", idCuentaEnviada);
  const query = `SELECT ${tbContactos}.id_contacto_crm AS idContacto, CONCAT(${tbContactos}.nombres," ",${tbContactos}.apellidos) AS nombresApellidosContacto, ${tbContactos}.correo_electronico AS emailContacto, ${tbContactos}.movil AS movilContacto, ${tbContactos}.cargo AS cargoContacto, ${tbUsuarios}.name AS nombrePropietarioContacto FROM ${tbContactos} INNER JOIN ${tbCuentas}, ${tbUsuarios} WHERE ${tbCuentas}.id_cuenta_crm = ${idCuentaEnviada} AND ${tbContactos}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbContactos}.id_propietario_contacto_crm = ${tbUsuarios}.id_user AND ${tbContactos}.status = 1 ORDER BY ${tbContactos}.apellidos ASC`;
  return query;
}
//Actualizar un contacto
export function ensamblarQueryActualizarContacto(datos) {
  const query = `UPDATE ${tbContactos} SET nombres="${datos.nombresContacto}", apellidos="${datos.apellidosContacto}", id_cuenta_crm=${datos.idCuentaContacto},cargo="${datos.cargoContacto}",telefono="${datos.telefonoContacto}",extension="${datos.extensionContacto}",movil="${datos.movilContacto}",correo_electronico="${datos.emailContacto}",departamento="${datos.departamentoContacto}",id_pais=${datos.idPaisContacto},estado="${datos.estadoContacto}",ciudad="${datos.ciudadContacto}",direccion="${datos.direccionContacto}",codigo_postal="${datos.codigoPostalContacto}",id_influencia_crm=${datos.idInfluyeEnContacto},id_jefe_crm=${datos.idJefeContacto}, id_participacion_crm=${datos.idParticipacionContacto},id_relacion_crm="${datos.idRelacionContacto}",id_propietario_contacto_crm=${datos.idPropietarioContacto},saludo="${datos.saludoContacto}",id_estado_actual="${datos.idSituacionLaboralContacto}",descripcion="${datos.descripcionContacto}",id_modificado_por_crm="${datos.idModificadoPorContacto}",fecha_modificacion=${datos.fechaModificacionContacto},status=${datos.statusContacto}  WHERE ${tbContactos}.id_contacto_crm = ${datos.idContacto}`;
  return query;
}

//Obtener el listado de los contactos pendientes de aprobar
export const getListaContactosPendientesAprobacion = `SELECT ${tbContactos}.id_contacto_crm AS idContacto, ${tbContactos}.nombres AS nombresContacto, ${tbContactos}.apellidos AS apellidosContacto, ${tbContactos}.correo_electronico AS emailContacto, ${tbCuentas}.nombre_cuenta AS cuentaContacto, ${tbContactos}.cargo AS cargoContacto, ${tbUsuarios}.name AS propietarioContacto FROM ${tbContactos} INNER JOIN ${tbCuentas}, ${tbUsuarios} WHERE ${tbContactos}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbContactos}.id_propietario_contacto_crm = ${tbUsuarios}.id_user AND ${tbContactos}.status = 2 ORDER BY ${tbContactos}.apellidos ASC`;
//============================================= OPORTUNIDADES =====================================================
//Listar todas las Oportunidades
export const queryOportunidades = `SELECT ${tbOportunidades}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbEtapasVentaPVS}.nombre AS etapaOportunidad, ${tbCuentas}.nombre_cuenta AS cuentaOportunidad, ${tbOportunidades}.fecha_cierre AS anoCierreOportunidad, ${tbUsuarios}.name AS propietarioOportunidad FROM ${tbOportunidades} INNER JOIN ${tbEtapasVentaPVS}, ${tbCuentas}, ${tbUsuarios} WHERE ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_propietario_oportunidad_crm = ${tbUsuarios}.id_user AND ${tbOportunidades}.status = 1 ORDER BY ${tbOportunidades}.id_oportunidad_crm ASC`;

//Listar todas las Oportunidades por año
export function getListaOportunidadesByAno(ano) {
  const query = `SELECT ${tbOportunidades}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbEtapasVentaPVS}.nombre AS etapaOportunidad, ${tbCuentas}.nombre_cuenta AS cuentaOportunidad, ${tbOportunidades}.fecha_cierre AS anoCierreOportunidad, ${tbUsuarios}.name AS propietarioOportunidad FROM ${tbOportunidades} INNER JOIN ${tbEtapasVentaPVS}, ${tbCuentas}, ${tbUsuarios} WHERE ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_propietario_oportunidad_crm = ${tbUsuarios}.id_user AND YEAR(STR_TO_DATE(${tbOportunidades}.fecha_cierre,'%d-%m-%Y')) = ${ano} AND ${tbOportunidades}.status = 1 ORDER BY ${tbOportunidades}.id_oportunidad_crm ASC`;
  return query;
}

//Listar todas las Oportunidades por usuario
export function ensamblarQueryGetOportunidadesPorUsuario(idUsuario) {
  const query = `SELECT ${tbOportunidades}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbEtapasVentaPVS}.nombre AS etapaOportunidad, ${tbCuentas}.nombre_cuenta AS cuentaOportunidad, ${tbOportunidades}.fecha_cierre AS anoCierreOportunidad, ${tbUsuarios}.name AS propietarioOportunidad FROM ${tbOportunidades} INNER JOIN ${tbEtapasVentaPVS}, ${tbCuentas}, ${tbUsuarios} WHERE ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_propietario_oportunidad_crm = ${tbUsuarios}.id_user AND ${tbUsuarios}.id_user=${idUsuario} AND ${tbOportunidades}.status = 1 ORDER BY ${tbOportunidades}.id_oportunidad_crm ASC`;
  return query;
}

//Listar todas las Oportunidades por año por usuario
export function getOportunidadesByAnoByUsuario(ano, idUsuario) {
  const query = `SELECT ${tbOportunidades}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbEtapasVentaPVS}.nombre AS etapaOportunidad, ${tbCuentas}.nombre_cuenta AS cuentaOportunidad, ${tbOportunidades}.fecha_cierre AS anoCierreOportunidad, ${tbUsuarios}.name AS propietarioOportunidad FROM ${tbOportunidades} INNER JOIN ${tbEtapasVentaPVS}, ${tbCuentas}, ${tbUsuarios} WHERE ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_propietario_oportunidad_crm = ${tbUsuarios}.id_user AND ${tbUsuarios}.id_user=${idUsuario} AND YEAR(STR_TO_DATE(${tbOportunidades}.fecha_cierre,'%d-%m-%Y')) = ${ano} AND ${tbOportunidades}.status = 1 ORDER BY ${tbOportunidades}.id_oportunidad_crm ASC`;
  return query;
}

//Listar todas las Oportunidades de una cuenta
export function queryGetOportunidadesConCuenta(idCuenta) {
  const query = `SELECT ${tbOportunidades}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbLineasNegocio}.nombre AS nombreLineaNegocio, ${tbEtapasVentaPVS}.nombre AS nombreEtapaVentaOportunidad, ${tbOportunidades}.importe AS importeOportunidad, ${tbUsuarios}.name AS nombrePropietarioOportunidad, ${tbOportunidades}.fecha_cierre AS fechaCierreOportunidad, ${tbOportunidades}.id_contacto_crm AS idContacto FROM ${tbOportunidades} INNER JOIN ${tbEtapasVentaPVS}, ${tbLineasNegocio}, ${tbUsuarios} WHERE ${tbOportunidades}.id_cuenta_crm= ${idCuenta} AND ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbOportunidades}.id_linea_negocio_crm = ${tbLineasNegocio}.id_linea AND ${tbOportunidades}.id_propietario_oportunidad_crm = ${tbUsuarios}.id_user AND ${tbOportunidades}.status = 1 ORDER BY ${tbOportunidades}.id_oportunidad_crm ASC`;
  return query;
}

//Lista todas las oportunidades de una cuenta en base a un usuario que es propietario o copropietario de la oportunidad
export function getListaOportunidadesByCuentaByUsuario(idCuenta, idUsuario) {
  const query = `SELECT ${tbOportunidades}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbLineasNegocio}.nombre AS nombreLineaNegocio, ${tbEtapasVentaPVS}.nombre AS nombreEtapaVentaOportunidad, ${tbOportunidades}.importe AS importeOportunidad, ${tbUsuarios}.name AS nombrePropietarioOportunidad, ${tbOportunidades}.fecha_cierre AS fechaCierreOportunidad, ${tbOportunidades}.id_contacto_crm AS idContacto FROM ${tbOportunidades} INNER JOIN ${tbEtapasVentaPVS}, ${tbLineasNegocio}, ${tbUsuarios} WHERE ${tbOportunidades}.id_cuenta_crm= ${idCuenta} AND ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbOportunidades}.id_linea_negocio_crm = ${tbLineasNegocio}.id_linea AND ${tbOportunidades}.id_propietario_oportunidad_crm = ${tbUsuarios}.id_user AND (${tbOportunidades}.id_propietario_oportunidad_crm = ${idUsuario} OR FIND_IN_SET(${idUsuario},${tbOportunidades}.lista_copropietarios))AND ${tbOportunidades}.status = 1 ORDER BY ${tbOportunidades}.id_oportunidad_crm ASC`;
  return query;
}

//Lista todas las oportunidades abiertas de una cuenta en base a un usuario que es propietario o copropietario de la oportunidad
export function getListaOportunidadesAbiertasByCuentaByUsuario(
  idCuenta,
  idUsuario
) {
  const query = `SELECT ${tbOportunidades}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbLineasNegocio}.nombre AS nombreLineaNegocio, ${tbEtapasVentaPVS}.nombre AS nombreEtapaVentaOportunidad, ${tbOportunidades}.importe AS importeOportunidad, ${tbUsuarios}.name AS nombrePropietarioOportunidad, ${tbOportunidades}.fecha_cierre AS fechaCierreOportunidad, ${tbOportunidades}.id_contacto_crm AS idContacto FROM ${tbOportunidades} INNER JOIN ${tbEtapasVentaPVS}, ${tbLineasNegocio}, ${tbUsuarios} WHERE ${tbOportunidades}.id_cuenta_crm= ${idCuenta} AND ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbOportunidades}.id_linea_negocio_crm = ${tbLineasNegocio}.id_linea AND ${tbOportunidades}.id_propietario_oportunidad_crm = ${tbUsuarios}.id_user AND (${tbOportunidades}.id_propietario_oportunidad_crm = ${idUsuario} OR FIND_IN_SET(${idUsuario},${tbOportunidades}.lista_copropietarios)) AND !(${tbOportunidades}.id_etapa_oportunidad_crm IN (109,110,111)) AND ${tbOportunidades}.status = 1 ORDER BY ${tbOportunidades}.id_oportunidad_crm ASC`;
  return query;
}

//Obtener el numero total de oportunidades en la BD
export const queryGetcantidadOportunidades = `SELECT MAX(${tbOportunidades}.id_oportunidad_crm) AS maximo FROM ${tbOportunidades}`;

//Grabar una oportunidad
export function ensamblarQueryGrabarOportunidad(datos) {
  const query = `INSERT INTO ${tbOportunidades} (id, id_oportunidad_crm, nombre_oportunidad, importe, id_cuenta_crm, fecha_cierre, id_contacto_crm, id_etapa_oportunidad_crm, id_etapa_compra, id_propietario_oportunidad_crm, lista_copropietarios, id_linea_negocio_crm, id_preventa_crm, status, id_creado_por_crm, id_modificado_por_crm, hora_creacion, hora_modificacion, id_oportunidad_valida) VALUES(${datos.id}, ${datos.idOportunidad},  "${datos.nombreOportunidad}", ${datos.importeOportunidad}, ${datos.idCuentaOportunidad}, "${datos.fechaCierreOportunidad}", ${datos.idContactoOportunidad}, ${datos.idEtapaVentaOportunidad}, ${datos.idEtapaCompraOportunidad}, ${datos.idPropietarioOportunidad}, "${datos.copropietarioOportunidad}", ${datos.idLineaNegocioOportunidad}, ${datos.idPreventaOportunidad}, ${datos.idEstadoOportunidad}, ${datos.idCreadoPorOportunidad}, ${datos.idModificadoPorOportunidad}, "${datos.fechaCreacionOportunidad}", "${datos.fechaModificacionOportunidad}", ${datos.idProcesoOportunidad})`;
  return query;
}

//Obtener el id de una oportunidad con el mismo id. Es para entregar el id a quien lo pregunta dentro de una respuesta valida
export function ensamblarQueryGetIdOportunidadConIdOportunidad(idOportunidad) {
  const query = `SELECT ${tbOportunidades}.id_oportunidad_crm AS id, ${tbOportunidades}.status AS statusOportunidad FROM ${tbOportunidades} WHERE ${tbOportunidades}.id_oportunidad_crm = ${idOportunidad}`;
  return query;
}

//Obtener todos los datos de una oportunidad
export function ensamblarQueryGetOportunidad(idOportunidad) {
  const query = `SELECT * FROM ${tbOportunidades} WHERE ${tbOportunidades}.id_oportunidad_crm = ${idOportunidad}`;
  return query;
}

//Actualizar una oportunidad
export function ensamblarQueryActualizarOportunidad(datos) {
  const query = `UPDATE ${tbOportunidades} SET nombre_oportunidad="${datos.nombreOportunidad}", importe="${datos.importeOportunidad}", id_cuenta_crm=${datos.idCuentaOportunidad},fecha_cierre="${datos.fechaCierreOportunidad}",id_contacto_crm="${datos.idContactoOportunidad}",id_etapa_oportunidad_crm="${datos.idEtapaVentaOportunidad}",id_etapa_compra="${datos.idEtapaCompraOportunidad}",id_propietario_oportunidad_crm="${datos.idPropietarioOportunidad}",lista_copropietarios="${datos.copropietarioOportunidad}",id_linea_negocio_crm=${datos.idLineaNegocioOportunidad},id_preventa_crm="${datos.idPreventaOportunidad}",status="${datos.idEstadoOportunidad}",id_modificado_por_crm="${datos.idModificadoPorOportunidad}",hora_modificacion="${datos.fechaModificacionOportunidad}"  WHERE ${tbOportunidades}.id_oportunidad_crm = ${datos.idOportunidad}`;
  return query;
}

//Descargar las respuestas del proceso de ventas de una oportunidad
export function queryGetRespuestasPVOportunidad(idOportunidad) {
  const query = `SELECT * FROM ${tbRespuestasPV} WHERE ${tbRespuestasPV}.id_oportunidad = ${idOportunidad}`;
  return query;
}

//Grabar las respuestas de una oportunidad
export function ensamblarQueryActualizarRespuestasPV(datos) {
  const query = `INSERT INTO ${tbRespuestasPV} (id, id_oportunidad, interes, requerimiento_tecnico, motivacion, presupuesto, cuando_porque, decision, ventajas, estrategia, informacion_tecnica_adicional, presentacion_tecnica, alcance_propuesto, puntos_tecnicos_importantes, aceptacion_propuesta_tecnica, observacion_propuesta_tecnica, riesgos_propuesta_tecnica, presupuesto_esperado, condiciones_comerciales, porque_demostracion, criterios_exito, siguientes_pasos_demostracion, resultado_demostracion, zona_baja_negociacion, puntos_importantes_clientes_negociacion, puntos_importantes_nosotros_negociacion, acuerdo_cliente, riesgo_waiting, aprobacion_respuestas) VALUES(null, ${datos.idOportunidad}, "${datos.interes}", "${datos.requerimientoTecnico}", "${datos.motivacion}", "${datos.presupuesto}", "${datos.cuandoPorque}", "${datos.decision}", "${datos.ventajas}", "${datos.estrategia}", "${datos.informacionTecnicaAdicional}", "${datos.presentacionTecnica}", "${datos.alcancePropuesto}", "${datos.puntosTecnicosImportantes}", "${datos.aceptacionPropuestaTecnica}", "${datos.observacionPropuestaTecnica}", "${datos.riesgosPropuestaTecnica}", "${datos.presupuestoEsperado}", "${datos.condicionesComerciales}", "${datos.porqueDemostracion}", "${datos.criteriosExito}", "${datos.siguientesPasosDemostracion}", "${datos.resultadoDemostracion}", "${datos.zonaBajaNegociacion}", "${datos.puntosImportantesClientesNegociacion}", "${datos.puntosImportantesNosotrosNegociacion}", "${datos.acuerdoCliente}", "${datos.riesgoWaiting}", "${datos.validacion}") ON DUPLICATE KEY UPDATE interes="${datos.interes}", requerimiento_tecnico="${datos.requerimientoTecnico}", motivacion="${datos.motivacion}", presupuesto="${datos.presupuesto}", cuando_porque="${datos.cuandoPorque}", decision="${datos.decision}", ventajas="${datos.ventajas}", estrategia="${datos.estrategia}", informacion_tecnica_adicional="${datos.informacionTecnicaAdicional}", presentacion_tecnica="${datos.presentacionTecnica}", alcance_propuesto="${datos.alcancePropuesto}", puntos_tecnicos_importantes="${datos.puntosTecnicosImportantes}", aceptacion_propuesta_tecnica="${datos.aceptacionPropuestaTecnica}", observacion_propuesta_tecnica="${datos.observacionPropuestaTecnica}", riesgos_propuesta_tecnica="${datos.riesgosPropuestaTecnica}", presupuesto_esperado="${datos.presupuestoEsperado}", condiciones_comerciales="${datos.condicionesComerciales}", porque_demostracion="${datos.porqueDemostracion}", criterios_exito="${datos.criteriosExito}", siguientes_pasos_demostracion="${datos.siguientesPasosDemostracion}", resultado_demostracion="${datos.resultadoDemostracion}", zona_baja_negociacion="${datos.zonaBajaNegociacion}", puntos_importantes_clientes_negociacion="${datos.puntosImportantesClientesNegociacion}", puntos_importantes_nosotros_negociacion="${datos.puntosImportantesNosotrosNegociacion}", acuerdo_cliente="${datos.acuerdoCliente}", riesgo_waiting="${datos.riesgoWaiting}", aprobacion_respuestas="${datos.validacion}"`;

  return query;
}

//Descargar las respuestas, validaciones y preguntas del PV de una oportunidad
export function queryGetValidacionPVOportunidad(idOportunidad) {
  const query = `SELECT ${tbPreguntasPV}.id, ${tbPreguntasPV}.id_pregunta AS idPregunta, ${tbPreguntasPV}.id_etapa AS idEtapa, ${tbPreguntasPV}.pregunta, ${tbRespuestasPV}.id_oportunidad AS idOportunidad, ${tbRespuestasPV}.interes, ${tbRespuestasPV}.requerimiento_tecnico, ${tbRespuestasPV}.motivacion, ${tbRespuestasPV}.presupuesto, ${tbRespuestasPV}.cuando_porque, ${tbRespuestasPV}.decision, ${tbRespuestasPV}.ventajas, ${tbRespuestasPV}.estrategia, ${tbRespuestasPV}.informacion_tecnica_adicional, ${tbRespuestasPV}.presentacion_tecnica, ${tbRespuestasPV}.alcance_propuesto, ${tbRespuestasPV}.puntos_tecnicos_importantes, ${tbRespuestasPV}.aceptacion_propuesta_tecnica, ${tbRespuestasPV}.observacion_propuesta_tecnica, ${tbRespuestasPV}.riesgos_propuesta_tecnica, ${tbRespuestasPV}.presupuesto_esperado, ${tbRespuestasPV}.condiciones_comerciales, ${tbRespuestasPV}.porque_demostracion, ${tbRespuestasPV}.criterios_exito, ${tbRespuestasPV}.siguientes_pasos_demostracion, ${tbRespuestasPV}.resultado_demostracion, ${tbRespuestasPV}.zona_baja_negociacion, ${tbRespuestasPV}.puntos_importantes_clientes_negociacion, ${tbRespuestasPV}.puntos_importantes_nosotros_negociacion, ${tbRespuestasPV}.acuerdo_cliente, ${tbRespuestasPV}.riesgo_waiting, ${tbRespuestasPV}.aprobacion_respuestas FROM ${tbPreguntasPV} INNER JOIN ${tbRespuestasPV} WHERE ${tbRespuestasPV}.id_oportunidad = ${idOportunidad}`;
  return query;
}

//Obtener el listado de las oportunidades pendientes de aprobar
export const getListaOportunidadesPendientesAprobacion = `SELECT ${tbOportunidades}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbEtapasVentaPVS}.nombre AS etapaOportunidad, ${tbCuentas}.nombre_cuenta AS cuentaOportunidad, ${tbOportunidades}.fecha_cierre AS anoCierreOportunidad, ${tbUsuarios}.name AS propietarioOportunidad FROM ${tbOportunidades} INNER JOIN ${tbEtapasVentaPVS}, ${tbCuentas}, ${tbUsuarios} WHERE ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_propietario_oportunidad_crm = ${tbUsuarios}.id_user AND ${tbOportunidades}.status = 2 ORDER BY ${tbOportunidades}.id_oportunidad_crm ASC`;

//====================================== REGISTROS CON FABRICANTES ================================================
//Registros de fabricantes
export const queryRegistrosFabricantes = `SELECT ${tbRegistrosF}.id_registro_fabricante AS idRegistro, ${tbCuentas}.nombre_cuenta AS cuentaRegistro, ${tbOportunidades}.nombre_oportunidad AS oportunidadRegistro, ${tbFabricantes}.nombre AS fabricanteRegistro, ${tbUsuarios}.name AS vendedorRegistro, ${tbRegistrosF}.nro_registro AS numeroRegistro, ${tbEstadosRF}.nombre AS estadoRegistro, ${tbRegistrosF}.fecha_vencimiento AS vencimientoRegistro FROM ${tbRegistrosF} INNER JOIN ${tbCuentas}, ${tbOportunidades}, ${tbFabricantes}, ${tbUsuarios}, ${tbEstadosRF} WHERE ${tbRegistrosF}.id_oportunidad = ${tbOportunidades}.id_oportunidad_crm AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbRegistrosF}.id_fabricante = ${tbFabricantes}.id_fabricante AND ${tbOportunidades}.id_propietario_oportunidad_crm = ${tbUsuarios}.id_user AND ${tbRegistrosF}.id_estado_registro = ${tbEstadosRF}.id_estado ORDER BY id_registro_fabricante ASC`;

//====================================== PARAMETROS DE CONFIGURACION ===============================================
//Tipos de la cuenta
export const queryConfiguracionTipoCuenta = `SELECT ${tbTipoCuenta}.id_tipo_cuenta, ${tbTipoCuenta}.nombre FROM ${tbTipoCuenta} ORDER BY ${tbTipoCuenta}.id_tipo_cuenta ASC`;
//Sectores de la cuenta
export const queryConfiguracionSectorCuenta = `SELECT ${tbSectores}.id_sector, ${tbSectores}.nombre FROM ${tbSectores} ORDER BY ${tbSectores}.id_sector ASC`;

//Países
export const queryConfiguracionPais = `SELECT ${tbPaises}.id_pais, ${tbPaises}.nombre FROM ${tbPaises} ORDER BY ${tbPaises}.nombre ASC`;
//Participación en la compra
export const queryConfiguracionParticipacion = `SELECT ${tbParticipacion}.id_participacion, ${tbParticipacion}.nombre FROM ${tbParticipacion} ORDER BY ${tbParticipacion}.nombre ASC`;
//Relación del contacto con el proveedor
export const queryConfiguracionRelacion = `SELECT ${tbRelacion}.id_relacion, ${tbRelacion}.nombre FROM ${tbRelacion} ORDER BY ${tbRelacion}.nombre ASC`;
//Situación laboral del contacto
export const queryConfiguracionSituacionLaboral = `SELECT ${tbSituacionLaboral}.id_estado_contacto, ${tbSituacionLaboral}.nombre FROM ${tbSituacionLaboral} ORDER BY ${tbSituacionLaboral}.nombre ASC`;
//Etapas de venta de la oportunidad
export const queryConfiguracionEtapaVenta = `SELECT ${tbEtapasVentaPVS}.id_etapa_oportunidad AS id, ${tbEtapasVentaPVS}.nombre FROM ${tbEtapasVentaPVS} ORDER BY ${tbEtapasVentaPVS}.id_etapa_oportunidad ASC`;
//Etapas de compra de la oportunidad
export const queryConfiguracionEtapaCompra = `SELECT ${tbEtapasCompra}.id_etapa_compra AS id, ${tbEtapasCompra}.nombre FROM ${tbEtapasCompra} ORDER BY ${tbEtapasCompra}.nombre ASC`;
//Lineas de negocio de la oportunidad
export const queryConfiguracionLineaNegocio = `SELECT ${tbLineasNegocio}.id_linea AS id, ${tbLineasNegocio}.nombre FROM ${tbLineasNegocio} ORDER BY ${tbLineasNegocio}.nombre ASC`;
//Lineas de negocio de la oportunidad
export const queryConfiguracionEstadoOportunidad = `SELECT ${tbEstadosOportunidad}.id_estado AS id, ${tbEstadosOportunidad}.nombre FROM ${tbEstadosOportunidad} ORDER BY ${tbEstadosOportunidad}.nombre ASC`;
//Obtener preguntas del proceso de ventas
export const queryGetConfiguracionPreguntasPV = `SELECT * FROM ${tbPreguntasPV} WHERE ${tbPreguntasPV}.status=1`;

//Obtiene la lista de los estados de una cotizacion
export const getListaEstadosCotizacion = `SELECT ${tbEstadosCotizacion}.id_estado_propuesta AS idEstadoCotizacion, ${tbEstadosCotizacion}.nombre AS nombreEstadoCotizacion FROM ${tbEstadosCotizacion}`;

//Obtiene la lista de opciones de tiempos de entrega
export const getListaTiemposEntregaCotizacion = `SELECT ${tbTiemposEntregaCotizacion}.id_tiempo_entrega AS id, ${tbTiemposEntregaCotizacion}.nombre AS nombre FROM ${tbTiemposEntregaCotizacion}`;

//Obtiene la lista de opciones de validez de la cotizacion
export const getListaValidezCotizacion = `SELECT ${tbValidezCotizacion}.id_opcion_validez AS id, ${tbValidezCotizacion}.nombre AS nombre FROM ${tbValidezCotizacion}`;

//Obtiene la lista de opciones de garantia de la cotizacion
export const getListaGarantiaCotizacion = `SELECT ${tbGarantiaCotizacion}.id_opcion_garantia AS id, ${tbGarantiaCotizacion}.nombre AS nombre FROM ${tbGarantiaCotizacion}`;

//Obtiene la lista de opciones de forma de pago de la cotizacion
export const getListaFormaPagoCotizacion = `SELECT ${tbFormaPagoCotizacion}.id_forma_pago AS id, ${tbFormaPagoCotizacion}.nombre AS nombre FROM ${tbFormaPagoCotizacion}`;

//Obtiene la lista de opciones de moneda de la cotizacion
export const getListaMonedaCotizacion = `SELECT ${tbMonedaCotizacion}.id_moneda AS id, ${tbMonedaCotizacion}.nombre AS nombre FROM ${tbMonedaCotizacion}`;

//=================================== USUARIOS =========================================================
//Lista todos los usuarios (activos e inactivos)
export const getListaUsuarios = `SELECT ${tbUsuarios}.id_user, ${tbUsuarios}.name, ${tbUsuarios}.email, ${tbUsuarios}.telefono FROM ${tbUsuarios} ORDER BY ${tbUsuarios}.name ASC`;

//Lista los usuarios activos con sus roles
export const getListaUsuariosActivos = `SELECT ${tbUsuarios}.id_user AS id, ${tbUsuarios}.name AS nombre, ${tbUsuariosRol}.id_role FROM ${tbUsuarios}, ${tbUsuariosRol} WHERE ${tbUsuarios}.id_user = ${tbUsuariosRol}.id_user AND ${tbUsuariosRol}.status = 1 AND ${tbUsuarios}.status=1`;

//Lista los usuarios activos y sus roles en base a una cuenta
export function getListaUsuariosActivosCuenta(idCuenta) {
  const query = `SELECT ${tbUsuarios}.id_user AS id, ${tbUsuarios}.name AS nombre, ${tbUsuariosRol}.id_role FROM ${tbUsuarios}, ${tbUsuariosRol}, ${tbCuentas} WHERE ${tbUsuarios}.id_user = ${tbUsuariosRol}.id_user AND ${tbUsuariosRol}.status = 1 AND (${tbCuentas}.id_propietario_crm = ${tbUsuarios}.id_user OR FIND_IN_SET(${tbUsuarios}.id_user,${tbCuentas}.lista_copropietarios)) AND ${tbCuentas}.id_cuenta_crm = ${idCuenta} AND ${tbUsuarios}.status=1`;
  return query;
}

//Obtiene toda la informacion de un usuario en base a su correo
export function getUsuarioByEmail(email) {
  const query = `SELECT ${tbUsuarios}.id_user AS id, ${tbUsuarios}.name AS nombre, ${tbRolRule}.id_rule AS rule FROM ${tbUsuarios}, ${tbUsuariosRol}, ${tbRolRule} WHERE ${tbUsuarios}.email = "${email}" AND ${tbUsuarios}.id_user = ${tbUsuariosRol}.id_user AND ${tbUsuariosRol}.id_role = ${tbRolRule}.id_role AND ${tbUsuariosRol}.status = 1 AND ${tbUsuarios}.status=1 AND ${tbRolRule}.status = 1`;
  return query;
}

//Valida si existe un usuario en base a su correo. Entrega el id del usuario
export function getIdUsuarioByEmail(email) {
  const query = `SELECT ${tbUsuarios}.id_user AS id, ${tbUsuarios}.name AS name FROM ${tbUsuarios} WHERE ${tbUsuarios}.email = "${email}" AND ${tbUsuarios}.status=1`;
  return query;
}

//==================================== COTIZACIONES ==============================================
//Descargar todos los datos de una oportunidad en base a una cotizacion
export function ensamblarQueryGetOportunidadByCotizacion(idCotizacion) {
  const query = `SELECT * FROM ${tbPropuestas} WHERE ${tbPropuestas}.id_oportunidad_crm = ${idCotizacion}`;
  return query;
}

//Obtener todos los datos de una cotizacion
export function ensamblarQueryGetCotizacion(idCotizacion) {
  const query = `SELECT * FROM ${tbPropuestas} WHERE ${tbPropuestas}.id_propuesta = ${idCotizacion}`;
  return query;
}

//Obtener todos los datos de una version de una cotizacion
export function GetCotizacionVersion(idCotizacion, versionCotizacion) {
  const datosPropuesta = `${tbPropuestas}.id AS id, ${tbPropuestas}.id_propuesta AS idCotizacion, ${tbPropuestas}.id_oportunidad_crm AS idOportunidadCotizacion,${tbPropuestas}.id_propietario_propuesta AS idPropietarioCotizacion, ${tbPropuestas}.status AS idStatusCotizacion, ${tbPropuestas}.total_versiones AS totalVersionesCotizacion, ${tbPropuestas}.id_pais AS idPais, ${tbPropuestas}.nro_documentos AS numeroDocumentos, ${tbPropuestas}.id_pv_oportunidad AS idPvOportunidad, ${tbPropuestas}.requiere_operaciones AS requiereOperaciones, ${tbPropuestas}.requiere_soporte AS requiereSoporte, ${tbPropuestas}.horas_implementacion AS horasImplementacion, ${tbPropuestas}.dias_implementacion AS diasImplementacion, ${tbPropuestas}.total_meses_soporte AS totalMesesSoporte, ${tbPropuestas}.notas_correctivas AS notasCorrectivas`;

  const datosVersion = `${tbVersiones}.nro_version AS versionCotizacion,${tbVersiones}.fecha_propuesta AS fechaCotizacion,${tbVersiones}.id_crm_contacto_impresion AS idContactoCotizacion, ${tbVersiones}.id_estado_propuesta AS idEstadoCotizacion, ${tbVersiones}.id_vendedor AS idVendedorCotizacion, ${tbVersiones}.introduccion_propuesta AS introduccionCotizacion, ${tbVersiones}.descuento AS descuentoFinalPorcentaje, ${tbVersiones}.switch_distribucion_descuento AS distribucionDescuentoFinal, ${tbVersiones}.valor_precio_total AS precioTotal, ${tbVersiones}.valor_iva AS IVAPorcentaje, ${tbVersiones}.iva_display AS distribucionIVA, ${tbVersiones}.id_tiempo_entrega AS tiempoEntrega,${tbVersiones}.id_opcion_validez AS validez,${tbVersiones}.id_opcion_garantia AS garantia,${tbVersiones}.id_forma_pago AS formaPago,${tbVersiones}.id_moneda_cambio AS moneda,${tbVersiones}.tipo_cambio AS tipoCambio,${tbVersiones}.notas_comerciales AS notasCotizacion,${tbVersiones}.notas_internas AS notasInternas,${tbVersiones}.id_estado_propuesta AS idEstadoCotizacion,${tbVersiones}.fecha_creacion AS fechaCreacionCotizacion,${tbVersiones}.fecha_creacion AS fechaModificacionCotizacion,${tbVersiones}.nombre_propuesta AS nombreCotizacion,${tbVersiones}.total_secciones AS totalSecciones,${tbVersiones}.telefono_vendedor AS telefonoVendedor,${tbVersiones}.email_vendedor AS emailVendedor,${tbVersiones}.id_preventa AS idPreventa,${tbVersiones}.email_preventa AS emailPreventa,${tbVersiones}.nombre_contacto_impresion AS nombreContactoImpresion,${tbVersiones}.id_crm_contacto_impresion AS idContactoImpresion,${tbVersiones}.telefono_contacto_impresion AS telefonoContactoImpresion,${tbVersiones}.email_contacto_impresion AS emailContactoImpresion,${tbVersiones}.id_moneda_base AS idMonedaBase,${tbVersiones}.iva AS IVA,${tbVersiones}.otro_impuesto AS otroImpuesto,${tbVersiones}.valor_otro_impuesto AS valorOtroImpuesto,${tbVersiones}.otro_impuesto_display AS otroImpuestoDisplay,${tbVersiones}.fecha_aceptada AS fechaAceptada,${tbVersiones}.valor_costo_total AS costoTotal,${tbVersiones}.financiamiento_resumen AS financiamientoResumen,${tbVersiones}.financiamiento_tea AS financiamientoTEA,${tbVersiones}.financiamiento_periodo_pago AS financiamientoPeriodoPago,${tbVersiones}.financiamiento_numero_periodos AS financiamientoNumeroPeriodos,${tbVersiones}.financiamiento_valor_inicial AS financiamientoValorInicial,${tbVersiones}.financiado AS financiado,${tbVersiones}.status AS statusVersion`;

  const datosOportunidad = `${tbCuentas}.id_cuenta_crm AS idCuentaOportunidad,${tbOportunidades}.nombre_oportunidad AS nombreOportunidad,${tbOportunidades}.fecha_cierre AS fechaCierreOportunidad,${tbEtapasVentaPVS}.id_etapa_oportunidad AS idEtapaVentaOportunidad,${tbOportunidades}.id_contacto_crm AS idContactoOportunidad,${tbOportunidades}.importe AS importeOportunidad`;

  const query = `SELECT ${datosPropuesta}, ${datosVersion}, ${datosOportunidad} 
  FROM ${tbPropuestas}, ${tbOportunidades}, ${tbCuentas}, ${tbEtapasVentaPVS}, ${tbEstadosCotizacion}, ${tbVersiones} 
  WHERE ${tbPropuestas}.id_propuesta = ${idCotizacion} AND ${tbVersiones}.nro_version = ${versionCotizacion} AND ${tbPropuestas}.id_oportunidad_crm = ${tbOportunidades}.id_oportunidad_crm AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbPropuestas}.id_propuesta = ${tbVersiones}.id_propuesta AND ${tbVersiones}.id_estado_propuesta = ${tbEstadosCotizacion}.id_estado_propuesta`;
  return query;
}

//Obtener los datos de las secciones una versión de una cotización
export function GetSeccionCotizacionVersion(idCotizacion, versionCotizacion) {
  const query = `SELECT ${tbSecciones}.nro_seccion AS numeroSeccion, ${tbSecciones}.titulo AS tituloSeccion, ${tbSecciones}.nro_items AS numeroItems, ${tbSecciones}.id_control AS idControlSeccion, ${tbSecciones}.status AS statusSeccion FROM ${tbSecciones} WHERE ${tbSecciones}.id_propuesta = ${idCotizacion} AND ${tbSecciones}.nro_version = ${versionCotizacion} AND ${tbSecciones}.status = 1`;
  return query;
}

//Obtener los datos de los items de una versión de una cotización
export function GetItemCotizacionVersion(idCotizacion, versionCotizacion) {
  const query = `SELECT ${tbItems}.id AS id, ${tbItems}.nro_seccion AS numeroSeccion, ${tbItems}.nro_item AS numeroItem, ${tbItems}.id_fabricante AS idFabricante, ${tbItems}.codigo AS codigoItem, ${tbItems}.descripcion AS descripcionItem, CAST(${tbItems}.cantidad AS DECIMAL(10,2)) AS cantidadItem, ${tbItems}.precio_lista AS precioListaItem, ${tbItems}.descuento_fabricante AS descuentoFabricante, ${tbItems}.precio_descontado AS precioDescontado, ${tbItems}.importacion AS importacion, ${tbItems}.costo_unitario AS costoUnitario, ${tbItems}.costo_total AS costoTotal, ${tbItems}.margen AS margen, ${tbItems}.descuento AS descuentoFinal, ${tbItems}.precio_unitario AS precioVentaItem, ${tbItems}.valor_precio_total AS precioVentaTotal, ${tbItems}.pertenece_formula AS perteneceFormula, ${tbItems}.precio_total AS formula, ${tbItems}.status AS status, CASE 
        WHEN ${tbItems}.sombra = 1 THEN TRUE
        ELSE FALSE
    END AS filaResaltada, CASE 
        WHEN ${tbItems}.escondido = 1 THEN TRUE
        ELSE FALSE
    END AS filaEscondida, CASE 
        WHEN ${tbItems}.fila_texto = 1 THEN TRUE
        ELSE FALSE
    END AS filaSubtitulo, CASE 
        WHEN ${tbItems}.fila_sin_precio = 1 THEN TRUE
        ELSE FALSE
    END AS filaSinPrecio FROM ${tbItems} WHERE ${tbItems}.id_propuesta = ${idCotizacion} AND ${tbItems}.nro_version = ${versionCotizacion} AND ${tbItems}.status = 1`;
  return query;
}

/*export function GetCotizacionVersion(idCotizacion, versionCotizacion) {
  const query = `SELECT ${tbPropuestas}.id_propuesta AS idCotizacion, ${tbVersiones}.nro_version AS versionCotizacion, ${tbPropuestas}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbCuentas}.id_cuenta_crm AS idCuentaOportunidad, ${tbOportunidades}.fecha_cierre AS fechaCierreOportunidad, ${tbOportunidades}.id_contacto_crm AS idContactoOportunidad, ${tbOportunidades}.importe AS importeOportunidad, ${tbEtapasVentaPVS}.id_etapa_oportunidad AS idEtapaVentaOportunidad, ${tbVersiones}.valor_precio_total AS importeCotizacion, ${tbEstadosCotizacion}.nombre AS estadoCotizacion, ${tbVersiones}.fecha_cierre AS fechaCierreCotizacion 
  FROM ${tbPropuestas}, ${tbOportunidades}, ${tbCuentas}, ${tbEtapasVentaPVS}, ${tbEstadosCotizacion}, ${tbVersiones} 
  WHERE ${tbPropuestas}.id_propuesta = ${idCotizacion} AND ${tbVersiones}.nro_version = ${versionCotizacion} AND ${tbPropuestas}.id_oportunidad_crm = ${tbOportunidades}.id_oportunidad_crm AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbPropuestas}.id_propuesta = ${tbVersiones}.id_propuesta AND ${tbVersiones}.id_estado_propuesta = ${tbEstadosCotizacion}.id_estado_propuesta`;
  return query;
}*/

//Listar todas las cotizaciones
export function getListaCotizaciones() {
  const query = `SELECT ${tbPropuestas}.id_propuesta AS idCotizacion, ${tbVersiones}.nro_version AS versionCotizacion, ${tbPropuestas}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbCuentas}.nombre_cuenta AS cuentaOportunidad, ${tbEtapasVentaPVS}.nombre AS etapaVentaOportunidad, ${tbVersiones}.valor_precio_total AS importe, ${tbEstadosCotizacion}.nombre AS estadoCotizacion, ${tbVersiones}.fecha_cierre AS fechaCierreCotizacion 
  FROM ${tbPropuestas}, ${tbOportunidades}, ${tbCuentas}, ${tbEtapasVentaPVS}, ${tbEstadosCotizacion}, ${tbVersiones} 
  WHERE ${tbPropuestas}.id_oportunidad_crm = ${tbOportunidades}.id_oportunidad_crm AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbPropuestas}.id_propuesta = ${tbVersiones}.id_propuesta AND ${tbVersiones}.id_estado_propuesta = ${tbEstadosCotizacion}.id_estado_propuesta AND ${tbVersiones}.status = 1`;
  return query;
}

//Listar todas las cotizaciones por año
export function getListaCotizacionesByAno(ano) {
  const query = `SELECT ${tbPropuestas}.id_propuesta AS idCotizacion, ${tbVersiones}.nro_version AS versionCotizacion, ${tbPropuestas}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbCuentas}.nombre_cuenta AS cuentaOportunidad, ${tbEtapasVentaPVS}.nombre AS etapaVentaOportunidad, ${tbVersiones}.valor_precio_total AS importe, ${tbEstadosCotizacion}.nombre AS estadoCotizacion, ${tbVersiones}.fecha_cierre AS fechaCierreCotizacion 
  FROM ${tbPropuestas}, ${tbOportunidades}, ${tbCuentas}, ${tbEtapasVentaPVS}, ${tbEstadosCotizacion}, ${tbVersiones} 
  WHERE ${tbPropuestas}.id_oportunidad_crm = ${tbOportunidades}.id_oportunidad_crm AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbPropuestas}.id_propuesta = ${tbVersiones}.id_propuesta AND ${tbVersiones}.id_estado_propuesta = ${tbEstadosCotizacion}.id_estado_propuesta AND YEAR(STR_TO_DATE(${tbVersiones}.fecha_cierre,'%d-%m-%Y')) = ${ano} AND ${tbVersiones}.status = 1`;
  return query;
}

//Listar las cotizaciones en base a un usuario que es el propietario o copropietario
export function getListaCotizacionesByUsuario(idUsuario) {
  const query = `SELECT ${tbPropuestas}.id_propuesta AS idCotizacion, ${tbVersiones}.nro_version AS versionCotizacion, ${tbPropuestas}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbCuentas}.nombre_cuenta AS cuentaOportunidad, ${tbEtapasVentaPVS}.nombre AS etapaVentaOportunidad, ${tbVersiones}.valor_precio_total AS importe, ${tbEstadosCotizacion}.nombre AS estadoCotizacion, ${tbVersiones}.fecha_cierre AS fechaCierreCotizacion 
  FROM ${tbPropuestas}, ${tbOportunidades}, ${tbCuentas}, ${tbEtapasVentaPVS}, ${tbEstadosCotizacion}, ${tbVersiones} 
  WHERE ${tbPropuestas}.id_propietario_propuesta = ${idUsuario} AND ${tbPropuestas}.id_oportunidad_crm = ${tbOportunidades}.id_oportunidad_crm AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbPropuestas}.id_propuesta = ${tbVersiones}.id_propuesta AND ${tbVersiones}.id_estado_propuesta = ${tbEstadosCotizacion}.id_estado_propuesta AND (${tbCuentas}.id_propietario_crm = ${idUsuario} OR FIND_IN_SET(${idUsuario},${tbCuentas}.lista_copropietarios))`;
  return query;
}

//Listar las cotizaciones por año por usuario que es el propietario o copropietario
export function getListaCotizacionesByAnoByUsuario(ano, idUsuario) {
  const query = `SELECT ${tbPropuestas}.id_propuesta AS idCotizacion, ${tbVersiones}.nro_version AS versionCotizacion, ${tbPropuestas}.id_oportunidad_crm AS idOportunidad, ${tbOportunidades}.nombre_oportunidad AS nombreOportunidad, ${tbCuentas}.nombre_cuenta AS cuentaOportunidad, ${tbEtapasVentaPVS}.nombre AS etapaVentaOportunidad, ${tbVersiones}.valor_precio_total AS importe, ${tbEstadosCotizacion}.nombre AS estadoCotizacion, ${tbVersiones}.fecha_cierre AS fechaCierreCotizacion 
  FROM ${tbPropuestas}, ${tbOportunidades}, ${tbCuentas}, ${tbEtapasVentaPVS}, ${tbEstadosCotizacion}, ${tbVersiones} 
  WHERE ${tbPropuestas}.id_propietario_propuesta = ${idUsuario} AND ${tbPropuestas}.id_oportunidad_crm = ${tbOportunidades}.id_oportunidad_crm AND ${tbOportunidades}.id_cuenta_crm = ${tbCuentas}.id_cuenta_crm AND ${tbOportunidades}.id_etapa_oportunidad_crm = ${tbEtapasVentaPVS}.id_etapa_oportunidad AND ${tbPropuestas}.id_propuesta = ${tbVersiones}.id_propuesta AND ${tbVersiones}.id_estado_propuesta = ${tbEstadosCotizacion}.id_estado_propuesta AND YEAR(STR_TO_DATE(${tbVersiones}.fecha_cierre,'%d-%m-%Y')) = ${ano} AND (${tbCuentas}.id_propietario_crm = ${idUsuario} OR FIND_IN_SET(${idUsuario},${tbCuentas}.lista_copropietarios))`;
  return query;
}

export function actualizarPropuestaCotizacion(propuesta) {
  const query = `UPDATE ${tbPropuestas} SET total_versiones = ${propuesta.totalVersiones} WHERE id_propuesta = ${propuesta.idCotizacion}`;
  return query;
}

export function actualizarVersionCotizacion(version) {
  const query = `UPDATE ${tbVersiones} SET nombre_propuesta="${version.nombreCotizacion}", total_secciones=${version.totalSecciones},introduccion_propuesta="${version.introduccionCotizacion}",nombre_contacto_impresion="${version.nombreContactoImpresion}",id_crm_contacto_impresion=${version.idContactoImpresion},telefono_contacto_impresion="${version.telefonoContactoImpresion}",email_contacto_impresion="${version.emailContactoImpresion}",id_moneda_cambio=${version.idMonedaCambio},tipo_cambio=${version.tipoCambio},descuento=${version.descuentoFinalPorcentaje}, switch_distribucion_descuento=${version.distribucionDescuentoFinal}, iva_display="${version.distribucionIVA}",fecha_propuesta="${version.fechaCotizacion}",fecha_ult_modificacion="${version.fechaModificacionCotizacion}",id_estado_propuesta=${version.idEstadoCotizacion}, id_tiempo_entrega=${version.tiempoEntrega}, id_opcion_validez=${version.validez}, id_opcion_garantia=${version.garantia}, id_forma_pago=${version.formaPago}, notas_comerciales="${version.notasCotizacion}", valor_precio_total=${version.precioTotal}, valor_costo_total=${version.costoTotal}, notas_internas="${version.notasInternas}" WHERE id_propuesta=${version.idCotizacion} AND nro_version=${version.versionCotizacion}`;
  return query;
}

export function crearVersionCotizacion(version, idCotizacion, idVersion) {
  const query = `INSERT INTO ${tbVersiones} (id,id_propuesta,nro_version, nombre_propuesta,total_secciones,introduccion_propuesta,id_vendedor,telefono_vendedor,email_vendedor, id_preventa,email_preventa,nombre_contacto_impresion,id_crm_contacto_impresion,telefono_contacto_impresion,email_contacto_impresion,id_moneda_base,id_moneda_cambio,tipo_cambio,descuento,switch_distribucion_descuento,iva,valor_iva,iva_display,otro_impuesto,valor_otro_impuesto,otro_impuesto_display,fecha_creacion,fecha_propuesta,fecha_ult_modificacion,fecha_cierre,fecha_aceptada,id_estado_propuesta,id_tiempo_entrega,id_opcion_validez,id_opcion_garantia,id_forma_pago,notas_comerciales,valor_precio_total,valor_costo_total,financiamiento_resumen, financiamiento_tea, financiamiento_periodo_pago, financiamiento_numero_periodos, financiamiento_valor_inicial, financiado, notas_internas, status) SELECT ${version.id}, ${idCotizacion}, ${idVersion}, "${version.nombreCotizacion}",${version.totalSecciones},"${version.introduccionCotizacion}",${version.idVendedorCotizacion},"${version.telefonoVendedor}","${version.emailVendedor}",${version.idPreventa},"${version.emailPreventa}","${version.nombreContactoImpresion}",${version.idContactoImpresion},"${version.telefonoContactoImpresion}","${version.emailContactoImpresion}",${version.idMonedaBase},${version.idMonedaCambio},${version.tipoCambio},${version.descuentoFinalPorcentaje},${version.distribucionDescuentoFinal},${version.IVA},${version.IVAPorcentaje},"${version.distribucionIVA}","${version.otroImpuesto}",${version.valorOtroImpuesto},"${version.otroImpuestoDisplay}","${version.fechaCreacionCotizacion}","${version.fechaCotizacion}","${version.fechaModificacionCotizacion}","${version.fechaCierreOportunidad}","${version.fechaAceptada}",${version.idEstadoCotizacion},${version.tiempoEntrega},${version.validez},${version.garantia},${version.formaPago},"${version.notasCotizacion}",${version.precioTotal},${version.costoTotal},"${version.financiamientoResumen}",${version.financiamientoTEA},"${version.financiamientoPeriodoPago}",${version.financiamientoNumeroPeriodos},${version.financiamientoValorInicial},${version.financiado},"${version.notasInternas}",${version.statusVersion} WHERE NOT EXISTS (SELECT 1 FROM ${tbVersiones} WHERE id_propuesta=${idCotizacion} AND nro_version=${idVersion})`;
  return query;
}

export function desactivarSeccionCotizacion(version) {
  const query = `UPDATE ${tbSecciones} SET status = 0 WHERE id_propuesta = ${version.idCotizacion} AND nro_version = ${version.versionCotizacion}`;
  return query;
}

export function actualizarSeccionCotizacion(seccion) {
  //console.log("secct", seccion);
  const query = `UPDATE ${tbSecciones} SET titulo="${seccion.tituloSeccion}", nro_items=${seccion.numeroItems},id_control="${seccion.idControlSeccion}",status="${seccion.status}" WHERE id_propuesta=${seccion.idCotizacion} AND nro_version=${seccion.versionCotizacion} AND nro_seccion=${seccion.numeroSeccion}`;
  return query;
}

export function crearSeccionCotizacion(seccion) {
  const query = `INSERT INTO ${tbSecciones} (id_propuesta,nro_version,nro_seccion,titulo,nro_items,id_control,id_preventa,status) SELECT ${seccion.idCotizacion}, ${seccion.versionCotizacion}, ${seccion.numeroSeccion},"${seccion.tituloSeccion}",${seccion.numeroItems},${seccion.idControlSeccion},${seccion.idPreventa},${seccion.status} WHERE NOT EXISTS (SELECT 1 FROM ${tbSecciones} WHERE id_propuesta=${seccion.idCotizacion} AND nro_version=${seccion.versionCotizacion} AND nro_seccion=${seccion.numeroSeccion})`;
  return query;
}

export function desactivarItemCotizacion(version, seccion) {
  const query = `UPDATE ${tbItems} SET status = 0 WHERE id_propuesta = ${version.idCotizacion} AND nro_version = ${version.versionCotizacion}`;
  return query;
}

export function actualizarItemCotizacion(item) {
  //console.log("item", item);
  const descripcion = mysql.escape(item.descripcion);
  const query = `UPDATE ${tbItems} SET id_fabricante=${item.fabricante}, codigo="${item.codigo}",descripcion=${descripcion}, cantidad=${item.cantidad}, precio_lista=${item.precioListaUnitario}, descuento_fabricante=${item.descuentoFabricante}, precio_descontado=${item.precioDescontado}, importacion=${item.importacion}, costo_unitario=${item.costoUnitario}, costo_total=${item.costoTotal}, margen=${item.margen}, descuento=${item.descuentoFinal}, precio_unitario=${item.precioUnitario}, precio_total="${item.precioTotal}", valor_precio_total=${item.precioVentaTotal}, sombra=${item.filaResaltada}, escondido=${item.filaEscondida}, fila_texto=${item.filaSubtitulo}, fila_sin_precio=${item.filaSinPrecio}, pertenece_formula=${item.perteneceFormula}, status=${item.status} WHERE id_propuesta=${item.idCotizacion} AND nro_version=${item.versionCotizacion} AND nro_seccion=${item.numeroSeccion} AND nro_item=${item.numeroItem}`;
  return query;
}

export function replacementActualizarItemCotizacion(item) {
  const replacements = [item.descripcion];
  return replacements;
}

/*export function actualizarItemCotizacion(item) {
  //console.log("item", item);
  const query = `UPDATE ${tbItems} SET id_fabricante=${item.fabricante}, codigo="${item.codigo}",descripcion="${item.descripcion}", cantidad=${item.cantidad}, precio_lista=${item.precioListaUnitario}, descuento_fabricante=${item.descuentoFabricante}, precio_descontado=${item.precioDescontado}, importacion=${item.importacion}, costo_unitario=${item.costoUnitario}, costo_total=${item.costoTotal}, margen=${item.margen}, descuento=${item.descuentoFinal}, precio_unitario=${item.precioUnitario}, precio_total="${item.precioTotal}", valor_precio_total=${item.precioVentaTotal}, sombra=${item.filaResaltada}, escondido=${item.filaEscondida}, fila_texto=${item.filaSubtitulo}, fila_sin_precio=${item.filaSinPrecio}, pertenece_formula=${item.perteneceFormula}, status=${item.status} WHERE id_propuesta=${item.idCotizacion} AND nro_version=${item.versionCotizacion} AND nro_seccion=${item.numeroSeccion} AND nro_item=${item.numeroItem}`;
  return query;
}*/

export function crearItemCotizacion(item) {
  const descripcion = mysql.escape(item.descripcion);
  const query = `INSERT INTO ${tbItems} (id_propuesta,nro_version, nro_seccion, nro_item, id_fabricante, codigo, descripcion, cantidad, precio_lista, descuento_fabricante, precio_descontado, importacion,aging, costo_unitario, costo_total, margen, descuento, precio_unitario, precio_total, valor_precio_total, sombra, escondido, fila_texto, fila_sin_precio, formula_precio_total, pertenece_formula,status) SELECT ${item.idCotizacion}, ${item.versionCotizacion}, ${item.numeroSeccion},${item.numeroItem}, ${item.fabricante}, "${item.codigo}", "${descripcion}", ${item.cantidad}, ${item.precioListaUnitario}, ${item.descuentoFabricante}, ${item.precioDescontado}, ${item.importacion}, ${item.aging}, ${item.costoUnitario}, ${item.costoTotal}, ${item.margen}, ${item.descuentoFinal}, ${item.precioUnitario}, "${item.precioTotal}", ${item.precioVentaTotal}, ${item.filaResaltada}, ${item.filaEscondida}, ${item.filaSubtitulo}, ${item.filaSinPrecio}, ${item.formulaPrecioTotal}, ${item.perteneceFormula}, ${item.status} WHERE NOT EXISTS (SELECT 1 FROM ${tbItems} WHERE id_propuesta=${item.idCotizacion} AND nro_version=${item.versionCotizacion} AND nro_seccion=${item.numeroSeccion} AND nro_item=${item.numeroItem})`;
  return query;
}

/*export function crearItemCotizacion(item) {
  const query = `INSERT INTO ${tbItems} (id_propuesta,nro_version, nro_seccion, nro_item, id_fabricante, codigo, descripcion, cantidad, precio_lista, descuento_fabricante, precio_descontado, importacion,aging, costo_unitario, costo_total, margen, descuento, precio_unitario, precio_total, valor_precio_total, sombra, escondido, fila_texto, fila_sin_precio, formula_precio_total, pertenece_formula,status) SELECT ${item.idCotizacion}, ${item.versionCotizacion}, ${item.numeroSeccion},${item.numeroItem}, ${item.fabricante}, "${item.codigo}", "${item.descripcion}", ${item.cantidad}, ${item.precioListaUnitario}, ${item.descuentoFabricante}, ${item.precioDescontado}, ${item.importacion}, ${item.aging}, ${item.costoUnitario}, ${item.costoTotal}, ${item.margen}, ${item.descuentoFinal}, ${item.precioUnitario}, "${item.precioTotal}", ${item.precioVentaTotal}, ${item.filaResaltada}, ${item.filaEscondida}, ${item.filaSubtitulo}, ${item.filaSinPrecio}, ${item.formulaPrecioTotal}, ${item.perteneceFormula}, ${item.status} WHERE NOT EXISTS (SELECT 1 FROM ${tbItems} WHERE id_propuesta=${item.idCotizacion} AND nro_version=${item.versionCotizacion} AND nro_seccion=${item.numeroSeccion} AND nro_item=${item.numeroItem})`;
  return query;
}*/

//Obtener el numero total de cotizaciones almacenadas en la base de datos
export function getTotalCotizaciones() {
  const query = `SELECT MAX(${tbPropuestas}.id_propuesta) AS maximo FROM ${tbPropuestas}`;
  return query;
}

export function crearPropuestaCotizacion(
  propuesta,
  idCotizacion,
  totalVersiones
) {
  const query = `INSERT INTO ${tbPropuestas} (id, id_propuesta, total_versiones, nombre_cliente_crm, id_cliente_crm, nombre_oportunidad_crm, id_oportunidad_crm, id_pais, nro_documentos, nombre_contacto_crm, id_contacto_crm, telefono_contacto, email_contacto, status, id_propietario_propuesta, id_pv_oportunidad, id_etapa_oportunidad, requiere_operaciones, requiere_soporte, horas_implementacion, dias_implementacion, total_meses_soporte, notas_correctivas) VALUES (${propuesta.id},${idCotizacion},${totalVersiones},"${propuesta.nombreCuenta}",${propuesta.idCuenta},"${propuesta.nombreOportunidad}",${propuesta.idOportunidad},${propuesta.idPais},${propuesta.nroDocumentos},"${propuesta.nombreContacto}",${propuesta.idContacto},"${propuesta.telefonoContacto}","${propuesta.emailContacto}",${propuesta.idStatusCotizacion},${propuesta.idPropietarioCotizacion},${propuesta.idPvOportunidad},${propuesta.idEtapaVentaOportunidad},${propuesta.requiereOperaciones},${propuesta.requiereSoporte},${propuesta.horasImplementacion},${propuesta.diasImplementacion},${propuesta.totalMesesSoporte},"${propuesta.notasCorrectivas}")`;
  return query;
}

//Obtener el id de una cotizacion con el mismo id. Es para entregar el id a quien lo pregunta dentro de una respuesta valida
export function getIdCotizacionConId(idCotizacion, numeroVersion) {
  //const query = `SELECT ${idCotizacion}, ${numeroVersion}`;
  const query = `SELECT ${tbVersiones}.id_propuesta AS idCotizacion, ${tbVersiones}.nro_version AS numeroVersion FROM ${tbVersiones} WHERE ${tbVersiones}.id_propuesta = ${idCotizacion} AND ${tbVersiones}.nro_version = ${numeroVersion}`;
  return query;
}

//Obtener el listado de todas las cotizaciones de una oportunidad
export function getListaCotizacionesByOportunidad(idOportunidad) {
  const query = `SELECT ${tbPropuestas}.id_propuesta AS idCotizacion, ${tbVersiones}.nro_version AS numeroVersion, ${tbVersiones}.valor_precio_total AS importeCotizacion, ${tbVersiones}.id_estado_propuesta AS idEstadoCotizacion FROM ${tbPropuestas}, ${tbVersiones}, ${tbOportunidades} WHERE ${tbOportunidades}.id_oportunidad_crm = ${idOportunidad} AND ${tbPropuestas}.id_oportunidad_crm = ${idOportunidad} AND ${tbVersiones}.id_propuesta = ${tbPropuestas}.id_propuesta AND ${tbVersiones}.status = 1 AND ${tbPropuestas}.status = 1 AND ${tbOportunidades}.status = 1`;
  return query;
}

//Actualizar la relacion Oportunidad Propuesta. Warning. Puede que ya no sea neecsario con la nueva versión
export function actualizarRelacionOportunidadesPropuestas(
  idOportunidad,
  idCotizacion,
  versionCotizacion,
  valorPrecioTotal
) {
  const query = `UPDATE ${tbOpProp} SET importe=${valorPrecioTotal} WHERE id_oportunidad=${idOportunidad} AND id_propuesta=${idCotizacion} AND nro_version=${versionCotizacion}`;
  return query;
}

//Actualizar la relacion Oportunidad Propuesta. Warning. Puede que ya no sea neecsario con la nueva versión
export function crearRelacionOportunidadesPropuestas(
  idRelOpCot,
  idOportunidad,
  idCotizacion,
  versionCotizacion,
  valorPrecioTotal
) {
  const query = `INSERT INTO ${tbOpProp} (id_op_prop,id_oportunidad,id_propuesta,nro_version,importe,status) SELECT ${idRelOpCot},${idOportunidad}, ${idCotizacion}, ${versionCotizacion},${valorPrecioTotal},1 WHERE NOT EXISTS (SELECT 1 FROM ${tbOpProp} WHERE id_oportunidad=${idOportunidad} AND id_propuesta=${idCotizacion} AND nro_version=${versionCotizacion})`;
  return query;
}

//Obtener el numero total de la relaciones oportunidad cotizacion
export function getTotalRelacionesOportunidadCotizacion() {
  const query = `SELECT MAX(${tbOpProp}.id_op_prop) AS maximo FROM ${tbOpProp}`;
  return query;
}

//==================================================== FABRICANTES ===========================================================
//Obtener la lista de los fabricantes
export const getListaFabricantes = `SELECT ${tbFabricantes}.id_fabricante AS id, ${tbFabricantes}.nombre, ${tbFabricantes}.bd_fabricante AS bdFabricante FROM ${tbFabricantes} WHERE ${tbFabricantes}.STATUS = 1`;

//Obtener el nombre de la tabla del fabricante en base a su id
export function getNombreTablaFabricanteById(idFabricante) {
  const query = `SELECT bd_fabricante FROM ${tbFabricantes} WHERE id_fabricante = ${idFabricante}`;
  return query;
}

//Descargar los codigos y precios de un fabricante
export function getProductosByFabricante(idFabricante, bdFabricante) {
  const tbMarca = `${dbFabricantes}.${bdFabricante}`;
  let query = ``;
  switch (idFabricante) {
    case 9: //creados manualmente
      query = `SELECT ${tbMarca}.id_fabricante AS idFabricante, ${tbMarca}.Codigo AS codigo, ${tbMarca}.Descripcion AS descripcion, ${tbMarca}.Precio AS precio FROM ${tbMarca}`;
      break;
    default:
      query = `SELECT ${tbMarca}.Codigo AS codigo, ${tbMarca}.Descripcion AS descripcion, ${tbMarca}.Precio AS precio FROM ${tbMarca} `;
      break;
  }

  return query;
}

//Validar si existe un codigo en la lista de un fabricante
export function getCodigoByFabricante(bdFabricante, codigo) {
  const tbMarca = `${dbFabricantes}.${bdFabricante}`;
  const query = `SELECT ${tbMarca}.Codigo FROM ${tbMarca} WHERE ${tbMarca}.Codigo = "${codigo}"`;
  return query;
}

//Crear un codigo en la base de datos del fabricante
export function crearCodigoFabricante(datos) {
  const tbMarca = `${dbFabricantes}.${datos.bdFabricante}`;
  const query = `INSERT INTO ${tbMarca} (Codigo,Descripcion,Precio) VALUES ("${datos.codigo}", "${datos.descripcion}", ${datos.precio})`;
  return query;
}

//=================================== POSTVENTA =======================================
//Obtener las ordenes recibidads de una cotizacion
export function getListaOrdenesRecibidasByCotizacion(
  idCotizacion,
  numeroVersion
) {
  const query = `SELECT id_orden AS idOrdenRecibida, id_propuesta AS idPropuesta, nro_version AS numeroVersion, nro_orden AS numeroOrden, importe_moneda_base AS importeMonedaBase, importe_moneda_cambio AS importeMonedaCambio, id_moneda_base AS idMonedaBase, id_moneda_cambio AS idMonedaCambio, tipo_cambio AS tipoCambio, fecha_recibida AS fechaRecibida, fecha_entrega AS fechaEntrega, forma_pago AS formaPago, garantia AS garantia, notas AS notas, status FROM ${tbOrdenesRecibidas} WHERE id_propuesta = ${idCotizacion} AND nro_version=${numeroVersion} AND status=1`;
  return query;
}

//Desactivar las ordenes recibidas de una cotizacion
export function desactivarOrdenesRecibidasByCotizacion(
  idCotizacion,
  numeroVersion
) {
  const query = `UPDATE ${tbOrdenesRecibidas} SET status = 0 WHERE id_propuesta = ${idCotizacion} AND nro_version = ${numeroVersion}`;
  return query;
}

//Actualizar las ordenes recibidas de una cotizacion
export function actualizarOrdenesRecibidasByCotizacion(
  idCotizacion,
  numeroVersion,
  orden
) {
  const query = `UPDATE ${tbOrdenesRecibidas} SET nro_orden="${orden.numeroOrden}", importe_moneda_base=${orden.importeMonedaBase},importe_moneda_cambio=${orden.importeMonedaCambio}, id_moneda_base=${orden.idMonedaBase}, id_moneda_cambio=${orden.idMonedaCambio}, tipo_cambio=${orden.tipoCambio}, fecha_recibida="${orden.fechaRecibida}",fecha_entrega="${orden.fechaEntrega}", forma_pago="${orden.formaPago}", garantia="${orden.garantia}", notas="${orden.notas}", status=${orden.status} WHERE id_propuesta=${idCotizacion} AND nro_version=${numeroVersion} AND nro_orden="${orden.numeroOrden}"`;
  return query;
}

//Obtener el numero total de ordenes recibidas almacenadas en la base de datos
export function getTotalOrdenesRecibidas() {
  const query = `SELECT MAX(${tbOrdenesRecibidas}.id_orden) AS maximo FROM ${tbOrdenesRecibidas}`;
  return query;
}

//Crear las ordenes recibidas de una cotizacion
export function crearOrdenesRecibidasByCotizacion(
  idCotizacion,
  numeroVersion,
  idOrdenNueva,
  orden
) {
  const query = `INSERT INTO ${tbOrdenesRecibidas} (id,id_orden,id_propuesta,nro_version,nro_orden,importe_moneda_base,importe_moneda_cambio,id_moneda_base,id_moneda_cambio,tipo_cambio,fecha_recibida,fecha_entrega,forma_pago,garantia,notas,status) SELECT null, ${idOrdenNueva}, ${idCotizacion}, ${numeroVersion},"${orden.numeroOrden}",${orden.importeMonedaBase},${orden.importeMonedaCambio},${orden.idMonedaBase},${orden.idMonedaCambio},${orden.tipoCambio},"${orden.fechaRecibida}","${orden.fechaEntrega}","${orden.formaPago}","${orden.garantia}","${orden.notas}",${orden.status} WHERE NOT EXISTS (SELECT 1 FROM ${tbOrdenesRecibidas} WHERE id_propuesta=${idCotizacion} AND nro_version=${numeroVersion} AND nro_orden="${orden.numeroOrden}")`;
  return query;
}

//========================================= CUENTAS ===================================================
export function getClaveUsuario(idUsuario) {
  const query = `SELECT record AS clave FROM ${tbUsuariosClave} WHERE id_user = ${idUsuario}`;
  return query;
}
