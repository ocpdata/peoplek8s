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

import * as constantes from "../../config/constantes.js";

const columnListaContactos = [
  { field: "idContacto", headerName: "Id", flex: 0.3 },
  {
    field: "nombresApellidosContacto",
    headerName: "Nombres y Apellidos",
    flex: 2,
  },
  {
    field: "emailContacto",
    headerName: "E-mail",
    flex: 1,
  },
  { field: "movilContacto", headerName: "Móvil", flex: 1 },
  { field: "cargoContacto", headerName: "Cargo", flex: 1 },
  { field: "nombrePropietarioContacto", headerName: "Propietario", flex: 1 },
];

function createData(param1, param2, param3, param4, param5, param6, param7) {
  return {
    id: param1,
    idContacto: param2,
    nombresApellidosContacto: param3,
    emailContacto: param4,
    movilContacto: param5,
    cargoContacto: param6,
    nombrePropietarioContacto: param7,
  };
}

let filas = [];

export function ListaContactos({ idCuentaSeleccionada }) {
  const [list, setList] = useState([]);
  const [selectedContacto, setSelectedContacto] = useState(0);
  const { setContactoDashboardLB, router } = useContext(RegistroContexto);

  useEffect(() => {
    let url = `${constantes.PREFIJO_URL_API}/contactos/cuenta/${idCuentaSeleccionada}`;
    console.log(url);

    fetch(url, constantes.HEADER_COOKIE)
      .then((resp) => resp.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        filas = [];

        json.data.map((item) =>
          filas.push(
            createData(
              item.idContacto,
              item.idContacto,
              item.nombresApellidosContacto,
              item.emailContacto,
              item.movilContacto,
              item.cargoContacto,
              item.nombrePropietarioContacto
            )
          )
        );
        console.log(filas);
        setList(filas);
      });
  }, [idCuentaSeleccionada]);

  const handleContactoClick = (idContacto) => {
    setSelectedContacto(idContacto);
  };

  useEffect(() => {
    if (selectedContacto > 0) {
      setContactoDashboardLB(selectedContacto);
      router.navigate(`/crm/contactos`);
      console.log("ListaContactos:", router);
    }
  });

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
        sx={{
          backgroundColor: "lightblue",
        }}
      >
        <Typography component="span">Lista de Contactos</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Nombres y Apellidos</TableCell>
                <TableCell align="right">E-mail</TableCell>
                <TableCell align="right">Móvil</TableCell>
                <TableCell align="right">Cargo</TableCell>
                <TableCell align="right">Propietario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((contacto, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleContactoClick(contacto.idContacto);
                      }}
                    >
                      {contacto.idContacto}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    {contacto.nombresApellidosContacto}
                  </TableCell>
                  <TableCell align="right">{contacto.emailContacto}</TableCell>
                  <TableCell align="right">{contacto.movilContacto}</TableCell>
                  <TableCell align="right">{contacto.cargoContacto}</TableCell>
                  <TableCell align="right">
                    {contacto.nombrePropietarioContacto}
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
          <DataGrid rows={list} columns={columnListaContactos} />
        </Box>*/}
      </AccordionDetails>
    </Accordion>
  );
}
