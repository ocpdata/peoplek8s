import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { Login } from "../pages/Login";
import { useState, useEffect, useContext, useMemo, createContext } from "react";
import * as constantes from "../config/constantes";

const providers = [
  { id: "credentials", name: "Email and Password" },
  { id: "github", name: "GitHub" },
  { id: "google", name: "Google" },
  { id: "facebook", name: "Facebook" },
  { id: "twitter", name: "Twitter" },
  { id: "linkedin", name: "LinkedIn" },
];

const signIn = async (provider, formData) => {
  console.log("funcion signIn");
  const promise = new Promise(async (resolve) => {
    switch (provider.id) {
      case "credentials":
        try {
          console.log("🔐 Iniciando autenticación local");

          const email = formData?.get("email");
          const password = formData?.get("password");

          console.log("Email:", email);

          if (!email || !password) {
            resolve({ error: "Email y contraseña son requeridos" });
            return;
          }

          const response = await fetch(
            `${constantes.URL_PEOPLE}:${constantes.PUERTO_CLIENT_APP}/auth/login`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
              },
              body: JSON.stringify({
                email: email,
                password: password,
              }),
            }
          );

          const result = await response.json();
          console.log("Respuesta del servidor:", result);

          if (result.error) {
            console.error(result.mensaje);
            resolve({
              error: true,
              success: false,
              user: null,
              mensaje: result.mensaje,
            });
            return;
          }

          if (result.success) {
            console.log("✅ Login exitoso");

            const userData = {
              id: result.user.id,
              email: result.user.email,
              displayName: result.user.displayName,
              permisos: result.user.permisos || [],
            };

            resolve({
              error: null,
              success: true,
              user: userData,
              mensaje: "",
            });
          } else {
            console.log("❌ Login fallido:", result.mensaje);
            resolve({
              error: false,
              success: false,
              user: null,
              mensaje: result.mensaje || "Credenciales incorrectas",
            });
          }
        } catch (error) {
          console.error("❌ Error en autenticación local:", error);
          resolve({
            error: true,
            success: false,
            user: null,
            mensaje: "Error al signIn",
          });
        }
        break;

      case "github":
        console.log("🐙 Redirigiendo a GitHub");
        window.open(
          `${constantes.URL_PEOPLE}:${constantes.PUERTO_CLIENT_APP}/auth/github`,
          "_self"
        );
        break;

      case "google":
        console.log("🔍 Redirigiendo a Google");
        window.open(
          `${constantes.URL_PEOPLE}:${constantes.PUERTO_CLIENT_APP}/auth/google`,
          "_self"
        );
        break;

      default:
        setTimeout(() => {
          console.log(`Sign in with ${provider.id}`);
          resolve({ error: "Proveedor no implementado" });
        }, 500);
        break;
    }
  });

  return promise;
};

export default function OAuthSignInPage() {
  const theme = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState({});
  console.log("🔐 Componente OAuthSignInPage cargado");

  // Wrapper para manejar el resultado del signIn
  const handleSignIn = async (provider, formData) => {
    const result = await signIn(provider, formData);
    console.log("result handleSignIn", result);

    // Si hay error de conexión o técnico
    if (result.error === true) {
      console.error("Error técnico:", result.mensaje);
      return {
        error: result.mensaje || "Error de conexión",
      };
    }

    // Si el login fue exitoso
    if (result.success) {
      console.log("✅ Autenticación exitosa:", result.user);
      setUserData({
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName,
      });
      setShowLogin(true); // Cambia el estado para mostrar Login

      //window.location.href = "/";
      return result;
    } else {
      // Si las credenciales son incorrectas
      console.error("Credenciales incorrectas:", result.mensaje);
      return {
        error: result.mensaje || "Credenciales incorrectas",
      };
    }
  };

  console.log("ShowLogin", showLogin);
  if (showLogin) {
    return (
      <Login
        id={userData.id}
        email={userData.email}
        displayName={userData.displayName}
      />
    );
  }

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleSignIn}
        providers={providers}
        slotProps={{
          emailField: {
            autoComplete: "email",
            required: true,
            type: "email",
          },
          passwordField: {
            autoComplete: "current-password",
            required: true,
            type: "password",
          },
        }}
      />
    </AppProvider>
  );
}
