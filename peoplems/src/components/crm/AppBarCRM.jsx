import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { VentanaBusqueda } from "./VentanaBusqueda";
//import { VentanaPendientes } from "./VentanaPendientes";
import { useReducer, useState, useEffect, useContext } from "react";
import * as permisos from "../../config/permisos.js";
import { AuthContext } from "../..//pages//Login";
import * as constantes from "../../config/constantes.js";

export function AppBarCRM({
  tipoRegistro,
  setOpenCrearRegistro,
  //setIdRegistroSeleccionado,
}) {
  const [openVentanaBusqueda, setOpenVentanaBusqueda] = useReducer(
    (s) => !s,
    false
  ); //Controla el display de la ventana de busqueda
  const [openVentanaPendientes, setOpenVentanaPendientes] = useState(false);
  const [categoriaRegistro, setCategoriaRegistro] = useState("");
  const [nombreBarra, setNombreBarra] = useState("");
  const [anoSeleccionado, setAnoSeleccionado] = useState(
    constantes.idAnoActual
  );

  const { user } = useContext(AuthContext);
  console.log("funcion AppBarCRM", tipoRegistro);

  //let nombreBarra = "";

  useEffect(() => {
    console.log("useEffect AppBarCRM tipoRegistro", tipoRegistro);
    //====== Define valores segun el tipo de registro ============
    //let nombreBarra = "";
    switch (tipoRegistro) {
      case "cuentas":
      case "cuentasPendientesAprobacion":
        //nombreBarra = "Cuentas";
        setNombreBarra("Cuentas");
        break;
      case "contactos":
      case "contactosPendientesAprobacion":
        //nombreBarra = "Contactos";
        setNombreBarra("Contactos");
        break;
      case "oportunidades":
      case "oportunidadesPendientesAprobacion":
        //nombreBarra = "Oportunidades";
        setNombreBarra("Oportunidades");
        break;
      case "registroFabricantes":
        //nombreBarra = "Registros con Fabricantes";
        setNombreBarra("Registros con Fabricantes");
        break;
      case "cotizacion":
        //nombreBarra = "Cotizaciones";
        setNombreBarra("Cotizaciones");
        break;
    }
    setCategoriaRegistro(tipoRegistro);
  }, [tipoRegistro]);

  /*//====== Define valores segun el tipo de registro ============
  let nombreBarra = "";
  switch (tipoRegistro) {
    case "cuentas":
      nombreBarra = "Cuentas";
      break;
    case "contactos":
      nombreBarra = "Contactos";
      break;
    case "oportunidades":
      nombreBarra = "Oportunidades";
      break;
    case "registroFabricantes":
      nombreBarra = "Registros con Fabricantes";
      break;
    case "cotizacion":
      nombreBarra = "Cotizaciones";
      break;
  }*/

  //Cuando se recibe un id, se cierra la ventana de busqueda, se actualiza el id y se puede ver la ventana de crear cuenta
  function ayudaSetOpenVentanaBusquedaConRegistro(idRegistro) {
    console.log("funcion ayudaSetOpenVentanaBusquedaConRegistro", idRegistro);
    setOpenCrearRegistro(idRegistro);
    setOpenVentanaBusqueda(!openVentanaBusqueda);
  }

  function ayudaSetOpenVentanaBusqueda() {
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
              onClick={() => {
                setCategoriaRegistro(tipoRegistro);
                ayudaSetOpenVentanaBusqueda();
              }}
              sx={{ color: "white" }}
            >
              Buscar
            </Button>
            <Button
              variant="text"
              onClick={() => setOpenCrearRegistro(0)}
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
            <Button
              variant="text"
              onClick={() => {
                switch (tipoRegistro) {
                  case "cuentas":
                    if (
                      user?.permisos?.includes(
                        permisos.ACCESSO__VENTAS_CRM_CUENTAS_PENDIENTES
                      )
                    ) {
                      setCategoriaRegistro("cuentasPendientesAprobacion");
                      ayudaSetOpenVentanaBusqueda();
                    }
                    break;
                  case "contactos":
                    if (
                      user?.permisos?.includes(
                        permisos.ACCESSO__VENTAS_CRM_CONTACTOS_PENDIENTES
                      )
                    ) {
                      setCategoriaRegistro("contactosPendientesAprobacion");
                      ayudaSetOpenVentanaBusqueda();
                    }
                    break;
                  case "oportunidades":
                    if (
                      user?.permisos?.includes(
                        permisos.ACCESSO__VENTAS_CRM_OPORTUNIDADES_PENDIENTES
                      )
                    ) {
                      setCategoriaRegistro("oportunidadesPendientesAprobacion");
                      ayudaSetOpenVentanaBusqueda();
                    }
                    break;
                }
              }}
              sx={{ color: "white" }}
            >
              Pendientes
            </Button>
            {categoriaRegistro === "oportunidades" && (
              <Select
                value={anoSeleccionado}
                name={"anoSeleccionado"}
                onChange={(e) => setAnoSeleccionado(e.target.value)}
                variant="standard"
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
            )}
            {openVentanaBusqueda ? (
              <VentanaBusqueda
                openVentanaBusqueda={openVentanaBusqueda}
                setOpenVentanaBusqueda={ayudaSetOpenVentanaBusqueda}
                setOpenVentanaBusquedaConRegistro={
                  ayudaSetOpenVentanaBusquedaConRegistro
                }
                tipoRegistro={categoriaRegistro}
                ano={
                  categoriaRegistro === "oportunidades" &&
                  constantes.listaAnos.find(
                    (option) => option.id === anoSeleccionado
                  )?.nombre
                }
              />
            ) : null}
            {/*openVentanaPendientes ? (
              <VentanaPendientes></VentanaPendientes>
            ) : null*/}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
