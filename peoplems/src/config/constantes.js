const AMBIENTE = "desarrollo";

export let URL_PEOPLE;
export let PUERTO_FRONT_END;
export let PUERTO_CLIENT_APP;
export let PUERTO_API_GATEWAY;
export let PUERTO_API_FILEMANAGER;

switch (AMBIENTE) {
  case "desarrollo":
    URL_PEOPLE = `https://peoplek8s.digitalvs.com`;
    PUERTO_FRONT_END = 443;
    PUERTO_CLIENT_APP = 443;
    PUERTO_API_GATEWAY = 443;
    PUERTO_API_FILEMANAGER = 443;
    /*PUERTO_FRONT_END = 4000;
    PUERTO_CLIENT_APP = 4100;
    PUERTO_API_GATEWAY = 5020;
    PUERTO_API_FILEMANAGER = 8090;*/
    break;
  case "produccionAccessQ":
    URL_PEOPLE = `https://test01.accessq.com.mx`;
    PUERTO_FRONT_END = 5000;
    PUERTO_CLIENT_APP = 5010;
    PUERTO_API_GATEWAY = 5020;
    PUERTO_API_FILEMANAGER = 8090;
    break;
  case "produccionDigitalVS":
    URL_PEOPLE = `https://test01.digitalvs.com`;
    PUERTO_FRONT_END = 5000;
    PUERTO_CLIENT_APP = 5010;
    PUERTO_API_GATEWAY = 5020;
    PUERTO_API_FILEMANAGER = 8090;
    break;
}

//--------- Es para otros servicios internos (luego se puede eliminar) -----------
export const URL_PEOPLE_HTTPS = `https://peoplek8s.digitalvs.com`;

//================= Comunicaciión con Autenticación ======================================
export const URL_LOGIN_SUCCESS = `${URL_PEOPLE}:${PUERTO_CLIENT_APP}/auth/login/success`;

//================= Comunicación con API Proxy ================================
export const PREFIJO_URL_API = `${URL_PEOPLE}:${PUERTO_CLIENT_APP}/apis`;

//================= IA NODE ==================================
export const URL_IA_NODE = `${PREFIJO_URL_API}/ia/node`;
//export const URL_IA = `${URL_PEOPLE_HTTPS}/people/ia`;

//================== FLOWISE ===========================
export const URL_IA_FLOWISE = `${PREFIJO_URL_API}/ia/flowise/`;
//export const URL_FLOWISE = `${URL_PEOPLE}:3010/apis/flowise/`;

//=============== API de tipo de cambio ===============
export const URL_TIPO_CAMBIO = `https://openexchangerates.org/api/latest.json?app_id=ea6dc7d50e264f1ab412cbe93669ae14&base=USD&symbols=`;

//================== File Manager para documentos ===================
//export const URL_FILE_MANAGER = `${URL_PEOPLE}:${PUERTO_CLIENT_APP}/`;
export const URL_FILE_MANAGER = `${URL_PEOPLE}:${PUERTO_CLIENT_APP}/filemanager/`;

//========== Branding ===========
export const brandData = {
  logoURL: "/AQ_Logo.png",
  logoAlt: "AQ logo",
  title: "People",
  homeUrl: "https://www.accessq.com.mx",
  razonSocial: "Access Quality S.A. de C.V.",
  rfc: "AQU110118AV2",
  direccion:
    "Montecito #38, Piso 7, Oficina 1, WTC, Col. Nápoles, Benito Juarez, CDMX, CP 03810",
};

//=========== Estados de la cotización ===========
export const BORRADOR = 1;
export const EN_EVALUACION = 2;
export const APROBADA = 3;
export const RECHAZADA = 4;
export const ENVIADA = 5;
export const GANADA = 6;
export const PERDIDA = 7;
export const ACEPTADA = 8;
export const NO_VIGENTE = 9;
export const ABANDONADA = 10;
export const GANADA_CONFIRMADA = 16; //Se usa cuando se declara ganada una oportunidad

//============== Acciones para cambiar los estado de la cotizacion ==============
export const PONER_COTIZACION_EN_ESTADO_BORRADOR = 0;
export const SOLICITAR_APROBACION_DE_COTIZACION = 1;
export const APROBAR_O_RECHAZAR_COTIZACION = 2;
export const DECLARAR_LA_COTIZACION_GANADA = 3;
export const ACEPTAR_LA_COTIZACION_GANADA = 4;

//============== Impresion =======================
//Para un papel formato carta (8.5x11 inch), el tamaño en pixel usando un DPI de 150 debe ser (W x H): 1275 x 1650
//Si es A4 (8.3x11.7 inch), debe ser: 1245 x 1755
export const ANCHO_PAGINA = "1275";
export const ALTO_PAGINA = "1650";
export const MARGEN_TOP_PAGINA = 0;

//============== Distribucion de descuentos =====================
export const DESCUENTO_TOTAL = 0;
export const DESCUENTO_POR_ITEM = 1;

//============= Distribucion IVA ================================
export const DISTRIBUCION_SIN_IVA = 0;
export const DISTRIBUCION_IVA_TOTAL = 1;
export const DISTRIBUCION_IVA_POR_ITEM = 2;

//============= REGISTROS ==============================
export const REGISTRO_NO_VALIDO = -1;
export const REGISTRO_CERO = 0;
export const REGISTRO_COTIZACION_NO_VALIDO = {
  idCotizacion: -1,
  versionContizacion: -1,
};
export const REGISTRO_COTIZACION_CERO = {
  idCotizacion: 0,
  versionContizacion: 0,
};

//=============== COLORES ================================
//Colores HTML
export const COLOR_ROJO = "#FF0000";
export const COLOR_LIMA = "#00FF00";
export const COLOR_AZUL = "#0000FF";
export const COLOR_BLANCO = "#FFFFFF";
export const COLOR_PLATA = "#C0C0C0";
export const COLOR_PLOMO = "#808080";
export const COLOR_NEGRO = "#000000";
export const COLOR_MARRON = "#800000";
export const COLOR_AMARILLO = "#FFFF00";
export const COLOR_OLIVA = "#808000";
export const COLOR_VERDE = "#008000";
export const COLOR_AGUA = "#00FFFF";
export const COLOR_TEAL = "#008080";
export const COLOR_NAVY = "#000080";
export const COLOR_FUCSIA = "#FF00FF";
export const COLOR_MORADO = "#800080";

//https://htmlcolorcodes.com/es/nombres-de-los-colores/
//COLORES HTML ROJOS
export const COLOR_IndianRed = "#CD5C5C";
export const COLOR_LightCoral = "#F08080";
export const COLOR_Salmon = "#FA8072";
export const COLOR_DarkSalmon = "#E9967A";
export const COLOR_LightSalmon = "#FFA07A";
export const COLOR_Crimson = "#DC143C";
export const COLOR_Red = "#FF0000";
export const COLOR_FireBrick = "#B22222";
export const COLOR_DarkRed = "#8B0000";

//COLORES HTML ROSA
export const COLOR_Pink = "#FFC0CB";
export const COLOR_LightPink = "#FFB6C1";
export const COLOR_HotPink = "#FF69B4";
export const COLOR_DeepPink = "#FF1493";
export const COLOR_MediumVioletRed = "#C71585";
export const COLOR_PaleVioletRed = "#DB7093";

//COLORES HTML NARANJA
export const COLOR_Coral = "#FF7F50";
export const COLOR_Tomato = "#FF6347";
export const COLOR_OrangeRed = "#FF4500";
export const COLOR_DarkOrange = "#FF8C00";
export const COLOR_Orange = "#FFA500";

//Colores HTML AMARILLO
export const COLOR_Gold = "#FFD700";
export const COLOR_Yellow = "#FFFF00";
export const COLOR_LightYellow = "#FFFFE0";
export const COLOR_LemonChiffon = "#FFFACD";
export const COLOR_LightGoldenrodYellow = "#FAFAD2";
export const COLOR_PapayaWhip = "#FFEFD5";
export const COLOR_Moccasin = "#FFE4B5";
export const COLOR_PeachPuff = "#FFDAB9";
export const COLOR_PaleGoldenrod = "#EEE8AA";
export const COLOR_Khaki = "#F0E68C";
export const COLOR_DarkKhaki = "#BDB76B";

//Colores HTML PURPURA
export const COLOR_Lavender = "#E6E6FA";
export const COLOR_Thistle = "#D8BFD8";
export const COLOR_Plum = "#DDA0DD";
export const COLOR_Violet = "#EE82EE";
export const COLOR_Orchid = "#DA70D6";
export const COLOR_Magenta = "#FF00FF";
export const COLOR_MediumOrchid = "#BA55D3";
export const COLOR_MediumPurple = "#9370DB";
export const COLOR_RebeccaPurple = "#663399";
export const COLOR_BlueViolet = "#8A2BE2";
export const COLOR_DarkViolet = "#9400D3";
export const COLOR_DarkOrchid = "#9932CC";
export const COLOR_DarkMagenta = "#8B008B";
export const COLOR_Purple = "#800080";
export const COLOR_Indigo = "#4B0082";
export const COLOR_SlateBlue = "#6A5ACD";
export const COLOR_DarkSlateBlue = "#483D8B";
export const COLOR_MediumSlateBlue = "#7B68EE";

//Colores HTML VERDE
export const COLOR_GreenYellow = "#ADFF2F";
export const COLOR_Chartreuse = "#7FFF00";
export const COLOR_LawnGreen = "#7CFC00";
export const COLOR_Lime = "#00FF00";
export const COLOR_LimeGreen = "#32CD32";
export const COLOR_PaleGreen = "#98FB98";
export const COLOR_LightGreen = "#90EE90";
export const COLOR_MediumSpringGreen = "#00FA9A";
export const COLOR_SpringGreen = "#00FF7F";
export const COLOR_MediumSeaGreen = "#3CB371";
export const COLOR_SeaGreen = "#2E8B57";
export const COLOR_ForestGreen = "#228B22";
export const COLOR_Green = "#008000";
export const COLOR_DarkGreen = "#006400";
export const COLOR_YellowGreen = "#9ACD32";
export const COLOR_OliveDrab = "#6B8E23";
export const COLOR_Olive = "#808000";
export const COLOR_DarkOliveGreen = "#556B2F";
export const COLOR_MediumAquamarine = "#66CDAA";
export const COLOR_DarkSeaGreen = "#8FBC8B";
export const COLOR_LightSeaGreen = "#20B2AA";
export const COLOR_DarkCyan = "#008B8B";

//Colores HTML AZUL
export const COLOR_Aqua = "#00FFFF";
export const COLOR_Cyan = "#00FFFF";
export const COLOR_LightCyan = "#E0FFFF";
export const COLOR_PaleTurquoise = "#AFEEEE";
export const COLOR_Aquamarine = "#7FFFD4";
export const COLOR_Turquoise = "#40E0D0";
export const COLOR_MediumTurquoise = "#48D1CC";
export const COLOR_DarkTurquoise = "#00CED1";
export const COLOR_CadetBlue = "#5F9EA0";
export const COLOR_SteelBlue = "#4682B4";
export const COLOR_LightSteelBlue = "#B0C4DE";
export const COLOR_PowderBlue = "#B0E0E6";
export const COLOR_LightBlue = "#ADD8E6";
export const COLOR_SkyBlue = "#87CEEB";
export const COLOR_LightSkyBlue = "#87CEFA";
export const COLOR_DeepSkyBlue = "#00BFFF";
export const COLOR_DodgerBlue = "#1E90FF";
export const COLOR_CornflowerBlue = "#6495ED";
export const COLOR_RoyalBlue = "#4169E1";
export const COLOR_Blue = "#0000FF";
export const COLOR_MediumBlue = "#0000CD";
export const COLOR_DarkBlue = "#00008B";
export const COLOR_Navy = "#000080";
export const COLOR_MidnightBlue = "#191970";

//Colores HTML MARRON
export const COLOR_Cornsilk = "#FFF8DC";
export const COLOR_BlanchedAlmond = "#FFEBCD";
export const COLOR_Bisque = "#FFE4C4";
export const COLOR_NavajoWhite = "#FFDEAD";
export const COLOR_Wheat = "#F5DEB3";
export const COLOR_BurlyWood = "#DEB887";
export const COLOR_Tan = "#D2B48C";
export const COLOR_RosyBrown = "#BC8F8F";
export const COLOR_SandyBrown = "#F4A460";
export const COLOR_Goldenrod = "#DAA520";
export const COLOR_DarkGoldenrod = "#B8860B";
export const COLOR_Peru = "#CD853F";
export const COLOR_Chocolate = "#D2691E";
export const COLOR_SaddleBrown = "#8B4513";
export const COLOR_Sienna = "#A0522D";
export const COLOR_Brown = "#A52A2A";
export const COLOR_Maroon = "#800000";

//Colores HTML BLANCO
export const COLOR_White = "#FFFFFF";
export const COLOR_Snow = "#FFFAFA";
export const COLOR_HoneyDew = "#F0FFF0";
export const COLOR_MintCream = "#F5FFFA";
export const COLOR_Azure = "#F0FFFF";
export const COLOR_AliceBlue = "#F0F8FF";
export const COLOR_GhostWhite = "#F8F8FF";
export const COLOR_WhiteSmoke = "#F5F5F5";
export const COLOR_SeaShell = "#FFF5EE";
export const COLOR_Beige = "#F5F5DC";
export const COLOR_OldLace = "#FDF5E6";
export const COLOR_FloralWhite = "#FFFAF0";
export const COLOR_Ivory = "#FFFFF0";
export const COLOR_AntiqueWhite = "#FAEBD7";
export const COLOR_Linen = "#FAF0E6";
export const COLOR_LavenderBlush = "#FFF0F5";
export const COLOR_MistyRose = "#FFE4E1";

//Colores HTML GRIS
export const COLOR_Gainsboro = "#DCDCDC";
export const COLOR_LightGray = "#D3D3D3";
export const COLOR_Silver = "#C0C0C0";
export const COLOR_DarkGray = "#A9A9A9";
export const COLOR_Gray = "#808080";
export const COLOR_DimGray = "#696969";
export const COLOR_LightSlateGray = "#778899";
export const COLOR_SlateGray = "#708090";
export const COLOR_DarkSlateGray = "#2F4F4F";
export const COLOR_Black = "#000000";

//============== LOADER =====================
export const ICONO_LOADER_ATOM = "Atom";
export const ICONO_LOADER_CIRCULAR = "Circular";
export const ICONO_LOADER = ICONO_LOADER_ATOM;
export const TAMANO_ICONO_MEDIUM = "medium";

//================ AÑOS ====================
export const listaAnos = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  nombre: 2015 + i,
}));
export const idAnoActual =
  listaAnos.find((a) => a.nombre === new Date().getFullYear())?.id ?? null;
export const anoActual = new Date().getFullYear();

//================== IA ===========================
export const globalOportunidad = {
  ia: {
    separacionPregunta: `Hasta aqui, todo lo anterior fue aprobado por ti en cuanto a que sirve para avanzar de manera sólida con la oportunidad. La siguiente información es nueva: `,
    preguntaIA: `. Consideras esta respuesta adecuada para avanzar con la oportunidad?. El inicio de tu respuesta estrictamente debe ser sólo un si o un no, ninguna palabra mas, luego sustenta porque. `,
    mensajeRol:
      "Eres el director de ventas de Access Quality y tienes que validar si lo que dice el vendedor está de acuerdo con lo que solicita en el proceso de ventas.",
    tipoPregunta: "consulta",
    indice: "accessq",
    temperatura: 0.5,
    //urlIa: "http://peoplenode.digitalvs.com:8080/people/ia",
    urlIa: URL_IA_NODE,
    //urlIa: "https://peoplenode.digitalvs.com/people/ia",
    /*urlIa:
      "https://flowise-jf1k.onrender.com/api/v1/prediction/0cd3fda8-52ff-43ba-b588-0feea9005e94",*/
    /*urlIa:
      "https://flowise-jf1k.onrender.com/api/v1/prediction/bff24e52-5ef1-4b7e-8be1-545eae4d675d",*/
    //urlIa: "http://peoplenode.digitalvs.com:3010/api/flowise/",
  },
  etapasVenta: {
    idEtapaDemostracion: 106,
    idEtapaWaiting: 108,
  },
};

export const chatIA = {
  //urlIa: "https://peoplenode.digitalvs.com/people/chat",
  /*urlIa:
    "https://flowise-jf1k.onrender.com/api/v1/prediction/0cd3fda8-52ff-43ba-b588-0feea9005e94",*/
  urlIa: URL_IA_FLOWISE,
  //urlIa: "http://peoplenode.digitalvs.com:3010/apis/flowise/",
};

//================ Cadenas de texto ======================
export const cadenaNotasComerciales =
  "Esta cotización está expresada en dólares americanos y no incluye el I.V.A.";

//============== Secciones ===========================
export const INCLUIR_SECCION = 1;
export const NO_INCLUIR_SECCION = 2;
export const SECCION_OPCIONAL = 3;

//================= Header para autenticar acceso a APIS =========
export const jwtLocal = "jwt";
export const jwtHeader = {
  "Content-Type": "application/json; charset=UTF-8",
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
};

//============== Header para enviar el cookie al servidor ==========
export const HEADER_COOKIE = {
  method: "GET",
  credentials: "include",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  },
};
