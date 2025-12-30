import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { CRMCuentasPage } from "../pages/CRMCuentasPage";
import { CRMContactosPage } from "../pages/CRMContactosPage";
import { CRMOportunidadesPage } from "../pages/CRMOportunidadesPage";
import { CRMRegistrosFabricantesPage } from "../pages/CRMRegistrosFabricantesPage";
import { CotizadorPage } from "../pages/CotizadorPage";

export function PageContent({ pathname }) {
  //export function PageContent({ pathname, routerLayout = () => {} }) {
  console.log("funcion PageContent", pathname);
  const project = (ruta) => {
    console.log("Ruta: ", ruta);
    switch (ruta) {
      case "/crm/cuentas":
        return <CRMCuentasPage></CRMCuentasPage>;
      case "/crm/contactos":
        return <CRMContactosPage></CRMContactosPage>;
      case "/crm/oportunidades":
        return (
          <CRMOportunidadesPage
          //routerLayout={routerLayout}
          ></CRMOportunidadesPage>
        );
      case "/crm/registrosFabricantes":
        return <CRMRegistrosFabricantesPage></CRMRegistrosFabricantesPage>;
      case "/cotizacion":
        return <CotizadorPage></CotizadorPage>;

      default:
        return;
      //return <h1>No project match</h1>;
    }
  };

  return (
    <Box
      sx={{
        //py: 4,
        display: "flex",
        flexDirection: "column",
        //alignItems: "center",
        //textAlign: "center",
      }}
    >
      {project(pathname)}
    </Box>
  );
}

PageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};
