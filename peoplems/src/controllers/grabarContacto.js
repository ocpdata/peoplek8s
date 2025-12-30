import * as constantes from "../config/constantes.js";

export function grabarContacto(datos, handleAlert, actualizarId) {
  console.log("funcion grabarCuenta", datos);
  let resultado = 0; //Ok
  fetch(`${constantes.PREFIJO_URL_API}/contactos/grabar`, {
    //fetch("http://peoplenode.digitalvs.com:3010/api/contactos/grabar", {
    method: "POST",
    body: JSON.stringify(datos),
    headers: { "Content-type": "application/json; charset=UTF-8" },
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
      datos.idContacto = json[0].id; //Cambia el id de la cuenta con el creado o modificado
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
