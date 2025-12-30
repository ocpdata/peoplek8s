import { GridToolbarContainer } from "@mui/x-data-grid";
import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
import { CampoSelect } from "../../comun/CampoSelect";
import SearchIcon from "@mui/icons-material/Search";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

export function CustomToolbarCodigos({
  idFabricante,
  listaFabricantes,
  registrarDatos,
  setOpenVentanaCrearCodigo,
}) {
  function handleAdicionarItem() {
    console.log("funcion handleAdicionarItem");
    setOpenVentanaCrearCodigo(true);
  }
  function handleEditarItem() {
    console.log("funcion handleEditarItem");
    //setOpenVentanaCrearCodigo(true);
  }

  return (
    <GridToolbarContainer>
      <Tooltip title="Seleccione un Fabricante">
        <Box sx={{ flexGrow: 1 }}>
          <CampoSelect
            nombreInstancia="fabricante"
            idOptionSelected={idFabricante}
            etiqueta={"Fabricante"}
            idEtiqueta={"lbFabricante"}
            options={listaFabricantes}
            registrarDatos={registrarDatos}
          ></CampoSelect>
        </Box>
      </Tooltip>
      <Divider orientation="vertical" flexItem />

      <Tooltip title="Crear un ítem">
        <IconButton>
          {<AddIcon color="primary" onClick={handleAdicionarItem}></AddIcon>}
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar un ítem">
        <IconButton>
          {<EditIcon color="primary" onClick={handleEditarItem}></EditIcon>}
        </IconButton>
      </Tooltip>
    </GridToolbarContainer>
  );
}
