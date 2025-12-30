import { Atom } from "react-loading-indicators";
import CircularProgress from "@mui/material/CircularProgress";
import * as constantes from "../../config/constantes";

export function IconoLoader({ texto }) {
  return (
    <>
      {constantes.ICONO_LOADER === constantes.ICONO_LOADER_ATOM ? (
        <Atom
          color={constantes.COLOR_RoyalBlue}
          size={constantes.TAMANO_ICONO_MEDIUM}
          text={texto}
          //text="Cargando..."
          textColor=""
        />
      ) : (
        <CircularProgress color="inherit" />
      )}
    </>
  );
}
