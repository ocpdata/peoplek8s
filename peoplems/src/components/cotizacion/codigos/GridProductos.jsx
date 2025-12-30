import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Atom } from "react-loading-indicators";
import { useEffect, useState } from "react";
import { CustomToolbarCodigos } from "./CustomToolbarCodigos";

import * as constantes from "../../../config/constantes.js";

const columnsCuentas = [
  { field: "id", headerName: "Id", flex: 0.4 },
  { field: "codigo", headerName: "Código", flex: 1 },
  { field: "descripcion", headerName: "Descripción", flex: 1 },
  { field: "precio", headerName: "Precio US$", flex: 0.5 },
];

export function GridProductos({
  idFabricanteDesdeGridCodigo,
  listaFabricantes,
  listaProductos,
  setOpenVentanaCodigos,
  colocarCodigo,
  setOpenVentanaCrearCodigo,
}) {
  const [listFabricantes, setListFabricantes] = useState([]);
  const [idFabricante, setIdFabricante] = useState(0);
  const [listProductos, setListProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("funcion GridProductos", listaFabricantes, listaProductos);

  function handleDoubleClickCelda(params) {
    console.log("function handleDoubleClickCelda", params);
    console.log(params.row.codigo, params.row.descripcion, params.row.precio);
    colocarCodigo(
      params.row.codigo,
      params.row.descripcion,
      params.row.precio,
      idFabricante
    );
    setOpenVentanaCodigos(false);
  }

  function registrarDatos(input) {
    console.log("funcion registrarDatos", input);
    const obtenerProductos = async () => {
      setLoading(true);

      //Obtener el campo bdFabricante de la listaFabricantes cuyo id sea igual al idFabricante
      console.log("input,idFabricante", input, idFabricante);
      console.log(listFabricantes);

      //Si existe input idVendor = input, si no exite, idVendor=idfabricante

      let fabricanteSeleccionado = listFabricantes.find(
        (fabricante) => fabricante.id === input
      );

      //Se hace una doble busqueda porque cuando se ejecuta useEffect, todavia no se define el estado de listFabricantes
      if (!fabricanteSeleccionado) {
        fabricanteSeleccionado = listaFabricantes.find(
          (fabricante) => fabricante.id === input
        );
        if (!fabricanteSeleccionado) {
          console.error("Fabricante no encontrado");
          setLoading(false);
          return;
        }
      }

      const bdFabricante = fabricanteSeleccionado.bdFabricante;

      const cadProductos = `${constantes.PREFIJO_URL_API}/fabricantes/${input}/productos`;
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

      setListProductos(listaProductos);
      setLoading(false);
    };
    obtenerProductos();
    //setLoading(true);
    setIdFabricante(input);
  }

  useEffect(() => {
    setListFabricantes(listaFabricantes);
    setIdFabricante(idFabricanteDesdeGridCodigo);
    registrarDatos(idFabricanteDesdeGridCodigo);
  }, [listaFabricantes, idFabricanteDesdeGridCodigo]);

  return (
    <div style={{ height: "90%", width: "100%" }}>
      <DataGrid
        rows={listProductos}
        columns={columnsCuentas}
        loading={loading}
        onCellDoubleClick={handleDoubleClickCelda}
        slots={{
          toolbar: CustomToolbarCodigos,
        }}
        slotProps={{
          toolbar: {
            idFabricante: idFabricante,
            listaFabricantes: listFabricantes,
            registrarDatos: registrarDatos,
            setOpenVentanaCrearCodigo: setOpenVentanaCrearCodigo,
          },
          loadingOverlay: {
            variant: "circular-progress",
            noRowsVariant: "circular-progress",
          },
        }}
      />
    </div>
  );
}
