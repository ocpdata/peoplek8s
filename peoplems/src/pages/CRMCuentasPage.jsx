import { useEffect, useState, useContext } from "react";
import { CrearCuenta } from "./CrearCuenta";
import { AppBarCRM } from "../components/crm/AppBarCRM.jsx";
import { RegistroContexto } from "../components/DashboardLayoutBasic";

//============= Constantes ================
import * as constantes from "../config/constantes";

export function CRMCuentasPage() {
  const [openCrearCuenta, setOpenCrearCuenta] = useState(false);
  const [idCuentaSeleccionada, setIdCuentaSeleccionada] = useState(0);
  const { idCuentaDashboardLB } = useContext(RegistroContexto);
  console.log("funcion CRMCuentasPage");

  //Cuando se recibe un id, se actualiza el id y se puede ver la ventana de crear cuenta
  function ayudaSetOpenCrearCuenta(idCuenta) {
    console.log("funcion ayudaSetOpenCrearCuenta", idCuenta);
    setIdCuentaSeleccionada(idCuenta);
    setOpenCrearCuenta(true);
  }

  useEffect(() => {
    console.log("useEffect CRMCuentasPage", idCuentaDashboardLB);

    if (idCuentaDashboardLB === constantes.REGISTRO_NO_VALIDO) {
      setOpenCrearCuenta(false);
      return;
    }
    setOpenCrearCuenta(true);
    if (idCuentaDashboardLB > constantes.REGISTRO_CERO) {
      setIdCuentaSeleccionada(idCuentaDashboardLB);
    }
  }, [idCuentaDashboardLB]);

  return (
    <>
      <AppBarCRM
        tipoRegistro="cuentas"
        setOpenCrearRegistro={ayudaSetOpenCrearCuenta}
      />
      {openCrearCuenta && (
        <CrearCuenta
          idCuentaSeleccionada={idCuentaSeleccionada}
          setIdCuentaSeleccionada={setIdCuentaSeleccionada}
        />
      )}
    </>
  );
}
