import * as constantes from "../../../config/constantes.js";

//Coloca un timeout a la funcion fetch para evitar que una conexión no se quede pegada
export const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 10000 } = options; // 10 segundos por default
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(resource, {
    ...constantes.HEADER_COOKIE,
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(id));
};
