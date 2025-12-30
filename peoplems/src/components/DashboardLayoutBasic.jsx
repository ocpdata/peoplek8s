import { useState, useEffect, useContext, useMemo, createContext } from "react";
import PropTypes from "prop-types";

import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { data as NAVIGATION } from "../data/dataSideBar";
import { demoTheme } from "../data/dataSideBar";
//import OAuthSignInPage from "./OAuthSignInPage";
import { PageContent } from "../router/PageContent.jsx";

import { AuthContext } from "../pages/Login";
import OAuthSignInPage from "../authentication/OAuthSignInPage";

//============= Constantes ================
import * as constantes from "../config/constantes";
import * as permisos from "../config/permisos.js";
//import { URL_LOGIN_SUCCESS } from "../config/constantes";
//import { PUERTO_APLICACION } from "../config/constantes";
//import { PUERTO_BACKEND } from "../../../backendAuth/src/config/constants.js";
//import { brandData } from "../config/constantes";

//========== Contexto =================
export const RegistroContexto = createContext();
import { BotonFlotante } from "./comun/BotonFlotante";
import ChatApp from "./comun/ChatApp";

//========== COMPONENTE PRINCIPAL ===========

function DashboardLayoutBasic(props) {
  const [session, setSession] = useState(null);
  const { user, setUser } = useContext(AuthContext);
  const [idCotizacionDashboardLB, setIdCotizacionDashboardLB] = useState(
    0
    //constantes.REGISTRO_COTIZACION_NO_VALIDO
  );
  const [idOportunidadDashboardLB, setIdOportunidadDashboardLB] = useState(
    constantes.REGISTRO_NO_VALIDO
  );
  const [idCuentaDashboardLB, setIdCuentaDashboardLB] = useState(
    constantes.REGISTRO_NO_VALIDO
  );
  const [idContactoDashboardLB, setIdContactoDashboardLB] = useState(
    constantes.REGISTRO_NO_VALIDO
  );
  const [openChat, setOpenChat] = useState(false);
  const [mostrarAutenticacion, setMostrarAutenticacion] = useState(false);
  console.log("funcion DashboardLayoutBasic", props);

  // Guarda la función para remover el listener
  const removeBeforeUnload = () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };

  // Mueve handleBeforeUnload fuera del useEffect para que sea accesible
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };

  //========== VALIDAR SI EL USUARIO ESTA AUTENTICADO ===========
  useEffect(() => {
    const getUser = async () => {
      console.log("useEffect getUser", user);

      if (user.id === 0) {
        /*//Obtiene el token que le envia el servidor despues de la autenticación y lo almacena localmente
        const params = new URLSearchParams(window.location.search);
        const jwt = params.get("token");
        if (jwt) {
          // Guarda el token en localStorage/cookie o contexto global
          console.log("token", jwt);
          localStorage.setItem(constantes.jwtLocal, jwt);
        }*/

        //No se usa el payload del token para obtener el usuario porque tendria que validarse el token y se requeriria el secret del JWT
        //Se usa la misma sesion abierta en el servidor para obtener los datos del usuario validado
        //Valida si hay un usuario autenticado
        const usuarioValidado = await fetch(
          constantes.URL_LOGIN_SUCCESS,
          constantes.HEADER_COOKIE
        );
        const jsonUsuarioValidado = await usuarioValidado.json();
        console.log(jsonUsuarioValidado);

        // --------------- Este codigo es el que funciona correctamente sin balanceador
        //Si no hay un usuario autenticado, la sesión y el usuario se ponen a null
        if (!jsonUsuarioValidado.success) {
          console.log("No hay usuario");
          setSession(null);
          setUser(null);
          return;
        }

        //Para pruebas con diferentes usuarios
        //jsonObtenerUsuarioValidado.user.emails[0].value = "ocarrillo@accessq.com.mx";

        //Se obtiene de la base de datos local, los permisos del usuario
        //Se establece una sesión porque hay un usuario validado
        const cadPermisosUsuario = `${constantes.PREFIJO_URL_API}/usuarios/${jsonUsuarioValidado.user.emails[0].value}`;
        //const cadPermisosUsuario = `${constantes.PREFIJO_URL_API}/configuracion/usuarios/${jsonUsuarioValidado.user.emails[0].value}`;

        const permisosUsuario = await fetch(
          cadPermisosUsuario,
          constantes.HEADER_COOKIE
        );
        const jsonPermisosUsuario = await permisosUsuario.json();
        console.log("Permisos:", jsonPermisosUsuario);

        if (jsonPermisosUsuario.data.length > 0) {
          //Obtener la matriz de permisos con los valores de la propiedad rule de los objetos de la matriz jsonPermisosUsuario y que no se repitan
          const permisos = [
            ...new Set(
              Array.isArray(jsonPermisosUsuario.data)
                ? jsonPermisosUsuario.data.map((item) => item.rule)
                : []
            ),
          ];
          console.log("Matriz de permisos:", permisos);

          setUser({
            id: jsonPermisosUsuario.data[0].id,
            email: jsonUsuarioValidado.user.emails[0].value,
            name: jsonUsuarioValidado.user.displayName, //Esto puede cambiar por proveedor de autenticacion
            permisos: permisos,
          });
          setSession({
            user: {
              name: jsonUsuarioValidado.user.displayName, //Esto puede cambiar por proveedor de autenticacion
              email: jsonUsuarioValidado.user.emails[0].value,
              image: jsonUsuarioValidado.user.photos?.[0]?.value || null,
              permisos: permisos,
            },
          });
        } else {
          console.log("Usuario no tiene permisos");
          setSession(null);
          setUser(null);
        }
      } else {
        //Se obtiene de la base de datos local, los permisos del usuario
        //Se establece una sesión porque hay un usuario validado
        const cadPermisos = `${constantes.PREFIJO_URL_API}/usuarios/${user.email}`;
        //const cadPermisos = `${constantes.PREFIJO_URL_API}/configuracion/usuarios/${user.email}`;
        console.log("cadPermisos", cadPermisos);
        const permisosUsuario = await fetch(
          cadPermisos,
          constantes.HEADER_COOKIE
        );
        const jsonPermisosUsuario = await permisosUsuario.json();
        console.log("Permisos:", jsonPermisosUsuario);

        if (jsonPermisosUsuario.data.length > 0) {
          //Obtener la matriz de permisos con los valores de la propiedad rule de los objetos de la matriz jsonPermisosUsuario y que no se repitan
          const permisos = [
            ...new Set(
              Array.isArray(jsonPermisosUsuario.data)
                ? jsonPermisosUsuario.data.map((item) => item.rule)
                : []
            ),
          ];
          console.log("Matriz de permisos:", permisos);

          setUser({
            id: user.id,
            email: user.email,
            name: user.displayName, //Esto puede cambiar por proveedor de autenticacion
            permisos: permisos,
          });
          setSession({
            user: {
              name: user.displayName, //Esto puede cambiar por proveedor de autenticacion
              email: user.email,
              image: null,
              permisos: permisos,
            },
          });
        } else {
          console.log("Usuario no tiene permisos");
          setSession(null);
          setUser(null);
        }
      }
    };
    getUser();
  }, []);

  //============== Para confirma el cierre del navegador
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  //========== FUNCIONES DE LOGIN Y LOGOUT ===========
  const login = async () => {
    console.log("Entró a login");

    setMostrarAutenticacion(true);

    /*removeBeforeUnload();
    window.open(
      `${constantes.URL_PEOPLE}:${constantes.PUERTO_APLICACION}/login`,
      "_self"
    );*/
  };

  const logout = async () => {
    console.log("Entró a logout");
    removeBeforeUnload();
    setSession(null);
    
    try {
      // Hacer petición fetch para obtener la respuesta JSON del logout
      const response = await fetch(
        `${constantes.URL_PEOPLE}:${constantes.PUERTO_CLIENT_APP}/auth/logout`,
        {
          method: 'GET',
          credentials: 'include', // Importante para enviar cookies
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        // Redirigir a la URL que retorna el backend
        window.location.href = data.redirectUrl || '/';
      } else {
        console.error('Error al hacer logout:', data.message);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error en logout:', error);
      // En caso de error, redirigir a home
      window.location.href = '/';
    }
  };

  const loginFailed = async () => {
    console.log("Entró a loginFailed");
    removeBeforeUnload();
    setSession(null);
    window.open(
      `${constantes.URL_PEOPLE}:${constantes.PUERTO_CLIENT_APP}/auth/login/failed`,
      "_self"
    );
  };

  //========== FUNCIONES DE AUTENTICACION ===========
  const authentication = useMemo(() => {
    return {
      signIn: async () => {
        console.log("Entró a authentication: ", session);
        session ? setSession(session) : await login();
      },
      signOut: async () => {
        await logout();
        //setSession(null);
      },
    };
  }, []);

  //const { window } = props;

  const router = useDemoRouter("/dashboard");
  console.log("router", router);

  function setCotizacionVersionDashboardLB(idCotVer) {
    console.log("funcion setCotizacionVersionDashboardLB", router, idCotVer);
    setIdCotizacionDashboardLB(idCotVer);
  }

  function setOportunidadDashboardLB(idOportunidad) {
    console.log("funcion setOportunidadDashboardLB", router, idOportunidad);
    setIdOportunidadDashboardLB(idOportunidad);
  }

  function setCuentaDashboardLB(idCuenta) {
    console.log("funcion setCuentadDashboardLB", router, idCuenta);
    setIdCuentaDashboardLB(idCuenta);
  }

  function setContactoDashboardLB(idContacto) {
    console.log("funcion setContactoDashboardLB", router, idContacto);
    setIdContactoDashboardLB(idContacto);
  }

  // Remove this const when copying and pasting into your project.
  //const demoWindow = window !== undefined ? window() : undefined;

  return mostrarAutenticacion ? (
    <OAuthSignInPage />
  ) : (
    <AppProvider
      session={session}
      branding={{
        logo: (
          <img
            src={constantes.brandData.logoURL}
            alt={constantes.brandData.logoAlt}
          />
        ),
        title: (
          <span>
            {constantes.brandData.title}
            <span style={{ marginLeft: 16, color: "#1976d2" }}>
              {session && `   ${session.user.name}`}
            </span>
          </span>
        ),
        //title: constantes.brandData.title,
        homeUrl: constantes.brandData.homeUrl,
      }}
      authentication={authentication}
      navigation={session ? NAVIGATION : []} //navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      //window={demoWindow}
    >
      <DashboardLayout
      /*slots={{
          appTitle: "Hola",
        }}*/
      >
        <RegistroContexto
          value={{
            idCotizacionDashboardLB,
            setCotizacionVersionDashboardLB,
            idOportunidadDashboardLB,
            setOportunidadDashboardLB,
            idCuentaDashboardLB,
            setCuentaDashboardLB,
            idContactoDashboardLB,
            setContactoDashboardLB,
            router,
          }}
        >
          <PageContent pathname={router.pathname} />
          {user?.permisos?.includes(permisos.ACCESO_CHAT_IA) && (
            <BotonFlotante
              onClick={() => {
                console.log("hola");
                setOpenChat(true);
              }}
            />
          )}
          {openChat && <ChatApp onClose={() => setOpenChat(false)} />}
        </RegistroContexto>
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBasic.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutBasic;
