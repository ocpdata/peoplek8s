const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();

// Servir archivos estáticos
app.use(express.static("dist"));

// SPA routing - todas las rutas van a index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Configuración HTTPS
const options = {
  key: fs.readFileSync("./ssl/privkey.pem"),
  cert: fs.readFileSync("./ssl/fullchain.pem"),
};

// Servidor HTTPS
https.createServer(options, app).listen(4000, "0.0.0.0", () => {
  console.log("🚀 Server running on https://0.0.0.0:4000");
});
