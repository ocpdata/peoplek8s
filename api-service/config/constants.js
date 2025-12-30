//================= Configuración de Constantes ================================
export let URL_APP;
export let URL_INTERNO;
export let PUERTO_FRONT_END;
export let PUERTO_API_SERVICE;
export let PUERTO_API_BD_GW;

console.log("env", process.env.NODE_ENV);

switch (process.env.NODE_ENV) {
  case "desarrollo":
    URL_APP = `https://peoplek8s.digitalvs.com`;
    URL_INTERNO = `http://backendapis-service`;
    PUERTO_FRONT_END = 4000;
    PUERTO_API_SERVICE = 4020;
    PUERTO_API_BD_GW = 5020;
    break;

}

//========== CORS para dar acceso a la apliacion desde el Backend ===========
export const URL_FRONT_END = `${URL_APP}:${PUERTO_FRONT_END}`;
export const URL_CORS = [URL_FRONT_END];
export const METHODS_COR = "GET,POST,PUT,DELETE,OPTIONS";

//================= URL de Backend BD GW ================================
export const URL_API_BD_GW = `${URL_INTERNO}:${PUERTO_API_BD_GW}/api`;


