import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LayersIcon from "@mui/icons-material/Layers";

import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { createTheme } from "@mui/material/styles";

export const data = [
  {
    kind: "header",
    title: "Ventas",
  },
  {
    segment: "crm",
    title: "CRM",
    icon: <PointOfSaleIcon />,
    children: [
      {
        segment: "cuentas",
        title: "Cuentas",
        icon: <BusinessIcon />,
      },
      {
        segment: "contactos",
        title: "Contactos",
        icon: <PersonIcon />,
      },
      {
        segment: "oportunidades",
        title: "Oportunidades",
        icon: <AdsClickIcon />,
      },
      {
        segment: "registrosFabricantes",
        title: "Registros Fabricante",
        icon: <ReceiptLongIcon />,
      },
    ],
  },
  {
    segment: "cotizacion",
    title: "Cotizador",
    icon: <RequestQuoteIcon />,
  },
  {
    segment: "preventa",
    title: "Preventa",
    icon: <CoPresentIcon />,
  },
  {
    segment: "plan-de-cuentas",
    title: "Plan de cuentas",
    icon: <AccountTreeIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Marketing",
  },
  {
    segment: "campanas",
    title: "Campañas",
    icon: <DashboardIcon />,
  },
  {
    segment: "herramientas-ia",
    title: "Herramientas IA",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "leads",
    title: "Leads",
    icon: <LayersIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Operaciones",
  },
  {
    segment: "actividades",
    title: "Actividades",
    icon: <DashboardIcon />,
  },
  {
    segment: "documentos",
    title: "Doc. Operaciones",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Logística",
  },
  {
    segment: "compras",
    title: "Compras",
    icon: <DashboardIcon />,
  },
  {
    segment: "recepcion",
    title: "Recepción",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "renovaciones",
    title: "Renovaciones",
    icon: <DashboardIcon />,
  },
  {
    segment: "comisiones",
    title: "Comisiones",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "header",
    title: "Contabilidad",
  },
  {
    segment: "facturas-in",
    title: "Facturas In",
    icon: <DashboardIcon />,
  },
  {
    segment: "pagos",
    title: "Pagos",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "facturas-out",
    title: "Facturas Outs",
    icon: <DashboardIcon />,
  },
  {
    segment: "cobranza",
    title: "Cobranza",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "header",
    title: "Administración",
  },
  {
    segment: "datos-financieros",
    title: "Datos financieros",
    icon: <DashboardIcon />,
  },
  {
    segment: "documentos-generales",
    title: "Doc. generales",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "header",
    title: "Dirección",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "reportes",
    title: "Reportes",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "header",
    title: "Sistema",
  },
  {
    segment: "configuracion",
    title: "Configuración",
    icon: <DashboardIcon />,
  },
  {
    segment: "cuenta",
    title: "Cuenta",
    icon: <ShoppingCartIcon />,
  },
];

//========== TEMA ===========
export const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

/*export const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});*/
