import { useEffect, useState, useContext } from "react";
import { CrearCotizacion } from "./CrearCotizacion";
import { AppBarCRM } from "../components/crm/AppBarCotizador";
import { RegistroContexto } from "../components/DashboardLayoutBasic";

export function CotizadorPage() {
  const [openCrearCotizacion, setOpenCrearCotizacion] = useState(false);
  const [idCotizacionVersionSeleccionada, setIdCotizacionVersionSeleccionada] =
    useState({});
  const { idCotizacionDashboardLB } = useContext(RegistroContexto);
  console.log("funcion CotizadorPage");

  //Cuando se recibe un id, se actualiza el id y se puede ver la ventana de crear cuenta
  function ayudaSetOpenCrearCotizacion(idCotizacionVersion) {
    console.log("funcion ayudaSetOpenCrearCotizacion", idCotizacionVersion);
    setIdCotizacionVersionSeleccionada(idCotizacionVersion);
    setOpenCrearCotizacion(true);
  }

  useEffect(() => {
    console.log("useEffect CotizadorPage", idCotizacionDashboardLB);
    if (
      idCotizacionDashboardLB &&
      Object.keys(idCotizacionDashboardLB).length > 0
    ) {
      setIdCotizacionVersionSeleccionada(idCotizacionDashboardLB);
      setOpenCrearCotizacion(true);
    } else {
      setOpenCrearCotizacion(false);
    }
  }, [idCotizacionDashboardLB.idCotizacion]);

  return (
    <>
      <AppBarCRM
        tipoRegistro="cotizaciones"
        setOpenCrearRegistro={ayudaSetOpenCrearCotizacion}
      />
      {openCrearCotizacion && (
        <CrearCotizacion
          idCotizacionVersionSeleccionada={idCotizacionVersionSeleccionada}
          setIdCotizacionVersionSeleccionada={
            setIdCotizacionVersionSeleccionada
          }
        />
      )}
    </>
  );
}
