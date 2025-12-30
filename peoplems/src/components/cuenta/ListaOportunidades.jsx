import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useEffect, useState, useContext } from "react";
import Link from "@mui/material/Link";
import { RegistroContexto } from "../DashboardLayoutBasic";
import { AuthContext } from "../../pages/Login";

import * as constantes from "../../config/constantes.js";
import * as permisosRegistrados from "../../config/permisos.js";

const columnListaOportunidades = [
  { field: "idOportunidad", headerName: "Id", flex: 0.3 },
  { field: "nombreOportunidad", headerName: "Oportunidad", flex: 2 },
  {
    field: "nombreLineaNegocio",
    headerName: "Línea de negocio",
    flex: 1,
  },
  {
    field: "nombreEtapaVentaOportunidad",
    headerName: "Etapa venta",
    flex: 1,
  },
  { field: "importeOportunidad", headerName: "Importe US$", flex: 1 },
  {
    field: "nombrePropietarioOportunidad",
    headerName: "Propietario",
    flex: 1,
  },
  { field: "fechaCierreOportunidad", headerName: "Fecha cierre", flex: 1 },
];

function createData(
  param1,
  param2,
  param3,
  param4,
  param5,
  param6,
  param7,
  param8
) {
  return {
    id: param1,
    idOportunidad: param2,
    nombreOportunidad: param3,
    nombreLineaNegocio: param4,
    nombreEtapaVentaOportunidad: param5,
    importeOportunidad: param6,
    nombrePropietarioOportunidad: param7,
    fechaCierreOportunidad: param8,
  };
}

let filas = [];

export function ListaOportunidades({ idCuentaSeleccionada, permisos }) {
  const [list, setList] = useState([]);
  const [selectedOportunidad, setSelectedOportunidad] = useState(0);
  const { setOportunidadDashboardLB, router } = useContext(RegistroContexto);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let url;
    console.log("user", user);
    if (
      user?.permisos?.includes(
        permisosRegistrados.ALCANCE__TODAS_LAS_OPORTUNIDADES
      )
    ) {
      url = `${constantes.PREFIJO_URL_API}/oportunidades/cuenta/${idCuentaSeleccionada}`;
    } else {
      url = `${constantes.PREFIJO_URL_API}/oportunidades/cuenta/${idCuentaSeleccionada}/usuario/${user.id}`;
    }
    //let url = `${constantes.PREFIJO_URL_API}/oportunidades/cuenta/${idCuentaSeleccionada}`;

    console.log(url);

    fetch(url, constantes.HEADER_COOKIE)
      .then((resp) => resp.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        filas = [];

        json.data.map((item) =>
          filas.push(
            createData(
              item.idOportunidad,
              item.idOportunidad,
              item.nombreOportunidad,
              item.nombreLineaNegocio,
              item.nombreEtapaVentaOportunidad,
              item.importeOportunidad,
              item.nombrePropietarioOportunidad,
              item.fechaCierreOportunidad
            )
          )
        );
        console.log(filas);
        setList(filas);
      });
  }, [idCuentaSeleccionada]);

  const handleOportunidadClick = (idOportunidad) => {
    setSelectedOportunidad(idOportunidad);
  };

  useEffect(() => {
    if (selectedOportunidad > 0) {
      setOportunidadDashboardLB(selectedOportunidad);
      router.navigate(`/crm/oportunidades`);
      console.log("ListaOportunidades:", router);
    }
  });

  return (
    <Accordion>
      {/*<Accordion expanded={true} style={{ maxHeight: "500px" }}>*/}
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
        sx={{
          backgroundColor: "lightblue",
        }}
      >
        <Typography component="span">Lista de Oportunidades</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Oportunidad</TableCell>
                <TableCell align="right">Línea de negocio</TableCell>
                <TableCell align="right">Etapa venta</TableCell>
                <TableCell align="right">Importe US$</TableCell>
                <TableCell align="right">Propietario</TableCell>
                <TableCell align="right">Fecha de cierre</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((oportunidad, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOportunidadClick(oportunidad.idOportunidad);
                      }}
                    >
                      {oportunidad.idOportunidad}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    {oportunidad.nombreOportunidad}
                  </TableCell>
                  <TableCell align="right">
                    {oportunidad.nombreLineaNegocio}
                  </TableCell>
                  <TableCell align="right">
                    {oportunidad.nombreEtapaVentaOportunidad}
                  </TableCell>
                  <TableCell align="right">
                    {oportunidad.importeOportunidad}
                  </TableCell>
                  <TableCell align="right">
                    {oportunidad.nombrePropietarioOportunidad}
                  </TableCell>
                  <TableCell align="right">
                    {oportunidad.fechaCierreOportunidad}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/*<Box
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: 400,
            minHeight: 200,
          }}
        >
          <DataGrid rows={list} columns={columnListaOportunidades} />
        </Box>*/}
      </AccordionDetails>
    </Accordion>
  );
}
