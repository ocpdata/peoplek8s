import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  useGridApiRef,
  useGridApiContext,
  GridCellEditStopReasons,
} from "@mui/x-data-grid";
import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import SwipeUpAltIcon from "@mui/icons-material/SwipeUpAlt";
import SwipeDownAltIcon from "@mui/icons-material/SwipeDownAlt";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  memo,
  useRef,
} from "react";
import numeral from "numeral";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import KeyboardOptionKeyIcon from "@mui/icons-material/KeyboardOptionKey";
import PanToolIcon from "@mui/icons-material/PanTool";
import DoNotTouchIcon from "@mui/icons-material/DoNotTouch";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Chip from "@mui/material/Chip";
import { purple, red, blue } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import HighlightIcon from "@mui/icons-material/Highlight";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";
import InventoryIcon from "@mui/icons-material/Inventory";
import Grid from "@mui/material/Grid2";

import { VentanaConfirmacion } from "../../../comun/VentanaConfirmacion";
import { VentanaCodigos } from "../../codigos/VentanaCodigos";
import { CustomToolbarTablaCotizacion } from "./CustomToolbarTablaCotizacion";
import { CustomFooterTablaCotizacion } from "./CustomFooterTablaCotizacion";
import { sincronizarFilas } from "../../../../funciones/sincronizarFilas.js";
import { getColumnsTablaCotizacion } from "../../utils/columnsTablaCotizacion";

//Formato de la seccion(tabla)
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .filaResaltada": {
    backgroundColor: "lightblue",
  },
  /*"& .MuiDataGrid-cell": {
    color: "gray",
    borderColor: "#292524",
  },*/
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderBottom: "0", // !important",
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: theme.palette.primary.main,
    //color: "#75706c",
  },
  /*"& .MuiDataGrid-scrollbarFiller": {
    borderBottom: "0 !important",
  },*/
}));

//Determina sies un evento del teclado. Retorna true si lo es
function isKeyboardEvent(event) {
  return !!event.key;
}

//Componente de la tabla de una seccion
const TablaCotizacion = memo(function TablaCotizacion({
  seccionString, //Es el objeto seccion pero en formato string para poder ver si sus propiedades han cambiado
  registrarDatos,
  registrarAlturaSeccion,
  filasCopiadas,
  //ordenarSecciones,
  //eliminarSeccion,
  datosBasicos,
}) {
  console.log("funcion TablaCotizacion", JSON.parse(seccionString));
  const [listFilas, setListFilas] = useState([]);
  //const [listFilasAMostrar, setListFilasAMostrar] = useState([]); //Para cuando se quiera mostrar una lista de filas distinta a la que se usa para procesarlas
  const [listGrupos, setListGrupos] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [listFilasSeleccionada, setListFilasSeleccionada] = useState([]);
  const [openConfirmacion, setOpenConfirmacion] = useState({});
  const [incluirSeccion, setIncluirSeccion] = useState(0);
  //const [listFilasResaltadas, setListFilasResaltadas] = useState([]);
  const [openVentanaCodigos, setOpenVentanaCodigos] = useState(false);
  const [idFabricante, setIdFabricante] = useState(0);
  const [idFilaCodigo, setIdFilaCodigo] = useState(0);
  const [numeroSeccion, setNumeroSeccion] = useState(0);

  const apiRef = useGridApiRef();
  const tablaRef = useRef(null);

  const columnsTablaCotizacion = getColumnsTablaCotizacion(
    listFilas,
    datosBasicos
  );

  //Se encarga de seleccionar filas y las almacena en listFilasSeleccionada. Si se selecciona un agrupador, se seleccionan tambien sus componentes.
  // Si se deselecciona un agrupador, tambien se deseleccionan todos sus componentes.
  function handleSeleccionFilas(newRowSelectionModel) {
    console.log("funcion handleSeleccionFilas");

    //Esta función se ejecuta cada vez que se selecciona una fila
    //El id de la fila seleccionada se recibe en newRowSelectionModel. Ejm [1, 2, 3]
    //El estado de las filas que están seleccionadas se guarda en listFilasSeleccionada
    //El estado de las filas que se muestran en la tabla se guarda en listFilas
    //El estado de los grupos y de las filas que componen los grupos se guarda en listGrupos
    //Se determina si la nueva fila seleccionada es un agrupador y cual es su grupo
    //Si no hay filas seleccionadas, se limpia la lista de filas seleccionadas
    //Un agrupador es una fila que tiene un numero de grupo mayor a 1000
    //Un componente de un grupo es una fila que tiene un numero de grupo mayor a 0 y menor a 1000. El numero de grupo es el mismo que el de su agrupador menos 1000
    //Una fila individual es una fila que tiene un numero de grupo igual a cero
    //Si la fila seleccionada no es un agrupador, se selecciona la fila
    //Se determina si la nueva fila seleccionada es un agrupador
    //Si la nueva fila seleccionada es un agrupador, se selecciona el agrupador y todos los componentes del grupo. Si la nueva fila no es un agrupador, se dejan las filas de los componentes como esten
    //Si se deseleccionan varios componentes de un grupo, asi esté seleccionado el agrupador y todos sus componentes, se deseleccionan las filas de los componentes que han sido deseleccionados
    //Si se deselecciona una fila, se deselecciona la fila
    //Si se deselecciona un agrupador, se deseleccionan tanto el agrupador como todos los componentes del grupo

    if (newRowSelectionModel.length === 0) {
      // Si no hay filas seleccionadas, limpiar la lista de filas seleccionadas
      setListFilasSeleccionada([]);
      return;
    }

    //Se determina si la nueva fila seleccionada es un agrupador
    /*const nuevaFilaSeleccionada =
      newRowSelectionModel[newRowSelectionModel.length - 1];*/
    const listNumeroFilasSeleccionadas = [];
    listFilasSeleccionada.map((fila) => {
      listNumeroFilasSeleccionadas.push(fila);
    });
    //console.log(listNumeroFilasSeleccionadas);

    const nuevaFilaSeleccionada = newRowSelectionModel.filter(
      (fila) => !listNumeroFilasSeleccionadas.includes(fila)
    );
    //console.log(nuevaFilaSeleccionada);

    let nuevoNumeroFilaSeleccionada = 0;
    if (nuevaFilaSeleccionada.length > 0) {
      nuevoNumeroFilaSeleccionada = nuevaFilaSeleccionada[0];
    }
    //console.log(nuevoNumeroFilaSeleccionada);

    let filaSeleccionada = {};
    if (nuevoNumeroFilaSeleccionada > 0) {
      filaSeleccionada = listFilas.find(
        (fila) => fila.id === nuevoNumeroFilaSeleccionada
      );
    }
    //console.log(filaSeleccionada);

    let nuevaFilaSeleccionadaEsAgrupador = false;
    if (Object.keys(filaSeleccionada).length > 0) {
      if (filaSeleccionada.grupo > 1000) {
        nuevaFilaSeleccionadaEsAgrupador = true;
      }
    }

    //console.log(nuevaFilaSeleccionadaEsAgrupador);

    const nuevasFilasSeleccionadas = new Set();

    // Procesar selección de filas
    newRowSelectionModel.forEach((id) => {
      const fila = listFilas.find((fila) => fila.id === id);

      if (
        fila.grupo > 1000 &&
        nuevaFilaSeleccionadaEsAgrupador &&
        fila.id === nuevoNumeroFilaSeleccionada
      ) {
        // Si la fila es un agrupador, seleccionar el agrupador y todos sus componentes
        nuevasFilasSeleccionadas.add(fila.id);
        const numeroGrupo = fila.grupo - 1000;
        const grupo = listGrupos.find((grupo) => grupo.id === numeroGrupo);
        grupo?.filas.forEach((componente) =>
          nuevasFilasSeleccionadas.add(componente.id)
        );
      } else if (fila.grupo === 0) {
        // Si la fila es individual, seleccionarla
        nuevasFilasSeleccionadas.add(fila.id);
      } else {
        // Si la fila es un componente de un grupo, seleccionarla
        nuevasFilasSeleccionadas.add(fila.id);
      }
    });
    //console.log(nuevasFilasSeleccionadas);

    // Manejar la deselección de filas
    const filasDeseleccionadas = listFilasSeleccionada.filter(
      (id) => !newRowSelectionModel.includes(id)
    );

    filasDeseleccionadas.forEach((id) => {
      const fila = listFilas.find((fila) => fila.id === id);

      if (fila.grupo > 1000) {
        // Si se deselecciona un agrupador, deseleccionar el agrupador y todos sus componentes
        nuevasFilasSeleccionadas.delete(fila.id);
        const numeroGrupo = fila.grupo - 1000;
        const grupo = listGrupos.find((grupo) => grupo.id === numeroGrupo);
        grupo?.filas.forEach((componente) =>
          nuevasFilasSeleccionadas.delete(componente.id)
        );
      } else {
        // Si se deselecciona una fila individual o componente, deseleccionarla
        nuevasFilasSeleccionadas.delete(fila.id);
      }
    });

    // Actualizar el estado con las filas seleccionadas
    setListFilasSeleccionada(Array.from(nuevasFilasSeleccionadas));
  }

  //Futuro: Se puede expandir o contraer un grupo
  function handleExpandirGrupo(fila) {
    console.log("funcion handleExpandirGrupo", fila);
    //1. Se identifica el grupo seleccionado
    //2. Se crea un array de las filas de la seccion

    //3. Se crea el array de los componentes que forman el grupo
    //4. Se crea un array de las filas a mostrar y se remueven los compenentes del grupo

    //5. Se guarda la lista de filas
    //6. Se guarda la lista de filas a mostrar

    //1. Se identifica el grupo seleccionado
    const numeroGrupo = fila.grupo - 1000;
    console.log(numeroGrupo);

    //2. Se crea un array de las filas de la seccion
    const listaFilas = [...listFilas];

    //3. Se crea el array de los componentes que forman el grupo
    const listaComponentesGrupo = listaFilas.filter(
      (item) => item.grupo === numeroGrupo
    );
    console.log(listaComponentesGrupo);

    //4. Se crea un array de las filas a mostrar y se remueven los compenentes del grupo
    const listaFilasAMostrar = listaFilas.filter(
      (item) => item.grupo !== numeroGrupo
    );
    console.log(listaFilasAMostrar);

    //5. Se guarda la lista de filas
    setListFilas(listaFilas);

    //6. Se guarda la lista de filas a mostrar
    //setListFilasAMostrar(listaFilasAMostrar);
  }

  //Se ejecuta cada vez que hay una seccion
  useEffect(() => {
    console.log("useEffect TablaCotizacion", JSON.parse(seccionString));

    //2. Se sincroniza la nueva lista de filas y grupos
    const seccion = JSON.parse(seccionString);
    const filasAMostrar = sincronizarFilas(seccion.filas);
    //const filasAMostrar = sincronizarFilas(listaFilas);
    setTotalItems(filasAMostrar.totalItems);
    setListFilas(filasAMostrar.listaFilasAMostrar);
    //setListFilasAMostrar(filasAMostrar.listaFilasAMostrar);
    setListGrupos(filasAMostrar.listaGrupos);
    setNumeroSeccion(seccion.datosSeccion.numeroSeccion);
    setIncluirSeccion(seccion.datosSeccion.idControlSeccion);
  }, [seccionString]);

  /**
   * Handles the update of a row in the quotation table, recalculating group totals and synchronizing state.
   *
   * @param {Object} newRow - The updated row object containing new values.
   * @param {Object} oldRow - The previous row object before the update.
   * @returns {Object} The updated row object (`newRow`).
   *
   * This function:
   * 1. Finds and replaces the updated row in the list of rows.
   * 2. Recalculates the total sale value (`venta`) for each group based on the updated rows.
   * 3. Updates each group's list of rows.
   * 4. Updates the display rows, setting group aggregator values where appropriate.
   * 5. Synchronizes the updated rows and groups with the component's state and persists the changes.
   */
  function handleProcessRowUpdate(newRow, oldRow) {
    console.log(newRow);
    console.log(oldRow);

    const listaGrupos = [...listGrupos];
    const listaFilas = [...listFilas];

    //1. Dentro del array de filas actual, se identifica el indice de la fila que corresponde con el id de la fila modificada.
    let indiceFila = 0;
    listFilas.forEach((fila, indice) => {
      if (fila.id === newRow.id) {
        indiceFila = indice;
      }
    });

    //2. Cambiar la fila anterior con la nueva
    listaFilas.splice(indiceFila, 1, newRow);

    //3. Se obtiene la suma agregada de los componentes de cada grupo, asi como los componentes de cada grupo
    listaGrupos.forEach((grupo) => {
      grupo.venta = listaFilas.reduce((total, item) => {
        if (item.grupo === grupo.id) {
          total +=
            ((item.precioListaUnitario *
              (1 - item.descuentoFabricante / 100) *
              (1 + item.importacion / 100)) /
              (1 - item.margen / 100)) *
            (1 - item.descuentoFinal / 100) *
            (1 + fila.iva / 100) *
            item.cantidad;
        }
        return total;
      }, 0);
      grupo.filas = listaFilas.filter((item) => item.grupo === grupo.id);
    });

    //4. Se arma la nueva lista de filas con los grupos actualizados. El numero de item es el mismo para cada componente de un grupo
    const listaFilasAMostrar = listaFilas.map((fila) => {
      //Se coloca el valor de la suma de los componentes de cada grupo en su agregador
      if (fila.grupo > 1000) {
        fila.precioVentaTotal = listaGrupos.find(
          (grupo) => grupo.id === fila.grupo - 1000
        ).venta;
      }
      return fila;
    });
    console.log(listaFilasAMostrar);
    console.log(indiceFila);
    console.log(listaFilasAMostrar[indiceFila]);

    const filasAMostrar = sincronizarFilas(listaFilasAMostrar);
    registrarDatos(
      filasAMostrar.listaFilasAMostrar,
      "filasCotizacion",
      numeroSeccion
    );
    setTotalItems(filasAMostrar.totalItems);
    setListFilas(filasAMostrar.listaFilasAMostrar);
    setListGrupos(filasAMostrar.listaGrupos);

    return newRow;
  }

  function handleProcessRowUpdateError(params) {
    console.log(params);
  }

  /**
   * Handles the double-click event on a table cell.
   * If the double-clicked cell is in the "codigoItem" field, it sets the relevant state
   * to open a modal or window for selecting codes.
   *
   * @param {object} params - Parameters containing information about the clicked cell.
   * @param {string|number} params.id - The unique identifier of the row.
   * @param {string} params.field - The field name of the clicked cell.
   * @param {object} params.row - The data object for the row.
   * @param {Event} event - The double-click event object.
   * @param {object} details - Additional details about the event.
   */
  function handleDoubleClickCelda(params, event, details) {
    console.log("function handleDoubleClickCelda", params, event, details);
    if (params.field === "codigoItem") {
      setIdFilaCodigo(params.id);
      setIdFabricante(params.row.fabricante);
      setOpenVentanaCodigos(true);
    }
  }

  /**
   * Updates the `listFilas` state by replacing the `codigoItem`, `descripcion`,
   * and `precioListaUnitario` fields of the row that matches the `idFilaCodigo`.
   *
   * @param {string} codigo - The code to set for the matching row.
   * @param {string} descripcion - The description to set for the matching row.
   * @param {number} precio - The unit price to set for the matching row.
   */
  function colocarCodigo(codigo, descripcion, precio, idFabricante) {
    console.log(
      "funcion colocarCodigo",
      codigo,
      descripcion,
      precio,
      idFabricante
    );
    //Reemplazar en listFilas los campos codigoItem, descripcion y precioListaUnotario con los argumentos de la funcion y actualizar el estado de listFilas
    const listaFilasActualizada = listFilas.map((fila) => {
      if (fila.id === idFilaCodigo) {
        return {
          ...fila,
          fabricante: idFabricante,
          codigoItem: codigo,
          descripcion: descripcion,
          precioListaUnitario: Number(precio),
        };
      }
      return fila;
    });
    console.log(listaFilasActualizada);

    // Sincronizar la nueva lista de filas y grupos
    const filasAMostrar = sincronizarFilas(listaFilasActualizada);
    setTotalItems(filasAMostrar.totalItems);
    setListFilas(filasAMostrar.listaFilasAMostrar);
    setListGrupos(filasAMostrar.listaGrupos);
    registrarDatos(
      filasAMostrar,
      "colocarCodigo",
      JSON.parse(seccionString).datosSeccion.numeroSeccion
    );
  }

  useEffect(() => {
    setTimeout(() => {
      console.log(
        "tablaRef",
        JSON.parse(seccionString).datosSeccion.numeroSeccion,
        tablaRef.current.clientHeight
      );
      registrarAlturaSeccion(
        JSON.parse(seccionString).datosSeccion.numeroSeccion,
        tablaRef.current.clientHeight
      );
    }, 0);
  }, [JSON.parse(seccionString).datosSeccion.numeroSeccion]);

  return (
    <div style={{ height: "90%", width: "100%" }}>
      <StyledDataGrid
        //rows={listFilasAMostrar}  //Para cuando se quiera mostrar una lista de filas distinta a la que se usa para procesarlas
        rows={listFilas.filter((fila) => {
          return !fila.filaEscondida;
        })}
        columns={columnsTablaCotizacion}
        sx={{ my: 3 }}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              fabricante: false,
              grupo: false,
              iva: false,
            },
          },
        }}
        apiRef={apiRef}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          //console.log(newRowSelectionModel);
          handleSeleccionFilas(newRowSelectionModel);
        }}
        rowSelectionModel={listFilasSeleccionada}
        getRowClassName={(params) => {
          return params.row.filaResaltada ? "filaResaltada" : "";
        }}
        onCellDoubleClick={handleDoubleClickCelda}
        onCellEditStop={(params, event) => {
          // Si NO es la columna "descripcion", permite salir con Enter (no prevengas nada)
          if (params.field !== "descripcion") {
            return;
          }
          // Si es la columna "descripcion" y la razón es Enter, previene salir de edición
          if (params.reason === GridCellEditStopReasons.enterKeyDown) {
            if (isKeyboardEvent(event) && !event.ctrlKey && !event.metaKey) {
              event.defaultMuiPrevented = true;
            }
          }
        }}
        /*onCellEditStop={(params, event) => {
          //console.log(params);
          if (params.reason !== GridCellEditStopReasons.enterKeyDown) {
            return;
          }
          if (isKeyboardEvent(event) && !event.ctrlKey && !event.metaKey) {
            event.defaultMuiPrevented = true;
          }
        }}*/
        slots={{
          toolbar: CustomToolbarTablaCotizacion,
          footer: CustomFooterTablaCotizacion,
        }}
        slotProps={{
          toolbar: {
            titulo: JSON.parse(seccionString).datosSeccion.tituloSeccion,
            listFilas,
            listGrupos,
            totalItems,
            sincronizarFilas,
            setTotalItems,
            setListFilas,
            setListGrupos,
            registrarDatos,
            seccion: JSON.parse(seccionString),
            setOpenConfirmacion,
            apiRef,
            setListFilasSeleccionada,
            incluirSeccion,
            setIncluirSeccion,
            filasCopiadas,
          },
          footer: { listFilas: JSON.stringify(listFilas) },
        }}
        ref={tablaRef}
      />
      {openVentanaCodigos ? (
        <VentanaCodigos
          openVentanaCodigos={openVentanaCodigos}
          setOpenVentanaCodigos={setOpenVentanaCodigos}
          idFabricante={idFabricante}
          colocarCodigo={colocarCodigo}
        />
      ) : null}
      <VentanaConfirmacion
        openConfirmacion={openConfirmacion.open}
        titulo={openConfirmacion.titulo}
        contenido={openConfirmacion.contenido}
        //ejecutarConfirmacion={confimarAccion}
        //accion={openConfirmacion.accion}
        onAceptar={openConfirmacion.onAceptar}
        onCancelar={openConfirmacion.onCancelar}
      ></VentanaConfirmacion>
    </div>
  );
});
//};

export default TablaCotizacion;
