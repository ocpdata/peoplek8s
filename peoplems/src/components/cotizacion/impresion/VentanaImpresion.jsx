import {
  Box,
  Grid,
  Modal,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useContext, useState } from "react";
import { Paper, TextField, Typography } from "@mui/material";
import { CampoSelect } from "../../comun/CampoSelect";
import { brandData } from "../../../config/constantes";
import { FieldSet } from "../datosComplementarios/resumen/FieldSet";
import { AppBarImpresion } from "./AppBarImpresion";
import {
  ANCHO_PAGINA,
  ALTO_PAGINA,
  MARGEN_TOP_PAGINA,
} from "../../../config/constantes.js";
import * as constantes from "../../../config/constantes.js";
import { LogoImpresion } from "./LogoImpresion";
import { TablaCotizacionImpresion } from "./TablaCotizacionImpresion";
import { ResumenCotizacionImpresion } from "./ResumenCotizacionImpresion";
import { CondicionesComercialesImpresion } from "./CondicionesComercialesImpresion";
import { DatosCotizacionImpresion } from "./DatosCotizacionImpresion";

//Estilo de la ventan de impresión previa
const estiloVentanImpresion = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: ANCHO_PAGINA,
  maxWidth: ANCHO_PAGINA,
  //maxWidth: "lg",
  height: 0.8,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
};

//El paramtero pageStyle de useReactToPrint configura el formato del papel donde se imprimira
//Si es Letter, el tamaño en pixel usando un DPI de 150 debe ser (W x H): 1275 x 1650
//Si es A4, debe ser: 1240 x 1754

//Letter
const estiloPagina = `@media print {
    @page {
        size: ${ANCHO_PAGINA}px ${ALTO_PAGINA}px;
 
    }
    body {
      -webkit-print-color-adjust: exact;
    }
    .page-break-before {
      page-break-before: always;
    }

    .page-break-after {
      page-break-after: always;
    }

    .page-break-inside-avoid {
      page-break-inside: avoid;
    }
}`;

export function VentanaImpresion({
  openVentanaImpresion,
  setOpenVentanaImpresion,
  secciones,
  datosBasicos,
  datosOpciones,
  totales,
  altura,
}) {
  const [pintar, setPintar] = useState(false);

  //Hooks para impresión
  const logoRef = useRef(null);
  const datosCotizacionRef = useRef(null);
  const introduccionRef = useRef(null);
  const bottom1Ref = useRef(null);
  const bottom2Ref = useRef(null);
  const impresionRef = useRef(null);

  //Hook de impresión
  const reactToPrintFn = useReactToPrint({
    contentRef: impresionRef,
    documentTitle: `Propuesta economica`,
    onAfterPrint: () => console.log("Printing completed"),
    pageStyle: estiloPagina,
    //copyStyles: true,
  });

  //Hook que guarda los pagebreaks de cada seccion incluyendo la parte inicial (datos de la cotizacion) y la parte final (resumen, condiciones y notas)
  const pagina = useRef([]);
  console.log("function VentanaImpresion", secciones, datosBasicos, altura);

  useEffect(() => {
    console.log("useEffect VentanaImpresion");
    setTimeout(() => {
      console.log("logoRef", logoRef.current.clientHeight);
      console.log("logoRef", logoRef.current.getBoundingClientRect().height);
      console.log(
        "datosCotizacionRef",
        datosCotizacionRef.current.clientHeight
      );
      console.log(
        "datosCotizacionRef",
        datosCotizacionRef.current.getBoundingClientRect().height
      );
      console.log("introduccionRef", introduccionRef.current.clientHeight);
      console.log(
        "introduccionRef",
        introduccionRef.current.getBoundingClientRect().height
      );
      console.log("bottom1Ref", bottom1Ref.current.clientHeight);
      console.log("bottom2Ref", bottom2Ref.current.clientHeight);

      //margen de logo,datos basicos y de secciones
      const margen = 3;
      //margen de introduccion
      const margenIntroduccion = 5;
      //margen de condiciones comerciales y nota
      const margenBottom = 2;

      const tamanoInicio =
        margen +
        logoRef.current.clientHeight +
        margen +
        datosCotizacionRef.current.clientHeight +
        margenIntroduccion +
        introduccionRef.current.clientHeight +
        margenIntroduccion;

      const tamanoFin =
        margenBottom +
        bottom1Ref.current.clientHeight +
        margenBottom +
        margenBottom +
        bottom2Ref.current.clientHeight +
        margenBottom;

      const tamanoLogo = margen + logoRef.current.clientHeight;

      //Colocar al inicio del array altura el objeto formado por idSeccion 0 y altura igual a tamano Inicio
      altura.unshift({ idSeccion: 0, altura: tamanoInicio });
      //Colocar la final del array altura el onbejto formado por idSeccion igual al siguiente al ultimo elemento y altura igual a tamanoFin
      altura.push({
        idSeccion: altura[altura.length - 1].idSeccion + 1,
        altura: tamanoFin,
      });
      console.log(altura);

      //Crear un array a partir del array altura. Los elementos del nuevo array serán boolean y todos falsos.
      //Se va sumando el tamano de los elementos a partir del primero; cuando la suma sea mayor a la constante ALTO_PAGINA, el elemento del nuevo array anterior a que la suma sea mayor a ALTO_PAGINA será verdadero.
      //A partir del último elemento de la suma anterior, la suma empezará de nuevo desde cero y cuando sea mayor a ALTO_PAGINA, el elemento del nuevo array será verdadero.
      //Y asi hasta llegar al último elemento del array altura
      let pageBreaks = new Array(altura.length).fill(false);
      let sum = MARGEN_TOP_PAGINA;
      //let sum = 0;
      for (let i = 0; i < altura.length; i++) {
        sum += altura[i].altura;
        console.log(
          "suma antes de alcanzar el alto de la pagina. seccion:",
          i,
          " suma:",
          sum
        );
        if (sum > ALTO_PAGINA) {
          console.log(
            "seccion que alcanzo o sobrepaso el alto de la pagina:",
            i
          );
          if (i > 0) pageBreaks[i - 1] = true;
          sum = MARGEN_TOP_PAGINA;
          sum += tamanoLogo;
          sum += altura[i].altura;

          console.log(
            "suma al inicio de cada pagina. seccion:",
            i,
            " suma:",
            sum
          );
          if (sum > ALTO_PAGINA) {
            if (i > 0) pageBreaks[i] = true;
            console.log("La seccion es mas alta que el alto de la pagina:", i);
          }
        }
      }

      console.log(pageBreaks);
      pagina.current = pageBreaks;

      setPintar(true);
    }, 0);
  }, [totales.precioVentaTotal]);

  return (
    <Modal open={openVentanaImpresion}>
      <Box sx={estiloVentanImpresion}>
        <AppBarImpresion
          setOpenVentanaImpresion={setOpenVentanaImpresion}
          reactToPrintFn={reactToPrintFn}
          estadoCotizacion={datosBasicos.idEstadoCotizacion}
        ></AppBarImpresion>
        <div ref={impresionRef}>
          <LogoImpresion logoRef={logoRef}></LogoImpresion>
          <div ref={datosCotizacionRef}>
            <DatosCotizacionImpresion
              datosBasicos={datosBasicos}
              datosOpciones={datosOpciones}
            ></DatosCotizacionImpresion>
          </div>
          <TextField
            fullWidth
            value={datosBasicos.introduccionCotizacion}
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
              },
            }}
            sx={{ my: 5, px: 4 }}
            multiline
            //maxRows={2}
            ref={introduccionRef}
            inputProps={{ readOnly: true }}
          />
          <Grid width={Number(ANCHO_PAGINA)}>
            {secciones &&
              secciones.map(
                (seccion) =>
                  seccion.datosSeccion.idControlSeccion !=
                    constantes.NO_INCLUIR_SECCION && (
                    <div
                      className={
                        pagina.current[seccion.datosSeccion.numeroSeccion - 1]
                          ? "page-break-before"
                          : ""
                      }
                      key={seccion.datosSeccion.numeroSeccion + 1000}
                    >
                      {pagina.current[
                        seccion.datosSeccion.numeroSeccion - 1
                      ] && (
                        <LogoImpresion
                          logoRef={logoRef}
                          key={seccion.datosSeccion.numeroSeccion + 2000}
                        ></LogoImpresion>
                      )}
                      {
                        <TablaCotizacionImpresion
                          seccion={seccion}
                          key={seccion.datosSeccion.numeroSeccion}
                          datosBasicos={datosBasicos}
                        ></TablaCotizacionImpresion>
                      }
                    </div>
                  )
              )}
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            //rowSpacing={1}
            //mx={4}
            px={4}
            ref={bottom1Ref}
          >
            <Grid item xs={12}>
              <div
                className={
                  pagina.current[pagina.current.length - 2]
                    ? "page-break-before"
                    : ""
                }
              ></div>
              {pagina.current[pagina.current.length - 2] && (
                <LogoImpresion logoRef={logoRef}></LogoImpresion>
              )}
            </Grid>
            <Grid item xs={6}>
              <CondicionesComercialesImpresion
                datos={datosBasicos}
                datosOpciones={datosOpciones}
                //registrarDatos={registrarDatos}
              ></CondicionesComercialesImpresion>
            </Grid>
            <Grid item xs={6}>
              <ResumenCotizacionImpresion
                totales={totales}
                datos={datosBasicos}
              ></ResumenCotizacionImpresion>
            </Grid>
          </Grid>
          <Grid px={4}>
            <FieldSet
              titulo={"Notas"}
              color="primary.main"
              tamanoTitulo="1.2rem"
              anchoBorde={2}
              radioBorde={1}
              ref={bottom2Ref}
            >
              <TextField
                name={"notasCotizacion"}
                //label={"Notas de la cotización"}
                value={datosBasicos.notasCotizacion}
                error={false}
                type={"text"}
                variant="standard"
                placeholder={"Notas de la cotización"}
                required={false}
                fullWidth
                multiline
                maxRows={12}
                minRows={12}
                inputProps={{ readOnly: true }}
              ></TextField>
            </FieldSet>
          </Grid>
        </div>
      </Box>
    </Modal>
  );
}
