import { AppBarCRM } from "../components/crm/AppBarCRM.jsx";
import { useEffect, useState } from "react";
import { Box, Button, AppBar, Toolbar, Typography } from "@mui/material";

export function CRMRegistrosFabricantesPage() {
  const [openContenido, setOpenContenido] = useState(false);

  function abrirContenido() {
    setOpenContenido(true);
  }

  return (
    <>
      <AppBarCRM
        tipoRegistro="registrosFabricantes"
        setOpenContenido={abrirContenido}
      />
      {openContenido && <Button>Hola</Button>}
    </>
  );
}
