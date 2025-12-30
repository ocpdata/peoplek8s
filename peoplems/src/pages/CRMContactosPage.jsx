import { useState, useContext, useEffect } from "react";
import { CrearContacto } from "./CrearContacto";
import { AppBarCRM } from "../components/crm/AppBarCRM.jsx";
import { RegistroContexto } from "../components/DashboardLayoutBasic";

//============= Constantes ================
import * as constantes from "../config/constantes";

export function CRMContactosPage() {
  const [openCrearContacto, setOpenCrearContacto] = useState(false);
  const [idContactoSeleccionado, setIdContactoSeleccionado] = useState(0);
  const { idContactoDashboardLB } = useContext(RegistroContexto);
  console.log("CRMContactosPage");

  //Cuando se recibe un id, se actualiza el id y se puede ver la ventana de crear contacto
  function ayudaSetOpenCrearContacto(idContacto) {
    console.log("funcion ayudaSetOpenCrearContacto", idContacto);
    setIdContactoSeleccionado(idContacto);
    setOpenCrearContacto(true);
  }

  useEffect(() => {
    console.log("useEffect CRMContactosPage", idContactoDashboardLB);

    if (idContactoDashboardLB === constantes.REGISTRO_NO_VALIDO) {
      setOpenCrearContacto(false);
      return;
    }
    setOpenCrearContacto(true);
    if (idContactoDashboardLB > constantes.REGISTRO_CERO) {
      setIdContactoSeleccionado(idContactoDashboardLB);
    }

    /*if (
      idContactoDashboardLB > 0 //&&
      //Object.keys(idOportunidadDashboardLB).length > 0
    ) {
      setIdContactoSeleccionado(idContactoDashboardLB);
      setOpenCrearContacto(true);
    } else {
      setOpenCrearContacto(false);
    }*/
  }, [idContactoDashboardLB]);

  return (
    <>
      <AppBarCRM
        tipoRegistro="contactos"
        setOpenCrearRegistro={ayudaSetOpenCrearContacto}
      />
      {openCrearContacto && (
        <CrearContacto
          idContactoSeleccionado={idContactoSeleccionado}
          setIdContactoSeleccionado={setIdContactoSeleccionado}
        />
      )}
    </>
  );
}
