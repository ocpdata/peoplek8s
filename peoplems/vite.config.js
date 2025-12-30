import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // default: 'localhost'
    port: 4000, // your custom port
    allowedHosts: true, // default: 'localhost'
    // Solo usar HTTPS en desarrollo si los certificados existen
    https: fs.existsSync("../peoplems/certificados/privkey.pem")
      ? {
          key: fs.readFileSync("../peoplems/certificados/privkey.pem"),
          cert: fs.readFileSync("../peoplems/certificados/fullchain.pem"),
        }
      : undefined,
    // Configuración específica de CORS (sin headers automáticos problemáticos)
    cors: true,
  },
});
