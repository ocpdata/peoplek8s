import * as constantes from "../config/constantes.js";

export function grabarOportunidad(datos, handleAlert, actualizarId) {
  console.log("funcion grabarOportunidad", datos);
  let resultado = 0; //Ok
  fetch(`${constantes.PREFIJO_URL_API}/oportunidades/grabar`, {
    method: "POST",
    body: JSON.stringify(datos),
    headers: constantes.jwtHeader,
    //headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((resp) => {
      console.log(resp);
      if (!resp.ok) {
        throw new Error(`Error al crear un registro en la base de datos`);
      }
      return resp.json();
    })
    .then((json) => {
      console.log(json);
      datos.idOportunidad = json[0].id; //Cambia el id de la cuenta con el creado o modificado
      let resultado = 200; //Ok
      handleAlert(resultado);
      actualizarId(datos);
      return resultado;
    })
    .catch((error) => {
      console.log(error);
      let resultado = 500; //Error
      handleAlert(resultado);
      return resultado;
    });
}

export function grabarRespuestasOportunidad(datos) {
  console.log("funcion grabarRespuestasOportunidad", datos);
  let resultado = 0; //Ok
}

export async function grabarRegistro(datos, tipoRegistro, preaccion = "") {
  console.log("funcion grabarRegistro", datos, tipoRegistro, preaccion);
  let resultado = 0; //Ok Warning. No se está usando al grabar
  let res = "";
  let datosBasicos = "";
  let datosADevolver = { resultado: false, idRegistro: 0, statusRegistro: 0 };
  try {
    switch (tipoRegistro) {
      case "oportunidad":
        //******** Codigo para usar PUT *************/
        const idOpp = datos.matrizDatosOportunidad.idOportunidad;

        // Crear una copia sin la propiedad 'id'
        const { idOportunidad, ...datosOportunidadSinId } =
          datos.matrizDatosOportunidad;

        if (preaccion === "crear") {
          res = await fetch(`${constantes.PREFIJO_URL_API}/oportunidades`, {
            method: "POST",
            body: JSON.stringify(datos.matrizDatosOportunidad),
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          });
        }
        if (preaccion === "actualizar") {
          res = await fetch(
            `${constantes.PREFIJO_URL_API}/oportunidades/${idOpp}`,
            {
              method: "PUT",
              body: JSON.stringify(datosOportunidadSinId),
              credentials: "include",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
              },
            }
          );
        }

        /*//Graba los datos de la oportunidad
        res = await fetch(
          `${constantes.PREFIJO_URL_API}/oportunidades/grabar`,
          {
            method: "POST",
            body: JSON.stringify(datos.matrizDatosOportunidad),
            headers: constantes.jwtHeader,
            //headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        );*/
        if (!res.ok) {
          resultado = 500;
          throw new Error(`Error al crear un registro en la base de datos`);
        }
        datosBasicos = await res.json();
        console.log(datosBasicos);

        //Graba las respuestas de la oportunidad
        if (idOpp > 0) {
          //Graba los datos de las respuestas
          const resRespuestas = await fetch(
            `${constantes.PREFIJO_URL_API}/oportunidades/${idOpp}/respuestaspv`,
            {
              method: "PUT",
              body: JSON.stringify({
                idOportunidad: idOpp,
                respuestas: datos.matrizPregRespOportunidad,
              }),
              credentials: "include",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
              },
            }
          );

          /*const res2 = await fetch(
            `${constantes.PREFIJO_URL_API}/oportunidades/grabarrespuestas`,
            {
              method: "POST",
              body: JSON.stringify({
                idOportunidad: datos.matrizDatosOportunidad.idOportunidad,
                respuestas: datos.matrizPregRespOportunidad,
              }),
              headers: constantes.jwtHeader,
              //headers: { "Content-type": "application/json; charset=UTF-8" },
            }
          );*/
          if (!resRespuestas.ok) {
            resultado = 500;
            throw new Error(`Error al crear un registro en la base de datos`);
          }
          const datosPreguntas = await resRespuestas.json();
          console.log(datosPreguntas);
        }

        resultado = 200; //Ok
        datosADevolver = {
          resultado: true,
          idRegistro: datosBasicos.data[0].id,
          statusRegistro: datosBasicos.data[0].statusOportunidad,
        };
        break;
      case "cuenta":
        //Dependiendo del status actual de la cuenta:
        // 0 - Inactiva. Ya tiene datos creados
        // 1 - Activa.
        // 2 - Pendiente
        //******** Codigo para usar PUT *************/
        const idAccount = datos.datosCuenta.idCuenta;

        // Crear una copia sin la propiedad 'id'
        const { idCuenta, ...datosCuentaSinId } = datos.datosCuenta;

        if (preaccion === "crear") {
          res = await fetch(`${constantes.PREFIJO_URL_API}/cuentas`, {
            method: "POST",
            body: JSON.stringify(datos.datosCuenta),
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          });
        }
        if (preaccion === "actualizar") {
          res = await fetch(
            `${constantes.PREFIJO_URL_API}/cuentas/${idAccount}`,
            {
              method: "PUT",
              body: JSON.stringify(datosCuentaSinId),
              credentials: "include",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
              },
            }
          );
        }
        //********************************************/

        //******** Codigo para usar POST (obsoleto) **********/
        /*res = await fetch(`${constantes.PREFIJO_URL_API}/cuentas/grabar`, {
          method: "POST",
          body: JSON.stringify(datos.datosCuenta),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          //headers: constantes.jwtHeader,
          //headers: { "Content-type": "application/json; charset=UTF-8" },
        });*/

        console.log("respuesta", res);
        if (!res.ok) {
          resultado = 500;
          throw new Error(`Error al crear un registro en la base de datos`);
        }
        datosBasicos = await res.json();
        console.log(datosBasicos);
        resultado = 200; //Ok
        datosADevolver = {
          resultado: true,
          idRegistro: datosBasicos.data[0].id,
          statusRegistro: datosBasicos.data[0].statusCuenta,
        };

        break;
      case "contacto":
        //Dependiendo del status actual del contacto:
        // 0 - Inactivo. Ya tiene datos creados
        // 1 - Activo.
        // 2 - Pendiente
        //******** Codigo para usar PUT *************/
        const idContact = datos.datosContacto.idContacto;

        // Crear una copia sin la propiedad 'id'
        const { idContacto, ...datosContactoSinId } = datos.datosContacto;

        if (preaccion === "crear") {
          res = await fetch(`${constantes.PREFIJO_URL_API}/contactos`, {
            method: "POST",
            body: JSON.stringify(datos.datosContacto),
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          });
        }
        if (preaccion === "actualizar") {
          res = await fetch(
            `${constantes.PREFIJO_URL_API}/contactos/${idContact}`,
            {
              method: "PUT",
              body: JSON.stringify(datosContactoSinId),
              credentials: "include",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
              },
            }
          );
        }
        //********************************************/

        /*res = await fetch(`${constantes.PREFIJO_URL_API}/contactos/grabar`, {
          method: "POST",
          body: JSON.stringify(datos.datosContacto),
          headers: constantes.jwtHeader,
          //headers: { "Content-type": "application/json; charset=UTF-8" },
        });*/
        console.log("respuesta", res);
        if (!res.ok) {
          resultado = 500;
          throw new Error(`Error al crear un registro en la base de datos`);
        }
        datosBasicos = await res.json();
        console.log(datosBasicos);
        resultado = 200; //Ok
        datosADevolver = {
          resultado: true,
          idRegistro: datosBasicos.data[0].id,
          statusRegistro: datosBasicos.data[0].statusContacto,
        };
        break;

      case "ordenesRecibidas":
        res = await fetch(
          `${constantes.PREFIJO_URL_API}/postventa/ordenesrecibidas/cotizacion/${datos.idCotizacion}/${datos.numeroVersion}`,
          //`${constantes.PREFIJO_URL_API}/postventa/cotizaciones/${datos.idCotizacion}/${datos.numeroVersion}/ordenesrecibidas/grabar`,
          {
            method: "POST",
            body: JSON.stringify(datos),
            headers: constantes.jwtHeader,
            //headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        );
        console.log("respuesta", res);
        if (!res.ok) {
          resultado = 500;
          throw new Error(`Error al crear un registro en la base de datos`);
        }

        datosBasicos = await res.json();
        console.log(datosBasicos);
        resultado = 200; //Ok
        datosADevolver = {
          resultado: true,
          ordenes: datosBasicos,
        };
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    let resultado = 500; //Error
    //handleAlert(resultado);
    //return false;
  }
  return datosADevolver;
}
