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

  function onBeforeSend(args) {
    console.log("funcion onBeforeSend", args);
    // Cambia la carpeta raíz antes de enviar la petición
    // Por ejemplo, para cambiar a la carpeta "/Documentos"
    if (args.ajaxSettings && args.ajaxSettings.data) {
      console.log("args", args.ajaxSettings);
      let data = JSON.parse(args.ajaxSettings.data);
      console.log(data);
      data.directorioBase = `/P_${cotizacion}`;
      //data.directorioBase = `/P_${cotizacion}`;

      args.ajaxSettings.data = JSON.stringify(data);
      console.log(args.ajaxSettings);
    }
  }

  /*useEffect(() => {
    console.log("useEffect FileCotizacion", cotizacion);
    setIdCotizacion(cotizacion);
  }, [cotizacion]);*/

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
          }}
          beforeSend={onBeforeSend}
          contextMenuSettings={{
            file: [
              "Open",
              "Cut",
              "Copy",
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
