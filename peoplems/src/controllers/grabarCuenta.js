import * as constantes from "../config/constantes.js";

export function grabarCuenta(datos, handleAlert, actualizarIdCuenta) {
  console.log("funcion grabarCuenta", datos);

  //Convertir el array de copropietarios a string
  //datos.copropietarioCuenta = datos.copropietarioCuenta.toString();

  let resultado = 0; //Ok
  fetch(
    `${constantes.PREFIJO_URL_API}/cuentas/grabar`,
    //"http://peoplenode.digitalvs.com:3010/api/cuentas/grabar",
    {
      method: "POST",
      body: JSON.stringify(datos),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }
  )
    .then((resp) => {
      console.log(resp);
      if (!resp.ok) {
        throw new Error(`Error al crear una cuenta en la base de datos`);
      }
      return resp.json();
    })
    .then((json) => {
      console.log(json);
      datos.idCuenta = json[0].id; //Cambia el id de la cuenta con el creado o modificado
      let resultado = 200; //Ok
      handleAlert(resultado);
      actualizarIdCuenta(datos);
      return json;
    })
    .catch((error) => {
      console.log(error);
      let resultado = 500; //Error
      handleAlert(resultado);
      return resultado;
    });
}
