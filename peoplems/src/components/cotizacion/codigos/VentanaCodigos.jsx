import { useEffect, useState, useContext } from "react";
import { Box, Grid, Modal } from "@mui/material";
import { AppBarCodigos } from "./AppBarCodigos";
import { GridProductos } from "./GridProductos";
import { AppBarCrearCodigo } from "./AppBarCrearCodigo";
import { DatosProducto } from "./DatosProducto";

import * as constantes from "../../../config/constantes.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1,
  maxWidth: "lg",
  height: 1,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const styleCrearCodigo = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 0.5,
  maxWidth: "lg",
  height: 0.5,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function VentanaCodigos({
  openVentanaCodigos,
  setOpenVentanaCodigos,
  idFabricante,
  colocarCodigo,
  registrarDatos,
}) {
  const [listFabricantes, setListFabricantes] = useState([]);
  const [listProductos, setListProductos] = useState([]);
  const [openVentanaCrearCodigo, setOpenVentanaCrearCodigo] = useState(false);

  console.log(
    "funcion VentanaCodigos",
    openVentanaCodigos,
    idFabricante,
    listFabricantes
  );

  useEffect(() => {
    const obtenerListaFabricantes = async () => {
      //Obtener la lista de fabricantes
      const cadListaFabricantes = `${constantes.PREFIJO_URL_API}/fabricantes/`;
      //const cadListaFabricantes = `http://peoplenode.digitalvs.com:3010/api/fabricantes/`;
      console.log(cadListaFabricantes);
      const resListaFabricantes = await fetch(
        cadListaFabricantes,
        constantes.HEADER_COOKIE
      );
      const jsonListaFabricantes = await resListaFabricantes.json();
      console.log("listafabricantes:", jsonListaFabricantes);

      const listaFabricantes = jsonListaFabricantes.data.map((el) => ({
        id: el.id,
        nombre: el.nombre,
        bdFabricante: el.bdFabricante,
      }));
      console.log(listaFabricantes);

      if (idFabricante === 0) {
        setListFabricantes(listaFabricantes);
        setListProductos([]);
        return;
      }

      //Obtener la lista de precios del fabricante seleccionado
      const fabricanteSeleccionado = listaFabricantes.find((fabricante) => {
        console.log(fabricante.id);
        return fabricante.id === idFabricante;
      });
      console.log(fabricanteSeleccionado);
      const bdFabricante = fabricanteSeleccionado.bdFabricante;

      const cadProductos = `${constantes.PREFIJO_URL_API}/fabricantes/${idFabricante}/productos`;
      //const cadProductos = `${constantes.PREFIJO_URL_API}/fabricantes/${idFabricante}/${bdFabricante}`;
      console.log(cadProductos);
      const resProductos = await fetch(cadProductos, constantes.HEADER_COOKIE);
      const jsonProductos = await resProductos.json();
      console.log(jsonProductos);

      const listaProductos = jsonProductos.data.map((el, index) => ({
        id: ++index,
        idFabricante: el.idFabricante,
        codigo: el.codigo,
        descripcion: el.descripcion,
        precio: el.precio,
      }));
      console.log(listaProductos);

      setListFabricantes(listaFabricantes);
      setListProductos(listaProductos);
    };
    obtenerListaFabricantes();
  }, [idFabricante]);

  return (
    <>
      <Modal open={openVentanaCodigos}>
        <Box sx={style}>
          <AppBarCodigos
            setOpenVentanaCodigos={setOpenVentanaCodigos}
          ></AppBarCodigos>

          <GridProductos
            idFabricanteDesdeGridCodigo={idFabricante}
            listaFabricantes={listFabricantes}
            listaProductos={listProductos}
            setOpenVentanaCodigos={setOpenVentanaCodigos}
            colocarCodigo={colocarCodigo}
            setOpenVentanaCrearCodigo={setOpenVentanaCrearCodigo}
          ></GridProductos>
        </Box>
      </Modal>
      <Modal open={openVentanaCrearCodigo}>
        <Box sx={styleCrearCodigo}>
          <AppBarCrearCodigo
            setOpenVentanaCrearCodigo={setOpenVentanaCrearCodigo}
          ></AppBarCrearCodigo>
          <DatosProducto
            registrarDatos={registrarDatos}
            listaFabricantes={listFabricantes}
          ></DatosProducto>
        </Box>
      </Modal>
    </>
  );
}
