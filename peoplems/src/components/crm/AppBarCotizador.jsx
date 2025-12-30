import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { VentanaBusqueda } from "./VentanaBusqueda";
import { useReducer, useState } from "react";
import * as constantes from "../../config/constantes.js";

export function AppBarCRM({ tipoRegistro, setOpenCrearRegistro }) {
  const [openVentanaBusqueda, setOpenVentanaBusqueda] = useReducer(
    (s) => !s,
    false
  ); //Controla el display de la ventana de busqueda
  const [anoSeleccionado, setAnoSeleccionado] = useState(
    constantes.idAnoActual
  );
  console.log("AppBarCotizador", tipoRegistro);

  //====== Define valores segun el tipo de registro ============
  let nombreBarra = "";
  switch (tipoRegistro) {
    case "cotizaciones":
      nombreBarra = "Cotizaciones";
      break;
  }

  //Cuando se recibe un id, se cierra la ventana de busqueda, se actualiza el id y se puede ver la ventana de crear cuenta
  function ayudaSetOpenVentanaBusquedaConRegistro(idRegistro) {
    console.log("funcion ayudaSetOpenVentanaBusquedaConRegistro", idRegistro);
    setOpenCrearRegistro(idRegistro);
    setOpenVentanaBusqueda(!openVentanaBusqueda);
  }

  function ayudaSetOpenVentanaBusqueda(ano) {
    setOpenVentanaBusqueda(!openVentanaBusqueda);
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography>{nombreBarra}</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              //width: "30rem",
            }}
          >
            <Button
              variant="text"
              onClick={() => ayudaSetOpenVentanaBusqueda(anoSeleccionado)}
              sx={{ color: "white" }}
            >
              Buscar
            </Button>
            <Button
              variant="text"
              onClick={() =>
                setOpenCrearRegistro({ idCotizacion: 0, versionCotizacion: 0 })
              }
              sx={{ color: "white" }}
            >
              Crear
            </Button>
            <Button variant="text" sx={{ color: "white" }}>
              Importar
            </Button>
            <Button variant="text" sx={{ color: "white" }}>
              Listar
            </Button>
            <Button variant="text" sx={{ color: "white" }}>
              Pendientes
            </Button>
            <Select
              value={anoSeleccionado}
              name={"anoSeleccionado"}
              onChange={(e) => setAnoSeleccionado(e.target.value)}
              //onChange={handleChange}
              variant="standard"
              //label={etiqueta}
              //labelId={idEtiqueta}
              //fullWidth
              //readOnly={readOnly}
              sx={{
                color: "white", // color del texto seleccionado
                "& .MuiSelect-select": { color: "white" }, // asegura el color del texto seleccionado
                "& .MuiSvgIcon-root": { color: "white" }, // color del ícono
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    maxWidth: 100,
                  },
                },
              }}
            >
              {constantes.listaAnos.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.nombre}
                </MenuItem>
              ))}
            </Select>
            {openVentanaBusqueda ? (
              <VentanaBusqueda
                openVentanaBusqueda={openVentanaBusqueda}
                setOpenVentanaBusqueda={ayudaSetOpenVentanaBusqueda}
                setOpenVentanaBusquedaConRegistro={
                  ayudaSetOpenVentanaBusquedaConRegistro
                }
                tipoRegistro={tipoRegistro}
                ano={
                  constantes.listaAnos.find(
                    (option) => option.id === anoSeleccionado
                  )?.nombre
                }
              />
            ) : null}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
