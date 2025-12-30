import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Box, Modal, Alert, CircularProgress } from "@mui/material";
import { AppBarBusqueda } from "./AppBarBusqueda";
import { GridBusqueda } from "./GridBusqueda";
import { AuthContext } from "../../pages/Login";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as permisosRegistrados from "../../config/permisos.js";
import CheckIcon from "@mui/icons-material/Check";
import * as constantes from "../../config/constantes.js";

dayjs.extend(customParseFormat);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1,
  maxWidth: "lg",
  height: 1,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// ✅ Configuración centralizada de endpoints
const ENDPOINT_CONFIG = {
  cuentas: (user) => ({
    url: user?.permisos?.includes(
      permisosRegistrados.ALCANCE__TODAS_LAS_CUENTAS
    )
      ? "/cuentas/"
      : `/cuentas/usuario/${user.id}`,
    //: `/usuarios/${user.id}/cuentas/`,
    mapFields: [
      "idCuenta",
      "idCuenta",
      "nombreCuenta",
      "tipoCuenta",
      "sectorCuenta",
      "propietarioCuenta",
    ],
  }),

  cuentasPendientesAprobacion: () => ({
    url: "/cuentas/pendientesAprobacion",
    mapFields: [
      "idCuenta",
      "idCuenta",
      "nombreCuenta",
      "tipoCuenta",
      "sectorCuenta",
      "propietarioCuenta",
    ],
  }),

  contactos: (user) => ({
    url: user?.permisos?.includes(
      permisosRegistrados.ALCANCE__TODOS_LOS_CONTACTOS
    )
      ? "/contactos/"
      : `/contactos/usuario/${user.id}`,
    mapFields: [
      "idContacto",
      "idContacto",
      "nombresContacto",
      "apellidosContacto",
      "emailContacto",
      "cuentaContacto",
      "cargoContacto",
      "propietarioContacto",
    ],
  }),

  contactosPendientesAprobacion: () => ({
    url: "/contactos/pendientesAprobacion",
    mapFields: [
      "idContacto",
      "idContacto",
      "nombresContacto",
      "apellidosContacto",
      "emailContacto",
      "cuentaContacto",
      "cargoContacto",
      "propietarioContacto",
    ],
  }),

  oportunidades: (user, ano) => ({
    url: user?.permisos?.includes(
      permisosRegistrados.ALCANCE__TODAS_LAS_OPORTUNIDADES
    )
      ? `/oportunidades/ano/${ano}`
      : `/oportunidades/usuario/${user.id}/ano/${ano}`,
    //: `/oportunidades/ano/${ano}/usuario/${user.id}`,
    //: `/oportunidades/ano/usuario/${ano}/${user.id}`,
    mapFields: [
      "idOportunidad",
      "idOportunidad",
      "nombreOportunidad",
      "etapaOportunidad",
      "cuentaOportunidad",
      "anoCierreOportunidad",
      "propietarioOportunidad",
    ],
  }),

  oportunidadesPendientesAprobacion: () => ({
    url: "/oportunidades/pendientesAprobacion",
    mapFields: [
      "idOportunidad",
      "idOportunidad",
      "nombreOportunidad",
      "etapaOportunidad",
      "cuentaOportunidad",
      "anoCierreOportunidad",
      "propietarioOportunidad",
    ],
  }),

  registrosFabricantes: () => ({
    url: "/registrosFabricantes",
    mapFields: [
      "idRegistro",
      "idRegistro",
      "cuentaRegistro",
      "oportunidadRegistro",
      "fabricanteRegistro",
      "vendedorRegistro",
      "numeroRegistro",
      "estadoRegistro",
      "vencimientoRegistro",
    ],
  }),

  cotizaciones: (user, ano) => ({
    url: user?.permisos?.includes(
      permisosRegistrados.ALCANCE__TODAS_LAS_PROPUESTAS
    )
      ? `/cotizaciones/ano/${ano}`
      : `/cotizaciones/ano/${ano}/usuario/${user.id}`,
    mapFields: [
      "idCotizacion",
      "idCotizacion",
      "versionCotizacion",
      "cuentaOportunidad",
      "nombreOportunidad",
      "etapaVentaOportunidad",
      "importe",
      "fechaCierreCotizacion",
      "estadoCotizacion",
    ],
    isSpecial: true, // Para cotizaciones que tienen lógica especial
  }),
};

// ✅ Hook personalizado para fetching
const useDataFetcher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, controller, onSuccess, onError) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`📡 Fetching: ${url}`);

      const response = await fetch(url, {
        ...constantes.HEADER_COOKIE,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      console.log("📋 Response:", json);

      // Validar respuesta
      if (json.success === false) {
        throw new Error(json.message || "Error del servidor");
      }

      const data = json.data || json;
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un array válido");
      }

      setLoading(false);
      onSuccess(data);
    } catch (err) {
      setLoading(false);
      if (err.name !== "AbortError") {
        console.error("❌ Fetch error:", err);
        setError(err.message);
        onError(err.message);
      }
    }
  }, []);

  return { fetchData, loading, error };
};

export function VentanaBusqueda({
  openVentanaBusqueda,
  setOpenVentanaBusqueda,
  tipoRegistro,
  setOpenVentanaBusquedaConRegistro,
  ano = 0,
}) {
  const [list, setList] = useState([]);
  const { user } = useContext(AuthContext);
  const [openAlert, setOpenAlert] = useState("sinAlerta");
  const [mensajeError, setMensajeError] = useState("");
  const { fetchData, loading } = useDataFetcher();

  console.log("🔍 VentanaBusqueda:", {
    openVentanaBusqueda,
    tipoRegistro,
    ano,
  });

  // ✅ Función optimizada createData
  const createData = useCallback((tipoRegistro, item, mapFields) => {
    const baseType = tipoRegistro.replace("PendientesAprobacion", "");

    switch (baseType) {
      case "cuentas":
        return {
          id: item[mapFields[0]],
          idCuenta: item[mapFields[1]],
          nombreCuenta: item[mapFields[2]],
          tipoCuenta: item[mapFields[3]],
          sectorCuenta: item[mapFields[4]],
          propietarioCuenta: item[mapFields[5]],
        };

      case "contactos":
        return {
          id: item[mapFields[0]],
          idContacto: item[mapFields[1]],
          nombresContacto: item[mapFields[2]],
          apellidosContacto: item[mapFields[3]],
          emailContacto: item[mapFields[4]],
          cuentaContacto: item[mapFields[5]],
          cargoContacto: item[mapFields[6]],
          propietarioContacto: item[mapFields[7]],
        };

      case "oportunidades":
        return {
          id: item[mapFields[0]],
          idOportunidad: item[mapFields[1]],
          nombreOportunidad: item[mapFields[2]],
          etapaOportunidad: item[mapFields[3]],
          cuentaOportunidad: item[mapFields[4]],
          anoCierreOportunidad: item[mapFields[5]],
          propietarioOportunidad: item[mapFields[6]],
        };

      case "registrosFabricantes":
        return {
          id: item[mapFields[0]],
          idRegistro: item[mapFields[1]],
          cuentaRegistro: item[mapFields[2]],
          oportunidadRegistro: item[mapFields[3]],
          fabricanteRegistro: item[mapFields[4]],
          vendedorRegistro: item[mapFields[5]],
          numeroRegistro: item[mapFields[6]],
          estadoRegistro: item[mapFields[7]],
          vencimientoRegistro: item[mapFields[8]],
        };

      case "cotizaciones":
        return {
          id: `${item[mapFields[1]]}-${item[mapFields[2]]}`,
          idCotizacion: item[mapFields[1]],
          versionCotizacion: item[mapFields[2]],
          cuentaOportunidad: item[mapFields[3]],
          nombreOportunidad: item[mapFields[4]],
          etapaOportunidad: item[mapFields[5]],
          importePropuesta: item[mapFields[6]],
          fechaCierreCotizacion: new Date(
            dayjs(item[mapFields[7]], "DD-MM-YYYY").format("MM-DD-YYYY")
          ),
          estadoCotizacion: item[mapFields[8]],
        };

      default:
        return item;
    }
  }, []);

  // ✅ Memoizar configuración del endpoint
  const endpointConfig = useMemo(() => {
    if (!tipoRegistro || !user) return null;

    const configFn = ENDPOINT_CONFIG[tipoRegistro];
    return configFn ? configFn(user, ano) : null;
  }, [tipoRegistro, user, ano]);

  // ✅ Manejadores de éxito y error
  const handleSuccess = useCallback(
    (data) => {
      if (!endpointConfig) return;

      const transformedData = data.map((item) =>
        createData(tipoRegistro, item, endpointConfig.mapFields)
      );

      console.log(`✅ Data loaded: ${transformedData.length} items`);
      setList(transformedData);
      setOpenAlert("sinAlerta");
    },
    [tipoRegistro, endpointConfig, createData]
  );

  const handleError = useCallback((errorMessage) => {
    console.error("❌ Error loading data:", errorMessage);
    setMensajeError(errorMessage);
    setOpenAlert("error");
    setList([]);
  }, []);

  // ✅ Efecto principal optimizado
  useEffect(() => {
    if (!tipoRegistro || !user || !endpointConfig) {
      console.log("⚠️ Missing requirements, skipping fetch");
      return;
    }

    console.log(`📡 Loading ${tipoRegistro}...`);
    const controller = new AbortController();

    const fullUrl = `${constantes.PREFIJO_URL_API}${endpointConfig.url}`;
    fetchData(fullUrl, controller, handleSuccess, handleError);

    // Cleanup
    return () => {
      console.log(`🧹 Cleanup: ${tipoRegistro}`);
      controller.abort();
    };
  }, [tipoRegistro, endpointConfig, fetchData, handleSuccess, handleError]);

  // ✅ Manejador de alertas optimizado
  const handleAlert = useCallback((resultado) => {
    const alertStates = {
      100: "sinAlerta",
      200: "success",
    };
    setOpenAlert(alertStates[resultado] || "error");
  }, []);

  // ✅ Render condicional temprano
  if (!openVentanaBusqueda) {
    return null;
  }

  return (
    <Modal open={openVentanaBusqueda}>
      <Box sx={style}>
        <AppBarBusqueda
          setOpenVentanaBusqueda={setOpenVentanaBusqueda}
          tipoRegistro={tipoRegistro}
        />

        {/* ✅ Estados de loading y error */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress size={24} />
            <Box ml={2}>Cargando {tipoRegistro}...</Box>
          </Box>
        )}

        {openAlert === "error" && (
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="error"
            onClose={() => handleAlert(100)}
            sx={{ mb: 2 }}
          >
            {mensajeError}
          </Alert>
        )}

        {openAlert === "success" && (
          <Alert
            severity="success"
            onClose={() => handleAlert(100)}
            sx={{ mb: 2 }}
          >
            Datos cargados exitosamente
          </Alert>
        )}

        <GridBusqueda
          list={list}
          tipoRegistro={tipoRegistro}
          setOpenVentanaBusquedaConRegistro={setOpenVentanaBusquedaConRegistro}
        />
      </Box>
    </Modal>
  );
}
