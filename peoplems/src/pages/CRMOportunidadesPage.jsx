import { useState, useContext, useEffect } from "react";
import { CrearOportunidad } from "./CrearOportunidad";
import { AppBarCRM } from "../components/crm/AppBarCRM.jsx";
import { RegistroContexto } from "../components/DashboardLayoutBasic";

//============= Constantes ================
import * as constantes from "../config/constantes";

export function CRMOportunidadesPage() {
  //export function CRMOportunidadesPage({ routerLayout }) {
  const [openCrearOportunidad, setOpenCrearOportunidad] = useState(false);
  const [idOportunidadSeleccionada, setIdOportunidadSeleccionada] = useState(0);
  const { idOportunidadDashboardLB } = useContext(RegistroContexto);
  console.log("funcion CRMOportunidadesPage");

  //Cuando se recibe un id, se actualiza el id y se puede ver la ventana de crear contacto
  function ayudaSetOpenCrearOportunidad(idOportunidad) {
    console.log("funcion ayudaSetOpenCrearOportunidad", idOportunidad);
    setIdOportunidadSeleccionada(idOportunidad);
    setOpenCrearOportunidad(true);
  }

  useEffect(() => {
    console.log("useEffect CRMOportunidadesPage", idOportunidadDashboardLB);

    if (idOportunidadDashboardLB === constantes.REGISTRO_NO_VALIDO) {
      setOpenCrearOportunidad(false);
      return;
    }
    setOpenCrearOportunidad(true);
    if (idOportunidadDashboardLB > constantes.REGISTRO_CERO) {
      setIdOportunidadSeleccionada(idOportunidadDashboardLB);
    }
  }, [idOportunidadDashboardLB]);

  return (
    <>
      <AppBarCRM
        tipoRegistro="oportunidades"
        setOpenCrearRegistro={ayudaSetOpenCrearOportunidad}
      />
      {openCrearOportunidad && (
        <CrearOportunidad
          idOportunidadSeleccionada={idOportunidadSeleccionada}
          setIdOportunidadSeleccionada={setIdOportunidadSeleccionada}
          //routerLayout={routerLayout}
        />
      )}
    </>
  );
}
