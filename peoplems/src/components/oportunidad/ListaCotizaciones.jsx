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
import Link from "@mui/material/Link";
import { CotizadorPage } from "../../pages/CotizadorPage";
import { useState, useEffect, useContext } from "react";
import { PageContent } from "../../router/PageContent.jsx";
import { RegistroContexto } from "../DashboardLayoutBasic";

export function ListaCotizaciones({ listaCotizaciones }) {
  //export function ListaCotizaciones({ listaCotizaciones, routerLayout }) {
  const [selectedCotizacionId, setSelectedCotizacionId] = useState(null);
  const [selectedNumeroVersion, setSelectedNumeroVersion] = useState(null);
  const [verCotizacion, setVerCotizacion] = useState(false);
  const { setCotizacionVersionDashboardLB, router } =
    useContext(RegistroContexto);
  console.log("funcion ListaCotizaciones");

  const handleCotizacionClick = (idCotizacion, numeroVersion) => {
    setSelectedCotizacionId(idCotizacion);
    setSelectedNumeroVersion(numeroVersion);
  };

  useEffect(() => {
    if (selectedCotizacionId) {
      setCotizacionVersionDashboardLB({
        idCotizacion: selectedCotizacionId,
        versionCotizacion: selectedNumeroVersion,
      });
      router.navigate(`/cotizacion`);
      //routerLayout.navigate(`/cotizacion`);
      console.log("ListaCotizaciones:", router);
    }
  });

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
        <Typography component="span">Cotizaciones</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Cotización</TableCell>
                <TableCell align="right">Versión</TableCell>
                <TableCell align="right">Importe</TableCell>
                <TableCell align="right">Etapa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listaCotizaciones.map((cotizacion, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCotizacionClick(
                          cotizacion.idCotizacion,
                          cotizacion.numeroVersion
                        );
                      }}
                    >
                      {cotizacion.idCotizacion}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    {cotizacion.numeroVersion}
                  </TableCell>
                  <TableCell align="right">
                    {cotizacion.importeCotizacion}
                  </TableCell>
                  <TableCell align="right">
                    {cotizacion.idEstadoCotizacion}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}
