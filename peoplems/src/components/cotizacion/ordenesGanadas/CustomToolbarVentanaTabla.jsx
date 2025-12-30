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
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";
import * as constantes from "../../../config/constantes.js";

export function CustomToolbarVentanaTabla({
  filas,
  registrarDatos,
  apiRef,
  setOpenConfirmacion,
  datos,
}) {
  const [espera, setEspera] = useState(false);
  const [filasTabla, setFilasTabla] = useState(filas);

  function handleAdicionarItem() {
    //Se añade la fila
    const listaOrdenes = [
      ...filas,
      {
        id: filas.length + 1,
        idOrdenRecibida: 0,
        idPropuesta: 0,
        numeroVersion: 0,
        numeroOrden: "",

        importeMonedaBase: 0,
        importeMonedaCambio: 0,
        idMonedaBase: datos.idMonedaBase,
        idMonedaCambio: datos.moneda,
        tipoCambio: Number(datos.tipoCambio),
        fechaRecibida: dayjs().format("YYYY-MM-DD"),
        fechaEntrega: dayjs().format("YYYY-MM-DD"),
        formaPago: "",
        garantia: "",
        notas: "",
        status: 1,
      },
    ];
    registrarDatos(listaOrdenes, "adicionarOrdenRecibida");
  }
  function handleRemoverItem() {
    //Antes de remover un item, debe solitarse confirmacion
    setOpenConfirmacion({
      open: true,
      titulo: "Eliminar orden",
      contenido:
        "¿Está seguro de que desea eliminar las ordenes seleccionadas?",
      accion: "eliminar",
      onAceptar: () => {
        console.log("Confirmación aceptada para eliminar ordenes recibidas");
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
        const listaOrdenes = [...filas];

        // Iniciar la eliminación de las filas seleccionadas
        filasAEliminar.forEach((fila) => {
          listaOrdenes.splice(
            listaOrdenes.findIndex((item) => item.id === fila.id),
            1
          );
        });

        registrarDatos(listaOrdenes, "eliminarOrdenRecibida");
      },
      onCancelar: () => {
        console.log("Confirmación cancelada para eliminar ítems");
        setOpenConfirmacion({ open: false });
      },
    });
  }

  function handleGrabarOrdenes() {
    //Revisar si todas las filas tienen un numero de orden y son diferentes
    const numerosOrden = filasTabla.map(
      (fila) => fila.numeroOrden && fila.numeroOrden.trim()
    );
    if (numerosOrden.some((num) => !num)) {
      setOpenConfirmacion({
        open: true,
        titulo: "Error",
        contenido: "Todos los ítems deben tener un número de orden.",
        accion: "error",
        onAceptar: () => setOpenConfirmacion({ open: false }),
        onCancelar: () => setOpenConfirmacion({ open: false }),
      });
      return;
    }
    const numerosUnicos = new Set(numerosOrden);
    if (numerosUnicos.size !== numerosOrden.length) {
      setOpenConfirmacion({
        open: true,
        titulo: "Error",
        contenido: "Los números de orden deben ser diferentes.",
        accion: "error",
        onAceptar: () => setOpenConfirmacion({ open: false }),
        onCancelar: () => setOpenConfirmacion({ open: false }),
      });
      return;
    }
    setOpenConfirmacion({
      open: true,
      titulo: "Grabar Ordenes",
      contenido: "¿Desea grabar las ordenes?",
      accion: "GrabarCotizacion",
      onAceptar: () => {
        setOpenConfirmacion({ open: false });
        registrarDatos(filasTabla, "grabarOrdenesRecibidas");
      },
      onCancelar: () => {
        console.log("Confirmación cancelada para eliminar ítems");
        setOpenConfirmacion({ open: false });
      },
    });
  }

  function handleDeclararGanada() {
    //Revisar si todas las filas tienen un numero de orden y son diferentes
    const numerosOrden = filasTabla.map(
      (fila) => fila.numeroOrden && fila.numeroOrden.trim()
    );
    if (numerosOrden.some((num) => !num)) {
      setOpenConfirmacion({
        open: true,
        titulo: "Error",
        contenido: "Todos los ítems deben tener un número de orden.",
        accion: "error",
        onAceptar: () => setOpenConfirmacion({ open: false }),
        onCancelar: () => setOpenConfirmacion({ open: false }),
      });
      return;
    }
    const numerosUnicos = new Set(numerosOrden);
    if (numerosUnicos.size !== numerosOrden.length) {
      setOpenConfirmacion({
        open: true,
        titulo: "Error",
        contenido: "Los números de orden deben ser diferentes.",
        accion: "error",
        onAceptar: () => setOpenConfirmacion({ open: false }),
        onCancelar: () => setOpenConfirmacion({ open: false }),
      });
      return;
    }
    setOpenConfirmacion({
      open: true,
      titulo: "Grabar Ordenes",
      contenido:
        "¿Están ingresadas todas las ordenes recibidas necesarias para declara ganda la cotización ?",
      accion: "GrabarCotizacion",
      onAceptar: () => {
        setOpenConfirmacion({ open: false });
        registrarDatos(filasTabla, "declararCotizacionGanada");
      },
      onCancelar: () => {
        console.log("Cancelar la declaración de cotización ganada");
        setOpenConfirmacion({ open: false });
      },
    });
  }

  useEffect(() => {
    setFilasTabla(filas);
  }, [JSON.stringify(filas)]);

  return (
    <GridToolbarContainer>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Tooltip title="Adicionar un ítem">
          <IconButton>
            <AddIcon color="primary" onClick={handleAdicionarItem}></AddIcon>
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
        <Tooltip title="Grabar">
          <IconButton>
            <SaveIcon color="primary" onClick={handleGrabarOrdenes}></SaveIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Confirmar como ganada la oportunidad">
          <IconButton>
            <CheckIcon
              color="primary"
              onClick={handleDeclararGanada}
            ></CheckIcon>
          </IconButton>
        </Tooltip>
      </Box>
    </GridToolbarContainer>
  );
}
