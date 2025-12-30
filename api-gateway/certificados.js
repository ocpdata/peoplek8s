import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determinar el path de los certificados:
// - En Kubernetes: montados desde Secret en /app/certificados
// - En desarrollo local: ../certificados (al mismo nivel que api-gateway)
const isKubernetes = fs.existsSync("/app/certificados/privkey.pem");
const certPath = isKubernetes 
  ? "/app/certificados" 
  : path.join(__dirname, "..", "certificados");

// Certificate - Leer desde Secret en K8s o archivos locales en desarrollo
const privateKey = fs.readFileSync(path.join(certPath, "privkey.pem"), "utf8");
const certificate = fs.readFileSync(
  path.join(certPath, "fullchain.pem"),
  "utf8"
);

// CA chain es opcional - solo si existe
let ca = null;
const caPath = path.join(certPath, "chain.pem");
if (fs.existsSync(caPath)) {
  ca = fs.readFileSync(caPath, "utf8");
}

export const credenciales = {
  key: privateKey,
  cert: certificate,
  ...(ca && { ca: ca }),
};
