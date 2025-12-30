import {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  memo,
  useRef,
} from "react";
import { GridToolbarContainer } from "@mui/x-data-grid";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import HighlightIcon from "@mui/icons-material/Highlight";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import SwipeUpAltIcon from "@mui/icons-material/SwipeUpAlt";
import SwipeDownAltIcon from "@mui/icons-material/SwipeDownAlt";
import PanToolIcon from "@mui/icons-material/PanTool";
import DoNotTouchIcon from "@mui/icons-material/DoNotTouch";
import KeyboardOptionKeyIcon from "@mui/icons-material/KeyboardOptionKey";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import * as constantes from "../../../../config/constantes.js";

const CustomToolbarTablaCotizacion = memo(
  function CustomToolbarTablaCotizacion({
    titulo,
    listFilas,
    listGrupos,
    totalItems,
    sincronizarFilas,
    setTotalItems,
    setListFilas,
    setListGrupos,
    registrarDatos,
    seccion,
    setOpenConfirmacion,
    apiRef,
    setListFilasSeleccionada,
    incluirSeccion,
    setIncluirSeccion,
    filasCopiadas,
  }) {
    console.log("funcion CustomToolbarTablaCotizacion", titulo);

    const [tituloSeccion, setTituloSeccion] = useState("");

    /**
     * Handles the change event for the section title input.
     * Updates the local state with the new title and registers the updated data.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input field.
     */
    function handleChangeTitulo(event) {
      console.log("funcion handleChangeTitulo", event.target.value);
      setTituloSeccion(event.target.value);
      registrarDatos(
        seccion.datosSeccion.numeroSeccion,
        "tituloSeccion",
        event.target.value
      );
    }

    /**
     * Handles the addition of a new item row to the list.
     * - Logs the action to the console.
     * - Creates a new item object with default values and appends it to the current list.
     * - Updates the total number of items and the list of rows in the state.
     * - Calls `registrarDatos` to register the updated list.
     *
     * @function
     */
    function handleAdicionarItem() {
      console.log("funcion handleAdicionarItem");

      //Se añade la fila
      const listaItems = [
        ...listFilas,
        {
          id: listFilas.length + 1,
          item: totalItems + 1,
          fabricante: 0,
          grupo: 0,
          codigoItem: "",
          descripcion: "",
          cantidad: 0,
          precioListaUnitario: 0,
          descuentoFabricante: 0,
          importacion: 0,
          margen: 0,
          descuentoFinal: 0, //WARNING hay que colocar el descuentofinal con el valor vigente
          iva: 0, //WARNING hay que colocar el valor del iva con la distribcuion de iva vigente
          precioVentaTotal: 0,
          filaResaltada: false,
          filaEscondida: false,
          filaSinPrecio: false,
          filaSubtitulo: false,
          formula: "",
          formulaPrecioTotal: 0,
          status: 1,
        },
      ];

      const filasAMostrar = sincronizarFilas(listaItems);
      //console.log(filasAMostrar);
      setTotalItems(filasAMostrar.totalItems + 1);
      setListFilas(filasAMostrar.listaFilasAMostrar);
      setListGrupos(filasAMostrar.listaGrupos);
      registrarDatos(
        filasAMostrar,
        "adicionarItem",
        seccion.datosSeccion.numeroSeccion
      );
    }

    //WARNING Se puede eliminar mucho del codigo llamando a sincronizarFilas
    /**
     * Handles the removal of selected items from the table.
     *
     * This function prompts the user for confirmation before proceeding with the removal
     * of selected items. If confirmed, it deselects the selected rows, updates the list
     * of rows and groups, and synchronizes the state with the updated data.
     *
     * The removal process handles three cases:
     * 1. If the selected row is an aggregator, it removes the row and its associated group.
     * 2. If the selected row is part of a group, it removes the row, updates the group,
     *    and deletes the group if it becomes empty.
     * 3. If the selected row is an individual item, it simply removes the row.
     *
     * After the removal, the function updates the total items, the list of rows to display,
     * and the list of groups.
     *
     * @function handleRemoverItem
     * @returns {void}
     */
    function handleRemoverItem() {
      console.log("funcion handleRemoverItem");

      //Antes de remover un item, debe solitarse confirmacion
      setOpenConfirmacion({
        open: true,
        titulo: "Eliminar ítem",
        contenido:
          "¿Está seguro de que desea eliminar los ítems seleccionados?",
        accion: "eliminar",
        onAceptar: () => {
          console.log("Confirmación aceptada para eliminar ítems");
          setOpenConfirmacion({ open: false });

          // Continuar con la eliminación de ítems
          const filasSeleccionadas = apiRef.current.getSelectedRows();
          const filasAEliminar = [];
          for (let fila of filasSeleccionadas.values()) {
            filasAEliminar.push(fila);
          }

          // Deseleccionar lo seleccionado
          filasAEliminar.map((fila) => {
            apiRef.current.selectRow(fila.id, false, true);
          });

          // Obtener una copia de la lista actual de filas y grupos
          const listaGrupos = [...listGrupos];
          const listaFilas = [...listFilas];

          // Iniciar la eliminación de las filas seleccionadas
          filasAEliminar.forEach((fila) => {
            if (fila.grupo > 1000) {
              const numeroGrupo = fila.grupo - 1000;
              listaFilas.forEach((fila) => {
                if (fila.grupo === numeroGrupo) {
                  fila.grupo = 0;
                }
              });
              const listaGruposFiltrada = listaGrupos.filter(
                (grupo) => grupo.id !== numeroGrupo
              );
              listaFilas.splice(
                listaFilas.findIndex((item) => item.id === fila.id),
                1
              );
            } else if (fila.grupo < 1000 && fila.grupo > 0) {
              const numeroGrupo = fila.grupo;
              listaFilas.splice(
                listaFilas.findIndex((item) => item.id === fila.id),
                1
              );
              //Se obtiene la lista de grupos que ya existia, quitando al grupo la fila que se esta eliminado
              const listaGruposFiltrada = listaGrupos.map((grupo) => {
                if (grupo.id === numeroGrupo) {
                  grupo.filas = grupo.filas.filter(
                    (item) => item.id !== fila.id
                  );
                }
                return grupo;
              });
              //console.log(listaGruposFiltrada);

              //Si al remover el componente del grupo, el grupo se queda sin componentes, se remueven el grupo de la lista de grupos y se remueve tambien la fila del grupo de la lista de filas
              if (
                listaGruposFiltrada.find((grupo) => grupo.id === numeroGrupo)
                  .filas.length === 0
              ) {
                listaGruposFiltrada.splice(
                  listaGruposFiltrada.findIndex(
                    (grupo) => grupo.id === numeroGrupo
                  ),
                  1
                );
                listaFilas.splice(
                  listaFilas.findIndex(
                    (item) => item.grupo === numeroGrupo + 1000
                  ),
                  1
                );
              }
            } else if (fila.grupo === 0) {
              listaFilas.splice(
                listaFilas.findIndex((item) => item.id === fila.id),
                1
              );
            }
          });

          // Sincronizar la nueva lista de filas y grupos
          const filasAMostrar = sincronizarFilas(listaFilas);
          //console.log(filasAMostrar);
          setTotalItems(filasAMostrar.totalItems);
          setListFilas(filasAMostrar.listaFilasAMostrar);
          setListGrupos(filasAMostrar.listaGrupos);
          setListFilasSeleccionada([]);
          registrarDatos(
            filasAMostrar,
            "removerItem",
            seccion.datosSeccion.numeroSeccion
          );
        },
        onCancelar: () => {
          console.log("Confirmación cancelada para eliminar ítems");
          setOpenConfirmacion({ open: false });
        },
      });
    }

    /**
     * Moves the selected rows one position up in the table, unless any selected row is already at the top.
     *
     * Steps:
     * 1. Retrieves the selected rows and their indices.
     * 2. Sorts the selected rows by their indices in ascending order.
     * 3. Iterates through the sorted indices and moves each row up by one position,
     *    stopping if a row is already at the top.
     * 4. Updates the state with the new row order and synchronizes related data.
     * 5. Clears the selection and logs the action.
     *
     * Side Effects:
     * - Updates the state: totalItems, listFilas, listGrupos, listFilasSeleccionada.
     * - Calls registrarDatos to log the action.
     *
     * @returns {void}
     */
    function handleMoverItemArriba() {
      console.log("funcion handleMoverItemArriba");

      //Desplazar las filas seleccionadas hacia arriba
      //Una vez que una de las filas seleccionadas se encuentre en la parte superior de la tabla, las filas seleccionadas ya no pueden seguir subiendo
      // 1. Obtener las filas seleccionadas y sus índices
      const filasSeleccionadas = apiRef.current.getSelectedRows();
      const filasAMover = [];
      const idsSeleccionadosAntes = [];

      for (let fila of filasSeleccionadas.values()) {
        filasAMover.push(fila);
        idsSeleccionadosAntes.push(fila.id);
      }
      console.log(idsSeleccionadosAntes);

      // 2. Obtener los índices de las filas seleccionadas
      const indicesFilas = filasAMover.map((filaAMover) => {
        let indiceFila = 0;
        listFilas.forEach((fila, indice) => {
          if (fila.id === filaAMover.id) {
            indiceFila = indice;
          }
        });
        return {
          id: filaAMover.id,
          indice: indiceFila,
        };
      });

      // 3. Ordenar los índices de menor a mayor
      indicesFilas.sort((a, b) => a.indice - b.indice);

      const listaFilas = [...listFilas];

      // 4. Mover las filas hacia arriba
      let llegoHastaArriba = false;
      indicesFilas.forEach((fila) => {
        if (!llegoHastaArriba) {
          if (fila.indice > 0) {
            listaFilas.splice(
              fila.indice - 1,
              0,
              listaFilas.splice(fila.indice, 1)[0]
            );
            //idsSeleccionados[]
          } else {
            llegoHastaArriba = true;
          }
        }
      });

      // 5. Actualizar el estado con la nueva lista de filas
      const filasOrdenadas = sincronizarFilas(listaFilas);
      console.log(filasOrdenadas);
      setTotalItems(filasOrdenadas.totalItems);
      setListFilas(filasOrdenadas.listaFilasAMostrar);
      setListGrupos(filasOrdenadas.listaGrupos);

      // 6. Seleccionar las nuevas filas
      let idsSeleccionadosDespues = [];
      idsSeleccionadosAntes.sort((a, b) => a.indice - b.indice);
      for (let i = 0; i < idsSeleccionadosAntes.length; i++) {
        const id = idsSeleccionadosAntes[i];
        if (id > 1) {
          idsSeleccionadosDespues.push(id - 1);
        } else {
          idsSeleccionadosDespues = [...idsSeleccionadosAntes];
          break;
        }
      }

      console.log("idsSeleccionadosDespues", idsSeleccionadosDespues);

      setListFilasSeleccionada(idsSeleccionadosDespues);
      //setListFilasSeleccionada([]);
      registrarDatos(
        filasOrdenadas,
        "moverFilaArriba",
        seccion.datosSeccion.numeroSeccion
      );
    }

    /**
     * Moves the selected rows one position down in the list.
     *
     * This function:
     * 1. Retrieves the currently selected rows from the grid.
     * 2. Determines the indices of the selected rows in the list.
     * 3. Sorts the selected rows by descending ID to avoid index shifting issues.
     * 4. Moves each selected row down by one position, unless it is already at the bottom.
     * 5. Updates the state with the new list order and synchronizes related data.
     * 6. Registers the action for tracking or undo purposes.
     *
     * Side effects:
     * - Updates the state: `setTotalItems`, `setListFilas`, `setListGrupos`, `setListFilasSeleccionada`.
     * - Calls `registrarDatos` to log the move operation.
     *
     * @returns {void}
     */
    function handleMoverItemAbajo() {
      console.log("funcion handleMoverItemAbajo");

      //1. Se obtiene el array de las filas seleccionadas y se crea el array de las filas a mover
      const filasSeleccionadas = apiRef.current.getSelectedRows();
      const filasAMover = [];
      const idsSeleccionadosAntes = [];
      for (let fila of filasSeleccionadas.values()) {
        filasAMover.push(fila);
        idsSeleccionadosAntes.push(fila.id);
      }

      //2. Se obtiene el array de los indices de cada fila que se tiene que mover
      const indicesFilas = filasAMover.map((filaAMover) => {
        let indiceFila = 0;
        listFilas.forEach((fila, indice) => {
          if (fila.id === filaAMover.id) {
            indiceFila = indice;
          }
        });
        return {
          id: filaAMover.id,
          indice: indiceFila,
        };
      });

      //3. Se ordena la lista de indices de mayor id a menor id
      indicesFilas.sort((a, b) => b.id - a.id);
      console.log(indicesFilas);

      //4. Se elimina la fila a mover y la coloca en la nueva posición. Solo puede bajar hasta que el indice sea igual a la longitud de la lista menos uno
      //Se usa el boolean llegoHastaAbajo para ya no seguir bajando
      const listaFilas = [...listFilas];
      let llegoHastaAbajo = false;
      indicesFilas.forEach((fila) => {
        if (!llegoHastaAbajo) {
          if (fila.indice + 1 <= listFilas.length - 1) {
            listaFilas.splice(
              fila.indice + 1,
              0,
              listaFilas.splice(fila.indice, 1)[0]
            );
          } else {
            llegoHastaAbajo = true;
          }
        }
      });

      // 5. Actualizar el estado con la nueva lista de filas
      const filasOrdenadas = sincronizarFilas(listaFilas);
      console.log(filasOrdenadas);
      setTotalItems(filasOrdenadas.totalItems);
      setListFilas(filasOrdenadas.listaFilasAMostrar);
      setListGrupos(filasOrdenadas.listaGrupos);

      // 6. Seleccionar las nuevas filas
      let idsSeleccionadosDespues = [];
      idsSeleccionadosAntes.sort((a, b) => b.id - a.id);
      console.log("idabajo", idsSeleccionadosAntes);
      for (let i = 0; i < idsSeleccionadosAntes.length; i++) {
        const id = idsSeleccionadosAntes[i];
        if (id < listFilas.length) {
          idsSeleccionadosDespues.push(id + 1);
        } else {
          idsSeleccionadosDespues = [...idsSeleccionadosAntes];
          break;
        }
      }
      console.log("idsSeleccionadosDespues", idsSeleccionadosDespues);

      setListFilasSeleccionada(idsSeleccionadosDespues);
      //setListFilasSeleccionada([]);
      registrarDatos(
        filasOrdenadas,
        "moverFilaAbajo",
        seccion.datosSeccion.numeroSeccion
      );
    }

    function handleDuplicarItem() {
      //Hacer una matriz con las filas seleccionadas
      //Insertar las filas seleccionadas a aprtir d ela ultima fila seleccionada
      const filasSeleccionadas = Array.from(
        apiRef.current.getSelectedRows().values()
      );
      if (filasSeleccionadas.length === 0) return;

      // Ordenar por posición en listFilas para mantener el orden visual
      const indicesSeleccionados = filasSeleccionadas
        .map((fila) => listFilas.findIndex((f) => f.id === fila.id))
        .sort((a, b) => a - b);

      const ultimaPosicion =
        indicesSeleccionados[indicesSeleccionados.length - 1];

      // Duplicar las filas seleccionadas
      const nuevasFilas = filasSeleccionadas.map((fila, idx) => ({
        ...fila,
        id: listFilas.length + idx + 1,
        item: totalItems + idx + 1,
      }));

      // Insertar las nuevas filas después de la última seleccionada
      const listaFilasActualizada = [
        ...listFilas.slice(0, ultimaPosicion + 1),
        ...nuevasFilas,
        ...listFilas.slice(ultimaPosicion + 1),
      ];

      const filasAMostrar = sincronizarFilas(listaFilasActualizada);
      setTotalItems(filasAMostrar.totalItems);
      setListFilas(filasAMostrar.listaFilasAMostrar);
      setListGrupos(filasAMostrar.listaGrupos);
      registrarDatos(
        filasAMostrar,
        "duplicarItem",
        seccion.datosSeccion.numeroSeccion
      );
    }

    function handleCopiarItem() {
      //Hacer una matriz con las filas seleccionadas
      //Si en las filas hay agrupadores, en la matriz de filas seleccionadas se incluiran los componentes del grupo asi no hayan sido seleccionados. En esta matriz no deben haber filas repetidas.
      //Los ids de las filas de la matriz de filas seleccionadas deben ser consecutivos inciando desde uno
      //Se debe usar la
      const filasSeleccionadas = Array.from(
        apiRef.current.getSelectedRows().values()
      );
      if (filasSeleccionadas.length === 0) return;

      // Obtener todos los ids de filas seleccionadas y, si hay agrupadores, incluir sus componentes
      let idsFilas = new Set();
      filasSeleccionadas.forEach((fila) => {
        if (fila.grupo > 1000) {
          // Es un agrupador, buscar sus componentes en listFilas
          const numeroGrupo = fila.grupo - 1000;
          listFilas.forEach((f) => {
            if (f.grupo === numeroGrupo) {
              idsFilas.add(f.id);
            }
          });
          idsFilas.add(fila.id);
        } else {
          idsFilas.add(fila.id);
        }
      });

      // Crear la matriz de filas seleccionadas, sin repetidos y en el orden de listFilas
      const matrizFilasSeleccionadas = listFilas.filter((fila) =>
        idsFilas.has(fila.id)
      );

      // Aquí puedes continuar con la lógica de copiar, por ejemplo, guardando en un estado o variable temporal
      console.log("Filas seleccionadas:", matrizFilasSeleccionadas);

      const listaFilasACopiar = sincronizarFilas(
        matrizFilasSeleccionadas
      ).listaFilasAMostrar;
      console.log("Filas copiadas:", listaFilasACopiar);
      registrarDatos(listaFilasACopiar, "copiarItems");
    }

    function handlePegarItem() {
      console.log("filas a pegar", filasCopiadas);
      //Adicionar las filas copiadas a la seccion
      //Si hay alguna fila seleccionada, adiconarlas despues de la fila seleccionada con mayor id
      //Si no hay filas seleccionadas, adicionarlas al final de la seccion
      if (!filasCopiadas || filasCopiadas.length === 0) return;

      // Obtener las filas seleccionadas actualmente
      const filasSeleccionadas = Array.from(
        apiRef.current.getSelectedRows().values()
      );

      // Determinar el índice de inserción
      let indiceInsercion;
      if (filasSeleccionadas.length > 0) {
        // Buscar el índice de la fila seleccionada con mayor id en listFilas
        const idsSeleccionados = filasSeleccionadas.map((f) => f.id);
        const indicesSeleccionados = idsSeleccionados
          .map((id) => listFilas.findIndex((fila) => fila.id === id))
          .filter((idx) => idx !== -1);
        indiceInsercion = Math.max(...indicesSeleccionados) + 1;
      } else {
        indiceInsercion = listFilas.length;
      }

      // Ajustar los ids y items de las filas copiadas para que sean únicos y consecutivos
      const maxId = listFilas.reduce((max, fila) => Math.max(max, fila.id), 0);
      const maxItem = listFilas.reduce(
        (max, fila) => Math.max(max, fila.item),
        0
      );

      const nuevasFilas = filasCopiadas.map((fila, idx) => ({
        ...fila,
        id: maxId + idx + 1,
        item: maxItem + idx + 1,
      }));

      // Insertar las nuevas filas en la posición calculada
      const listaFilasActualizada = [
        ...listFilas.slice(0, indiceInsercion),
        ...nuevasFilas,
        ...listFilas.slice(indiceInsercion),
      ];

      const filasAMostrar = sincronizarFilas(listaFilasActualizada);
      setTotalItems(filasAMostrar.totalItems);
      setListFilas(filasAMostrar.listaFilasAMostrar);
      setListGrupos(filasAMostrar.listaGrupos);
      registrarDatos(
        filasAMostrar,
        "pegarItem",
        seccion.datosSeccion.numeroSeccion
      );
    }

    function handleCortarItem() {}

    /**
     * Handles the logic for grouping or editing groups of selected rows in the table.
     *
     * This function performs several validations to determine whether the selected rows
     * can be grouped into a new group, edited as an existing group, or if the operation
     * should be blocked. It uses the `VentanaConfirmacion` component to display
     * confirmation dialogs and error messages to the user.
     *
     * Grouping/editing rules:
     * - No action if no rows are selected.
     * - A new group can only be created from individual rows (not already grouped).
     * - Only one group can be edited at a time.
     * - Editing a group is allowed if only one group aggregator and its components or individual rows are selected.
     * - Cannot edit a group if rows from other groups are selected.
     *
     * @function
     * @returns {void}
     */
    function handleAgruparItems() {
      console.log("funcion handleValidarAgruparItems");

      //Esta función valida si se puede crear un grupo nuevo o editar un grupo ya creado
      //Si no hay ninguna fila seleccionada no se puede crear ni editar ningun grupo
      //Un grupo nuevo se puede crear solo con filas individuales (que no pertenezcan a ningun otro grupo)
      //Un agrupador es una fila que tiene un numero de grupo mayor a 1000
      //Un grupo ya creado se puede editar si se selecciona su agrupador, filas seleccionadas que componen el mismo grupo seleccionado o filas individuales seleccionadas. No pueden haber filas seleccionadas de otro grupo
      //Solo se puede editar un grupo a la vez
      //Se usará el componente VentanaConfirmacion para mostrar el mensaje de advertencia y solicitar confirmación de agrupar o editar el grupo

      // Obtener las filas seleccionadas
      const filasSeleccionadas = Array.from(
        apiRef.current.getSelectedRows().values()
      );
      console.log("Filas seleccionadas:", filasSeleccionadas);

      // Filtrar filas individuales, agrupadores y componentes de otros grupos
      const filasIndividuales = filasSeleccionadas.filter(
        (fila) => fila.grupo === 0
      );
      const agrupadoresSeleccionados = filasSeleccionadas.filter(
        (fila) => fila.grupo > 1000
      );
      const componentesDeOtrosGrupos =
        agrupadoresSeleccionados.length === 1
          ? filasSeleccionadas.filter(
              (fila) =>
                fila.grupo > 0 &&
                fila.grupo < 1000 &&
                fila.grupo !== agrupadoresSeleccionados[0].grupo - 1000
            )
          : filasSeleccionadas.filter(
              (fila) => fila.grupo > 0 && fila.grupo < 1000
            );

      console.log("Filas individuales:", filasIndividuales);
      console.log("Agrupadores seleccionados:", agrupadoresSeleccionados);
      console.log("Componentes de otros grupos:", componentesDeOtrosGrupos);

      // Validaciones
      //No se puede crear un grupo si no hay filas seleccionadas
      if (filasSeleccionadas.length === 0) {
        setOpenConfirmacion({
          open: true,
          titulo: "Agrupar items",
          contenido:
            "No hay filas seleccionadas. Seleccione al menos una fila para agrupar o editar.",
          onCancelar: () => {
            console.log(
              "Confirmación cancelada porque no hay filas seleccionadas"
            );
            setOpenConfirmacion({ open: false });
          },
        });
        return;
      }

      //No se puede editar mas de un grupo
      if (agrupadoresSeleccionados.length > 1) {
        setOpenConfirmacion({
          open: true,
          titulo: "Editar grupo",
          contenido:
            "Solo se puede editar un grupo a la vez. Seleccione un único agrupador.",
          onCancelar: () => {
            setOpenConfirmacion({ open: false });
          },
        });
        return;
      }

      //Se puede crear un grupo si no hay otro grupo, ni componentes de otro grupo seleccionados
      if (
        agrupadoresSeleccionados.length === 0 &&
        filasIndividuales.length > 0 &&
        componentesDeOtrosGrupos.length === 0
      ) {
        setOpenConfirmacion({
          open: true,
          titulo: "Agrupar items",
          contenido:
            "¿Está seguro de que desea agrupar las filas seleccionadas?",
          onAceptar: () => {
            setOpenConfirmacion({ open: false });
            agruparItems();
          },
          onCancelar: () => {
            setOpenConfirmacion({ open: false });
          },
          //onCancelar: setOpenConfirmacion({ open: false }),
        });
        return;
      }

      //Se puede editar un grupo si solo esta seleccionado uno y ningun componente de otro
      if (
        agrupadoresSeleccionados.length === 1 &&
        componentesDeOtrosGrupos.length === 0 &&
        (filasIndividuales.length > 0 ||
          filasSeleccionadas.some(
            (fila) => fila.grupo === agrupadoresSeleccionados[0].grupo - 1000
          ))
      ) {
        setOpenConfirmacion({
          open: true,
          titulo: "Editar grupo",
          contenido: "¿Está seguro de que desea editar el grupo seleccionado?",
          onAceptar: () => {
            setOpenConfirmacion({ open: false });
            editarGrupoItems();
          },
          onCancelar: () => {
            console.log("Confirmación cancelada para eliminar ítems");
            setOpenConfirmacion({ open: false });
          },
        });
        return;
      }

      //No se puede editar un grupo si hay componentes de otro
      if (
        agrupadoresSeleccionados.length === 1 &&
        componentesDeOtrosGrupos.length > 0
      ) {
        setOpenConfirmacion({
          open: true,
          titulo: "Editar grupo",
          contenido:
            "No se puede editar el grupo seleccionado porque hay filas de otros grupos seleccionadas.",
          onCancelar: () => {
            console.log("Confirmación cancelada para editar grupos");
            setOpenConfirmacion({ open: false });
          },
        });
        return;
      }

      // Caso por defecto: no se puede agrupar ni editar
      setOpenConfirmacion({
        open: true,
        titulo: "Agrupar items",
        contenido: "No se puede agrupar ni editar con la selección actual.",
        onCancelar: () => {
          console.log("Confirmación cancelada para agrupar o editar ítems");
          setOpenConfirmacion({ open: false });
        },
      });
    }

    /**
     * Groups selected rows into a new group within the quotation table.
     *
     * Steps performed:
     * 1. Retrieves the selected rows and creates an array of group components.
     * 2. Deselects the selected rows.
     * 3. Determines the new group's item number (the smallest item number among selected components).
     * 4. Finds the index in the row list where the new group aggregator should be inserted.
     * 5. Assigns a new group number (one more than the current number of groups).
     * 6. Inserts a new aggregator row for the group at the determined index.
     * 7. Updates the group number for each component in the group.
     * 8. Synchronizes the updated rows and groups, updates state, and registers the changes.
     *
     * @function
     * @returns {void}
     */
    function agruparItems() {
      console.log("funcion agruparItems");
      //console.log(apiRef.current.getSelectedRows());

      //Los grupos y sus componentes no dependen de los indices que ocupen en la lista de filas, pero si el id. El id no debe cambiar una vez asignado
      //1. Se obtiene el array de las filas seleccionadas y se crea el array de componentes del grupo
      //2. Se deselecciona lo seleccionado
      //3. Se identifica el numero del nuevo grupo. Será el menor numero de item de los componentes del grupo. El agrupador tendrá este numero de item
      //4. Dentro del array de filas actual, se identifica el indice de la fila que corresponde con el menor numero de item encontrado antes. En esta fila se insertará el agrupador
      //5. El numero de grupo nuevo es igual a la longitud del array de grupos mas uno
      //6. Se inserta en la lista de filas el agregador del nuevo grupo
      //7. Se arma la nueva lista de grupos (id, filas que lo componen y valor de venta)
      //8. Se sincroniza la nueva lista de filas y grupos

      //1. Se obtiene el array de las filas seleccionadas y se crea el array de componentes del grupo
      const filasSeleccionadas = apiRef.current.getSelectedRows();
      const filasComponentes = [];
      for (let fila of filasSeleccionadas.values()) {
        filasComponentes.push(fila);
      }

      //2. Se deselecciona lo seleccionado
      filasComponentes.map((fila) => {
        apiRef.current.selectRow(fila.id, false, true);
      });
      //console.log(filasComponentes);

      //3. Se identifica el numero del nuevo grupo. Será el menor numero de item de los componentes del grupo. El agrupador tendrá este numero de item
      let numeroItemGrupo = filasComponentes[0].item;
      filasComponentes.forEach((fila, indice) => {
        if (Number(fila.item) < numeroItemGrupo) {
          numeroItemGrupo = fila.item;
        }
      });

      //4. Dentro del array de filas actual, se identifica el indice de la fila que corresponde con el menor numero de item encontrado antes. En esta fila se insertará el agrupador
      let indiceItemGrupo = 0;
      listFilas.forEach((fila, indice) => {
        if (fila.item === numeroItemGrupo) {
          indiceItemGrupo = indice;
        }
      });

      //console.log(numeroItemGrupo, indiceItemGrupo);

      //5. El numero de grupo nuevo es igual a la longitud del array de grupos mas uno
      const numeroGrupo = listGrupos.length + 1;
      //console.log(numeroGrupo);

      //6. Se inserta en la lista de filas el agregador del nuevo grupo
      const listaFilas = [...listFilas];
      listaFilas.splice(indiceItemGrupo, 0, {
        id: listFilas.length + 1,
        item: numeroItemGrupo,
        fabricante: 0,
        grupo: numeroGrupo + 1000,
        codigoItem: "",
        descripcion: "",
        cantidad: 1,
        precioVentaTotal: 0,
        filaResaltada: false,
        filaEscondida: false,
        filaSinPrecio: false,
        filaSubtitulo: false,
        formula: "",
        formulaPrecioTotal: 0,
        status: 1,
      });
      //console.log(listaFilas);

      //7. Se modifica el numero de grupo de cada componente con el del numero de grupo que le corresponde
      listaFilas.forEach((fila) => {
        filasComponentes.map((componente) => {
          if (componente.id === fila.id) {
            fila.grupo = numeroGrupo;
          }
        });
      });

      //8. Se sincroniza la nueva lista de filas y grupos
      const filasAMostrar = sincronizarFilas(listaFilas);
      setTotalItems(filasAMostrar.totalItems);
      setListFilas(filasAMostrar.listaFilasAMostrar);
      setListGrupos(filasAMostrar.listaGrupos);
      registrarDatos(
        filasAMostrar,
        "agruparItems",
        seccion.datosSeccion.numeroSeccion
      );
    }

    /**
     * Modifies the components of the selected group based on the currently selected rows.
     *
     * - Identifies the group aggregator and the new components from the selected rows.
     * - Updates the group assignment for each row:
     *   - Removes rows from the group if they are not selected.
     *   - Assigns selected rows to the group.
     * - Updates the group's list of components.
     * - Synchronizes the rows and groups, updates state, and logs the operation.
     *
     * Preconditions:
     * - At least one group aggregator and one or more components must be selected.
     *
     * Side Effects:
     * - Updates `listFilas`, `listGrupos`, `totalItems`, and selection state.
     * - Calls `registrarDatos` to log the operation.
     *
     * @returns {void}
     */
    function editarGrupoItems() {
      console.log("funcion editarGrupoItems");

      //Esta función permite modificar los componentes del grupo seleccionado
      //En las filas seleccionadas hay un agrupador y otras filas
      //Los nuevos componentes del grupo son las filas seleccionadas distintas al agrupador
      //Los componentes del grupo que no fueron seleccionados ya no perteneceran a ningun grupo
      //Una vez actualizada la lista de grupos se usa la funcion sincronizar para ordenar la lista de filas
      //Se actualizan los estados de listFilas, listGrupos y totalItems

      const filasSeleccionadas = Array.from(
        apiRef.current.getSelectedRows().values()
      );
      const agrupador = filasSeleccionadas.find((fila) => fila.grupo > 1000);
      const nuevosComponentes = filasSeleccionadas.filter(
        (fila) => fila.grupo <= 1000
      );

      if (!agrupador) {
        console.error("No se seleccionó un agrupador.");
        return;
      }

      // Crear una copia de la lista de filas y grupos
      const listaFilas = [...listFilas];
      const listaGrupos = [...listGrupos];

      // Actualizar los componentes del grupo
      listaFilas.forEach((fila) => {
        if (fila.grupo === agrupador.grupo - 1000) {
          fila.grupo = 0; // Quitar componentes que no están seleccionados
        }
        nuevosComponentes.forEach((componente) => {
          if (componente.id === fila.id) {
            fila.grupo = agrupador.grupo - 1000; // Asignar al grupo seleccionado
          }
        });
      });

      // Actualizar la lista de grupos
      const grupoActualizado = listaGrupos.find(
        (grupo) => grupo.id === agrupador.grupo - 1000
      );
      if (grupoActualizado) {
        grupoActualizado.filas = listaFilas.filter(
          (fila) => fila.grupo === grupoActualizado.id
        );
      }

      // Sincronizar las filas y grupos
      const filasAMostrar = sincronizarFilas(listaFilas);
      setTotalItems(filasAMostrar.totalItems);
      setListFilas(filasAMostrar.listaFilasAMostrar);
      setListGrupos(filasAMostrar.listaGrupos);
      setListFilasSeleccionada([]); //Esta es otra manera de deseleccionar todos los items seleccionados
      registrarDatos(
        filasAMostrar,
        "editarGrupoItems",
        seccion.datosSeccion.numeroSeccion
      );
    }

    /**
     * Handles the highlighting (resaltar) of selected rows in the table.
     *
     * - Retrieves the currently selected rows from the table using the apiRef.
     * - Deselects all selected rows.
     * - Toggles the `filaResaltada` property for each selected row in the `listFilas` state.
     *   - If a row is already highlighted, it will be un-highlighted, and vice versa.
     * - Updates the state with the new list of rows.
     * - Calls `registrarDatos` to register the action for the current section.
     */
    function handleResaltarFilas() {
      //Se obtienen las filas seleccionadas
      //Se deseleccionan las filas seleccionadas
      //En el estado listFilas la propiedad filaResaltada indica si la fila está resaltada
      //Si las filas seleccionadas no están resaltadas, hay que resaltarlas
      //Si las filas seleccionadas están resaltadas, hay que hacer que no se resalten
      const filasSeleccionadas = Array.from(
        apiRef.current.getSelectedRows().values()
      );
      console.log(filasSeleccionadas);

      // Deseleccionar las filas seleccionadas
      filasSeleccionadas.map((fila) => {
        console.log(fila.id);
        apiRef.current.selectRow(fila.id, false, true); //Con el tercer parametro en true, la seleccion de filas es vacia
      });

      // Actualizar el estado de las filas resaltadas
      const listaFilasActualizada = listFilas.map((fila) => {
        if (
          filasSeleccionadas.some((seleccionada) => seleccionada.id === fila.id)
        ) {
          return { ...fila, filaResaltada: !fila.filaResaltada };
        }
        return fila;
      });
      console.log(listaFilasActualizada);

      setListFilas(listaFilasActualizada);
      registrarDatos(
        listaFilasActualizada,
        "resaltarFila",
        seccion.datosSeccion.numeroSeccion
      );
    }

    /**
     * Handles the action of showing all hidden rows in the table.
     * Sets the `filaEscondida` property of each row in `listFilas` to `false`,
     * updates the state with the new list, and registers the action.
     *
     * @function
     * @returns {void}
     */
    function handleMostrarFila() {
      console.log("funcion handleMostrarFila", listFilas, listGrupos);

      //Esta funcion mostrará las filas ocultas
      //Se coloca en false el campo filaEscondida del estado listFilas
      const listaFilasActualizada = listFilas.map((fila) => {
        return { ...fila, filaEscondida: false };
      });

      setListFilas(listaFilasActualizada);
      registrarDatos(
        listaFilasActualizada,
        "mostrarFila",
        seccion.datosSeccion.numeroSeccion
      );
    }

    /**
     * Oculta las filas seleccionadas en la tabla estableciendo su campo `filaEscondida` en `true`.
     * Luego, deselecciona dichas filas y actualiza el estado de la lista de filas.
     * Finalmente, registra la acción realizada.
     *
     * @function
     * @returns {void}
     */
    function handleOcultarFila() {
      console.log("funcion handleOcultarFila");

      //Esta funcion no mostrará las filas seleccionadas
      //El campo filaEscondida del estado listFilas se colocará en true para las filas seleccionadas
      //Luego se deseleccionarán las filas seleccionadas
      // Obtener las filas seleccionadas
      const filasSeleccionadas = Array.from(
        apiRef.current.getSelectedRows().values()
      );

      // Actualizar el estado de las filas seleccionadas para que estén escondidas
      const listaFilasActualizada = listFilas.map((fila) => {
        if (
          filasSeleccionadas.some((seleccionada) => seleccionada.id === fila.id)
        ) {
          return { ...fila, filaEscondida: true };
        }
        return fila;
      });
      console.log(listaFilasActualizada);

      // Deseleccionar las filas seleccionadas
      filasSeleccionadas.forEach((fila) => {
        apiRef.current.selectRow(fila.id, false, true);
      });

      // Actualizar el estado con la nueva lista de filas
      setListFilas(listaFilasActualizada);
      registrarDatos(
        listaFilasActualizada,
        "esconderFila",
        seccion.datosSeccion.numeroSeccion
      );
    }

    /**
     * Toggles the `filaSubtitulo` property for each selected row in the list of rows (`listFilas`).
     *
     * This function:
     * 1. Retrieves the currently selected rows from the data grid using `apiRef`.
     * 2. Updates the `filaSubtitulo` property for each selected row by toggling its value.
     * 3. Deselects all previously selected rows in the data grid.
     * 4. Updates the state with the modified list of rows.
     * 5. Calls `registrarDatos` to persist the updated data.
     *
     * @function
     * @returns {void}
     */
    function handleSubtituloFilas() {
      console.log("funcion handleSubtituloFilas");

      const filasSeleccionadas = Array.from(
        apiRef.current.getSelectedRows().values()
      );

      // Actualizar el estado de las filas seleccionadas para que estén escondidas
      const listaFilasActualizada = listFilas.map((fila) => {
        if (
          filasSeleccionadas.some((seleccionada) => seleccionada.id === fila.id)
        ) {
          return { ...fila, filaSubtitulo: !fila.filaSubtitulo };
        }
        return fila;
      });
      console.log(listaFilasActualizada);

      // Deseleccionar las filas seleccionadas
      filasSeleccionadas.forEach((fila) => {
        apiRef.current.selectRow(fila.id, false, true);
      });

      // Actualizar el estado con la nueva lista de filas
      setListFilas(listaFilasActualizada);
      registrarDatos(
        listaFilasActualizada,
        "subtituloFila",
        seccion.datosSeccion.numeroSeccion
      );
    }

    /**
     * Handles toggling the 'filaSinPrecio' property for the selected rows in the table.
     *
     * This function:
     * 1. Retrieves the currently selected rows from the table using the apiRef.
     * 2. Toggles the 'filaSinPrecio' property for each selected row in the listFilas state.
     * 3. Deselects the affected rows in the table UI.
     * 4. Updates the listFilas state with the modified rows.
     * 5. Calls registrarDatos to persist the changes.
     *
     * @function
     * @returns {void}
     */
    function handleSinPrecioFilas() {
      console.log("funcion handleSinPrecioFilas");

      const filasSeleccionadas = Array.from(
        apiRef.current.getSelectedRows().values()
      );

      // Actualizar el estado de las filas seleccionadas para que estén escondidas
      const listaFilasActualizada = listFilas.map((fila) => {
        if (
          filasSeleccionadas.some((seleccionada) => seleccionada.id === fila.id)
        ) {
          return { ...fila, filaSinPrecio: !fila.filaSinPrecio };
        }
        return fila;
      });
      console.log(listaFilasActualizada);

      // Deseleccionar las filas seleccionadas
      filasSeleccionadas.forEach((fila) => {
        apiRef.current.selectRow(fila.id, false, true);
      });

      // Actualizar el estado con la nueva lista de filas
      setListFilas(listaFilasActualizada);
      registrarDatos(
        listaFilasActualizada,
        "sinPrecioFila",
        seccion.datosSeccion.numeroSeccion
      );
    }

    function handleCodigoItem() {
      console.log("funcion handleCodigoItem");
    }

    /**
     * Handles moving the current section down in the list of sections.
     * Logs the action and calls the function to reorder sections, moving the current section down.
     *
     * @function
     * @returns {void}
     */
    function handleMoverSeccionAbajo() {
      console.log(
        "funcion handleMoverSeccionAbajo",
        seccion.datosSeccion.numeroSeccion,
        seccion
      );
      registrarDatos(
        seccion.datosSeccion.numeroSeccion,
        "ordenarSecciones",
        "abajo"
      );
      //ordenarSecciones(seccion.datosSeccion.numeroSeccion, "abajo");
    }

    /**
     * Handles moving the current section up in the order.
     * Logs the action and calls the ordenarSecciones function with the current section number and the direction "arriba".
     *
     * @function
     * @returns {void}
     */
    function handleMoverSeccionArriba() {
      console.log(
        "funcion handleMoverSeccionArriba",
        seccion.datosSeccion.numeroSeccion,
        seccion
      );
      registrarDatos(
        seccion.datosSeccion.numeroSeccion,
        "ordenarSecciones",
        "arriba"
      );
    }

    /**
     * Handles the deletion of a section by logging the action and invoking the eliminarSeccion function
     * with the current section's number.
     *
     * @function
     * @returns {void}
     */
    function handleEliminarSeccion() {
      console.log("funcion handleEliminarSeccion");
      registrarDatos(seccion.datosSeccion.numeroSeccion, "eliminarSeccion");
      //eliminarSeccion(seccion.datosSeccion.numeroSeccion);
    }

    /**
     * Handles the inclusion or exclusion of a section based on user interaction.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by the input change.
     * @param {boolean} opcion - Indicates whether the section should be included (true) or not (false).
     */
    function handleIncluirSeccion(event, value) {
      console.log("funcion handleIncluirSeccion", value);
      registrarDatos(
        seccion.datosSeccion.numeroSeccion,
        "inclusionSeccion",
        value
      );
      setIncluirSeccion(value);
    }

    function handleDuplicarSeccion(event, value) {
      console.log("funcion handleDuplicarSeccion", value);
      registrarDatos(seccion.datosSeccion.numeroSeccion, "duplicarSeccion");
    }

    useEffect(() => {
      setTituloSeccion(titulo);
    }, [titulo]);

    return (
      <GridToolbarContainer>
        <TextField
          name={"tituloSeccion"}
          label={"Título"}
          value={tituloSeccion}
          error={false}
          type={"text"}
          variant="standard"
          placeholder={"Título"}
          required={false}
          sx={{ flexGrow: 1 }}
          //inputProps={{ readOnly: readOnly }}
          //fullWidth
          onChange={handleChangeTitulo}
        />
        <Divider orientation="vertical" flexItem />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mx: 1 }}
        >
          <Typography
            variant="caption"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 0.5,
              letterSpacing: 1,
              lineHeight: 1,
              pb: 0,
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            Items
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Tooltip title="Adicionar un ítem">
              <IconButton>
                <AddIcon
                  color="primary"
                  onClick={handleAdicionarItem}
                ></AddIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar un ítem">
              <IconButton>
                <RemoveIcon
                  color="primary"
                  onClick={handleRemoverItem}
                ></RemoveIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Mover un ítem hacia arriba">
              <IconButton>
                <ArrowUpwardIcon
                  color="primary"
                  onClick={handleMoverItemArriba}
                ></ArrowUpwardIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Mover un ítem hacia abajo">
              <IconButton>
                <ArrowDownwardIcon
                  color="primary"
                  onClick={handleMoverItemAbajo}
                ></ArrowDownwardIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Duplicar los ítems">
              <IconButton>
                <SplitscreenIcon
                  color="primary"
                  onClick={handleDuplicarItem}
                ></SplitscreenIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Copiar los ítems">
              <IconButton>
                <ContentCopyIcon
                  color="primary"
                  onClick={handleCopiarItem}
                ></ContentCopyIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Pega los ítems copiados">
              <IconButton>
                <ContentPasteIcon
                  color="primary"
                  onClick={handlePegarItem}
                ></ContentPasteIcon>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mx: 1 }}
        >
          <Typography
            variant="caption"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 0.5,
              letterSpacing: 1,
              lineHeight: 1,
              pb: 0,
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            Formato
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Tooltip title="Ocultar Fila">
              <IconButton>
                <VisibilityOffIcon
                  color="primary"
                  onClick={handleOcultarFila}
                ></VisibilityOffIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Mostrar las filas ocultas">
              <IconButton>
                <VisibilityIcon
                  color="primary"
                  onClick={handleMostrarFila}
                ></VisibilityIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Subtitulo">
              <IconButton>
                <SubtitlesIcon
                  color="primary"
                  onClick={handleSubtituloFilas}
                ></SubtitlesIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Resaltar">
              <IconButton>
                <HighlightIcon
                  color="primary"
                  onClick={handleResaltarFilas}
                ></HighlightIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Sin precio">
              <IconButton>
                <MoneyOffIcon
                  color="primary"
                  onClick={handleSinPrecioFilas}
                ></MoneyOffIcon>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        {/*<Tooltip title="Seleccionar producto">
          <IconButton>
            <InventoryIcon
              color="primary"
              onClick={handleCodigoItem}
            ></InventoryIcon>
          </IconButton>
        </Tooltip>*/}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mx: 1 }}
        >
          <Typography
            variant="caption"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 0.5,
              letterSpacing: 1,
              lineHeight: 1,
              pb: 0,
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            Grupos
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Tooltip title="Agrupar items">
              <IconButton>
                <GroupWorkIcon
                  color="primary"
                  onClick={handleAgruparItems}
                ></GroupWorkIcon>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mx: 1 }}
        >
          <Typography
            variant="caption"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 0.5,
              letterSpacing: 1,
              lineHeight: 1,
              pb: 0,
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            Secciones
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Tooltip title="Eliminar sección">
              <IconButton>
                <PlaylistRemoveIcon
                  color="primary"
                  onClick={handleEliminarSeccion}
                ></PlaylistRemoveIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Mover sección hacia arriba">
              <IconButton>
                <SwipeUpAltIcon
                  color="primary"
                  onClick={handleMoverSeccionArriba}
                ></SwipeUpAltIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Mover sección hacia abajo">
              <IconButton>
                <SwipeDownAltIcon
                  color="primary"
                  onClick={handleMoverSeccionAbajo}
                ></SwipeDownAltIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Duplicar la sección">
              <IconButton>
                <SplitscreenIcon
                  color="primary"
                  onClick={handleDuplicarSeccion}
                ></SplitscreenIcon>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mx: 1 }}
        >
          <Typography
            variant="caption"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 0.5,
              letterSpacing: 1,
              lineHeight: 1,
              pb: 0,
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            Inclusión
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center">
            <ToggleButtonGroup
              size="small"
              value={incluirSeccion}
              exclusive
              onChange={handleIncluirSeccion}
              color="primary"
              //aria-label="text alignment"
            >
              <Tooltip title="Incluir la sección">
                <ToggleButton value={constantes.INCLUIR_SECCION}>
                  <PanToolIcon />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="No incluir la sección">
                <ToggleButton value={constantes.NO_INCLUIR_SECCION}>
                  <DoNotTouchIcon />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Incluir la sección como opcional">
                <ToggleButton value={constantes.SECCION_OPCIONAL}>
                  <KeyboardOptionKeyIcon />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </GridToolbarContainer>
    );
  }
);

export { CustomToolbarTablaCotizacion };
