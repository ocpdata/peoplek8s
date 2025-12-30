import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";

import * as constantes from "../config/constantes";

// preview-start
const providers = [
  { id: "github", name: "GitHub" },
  { id: "google", name: "Google" },
  { id: "facebook", name: "Facebook" },
  { id: "twitter", name: "Twitter" },
  { id: "linkedin", name: "LinkedIn" },
];

// preview-end

const signIn = async (provider) => {
  // preview-start
  const promise = new Promise((resolve) => {
    switch (provider.id) {
      case "github":
        window.open(
          `${constantes.URL_PEOPLE}:${constantes.PUERTO_AUTORIZACION}/auth/github`,
          //"http://peoplenode.digitalvs.com:5010/auth/github",
          "_self"
        );
        break;

      case "google":
        window.open(
          `${constantes.URL_PEOPLE}:${constantes.PUERTO_AUTORIZACION}/auth/google`,
          //"http://peoplenode.digitalvs.com:5010/auth/google",
          "_self"
        );
        break;

      default:
        setTimeout(() => {
          console.log(`Sign in with ${provider.id}`);
          resolve({ error: "This is a fake error" });
        }, 500);
        break;
    }
  });
  // preview-end
  return promise;
};

export default function OAuthSignInPage({ login }) {
  const theme = useTheme();
  console.log("Entró a OAUTH");
  return (
    // preview-start
    <AppProvider theme={theme}>
      <SignInPage signIn={signIn} providers={providers} />
    </AppProvider>
    // preview-end
  );
}
