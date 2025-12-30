// URL de la APP
export const URL_APP = "https://peoplek8s.digitalvs.com";

// Configuración de servicios - Usar HTTP para comunicación interna en Kubernetes
export const services = {
  auth: "http://auth-service:4010",
  api: "http://api-service:4020",
  filemanager: "http://filemanager-service:4030",
};

//Puerto de API-GATEWAY
export const PUERTO_SERVICIO = 4100;
