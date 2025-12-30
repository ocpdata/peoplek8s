import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import { registerLicense } from "@syncfusion/ej2-base";

import App from "./App.jsx";

// Registering Syncfusion<sup style="font-size:70%">&reg;</sup> license key
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXlfdnVQRmlcV0NwWUJWYUA="
);

//createRoot(document.getElementById("root")).render(<App />);

createRoot(document.querySelector("#root")).render(
  //<StrictMode>
  <StyledEngineProvider injectFirst>
    <App />
  </StyledEngineProvider>
  //</StrictMode>
);
