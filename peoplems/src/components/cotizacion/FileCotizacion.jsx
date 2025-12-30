import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  DetailsView,
  FileManagerComponent,
  NavigationPane,
  Toolbar,
  Inject,
} from "@syncfusion/ej2-react-filemanager";
import { useState, useEffect } from "react";

import * as constantes from "../../config/constantes.js";

let hostUrl = constantes.URL_FILE_MANAGER;
//let hostUrl = "http://peoplenode.digitalvs.com:8090/";

export function FileCotizacion({ cotizacion }) {
  //const [idCotizacion, setIdCotizacion] = useState(0);
  console.log("funcion FileCotizacion", cotizacion);

  function onFailure(args) {
    console.log("funcion onFailure");
    console.log("args", args);
  }

  function onSuccess(args) {
    console.log("funcion onSuccess");
    console.log("args", args);
  }

  function onBeforeDownload(args) {
    console.log("funcion onBeforeDownload");
    console.log("args", args);

    //Solo se pueden descargar archivos. Se deben quitar los folderes de lo que se desee descargar. Se usa el indice 0 porque el componente filemanager está configurado para trabajar con un solo archivo
    if (args.data.data[0].isFile === false) {
      args.cancel = true;
    } else {
      const rutaBase = `P_${cotizacion}`;
      const path = args.data.path;
      const rutaCompleta = `${rutaBase}${path}`;
      console.log("rutaCompleta", rutaCompleta);

      args.data.rutaCompleta = `${rutaCompleta}`;

      //Coloca la cookie en el header
      args.ajaxSettings.beforeSend = function (args) {
        args.httpRequest.setRequestHeader("Accept", "application/json");
        args.httpRequest.setRequestHeader(
          "Access-Control-Allow-Credentials",
          true
        );
        args.httpRequest.withCredentials = true;
      };
    }
  }

  function onBeforeSend(args) {
    console.log("funcion onBeforeSend ===============");
    console.log("args:", args);
    console.log("Document cookies:", document.cookie);

    const accion = args.action;
    // Cambia la carpeta raíz antes de enviar la petición
    // Por ejemplo, para cambiar a la carpeta "/Documentos"
    if (args.ajaxSettings && args.ajaxSettings.data) {
      console.log("🍪 Configurando credenciales...");

      let data = JSON.parse(args.ajaxSettings.data);
      let path = "";
      if (Array.isArray(data)) {
        path = data[0].path;
      } else {
        path = data.path;
      }
      console.log("data", data);
      console.log("accion", accion);

      const rutaBase = `P_${cotizacion}`;
      const rutaCompleta = `${rutaBase}${path}`;
      console.log("rutaBase:", rutaBase);
      console.log("path:", path);
      console.log("rutaCompleta:", rutaCompleta);

      switch (accion) {
        case "read":
          if (data.data[0] && !("dateCreated" in data.data[0])) {
            // La propiedad dateCreated NO existe
            console.log("Entro a dateCreated");
            if (path === "/") {
              data.data = [];
            } else {
              data.data[0].dateCreated = "";
              data.data[0].dateModified = "";
              data.data[0].filterPath = "/";
              data.data[0].isFile = false;
              data.data[0].type = "folder";
              data.data[0]._fm_created = null;
              data.data[0]._fm_htmlAttr = {
                class: "e-large-icon",
                tittle: data.data[0].name,
              };
              data.data[0]._fm_icon = "e-fe-folder";
              data.data[0]._fm_iconClass = "e-fe-folder";
              data.data[0]._fm_modified = null;
            }
          }
          data.rutaCompleta = `${rutaCompleta}`;
          data.rutaBase = rutaBase;
          break;

        case "save":
          data.rutaCompleta = `${rutaCompleta}`;
          break;

        case "Upload":
          console.log("Entró a aupload");
          data.push({ rutaCompleta: `${rutaCompleta}` });

          break;

        case "create":
          data.path = `/${rutaCompleta}`;
          data.rutaDirectorioNuevo = `${rutaCompleta}${data.name}/`;
          data.mimetype = "application/x-empty";
          break;

        case "download":
          data.rutaCompleta = `${rutaCompleta}`;
          break;

        case "rename":
          data.data.forEach((archivo) => {
            archivo.rutaCompletaFuente = `${rutaBase}/${archivo.filterPath.replace(
              /^\/+/,
              ""
            )}${archivo.name}`;
            archivo.rutaCompletaDestino = `${rutaBase}/${archivo.filterPath.replace(
              /^\/+/,
              ""
            )}${data.newName}`;
          });
          break;

        case "copy":
          //Adiciona a la matriz data de cada archivo a copiar, la ruta completa fuente y la ruta destino
          data.data.forEach((archivo) => {
            if (archivo.isFile === true) {
              archivo.rutaCompletaFuente = `${rutaBase}/${archivo.filterPath.replace(
                /^\/+/,
                ""
              )}${archivo.name}`;
              archivo.rutaCompletaDestino = `${rutaBase}/${data.targetData.filterPath.replace(
                /^\/+/,
                ""
              )}${archivo.name}`;
            } else {
              args.cancel = true;
            }
          });
          break;

        case "delete":
          //Adiciona a la matriz data de cada archivo a borrar, la ruta completa fuente y la ruta destino
          data.data.forEach((archivo) => {
            archivo.rutaCompletaFuente = `${rutaBase}/${archivo.filterPath.replace(
              /^\/+/,
              ""
            )}${archivo.name}`;
          });
          break;

        case "details":
          data.data.forEach((archivo) => {
            archivo.rutaCompletaFuente = `${rutaBase}/${archivo.filterPath.replace(
              /^\/+/,
              ""
            )}${archivo.name}`;
          });
          break;

        case "move":
          data.data.forEach((archivo) => {
            if (archivo.isFile === true) {
              archivo.rutaCompletaFuente = `${rutaBase}/${archivo.filterPath.replace(
                /^\/+/,
                ""
              )}${archivo.name}`;
              archivo.rutaCompletaDestino = `${rutaBase}/${data.targetData.filterPath.replace(
                /^\/+/,
                ""
              )}${archivo.name}`;
            } else {
              args.cancel = true;
            }
          });
          break;

        case "search":
          args.cancel = true;
          break;

        default:
          break;
      }

      args.ajaxSettings.data = JSON.stringify(data);

      console.log("Coloca las credenciales");
      //Coloca la cookie en el header
      args.ajaxSettings.beforeSend = function (args) {
        args.httpRequest.setRequestHeader("Accept", "application/json");
        args.httpRequest.setRequestHeader(
          "Access-Control-Allow-Credentials",
          true
        );
        args.httpRequest.withCredentials = true;
      };
      console.log("cookie", document.cookie);
      console.log(args.ajaxSettings);
    }
  }

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: "lightblue",
        }}
      >
        <Typography component="span">Archivos</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FileManagerComponent
          key={cotizacion} //Para que se demonte y monte el componete con cada cotizacion
          id="file"
          ajaxSettings={{
            url: hostUrl,
            uploadUrl: hostUrl + "Upload",
            downloadUrl: hostUrl + "Download",
            getImageUrl: hostUrl + "GetImage",
            // ✅ Configuración de credenciales más completa
            withCredentials: true,
            credentials: "include",
            xhrFields: {
              withCredentials: true,
            },
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            crossDomain: true,
          }}
          beforeSend={onBeforeSend.bind(this)}
          //beforeSend={onBeforeSend}
          beforeDownload={onBeforeDownload}
          failure={onFailure}
          success={onSuccess}
          allowMultiSelection={false} //Solo se puede seleccionar un archivo a la vez
          contextMenuSettings={{
            file: [
              "Open",
              "Cut",
              "Copy",
              "Delete",
              "|",
              "Download",
              "Rename",
              "|",
              "Details",
            ],
            folder: [
              "Open",
              "Cut",
              "Copy",
              "|",
              "Download",
              "Rename",
              "|",
              "Details",
            ],
            //layout: ["SortBy", "View", "Refresh", "|", "Details", "|"],
            //visible: true,
          }}

          //path={"/"}
          //otro={"otro"}
          //path={`P_${cotizacion}/`}
        >
          <Inject services={[NavigationPane, DetailsView, Toolbar]} />
        </FileManagerComponent>
      </AccordionDetails>
    </Accordion>
  );
}
